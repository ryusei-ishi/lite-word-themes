<?php
/**
 * リンク有効性チェッククラス
 *
 * @package LiteWord
 */

if (!defined('ABSPATH')) {
    exit;
}

class LW_Broken_Link_Check_Checker {

    /**
     * タイムアウト秒数
     */
    const TIMEOUT = 10;

    /**
     * User-Agent
     *
     * 🚨 ブラウザのふりをしない。誰が来ているかを正直に名乗る。
     *    そのぶん一部の大手サイト（Amazon・ChatGPT 等）にはボットとして弾かれるが、
     *    弾かれたことは「リンク切れ」ではなく「確認できず」として出す（下の UNVERIFIED_CODES）。
     */
    const USER_AGENT = 'Mozilla/5.0 (compatible; LiteWord Link Checker/1.0)';

    /**
     * 相手が「自動チェックお断り」と言っているだけで、リンク自体は生きているコード。
     *
     * 🚨 これを「リンク切れ」に混ぜないこと。
     *    2026-08-22 に lite-word.com で実測したところ、19件の「問題あり」のうち
     *    本当に切れていたのは2件だけで、残り17件は
     *    ・youtu.be 7本と自サイト5本が 429（短時間に叩きすぎ）
     *    ・chatgpt.com が 403 ／ Amazon 3本が 503（ボット遮断）
     *    だった。これを「切れています」と伝えるのは誤報でしかない。
     *
     *   401 ログインが要る ／ 403 拒否 ／ 405 HEAD不可 ／ 406 受け付けない
     *   429 アクセス過多 ／ 451 法的理由 ／ 503 一時的に応答なし
     *   999 LinkedIn などが独自に返す拒否
     */
    const UNVERIFIED_CODES = array( 401, 403, 405, 406, 429, 451, 503, 999 );

    /**
     * HEAD を拒否されたときに GET で確かめ直すコード。
     *
     * HEAD だけ弾いて GET は返すサーバーは多い。これをやらないと
     * 「HEADが403だったのでリンク切れ」という誤報になる。
     */
    const RETRY_WITH_GET_CODES = array( 403, 405, 406, 501, 999 );

    /**
     * 「もう確認を断られた」と分かった相手（ホスト名）を覚えておく置き場。
     *
     * 🚨 同じ相手に何度も頼みに行かないこと。
     *    lite-word.com には youtu.be へのリンクが85本あり、YouTube は
     *    サーバーからの連続アクセスを 429 で断る。1本ごとに待って
     *    やり直していたら、チェック全体が 134秒 → 384秒 になった（2026-08-22 実測）。
     *    しかも結果は全部同じ「確認できず」。相手にとっても迷惑なだけ。
     *    → 一度断られた相手は、その回の残りをまとめて「確認できず」にする。
     */
    const BLOCKED_HOSTS_TRANSIENT = 'lw_link_check_blocked_hosts';

    // 自分のサイトに断られたときの目印。打ち切らずに間隔を広げるために使う
    const SELF_THROTTLED_TRANSIENT = 'lw_link_check_self_throttled';

    /**
     * 単一URLをチェック
     *
     * @param string $url チェックするURL
     * @return array チェック結果
     */
    public static function check_url($url) {
        // 空のURLはスキップ
        if (empty($url)) {
            return array(
                'url' => $url,
                'status' => 'skip',
                'status_code' => null,
                'message' => '空のURL',
            );
        }

        // チェック不要なURLタイプ
        if (self::should_skip($url)) {
            return array(
                'url' => $url,
                'status' => 'skip',
                'status_code' => null,
                'message' => 'チェック対象外',
            );
        }

        // 相対URLを絶対URLに変換
        $absolute_url = self::make_absolute_url($url);

        // この相手には既に断られている。もう頼みに行かない（相手にも自分にも無駄）
        if (self::is_host_blocked($absolute_url)) {
            return array(
                'url' => $url,
                'absolute_url' => $absolute_url,
                'status' => 'unverified',
                'status_code' => 429,
                'message' => '同じサイトへの確認をまとめて断られたため、確認していません（429）',
                'redirect_url' => null,
            );
        }

        // HTTPリクエストを送信
        $result = self::send_request($absolute_url);

        // 断られたら、この相手への残りは以後まとめて打ち切る
        if ('unverified' === $result['status'] && 429 === (int) $result['status_code']) {
            self::block_host($absolute_url);
        }

        return array(
            'url' => $url,
            'absolute_url' => $absolute_url,
            'status' => $result['status'],
            'status_code' => $result['status_code'],
            'message' => $result['message'],
            'redirect_url' => isset($result['redirect_url']) ? $result['redirect_url'] : null,
        );
    }

    /**
     * バッチでURLをチェック
     *
     * @param array $urls チェックするURL配列
     * @return array チェック結果配列
     */
    public static function check_batch($urls) {
        $results = array();
        $first   = true;

        foreach ($urls as $url) {
            // 🚨 続けざまに叩かない。
            //    同じ相手（自サイト・YouTube・Amazon）に何本もリンクが向いていることは普通にある。
            //    間隔を空けないと 429 で弾かれ、生きているリンクが切れて見える。
            if (!$first) {
                usleep(self::get_delay_us($url));
            }
            $first = false;

            $results[] = self::check_url($url);
        }

        return $results;
    }

    /**
     * 次の1本を叩くまでに空ける時間（マイクロ秒）。
     *
     * @return int
     */
    private static function get_delay_us($url = '') {
        $ms = defined('LW_LINK_LIST_CHECK_DELAY_MS') ? LW_LINK_LIST_CHECK_DELAY_MS : 200;

        // 自分のサイトに一度断られていたら、以後は間隔を広げて最後まで確かめきる
        if ('' !== $url && self::is_own_url($url) && get_transient(self::SELF_THROTTLED_TRANSIENT)) {
            $slow = defined('LW_LINK_LIST_CRAWL_SLOW_DELAY_MS') ? LW_LINK_LIST_CRAWL_SLOW_DELAY_MS : 1200;
            $ms   = max($ms, $slow);
        }

        return (int) $ms * 1000;
    }

    /**
     * 確認を断られた相手の一覧（ホスト名 => 1）。
     *
     * @return array
     */
    private static function get_blocked_hosts() {
        $hosts = get_transient(self::BLOCKED_HOSTS_TRANSIENT);

        return is_array($hosts) ? $hosts : array();
    }

    /**
     * この相手には、もう頼みに行かないことにする。
     *
     * @param string $url 断られたURL。
     * @return void
     */
    private static function block_host($url) {
        $host = wp_parse_url($url, PHP_URL_HOST);

        if (empty($host)) {
            return;
        }

        // 🚨 自分のサイトだけは打ち切らない。
        //    打ち切ると内部リンクが丸ごと「確認できず」に化けて、本当のリンク切れが隠れる。
        //    2026-08-22 に lite-word.com で実際に起きた（内部126本が全部 429 で確認できずになり、
        //    下書きページへのリンク切れが見えなくなった）。代わりに間隔を広げて最後まで確かめる。
        if (self::is_own_url($url)) {
            set_transient(self::SELF_THROTTLED_TRANSIENT, 1, 10 * MINUTE_IN_SECONDS);

            return;
        }

        $hosts = self::get_blocked_hosts();
        $hosts[strtolower($host)] = 1;

        set_transient(self::BLOCKED_HOSTS_TRANSIENT, $hosts, 10 * MINUTE_IN_SECONDS);
    }

    /**
     * この相手は、もう断られているか。
     *
     * @param string $url 対象。
     * @return bool
     */
    private static function is_host_blocked($url) {
        $host = wp_parse_url($url, PHP_URL_HOST);

        if (empty($host)) {
            return false;
        }

        $hosts = self::get_blocked_hosts();

        return isset($hosts[strtolower($host)]);
    }

    /**
     * 断られた相手の記録を捨てる（チェックを始めるときに呼ぶ）。
     *
     * @return void
     */
    public static function reset_blocked_hosts() {
        delete_transient(self::BLOCKED_HOSTS_TRANSIENT);
        delete_transient(self::SELF_THROTTLED_TRANSIENT);
    }

    /**
     * チェックをスキップすべきURLか判定
     *
     * @param string $url URL
     * @return bool スキップすべき場合true
     */
    private static function should_skip($url) {
        // アンカーリンク
        if (strpos($url, '#') === 0) {
            return true;
        }

        // メールリンク
        if (stripos($url, 'mailto:') === 0) {
            return true;
        }

        // 電話リンク
        if (stripos($url, 'tel:') === 0) {
            return true;
        }

        // JavaScriptリンク
        if (stripos($url, 'javascript:') === 0) {
            return true;
        }

        // データURL
        if (stripos($url, 'data:') === 0) {
            return true;
        }

        return false;
    }

    /**
     * 相対URLを絶対URLに変換
     *
     * @param string $url URL
     * @return string 絶対URL
     */
    private static function make_absolute_url($url) {
        // すでに絶対URLの場合
        if (preg_match('/^https?:\/\//i', $url)) {
            return $url;
        }

        // プロトコル相対URL
        if (strpos($url, '//') === 0) {
            return (is_ssl() ? 'https:' : 'http:') . $url;
        }

        // 相対・ルート相対は WordPress 標準の解決器に任せる（../ や ./ も正しく畳まれる）
        $absolute = WP_Http::make_absolute_url($url, home_url('/'));

        return $absolute ? $absolute : $url;
    }

    /**
     * HTTPリクエストを送信してステータスを取得
     *
     * 🚨 wp_remote_* ではなく wp_safe_remote_* を使うこと。
     *    safe 版は内部で wp_http_validate_url() を通し、
     *    127.0.0.0/8・10.0.0.0/8・172.16.0.0/12・192.168.0.0/16 に加えて
     *    169.254.0.0/16（クラウドのメタデータ endpoint）や 0.0.0.0/8・CGNAT・
     *    マルチキャストまで拒否する。ポートも 80/443/8080 に限られる。
     *    これが無いと「リンクチェック」の皮をかぶった SSRF の踏み台になる
     *    （2026-07-24 のセキュリティ監査の指摘）。
     *    ⚠️ 自サイトのホストは同一ホスト判定で例外扱いされるので、
     *      ローカル開発（localhost）や社内サーバーでも自サイトのリンクは検査できる。
     *
     * @param string $url 絶対URL
     * @return array 結果配列
     */
    private static function send_request($url) {
        // 送る前に自分で検証する。
        // wp_safe_remote_* も内部で同じ検証をするが、拒否されたときのエラーは
        // http_request_failed ＋ 翻訳されたメッセージ（日本語環境では
        // 「有効な URL ではありません。」）で返るため、文字列では判別できない。
        // 事前に呼べばロケールに関係なく「送らなかった」と言い切れる。
        if (!wp_http_validate_url($url)) {
            return array(
                'status' => 'blocked',
                'status_code' => null,
                'message' => '安全でない宛先のため送信しませんでした',
            );
        }

        $args = array(
            'timeout'     => self::TIMEOUT,
            'redirection' => 5,
            'user-agent'  => self::USER_AGENT,
            // 第三者サイトの証明書エラーで「リンク切れ」と誤判定しないための意図的な設定。
            // 監査でも意図的と確認済み（結果を管理画面に描画するだけで、本文は取り込まない）
            'sslverify'   => false,
        );

        // まずHEADリクエストを試す（本文を受け取らないので軽い）
        $response = wp_safe_remote_head($url, $args);

        // HEADが失敗した場合はGETを試す（一部サーバーはHEADを拒否する）
        if (is_wp_error($response)) {
            $response = wp_safe_remote_get($url, $args);
        } elseif (in_array((int) wp_remote_retrieve_response_code($response), self::RETRY_WITH_GET_CODES, true)) {
            // 🚨 HEAD だけ弾いて GET なら返すサーバーは多い。
            //    ここで確かめ直さないと「HEADが403だったのでリンク切れ」という誤報になる
            $get = wp_safe_remote_get($url, $args);
            if (!is_wp_error($get)) {
                $response = $get;
            }
        }

        // 429（アクセス過多）は待ってから1回だけやり直す。
        // 同じ相手に何本もリンクが向いていると簡単に出る
        if (!is_wp_error($response) && 429 === (int) wp_remote_retrieve_response_code($response)) {
            sleep(self::get_retry_after($response));
            $retry = wp_safe_remote_get($url, $args);
            if (!is_wp_error($retry)) {
                $response = $retry;
            }
        }

        // エラーチェック
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();

            // タイムアウト判定
            if (strpos($error_message, 'timed out') !== false || strpos($error_message, 'timeout') !== false) {
                return array(
                    'status' => 'timeout',
                    'status_code' => null,
                    'message' => 'タイムアウト',
                );
            }

            // 接続エラー
            return array(
                'status' => 'error',
                'status_code' => null,
                'message' => $error_message,
            );
        }

        // ステータスコードを取得
        $status_code = wp_remote_retrieve_response_code($response);
        $headers = wp_remote_retrieve_headers($response);

        // ステータスに応じた結果を返す
        if ($status_code >= 200 && $status_code < 300) {
            // 🚨 'redirection' => 5 なので、ここに来た時点で転送は追い終わっている。
            //    最終URLを見ないと転送に気づけず、「リダイレクト」欄が永久に0になる
            //    （2026-08-22 実測: lite-word.com の自サイト内リンク13本が転送で救われていた）。
            // 🚨 外部サイトの転送は出さない。youtu.be の短縮URL・言語振り分け・トラッキング付与など
            //    「相手の都合」が大半で、こちらでは直しようがない。
            //    実測（lite-word.com・243URL）では 115件が転送になり、黄色が意味を失った。
            //    自サイト内の転送だけを出す。これは「自分のリンクが古い」という直せる合図になる。
            $final_url = self::final_url($response);
            if ('' !== $final_url && self::is_own_url($url) && self::is_real_redirect($url, $final_url)) {
                return array(
                    'status' => 'redirect',
                    'status_code' => $status_code,
                    'message' => '別のページへ転送されています',
                    'redirect_url' => $final_url,
                );
            }

            return array(
                'status' => 'ok',
                'status_code' => $status_code,
                'message' => 'OK',
            );
        }

        if ($status_code >= 300 && $status_code < 400) {
            $redirect_url = isset($headers['location']) ? $headers['location'] : null;
            return array(
                'status' => 'redirect',
                'status_code' => $status_code,
                'message' => 'リダイレクト',
                'redirect_url' => $redirect_url,
            );
        }

        // 404 と 410（Gone）だけが「そのページはもう無い」と言い切れるコード
        if (404 == $status_code || 410 == $status_code) {
            return array(
                'status' => 'not_found',
                'status_code' => $status_code,
                'message' => 'ページが見つかりません',
            );
        }

        // 相手が自動チェックを断っているだけ。リンクが切れているわけではない
        if (in_array((int) $status_code, self::UNVERIFIED_CODES, true)) {
            return array(
                'status' => 'unverified',
                'status_code' => $status_code,
                'message' => self::describe_unverified($status_code),
            );
        }

        if ($status_code >= 400 && $status_code < 500) {
            return array(
                'status' => 'client_error',
                'status_code' => $status_code,
                'message' => 'クライアントエラー',
            );
        }

        if ($status_code >= 500) {
            return array(
                'status' => 'server_error',
                'status_code' => $status_code,
                'message' => 'サーバーエラー',
            );
        }

        return array(
            'status' => 'unknown',
            'status_code' => $status_code,
            'message' => '不明なステータス',
        );
    }

    /**
     * 429 のときに何秒待つか（上限つき）。
     *
     * @param array $response レスポンス。
     * @return int
     */
    private static function get_retry_after($response) {
        $header = wp_remote_retrieve_header($response, 'retry-after');
        $wait   = 2;

        if ('' !== $header && null !== $header) {
            if (is_numeric($header)) {
                $wait = (int) $header;
            } else {
                $when = strtotime((string) $header);
                if ($when) {
                    $wait = $when - time();
                }
            }
        }

        if ($wait < 1) {
            $wait = 1;
        }

        $max = defined('LW_LINK_LIST_CRAWL_RETRY_MAX_SEC') ? LW_LINK_LIST_CRAWL_RETRY_MAX_SEC : 5;

        return min($wait, $max);
    }

    /**
     * 「確認できなかった」理由を、利用者に分かる言葉にする。
     *
     * @param int $code ステータスコード。
     * @return string
     */
    /**
     * このサイト自身のURLか。
     *
     * @param string $url URL
     * @return bool
     */
    private static function is_own_url($url) {
        $host = wp_parse_url($url, PHP_URL_HOST);
        $self = wp_parse_url(home_url('/'), PHP_URL_HOST);

        if (!$host || !$self) {
            return false;
        }

        return strtolower(ltrim($host, '.')) === strtolower(ltrim($self, '.'));
    }

    /**
     * 転送を追い終わったあとの、実際に届いたURLを返す。
     *
     * WP_HTTP の cURL 経由なら http_response が最終URLを持っている。
     * 取れない環境（fsockopen 等）では空文字を返し、判定そのものを見送る。
     *
     * @param array $response wp_remote_* の戻り値
     * @return string
     */
    private static function final_url($response) {
        if (!isset($response['http_response']) || !is_object($response['http_response'])) {
            return '';
        }
        if (!method_exists($response['http_response'], 'get_response_object')) {
            return '';
        }

        $obj = $response['http_response']->get_response_object();

        return (is_object($obj) && !empty($obj->url)) ? (string) $obj->url : '';
    }

    /**
     * 「本当に別のページへ飛ばされたか」を判定する。
     *
     * 🚨 見た目だけの差で騒がないこと。次の3つは同じ場所とみなす。
     *    ・末尾スラッシュの有無（WordPress が自動で付ける）
     *    ・http → https（常時SSL化の転送）
     *    ・#以降（サーバーには送られていない）
     *    これらを転送として数えると、ほぼ全リンクが「リダイレクト」になって意味を失う。
     *
     * @param string $from 頼んだURL
     * @param string $to   実際に届いたURL
     * @return bool
     */
    private static function is_real_redirect($from, $to) {
        return self::normalize_url($from) !== self::normalize_url($to);
    }

    /**
     * 比較用にURLをそろえる。
     *
     * @param string $url URL
     * @return string
     */
    private static function normalize_url($url) {
        $parts = wp_parse_url($url);
        if (!is_array($parts) || empty($parts['host'])) {
            return (string) $url;
        }

        $host = strtolower($parts['host']);
        $path = isset($parts['path']) ? untrailingslashit($parts['path']) : '';
        $out  = $host . ('' === $path ? '/' : $path);

        if (!empty($parts['query'])) {
            $out .= '?' . $parts['query'];
        }

        // %E3 と %e3 は同じ文字。WordPress の正規化転送でここだけ変わることがあり、
        // そろえないと「転送された」と誤って出る（2026-08-22 実測で2件）
        return preg_replace_callback(
            '/%[0-9a-fA-F]{2}/',
            function ($m) {
                return strtoupper($m[0]);
            },
            $out
        );
    }

    private static function describe_unverified($code) {
        $code = (int) $code;

        if (401 === $code) {
            return 'ログインが必要なページのため確認できませんでした（401）';
        }
        if (429 === $code) {
            return '短い時間に何度も確認したため断られました（429）。時間を置くと確認できます';
        }
        if (451 === $code) {
            return '法的な理由で表示できないとされています（451）';
        }
        if (503 === $code) {
            return '一時的に応答がありませんでした（503）。相手が自動確認を断っている場合もあります';
        }

        return '相手のサイトが自動での確認を断っています（' . $code . '）。ブラウザでは開ける可能性が高いです';
    }

    /**
     * ステータスのラベルを取得
     *
     * @param string $status ステータス
     * @return string ラベル
     */
    public static function get_status_label($status) {
        $labels = array(
            'ok' => '有効',
            'redirect' => 'リダイレクト',
            'not_found' => 'リンク切れ',
            'unverified' => '確認できず',
            'client_error' => 'エラー',
            'server_error' => 'サーバーエラー',
            'timeout' => 'タイムアウト',
            'error' => '接続エラー',
            'blocked' => '送信せず',
            'skip' => 'スキップ',
            'unknown' => '不明',
        );

        return isset($labels[$status]) ? $labels[$status] : $status;
    }
}
