<?php
/**
 * しっかりスキャン — 公開URLを実際に取得して、訪問者が見るHTMLからリンクを集める。
 *
 * 軽いスキャン（class-scanner.php）との違い:
 *
 *   軽い     … the_content を管理画面の中で走らせて集める。速いが
 *              ①ヘッダー・フッター・メニューが見えない
 *              ②動的ブロックが出すリンクを数件取りこぼす（実測 412 対 408）
 *   しっかり … 公開URLを wp_safe_remote_get で取得して集める。訪問者が見るHTMLそのもの。
 *              ヘッダー・フッター・メニューまで拾える代わりにページ数ぶんの HTTP が要る。
 *
 * 🚨 本文のリンクは、取得したHTMLではなく post_content から採る。
 *    HTML からだと post_content 内での出現位置（link_index）が分からず、
 *    一覧からのインライン編集ができなくなるため。
 *    本文＝編集できる / それ以外＝編集できない、という切り分けは軽いスキャンと同じ。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LW_Link_List_Crawler {

    /** 1ページあたりの待ち時間（秒）。共用サーバーの実行時間に収める */
    const TIMEOUT = 8;

    /** 1リクエストで使ってよい時間（秒）。超えたらページ数が残っていても返す */
    const TIME_BUDGET = 20;

    /** リダイレクトの追跡上限 */
    const REDIRECTION = 3;

    /**
     * 巡回するときの名乗り。
     *
     * サイト所有者がアクセスログを見たときに「これは自分のサイトの点検だ」と分かるようにする。
     * 一般的なボットの書式に合わせておかないとセキュリティプラグインに弾かれやすい。
     *
     * @return string
     */
    public static function user_agent() {
        return 'Mozilla/5.0 (compatible; LiteWordLinkScanner/1.0; +' . home_url( '/' ) . ')';
    }

    /**
     * 巡回するページ数の上限。
     *
     * 1,000ページのサイトで全部取りに行くと、自分のサーバーに自分でアクセスを浴びせることになる。
     * 上限を超えたぶんは対象から外し、外した件数を必ず画面に出す（黙って打ち切らない）。
     *
     * @return int
     */
    public static function get_max_pages() {
        $max = (int) apply_filters( 'lw_link_list_crawl_max', LW_LINK_LIST_CRAWL_MAX );

        return ( $max > 0 ) ? $max : LW_LINK_LIST_CRAWL_MAX;
    }

    /**
     * 巡回対象の件数と、上限で外れた件数。
     *
     * @return array array('total' => 巡回する数, 'skipped' => 外した数)
     */
    public static function count_crawlable() {
        $all = LW_Broken_Link_Check_Scanner::count_scannable_posts();
        $max = self::get_max_pages();

        if ( $all <= $max ) {
            return array(
                'total'   => $all,
                'skipped' => 0,
            );
        }

        return array(
            'total'   => $max,
            'skipped' => $all - $max,
        );
    }

    /**
     * 巡回してよいURLか。
     *
     * 自分のサイト以外は絶対に取りに行かない。
     * パーマリンクは普通そうならないが、フィルターで書き換えられている可能性がある。
     * （checker 側の wp_safe_remote_* とあわせて二重に守る）
     *
     * @param string $url 対象。
     * @return bool
     */
    public static function is_own_url( $url ) {
        $host = wp_parse_url( $url, PHP_URL_HOST );
        $home = wp_parse_url( home_url( '/' ), PHP_URL_HOST );

        if ( empty( $host ) || empty( $home ) ) {
            return false;
        }

        return strtolower( $host ) === strtolower( $home );
    }

    /**
     * 一度でも 429（アクセス過多）で弾かれたか。
     *
     * PHP はリクエストごとに真っさらになるので、そのままだと次のバッチが
     * また同じ勢いで叩きに行って弾かれ続ける。transient で申し送る。
     *
     * @return bool
     */
    public static function is_throttled() {
        return (bool) get_transient( LW_LINK_LIST_THROTTLED_TRANSIENT );
    }

    /**
     * 429 で弾かれたことを覚えておく（10分）。
     *
     * @return void
     */
    public static function mark_throttled() {
        set_transient( LW_LINK_LIST_THROTTLED_TRANSIENT, 1, 10 * MINUTE_IN_SECONDS );
    }

    /**
     * 次の1本を取りに行くまでに空ける時間（マイクロ秒）。
     *
     * @return int
     */
    public static function get_delay_us() {
        $ms = self::is_throttled() ? LW_LINK_LIST_CRAWL_SLOW_DELAY_MS : LW_LINK_LIST_CRAWL_DELAY_MS;

        return (int) $ms * 1000;
    }

    /**
     * URLを1本取得する。
     *
     * 🚨 429（Too Many Requests）は必ず面倒を見ること。
     *    自分のサイトを短時間に何度も叩くので、サーバーやセキュリティプラグインに
     *    アクセス過多と判断されることがある。実際に lite-word.com（175ページ）で
     *    5ページが 429 で読めなかった（2026-08-22）。
     *    一度きりの失敗として捨てると、そのページのリンクが黙って一覧から抜ける。
     *
     * @param string $url 対象。
     * @return array array('ok' => bool, 'body' => string, 'code' => int, 'reason' => string)
     */
    public static function fetch( $url ) {
        $fail = array(
            'ok'     => false,
            'body'   => '',
            'code'   => 0,
            'reason' => '',
        );

        if ( ! self::is_own_url( $url ) ) {
            $fail['reason'] = '自分のサイト以外のURLだったため取得しませんでした';
            return $fail;
        }

        $response = self::request( $url );

        // 弾かれたら、言われた時間だけ待って1回だけやり直す
        if ( ! is_wp_error( $response ) && 429 === (int) wp_remote_retrieve_response_code( $response ) ) {
            self::mark_throttled();
            sleep( self::get_retry_after( $response ) );
            $response = self::request( $url );
        }

        if ( is_wp_error( $response ) ) {
            $fail['reason'] = self::describe_wp_error( $response );
            return $fail;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = (string) wp_remote_retrieve_body( $response );

        if ( 200 !== $code ) {
            $fail['code']   = $code;
            $fail['reason'] = self::describe_status( $code );
            return $fail;
        }

        if ( '' === trim( $body ) ) {
            $fail['code']   = $code;
            $fail['reason'] = '中身が空で返ってきました';
            return $fail;
        }

        return array(
            'ok'     => true,
            'body'   => $body,
            'code'   => $code,
            'reason' => '',
        );
    }

    /**
     * 実際に1回だけ取りに行く。
     *
     * @param string $url 対象。
     * @return array|WP_Error
     */
    private static function request( $url ) {
        return wp_safe_remote_get(
            $url,
            array(
                'timeout'     => self::TIMEOUT,
                'redirection' => self::REDIRECTION,
                'user-agent'  => self::user_agent(),
                'sslverify'   => false,
                'headers'     => array( 'Accept' => 'text/html,application/xhtml+xml' ),
            )
        );
    }

    /**
     * 429 のときに何秒待つか。
     *
     * Retry-After は「秒数」でも「日時」でも返りうる。長すぎる値をそのまま信じると
     * 画面が固まるので上限で切る。
     *
     * @param array $response レスポンス。
     * @return int 待つ秒数。
     */
    private static function get_retry_after( $response ) {
        $header = wp_remote_retrieve_header( $response, 'retry-after' );
        $wait   = 2;

        if ( '' !== $header && null !== $header ) {
            if ( is_numeric( $header ) ) {
                $wait = (int) $header;
            } else {
                $when = strtotime( (string) $header );
                if ( $when ) {
                    $wait = $when - time();
                }
            }
        }

        if ( $wait < 1 ) {
            $wait = 1;
        }

        return min( $wait, LW_LINK_LIST_CRAWL_RETRY_MAX_SEC );
    }

    /**
     * HTTP ステータスを利用者に見せる日本語にする。
     *
     * @param int $code ステータスコード。
     * @return string
     */
    public static function describe_status( $code ) {
        if ( 401 === $code || 403 === $code ) {
            return 'パスワードで保護されています（' . $code . '）。制作中のサイトではこの方式は使えません';
        }
        if ( 503 === $code ) {
            return 'メンテナンスモードになっています（503）';
        }
        if ( 404 === $code ) {
            // 公開になっているのに 404 が返るのは、そのページが訪問者から開けないということ。
            // スキャンの都合ではなく、サイト側の問題なのでそう伝える
            return '公開されているのに開けません（404）。パーマリンクの設定を確かめてください';
        }
        if ( 429 === $code ) {
            return 'アクセスが集中しているとサーバーに判断されました（429）。少し時間を置いてからもう一度お試しください';
        }
        if ( $code >= 500 ) {
            return 'サーバーがエラーを返しました（' . $code . '）';
        }
        if ( 0 === $code ) {
            return '応答がありませんでした';
        }

        return '取得できませんでした（' . $code . '）';
    }

    /**
     * WP_Error を利用者に見せる日本語にする。
     *
     * 🚨 WP_Error のメッセージは翻訳される。英語での文字列一致に頼らないこと。
     *    判定はエラーコードで行う（コードは翻訳されない）。
     *
     * @param WP_Error $error 対象。
     * @return string
     */
    public static function describe_wp_error( $error ) {
        $code = $error->get_error_code();

        if ( 'http_request_failed' === $code ) {
            $message = $error->get_error_message();

            if ( false !== stripos( $message, 'timed out' ) || false !== stripos( $message, 'timeout' ) ) {
                return '時間内に応答がありませんでした（' . self::TIMEOUT . '秒）';
            }

            return '接続できませんでした。サーバーの設定で自分自身へのアクセスが塞がれている可能性があります';
        }

        if ( 'http_request_not_executed' === $code ) {
            return 'サーバー側でリクエストが止められました';
        }

        return '取得できませんでした（' . $code . '）';
    }

    /**
     * 巡回できる状態かを、トップページ1本で先に確かめる。
     *
     * 🚨 これを通ってから既存データを消すこと。
     *    先に消すと、巡回できないサイトでは「前に採れていた一覧まで失う」ことになる。
     *
     * @return array array('ok' => bool, 'reason' => string, 'url' => string)
     */
    public static function preflight() {
        $url    = home_url( '/' );
        $result = self::fetch( $url );

        return array(
            'ok'     => ! empty( $result['ok'] ),
            'reason' => isset( $result['reason'] ) ? $result['reason'] : '',
            'url'    => $url,
        );
    }

    /**
     * 1バッチぶん巡回する。
     *
     * @param int $offset 開始位置。
     * @param int $limit  最大件数。
     * @return array array('pages' => 保存用, 'crawled' => 件数, 'errors' => 読めなかったページ)
     */
    public static function crawl_batch( $offset = 0, $limit = 3 ) {
        $empty = array(
            'pages'   => array(),
            'crawled' => 0,
            'errors'  => array(),
        );

        $remaining = self::get_max_pages() - (int) $offset;

        if ( $remaining <= 0 ) {
            return $empty;
        }

        $limit = min( (int) $limit, $remaining );

        $posts = get_posts(
            array(
                'post_type'        => LW_Broken_Link_Check_Scanner::get_target_post_types(),
                'post_status'      => 'publish',
                'posts_per_page'   => $limit,
                'offset'           => (int) $offset,
                'orderby'          => 'ID',
                'order'            => 'ASC',
                'suppress_filters' => false,
            )
        );

        $pages   = array();
        $errors  = array();
        $started = microtime( true );
        $first   = true;

        foreach ( $posts as $post ) {
            // 🚨 続けざまに叩かない。自分のサイトを短時間に何度も取りに行くと 429 で弾かれる。
            //    一度弾かれたあとは、さらに間隔を空ける（is_throttled）
            if ( ! $first ) {
                usleep( self::get_delay_us() );
            }
            $first = false;

            $result  = self::crawl_post( $post );
            $pages[] = $result['page'];

            if ( ! empty( $result['error'] ) ) {
                $errors[] = $result['error'];
            }

            // 与えられた時間を使い切ったら、残りは次のリクエストに回す
            if ( ( microtime( true ) - $started ) > self::TIME_BUDGET ) {
                break;
            }
        }

        return array(
            'pages'   => $pages,
            'crawled' => count( $pages ),
            'errors'  => $errors,
        );
    }

    /**
     * ページ1枚を巡回する。
     *
     * 取得に失敗しても、本文から採れるぶんは残す（何も無いより手掛かりがある方がよい）。
     * 失敗したことは error に入れて必ず画面に出す。黙って軽いスキャン相当に落とさない。
     *
     * @param WP_Post $post 対象。
     * @return array array('page' => 保存用, 'error' => 失敗時のみ)
     */
    public static function crawl_post( $post ) {
        $raw_content = $post->post_content;
        $url         = get_permalink( $post );

        // ① 本文のリンク。ここだけが post_content 内の位置を持つ＝一覧から編集できる
        $links = array();

        if ( ! empty( $raw_content ) ) {
            foreach ( LW_Broken_Link_Check_Scanner::extract_all_a_tags( $raw_content ) as $link ) {
                $link['source_field'] = 'post_content';
                $link['editable']     = true;
                $links[]              = $link;
            }
        }

        $fetched = $url
            ? self::fetch( $url )
            : array(
                'ok'     => false,
                'reason' => 'URLが取得できませんでした',
            );

        $error = null;

        if ( empty( $fetched['ok'] ) ) {
            $error = array(
                'post_id' => (int) $post->ID,
                'title'   => $post->post_title,
                'url'     => (string) $url,
                'reason'  => isset( $fetched['reason'] ) ? $fetched['reason'] : '取得できませんでした',
            );

            $ids = LW_Broken_Link_Check_Scanner::extract_all_ids( $raw_content );
        } else {
            // ② 取得したHTMLにしか無いリンク（ヘッダー・フッター・メニュー・動的ブロック）。
            //    post_content には実体が無いので位置で特定できない＝編集不可にする
            foreach ( LW_Broken_Link_Check_Scanner::extract_all_a_tags( $fetched['body'] ) as $link ) {
                if ( self::has_href( $links, $link['href'] ) ) {
                    continue;
                }

                $link['source_field'] = 'ページ全体（巡回）';
                $link['editable']     = false;
                $link['link_index']   = -1;
                $links[]              = $link;
            }

            $ids = LW_Broken_Link_Check_Scanner::extract_all_ids( $fetched['body'] );
        }

        $page = array(
            'post_id'    => (int) $post->ID,
            'post_type'  => $post->post_type,
            'post_title' => $post->post_title,
            'ids'        => $ids,
            'links'      => $links,
            // 取得したHTMLをそのまま呼び出し側へ渡す。サイト診断のうち
            // 「公開ページを開かないと分からないもの」（タイトルの長さ・h1）は
            // ここに相乗りして採る。取り直すと同じページを2回叩くことになる。
            // 🚨 保存はされない（lw_link_list_save_pages は使う列だけを見る）
            'html'       => empty( $fetched['ok'] ) ? '' : (string) $fetched['body'],
        );

        return array(
            'page'  => $page,
            'error' => $error,
        );
    }

    /**
     * その href が既に採れているか。
     *
     * 🚨 テキストで突き合わせないこと（理由は class-scanner.php の link_exists を参照）。
     *
     * @param array  $links 既存。
     * @param string $href  候補。
     * @return bool
     */
    private static function has_href( $links, $href ) {
        foreach ( $links as $existing ) {
            if ( $existing['href'] === $href ) {
                return true;
            }
        }

        return false;
    }
}
