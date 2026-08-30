<?php
/**
 * サイト診断 — 検査ルールの実行エンジン。
 *
 * ルールの中身は rules/ に1ルール1ファイルで置く。ここは
 * 「材料をそろえて、ルールに渡して、結果を保存する」だけを持つ。
 *
 * 検査は2系統ある。
 *
 *   DB系   … 本文とデータベースだけで判定できる。HTTPを1本も叩かない。数秒で終わる。
 *            R10 R13 R15 R16 R20 R22 R24 R25 R32 R34
 *   巡回系 … 公開URLを実際に叩かないと本当のことが分からない。
 *            R10 の「その下書きのURLは訪問者にどう見えるか」（verify_draft_links）
 *            → 巡回の締めで採り、診断のときは採った結果を読むだけにする
 *   ページ系… 公開ページを実際に開かないと判定できない。
 *            R23（タイトルの長さ）R30（h1）
 *            → リンク一覧の「ページを開いて全部調べる」に相乗りして採る。
 *
 * 🚨 ページ系をデータベースの値で代用しないこと。答えが逆になる。
 *    post_title で測ると「短すぎ105ページ」、実際の <title> で測ると「ほぼ全部長すぎ」
 *    （テーマがサイト名30文字を後ろに足すため。lite-word.com 実測・2026-08-22）。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LW_Site_Diagnostics {

    /** 一覧ページ（カテゴリー等）を一度に何本まで数えるか。タグが数百あるサイトの歯止め */
    const MAX_TERM_ARCHIVES = 200;

    /** 本文とDBだけで判定するルール（診断ボタンで消して入れ直す範囲） */
    public static function db_rule_ids() {
        return array( 'R10', 'R10U', 'R10R', 'R13', 'R14', 'R15', 'R16', 'R20', 'R22', 'R24', 'R25', 'R32', 'R32E', 'R34', 'R35' );
    }

    /** 公開ページを開かないと判定できないルール（巡回で消して入れ直す範囲） */
    public static function page_rule_ids() {
        return array( 'R23', 'R30' );
    }

    /**
     * 「検索に出すつもりのページ」の一覧（post_id => true）。判定できなければ null。
     *
     * 🚨 サイトマップの実物を正とする。設定（seo_noindex）だけを見てはいけない。
     *    noindex の付け方はテーマの設定だけではなく、プラグインが表示時に
     *    `<meta name="robots">` を出しているだけのこともある。
     *    lite-word.com はまさにそれで、サンプル130ページに seo_noindex が付いていない
     *    （lw-manual-publisher が wp_head で出している）。
     *    設定だけで判定した結果、**孤立ページ133件・説明文なし121件・重複36件**という
     *    ほぼ誤検出の一覧ができた（2026-08-22 本番実測）。
     *    サイトマップはテーマ・プラグイン両方のフィルタを通った結果なので、これが唯一正しい。
     *
     * null（判定できない）を返すのは、サイトマップ機能が止められている場合。
     * そのときは「全公開ページが対象」として扱う（黙って検査を減らさない）。
     *
     * @return array|null
     */
    public static function indexable_ids() {
        static $ids = false;

        if ( false !== $ids ) {
            return $ids;
        }

        $ids = null;

        // WordPress 5.5 以降にしか無い。古い環境では判定しない（＝全ページ対象）
        if ( ! function_exists( 'wp_sitemaps_get_server' ) ) {
            return $ids;
        }

        $server = wp_sitemaps_get_server();

        if ( ! $server || ! isset( $server->registry ) ) {
            return $ids;
        }

        // 🚨 wp_sitemaps_is_enabled() という関数は存在しない（2026-08-22 に Fatal を踏んだ）。
        //    有効かどうかは WP_Sitemaps のメソッドで見る
        if ( method_exists( $server, 'sitemaps_enabled' ) && ! $server->sitemaps_enabled() ) {
            return $ids;
        }

        $provider = $server->registry->get_provider( 'posts' );

        if ( ! $provider ) {
            return $ids;
        }

        $found = array();
        $home  = untrailingslashit( home_url( '/' ) );
        $front = (int) get_option( 'page_on_front' );

        foreach ( LW_Broken_Link_Check_Scanner::get_target_post_types() as $type ) {
            // 1ページ2,000件。多くても2万件で打ち切る（それ以上は判定に使わない）
            $max = min( 10, (int) $provider->get_max_num_pages( $type ) );

            for ( $page = 1; $page <= $max; $page++ ) {
                foreach ( (array) $provider->get_url_list( $page, $type ) as $entry ) {
                    if ( empty( $entry['loc'] ) ) {
                        continue;
                    }

                    $target = LW_Site_Url_Index::resolve( $entry['loc'] );

                    if ( $target ) {
                        $found[ $target['post_id'] ] = true;
                        continue;
                    }

                    // トップページは URL から投稿を引けない。固定ページをトップにしていれば拾う
                    if ( $front && untrailingslashit( $entry['loc'] ) === $home ) {
                        $found[ $front ] = true;
                    }
                }
            }
        }

        // 1件も取れないのは異常。検査を減らすより、全ページを対象にした方が安全
        $ids = empty( $found ) ? null : $found;

        return $ids;
    }

    /**
     * そのページを「検索に出すつもり」か。
     *
     * 検索まわりのルール（孤立・タイトル・説明文）はこれが true のページだけに出す。
     * 訪問者に実害が出るルール（下書きへのリンク・差し込み文字の残り・画像のalt）は
     * 検索に出さないページでも指摘する。訪問者はそのページも見るため。
     *
     * @param int $post_id 対象。
     * @return bool
     */
    public static function is_indexable( $post_id ) {
        $ids = self::indexable_ids();

        if ( null === $ids ) {
            return true;
        }

        return isset( $ids[ (int) $post_id ] );
    }

    /**
     * 文字数を数える。
     *
     * 🚨 mb_strlen を直接呼ばないこと。共用サーバーでは mbstring が無効なことがあり、
     *    php -l では見つからない Fatal になる（class-scanner.php の trim_text と同じ理由）。
     *    UTF-8 の継続バイト（10xxxxxx）を落として数えれば mbstring は要らない。
     *
     * @param string $text 対象。
     * @return int
     */
    public static function text_length( $text ) {
        return (int) strlen( preg_replace( '/[\x80-\xBF]/', '', (string) $text ) );
    }

    /* ---------------------------------------------------------
     * ① 本文とDBだけで調べる
     * ------------------------------------------------------- */

    /**
     * 診断を始める（前回の結果を捨てる）。
     *
     * 🚨 全部消さない。巡回でしか採れないページ系ルールの結果は残す。
     *    消してしまうと「本文だけ調べる」を1回押しただけで、
     *    せっかく巡回して採ったタイトル・見出しの指摘が黙って消える。
     *
     * @return int 対象ページ数。
     */
    public static function begin() {
        lw_site_issues_create_table();
        lw_site_issues_clear_rules( self::db_rule_ids() );

        return LW_Broken_Link_Check_Scanner::count_scannable_posts();
    }

    /**
     * 本文の検査を1バッチぶん走らせる。
     *
     * @param int $offset 開始位置。
     * @param int $limit  件数。
     * @return int 調べたページ数。
     */
    public static function content_batch( $offset = 0, $limit = 20 ) {
        $posts = get_posts(
            array(
                'post_type'        => LW_Broken_Link_Check_Scanner::get_target_post_types(),
                'post_status'      => 'publish',
                'posts_per_page'   => (int) $limit,
                'offset'           => (int) $offset,
                'orderby'          => 'ID',
                'order'            => 'ASC',
                'suppress_filters' => false,
            )
        );

        $issues = array();

        foreach ( $posts as $post ) {
            $content = self::parse_content( $post );
            $issues  = array_merge( $issues, lw_site_rule_image_alt( $post, $content ) );
        }

        lw_site_issues_save( $issues );

        return count( $posts );
    }

    /**
     * サイト全体を見ないと判定できないルールを走らせる（診断の締め）。
     *
     * リンクの台帳が全ページぶんそろってからでないと、
     * 「どこからもリンクされていない」も「下書きへのリンク」も数えられない。
     *
     * @return array array('issues' => 件数, 'pages' => 台帳のページ数, 'scan_mode' => light|full)
     */
    public static function finish() {
        $ledger    = lw_link_list_get_from_db();
        $scan_mode = lw_link_list_get_scan_mode();

        $issues = array();

        // リンクの台帳が要るもの
        if ( ! empty( $ledger['pages'] ) ) {
            $issues = array_merge( $issues, lw_site_rule_draft_links( $ledger ) );
            $issues = array_merge( $issues, lw_site_rule_redirect( $ledger ) );
            $issues = array_merge( $issues, lw_site_rule_placeholder( $ledger ) );

            // 🚨 孤立ページは巡回した台帳のときだけ。
            //    本文だけの台帳ではメニュー・フッターのリンクが見えないので、
            //    メニューに入っているページまで「孤立」と誤って言ってしまう
            if ( 'full' === $scan_mode ) {
                $issues = array_merge( $issues, lw_site_rule_orphan( $ledger ) );

                // 一覧ページ（カテゴリー）自体への導線。R13 が「一覧から張られている」と
                // 数えてよいかの根拠でもあるので、同じ台帳・同じ条件で見る
                $issues = array_merge( $issues, lw_site_rule_archive_orphan( $ledger ) );
            }
        }

        // 台帳が無くても判定できるもの
        $issues = array_merge( $issues, lw_site_rule_sitemap_noindex() );
        $issues = array_merge( $issues, lw_site_rule_duplicate_title() );
        $issues = array_merge( $issues, lw_site_rule_description() );
        $issues = array_merge( $issues, lw_site_rule_title_suffix() );

        lw_site_issues_save( $issues );

        $meta      = lw_site_issues_get_meta();
        $indexable = self::indexable_ids();

        lw_site_issues_set_meta(
            array_merge(
                $meta,
                array(
                    'pages'      => max( count( $ledger['pages'] ), LW_Broken_Link_Check_Scanner::count_scannable_posts() ),
                    'scan_mode'  => $scan_mode,
                    'checked_at' => current_time( 'mysql' ),
                    // 検索まわりの検査の対象になったページ数。null＝サイトマップで判定できず全ページが対象
                    'indexable'  => ( null === $indexable ) ? null : count( $indexable ),
                )
            )
        );

        return array(
            'issues'    => count( $issues ),
            'pages'     => count( $ledger['pages'] ),
            'scan_mode' => $scan_mode,
        );
    }

    /* ---------------------------------------------------------
     * ② 公開ページを開いて調べる（巡回に相乗り）
     * ------------------------------------------------------- */

    /**
     * 巡回の開始時に、前回のページ系ルールの結果を捨てる。
     *
     * @return void
     */
    public static function begin_page_rules() {
        lw_site_issues_create_table();
        lw_site_issues_clear_rules( self::page_rule_ids() );
    }

    /**
     * 巡回で取得したHTMLからページ系ルールを走らせる。
     *
     * @param int    $post_id 対象。
     * @param string $html    取得したHTML。空なら何もしない。
     * @return void
     */
    public static function analyze_crawled( $post_id, $html ) {
        if ( '' === trim( (string) $html ) ) {
            return;
        }

        $post = get_post( $post_id );

        if ( ! $post ) {
            return;
        }

        // タイトルの長さも h1 も「検索結果でどう見えるか」の話なので、
        // 検索に出さないページでは指摘しない
        if ( ! self::is_indexable( $post_id ) ) {
            return;
        }

        $view = self::parse_view( $html );

        $issues = array_merge(
            lw_site_rule_title_length( $post, $view ),
            lw_site_rule_heading( $post, $view )
        );

        lw_site_issues_save( $issues );
    }

    /**
     * 一覧ページ（トップ・投稿一覧・カテゴリー等）から張られているリンクを集める。
     *
     * 🚨 これが無いと「孤立ページ」が普通のサイトで誤検出になる。
     *    リンクの台帳は投稿・固定ページのURLしか巡回しないので、
     *    **アーカイブから張られているリンクを1本も持っていない**。
     *    その状態で孤立を判定すると、ブログ記事が全部「どこからもリンクされていない」になる。
     *    （lite-word.com は一覧ブロックが JavaScript 描画なので実際に0本だったが、
     *      サーバー側で <a> を出すサイトでは全部誤検出になる・2026-08-22）
     *
     * 🚨 「どの一覧ページから張られていたか」まで残す（2026-08-23）。
     *    以前は post_id の平らな配列しか残しておらず、R13 が
     *    **その一覧ページ自体がどこからも辿れなくても「リンクされている」と数えて**いた。
     *    lite-word.com がまさにその状態で、カテゴリー一覧へのリンクがサイト内に0本、
     *    記事はそこからしか辿れないのに孤立と出ていなかった。内訳が無いと直しようがない。
     *
     * 🚨 どの一覧ページを取りに行くかを term の count で決めない（2026-08-23）。
     *    count は wp_update_term_count が走るまで古い値のまま残る。lite-word.com では
     *    下書きを含んだ古い数字が入っていて、**公開記事が0件のカテゴリー2つを取りに行き、
     *    公開記事のあるカテゴリー3つを取りこぼしていた**。公開記事数はその場で数える。
     *
     * 巡回（しっかりスキャン）の締めで1回だけ走る。
     * 取りに行くのは LW_SITE_ARCHIVE_CRAWL_MAX 本まで（1本ごとに HTTP が1回増えるため）。
     *
     * @return int 見つかったページ数。
     */
    public static function collect_archive_links() {
        $archives = self::archive_targets();
        $found    = array();
        $first    = true;

        foreach ( $archives as $key => $archive ) {
            // 🚨 続けざまに叩かない（自サイトでも 429 で弾かれる）
            if ( ! $first ) {
                usleep( LW_Link_List_Crawler::get_delay_us() );
            }
            $first = false;

            $result = LW_Link_List_Crawler::fetch( $archive['url'] );

            if ( empty( $result['ok'] ) ) {
                continue;
            }

            $ids = array();

            foreach ( LW_Broken_Link_Check_Scanner::extract_all_a_tags( $result['body'] ) as $link ) {
                $target = LW_Site_Url_Index::resolve( isset( $link['href'] ) ? $link['href'] : '' );

                if ( $target ) {
                    $ids[ (int) $target['post_id'] ]   = true;
                    $found[ (int) $target['post_id'] ] = true;
                }
            }

            $archives[ $key ]['ids'] = array_keys( $ids );
        }

        update_option(
            LW_SITE_ARCHIVE_LINKS_OPTION,
            array(
                'version'    => 2,
                'checked_at' => current_time( 'mysql' ),
                'archives'   => array_values( $archives ),
            ),
            false
        );

        return count( $found );
    }

    /**
     * 取りに行く一覧ページの一覧。
     *
     * ①トップページ ②投稿一覧ページ ③タクソノミーの一覧ページ（公開記事の多い順）
     *
     * @return array
     */
    private static function archive_targets() {
        $targets = array();

        $targets['home'] = array(
            'kind'  => 'home',
            'url'   => home_url( '/' ),
            'label' => 'トップページ',
            'posts' => 0,
            'ids'   => array(),
        );

        $posts_page = (int) get_option( 'page_for_posts' );

        if ( $posts_page ) {
            $link = get_permalink( $posts_page );

            if ( $link ) {
                $targets['posts_page'] = array(
                    'kind'    => 'posts_page',
                    'url'     => $link,
                    'label'   => get_the_title( $posts_page ),
                    'post_id' => $posts_page,
                    'posts'   => 0,
                    'ids'     => array(),
                );
            }
        }

        $terms = self::term_archives();

        // 公開記事の多い順に、上限まで
        usort(
            $terms,
            function ( $a, $b ) {
                return (int) $b['posts'] - (int) $a['posts'];
            }
        );

        foreach ( array_slice( $terms, 0, (int) LW_SITE_ARCHIVE_CRAWL_MAX ) as $term ) {
            $targets[ $term['taxonomy'] . ':' . $term['term_id'] ] = $term;
        }

        return $targets;
    }

    /**
     * 一覧ページ（タクソノミーのアーカイブ）の一覧。公開記事が1本も無いものは入れない。
     *
     * 🚨 公開記事数はその場で数える（term の count を信じない）。
     *    count は wp_update_term_count が走るまで古いままで、下書きを含んだ数が残る。
     *    lite-word.com では count=5 なのに公開記事は0件、というカテゴリーが2つあった。
     *
     * 🚨 対象は「サイトマップに載る一覧ページ」だけにする。
     *    公開タクソノミーを全部見ると post_format のような、そもそも検索に出すつもりの
     *    無い一覧まで数えることになる。判定の考え方は is_indexable() と同じ。
     *
     * @return array kind/url/label/taxonomy/term_id/posts/ids
     */
    public static function term_archives() {
        static $cache = null;

        if ( null !== $cache ) {
            return $cache;
        }

        $cache      = array();
        $taxonomies = self::archive_taxonomies();
        $types      = LW_Broken_Link_Check_Scanner::get_target_post_types();

        if ( empty( $taxonomies ) || empty( $types ) ) {
            return $cache;
        }

        global $wpdb;

        $tax_ph  = implode( ',', array_fill( 0, count( $taxonomies ), '%s' ) );
        $type_ph = implode( ',', array_fill( 0, count( $types ), '%s' ) );

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT tt.term_id, tt.taxonomy, COUNT(p.ID) AS posts
                 FROM {$wpdb->term_taxonomy} tt
                 INNER JOIN {$wpdb->term_relationships} tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
                 INNER JOIN {$wpdb->posts} p ON p.ID = tr.object_id
                 WHERE tt.taxonomy IN ($tax_ph)
                   AND p.post_status = 'publish'
                   AND p.post_type IN ($type_ph)
                 GROUP BY tt.term_taxonomy_id
                 ORDER BY posts DESC
                 LIMIT " . self::MAX_TERM_ARCHIVES,
                array_merge( $taxonomies, $types )
            ),
            ARRAY_A
        );

        foreach ( (array) $rows as $row ) {
            $link = get_term_link( (int) $row['term_id'], $row['taxonomy'] );

            if ( ! $link || is_wp_error( $link ) ) {
                continue;
            }

            $term = get_term( (int) $row['term_id'], $row['taxonomy'] );

            $cache[] = array(
                'kind'     => 'term',
                'url'      => $link,
                'label'    => ( $term && ! is_wp_error( $term ) ) ? $term->name : $row['taxonomy'],
                'taxonomy' => $row['taxonomy'],
                'term_id'  => (int) $row['term_id'],
                'posts'    => (int) $row['posts'],
                'ids'      => array(),
            );
        }

        return $cache;
    }

    /**
     * 一覧ページを見に行くタクソノミー。
     *
     * @return array タクソノミー名。
     */
    private static function archive_taxonomies() {
        $names = array();

        if ( function_exists( 'wp_sitemaps_get_server' ) ) {
            $server = wp_sitemaps_get_server();

            if ( $server && isset( $server->registry )
                && ( ! method_exists( $server, 'sitemaps_enabled' ) || $server->sitemaps_enabled() ) ) {
                $provider = $server->registry->get_provider( 'taxonomies' );

                if ( $provider && method_exists( $provider, 'get_object_subtypes' ) ) {
                    foreach ( (array) $provider->get_object_subtypes() as $taxonomy ) {
                        $names[] = is_object( $taxonomy ) ? $taxonomy->name : (string) $taxonomy;
                    }
                }
            }
        }

        if ( empty( $names ) ) {
            // サイトマップが止まっている環境。公開タクソノミーで代用する
            $names = get_taxonomies( array( 'public' => true, 'publicly_queryable' => true ), 'names' );
        }

        $types = LW_Broken_Link_Check_Scanner::get_target_post_types();
        $out   = array();

        foreach ( (array) $names as $name ) {
            // 投稿フォーマットは「一覧への導線」を語る対象ではない
            if ( 'post_format' === $name ) {
                continue;
            }

            $taxonomy = get_taxonomy( $name );

            if ( ! $taxonomy || empty( $taxonomy->public ) ) {
                continue;
            }

            if ( ! array_intersect( (array) $taxonomy->object_type, $types ) ) {
                continue;
            }

            $out[] = $name;
        }

        return array_values( array_unique( $out ) );
    }

    /**
     * 一覧ページから張られていると分かっているページ。
     *
     * null＝一度も集めていない（＝孤立の判定に使えない）。
     *
     * @return array|null post_id => true
     */
    public static function archive_linked_ids() {
        $saved = get_option( LW_SITE_ARCHIVE_LINKS_OPTION, null );

        if ( ! is_array( $saved ) ) {
            return null;
        }

        // 旧形式（post_id の平らな配列）。内訳は持っていないが、集めてはある
        if ( ! isset( $saved['archives'] ) ) {
            return array_fill_keys( array_map( 'intval', $saved ), true );
        }

        $ids = array();

        foreach ( (array) $saved['archives'] as $archive ) {
            foreach ( (array) ( isset( $archive['ids'] ) ? $archive['ids'] : array() ) as $id ) {
                $ids[ (int) $id ] = true;
            }
        }

        return $ids;
    }

    /**
     * 一覧ページ1本ごとの内訳（どの一覧が、どのページを張っていたか）。
     *
     * null＝一度も集めていない、または旧形式（内訳を持っていない）。
     * 旧形式のときは、これまでどおり「一覧ページは辿れる」として扱うしかない。
     *
     * @return array|null
     */
    public static function archive_list() {
        $saved = get_option( LW_SITE_ARCHIVE_LINKS_OPTION, null );

        if ( ! is_array( $saved ) || ! isset( $saved['archives'] ) || ! is_array( $saved['archives'] ) ) {
            return null;
        }

        return $saved['archives'];
    }

    /**
     * 台帳に出てくる内部リンクを「パス」の集合にする。
     *
     * 🚨 投稿・固定ページは LW_Site_Url_Index で引けるが、カテゴリーの一覧ページは
     *    投稿ではないので引けない（resolve() は null を返す）。
     *    「その一覧ページに入る道があるか」を見るには、パスで突き合わせるしかない。
     *
     * @param array $ledger lw_link_list_get_from_db() の戻り値。
     * @return array path => 張っているページ数
     */
    public static function ledger_link_paths( $ledger ) {
        $paths = array();

        if ( empty( $ledger['links'] ) || ! is_array( $ledger['links'] ) ) {
            return $paths;
        }

        foreach ( $ledger['links'] as $link ) {
            $path = self::link_path( isset( $link['href'] ) ? $link['href'] : '' );

            if ( '' === $path ) {
                continue;
            }

            if ( ! isset( $paths[ $path ] ) ) {
                $paths[ $path ] = array();
            }

            $paths[ $path ][ (int) ( isset( $link['source_id'] ) ? $link['source_id'] : 0 ) ] = true;
        }

        foreach ( $paths as $path => $sources ) {
            $paths[ $path ] = count( $sources );
        }

        return $paths;
    }

    /**
     * サイト内URLを、突き合わせ用のパスにする。外部・アンカー・トップページは空。
     *
     * 🚨 カテゴリーのURLは日本語スラッグだと %e3%81%9d... の形で書かれる。
     *    片方だけエンコードされていると一致しないので、必ず urldecode してから比べる。
     *
     * @param string $url 対象。
     * @return string
     */
    public static function link_path( $url ) {
        $url = trim( (string) $url );

        if ( '' === $url || ! LW_Site_Url_Index::is_internal( $url ) ) {
            return '';
        }

        $parts = wp_parse_url( $url );

        if ( false === $parts || empty( $parts['path'] ) ) {
            return '';
        }

        $path = urldecode( $parts['path'] );
        $home = wp_parse_url( home_url( '/' ), PHP_URL_PATH );

        if ( $home && '/' !== $home ) {
            $home = rtrim( $home, '/' );

            if ( 0 === strpos( $path, $home . '/' ) || $path === $home ) {
                $path = substr( $path, strlen( $home ) );
            }
        }

        return trim( (string) $path, '/' );
    }

    /* ---------------------------------------------------------
     * ③ 下書きページのURLが、訪問者にはどう見えるかを実地で確かめる
     * ------------------------------------------------------- */

    /**
     * 「公開していないページへのリンク」の行き先を、実際に叩いて確かめる。
     *
     * 🚨 これが無いと R10 が誤検出になる（2026-08-23・本番実測）。
     *    下書きページのURLでも、転送が設定されていれば訪問者はちゃんと別ページを見る。
     *    lite-word.com では R10 が指摘した12種**すべて**が301で新しいマニュアルへ
     *    転送されていて、行き止まりは0件だった。しかもその転送はテーマの
     *    seo_301_redirect_url ではなくプラグイン側にあり、**DBからは存在すら分からない**。
     *    叩いてみる以外に知る方法が無い。
     *
     * 🚨 診断ボタン（ajax/diagnose.php）からは呼ばないこと。
     *    あちらは HTTP を1本も出さない決まり（2026-08-22 Ryuichi 判断）。
     *    ここは巡回（ページを開いて全部調べる）の締めで1回だけ走る。
     *
     * 叩く本数は上限つき。超えたぶんは「確認していない」として残す（黙って切らない）。
     *
     * 🚨 前回の結果は引き継ぐ。引き継がないと、時間切れの位置が毎回同じなので
     *    **同じURLが永久に未確認**になる（2026-08-23・lite-word.com で実際に起きた）。
     *
     * @return array array('checked' => 今回叩いた数, 'skipped' => まだ判定が付いていない数)
     */
    public static function verify_draft_links() {
        $ledger = lw_link_list_get_from_db();
        $urls   = array();

        if ( ! empty( $ledger['links'] ) ) {
            foreach ( $ledger['links'] as $link ) {
                $href = isset( $link['href'] ) ? (string) $link['href'] : '';

                if ( '' === $href ) {
                    continue;
                }

                $target = LW_Site_Url_Index::resolve( $href );

                if ( null === $target || 'publish' === $target['status'] ) {
                    continue;
                }

                $key = lw_site_rule_draft_link_key( $href );

                if ( '' === $key || isset( $urls[ $key ] ) ) {
                    continue;
                }

                $url = lw_site_rule_absolute_url( $href );
                $cut = strpos( $url, '#' );

                $urls[ $key ] = ( false === $cut ) ? $url : substr( $url, 0, $cut );
            }
        }

        // 🚨 前回の結果を引き継ぐ（2026-08-23）。
        //    引き継がないと毎回まっさらから叩き直すので、時間切れの位置が毎回同じになり
        //    **同じURLが永久に未確認**のまま残る。lite-word.com で実際に起きた:
        //    下書きリンク12本・制限15秒・巡回が429を食らって1200ms待ちだったため11本で時間切れ
        //    → 12本目の /theme-download/ だけが毎回あぶれ、「ページを開いて全部調べる」を
        //    何度押しても🟡のまま消えなかった（実際は301で転送されていて訪問者は困っていない）。
        //    ⚠️ 台帳から消えたURLの結果は捨てる（公開された・リンクを直した ＝ もう指摘に出ない）。
        $saved  = get_option( LW_SITE_DRAFT_LINK_STATUS_OPTION, null );
        $before = ( is_array( $saved ) && ! empty( $saved['urls'] ) && is_array( $saved['urls'] ) )
            ? $saved['urls']
            : array();

        $status = array_intersect_key( $before, $urls );

        // 🚨 まだ一度も確かめていないものを先に、次は確かめてから古い順に叩く。
        //    上限（LW_SITE_DRAFT_LINK_VERIFY_MAX）と時間切れで切られるのは必ず「後ろ」なので、
        //    1回ぶんずつでも未確認が減っていき、何回か回せば必ず全部に判定が付く。
        //    古い順に回し直すのは、あとから転送を外されたリンクを取りこぼさないため。
        $never = array();
        $again = array();

        foreach ( $urls as $key => $url ) {
            if ( isset( $status[ $key ] ) ) {
                // 'at' が無いのは引き継ぎ前の古い形式。いちばん古いものとして先に確かめ直す
                $again[ $key ] = isset( $status[ $key ]['at'] ) ? (string) $status[ $key ]['at'] : '';
            } else {
                $never[ $key ] = $url;
            }
        }

        asort( $again );

        $ordered = $never;

        foreach ( array_keys( $again ) as $key ) {
            $ordered[ $key ] = $urls[ $key ];
        }

        $targets = array_slice( $ordered, 0, (int) LW_SITE_DRAFT_LINK_VERIFY_MAX, true );

        $checked = 0;
        $started = microtime( true );
        $first   = true;

        foreach ( $targets as $key => $url ) {
            // 使ってよい時間を超えたら、残りは前回のまま（引き継いだ結果）にして抜ける。
            // 巡回の締めは他の仕事も持っているので、ここで居座らない
            if ( ! $first && ( microtime( true ) - $started ) > LW_SITE_DRAFT_LINK_VERIFY_BUDGET ) {
                break;
            }

            // 🚨 続けざまに叩かない（自サイトでも 429 で弾かれる）
            if ( ! $first ) {
                usleep( LW_Link_List_Crawler::get_delay_us() );
            }
            $first = false;

            $verdict = self::judge_draft_url( LW_Broken_Link_Check_Checker::check_url( $url ) );

            // 🚨 相手が断って判定できなかったときも「叩いた時刻」は控える。
            //    控えないと、答えないURLが毎回列の先頭に居座って他を押し出す。
            //    verdict は 'unknown' のままなので、R10 から見た扱いは未確認で変わらない
            $status[ $key ] = ( null !== $verdict )
                ? array_merge( $verdict, array( 'at' => current_time( 'mysql' ) ) )
                : array(
                    'verdict' => 'unknown',
                    'code'    => null,
                    'goes_to' => '',
                    'at'      => current_time( 'mysql' ),
                );

            ++$checked;
        }

        $pending = self::count_pending_draft_links( $urls, $status );

        update_option(
            LW_SITE_DRAFT_LINK_STATUS_OPTION,
            array(
                'checked_at' => current_time( 'mysql' ),
                'skipped'    => $pending,
                'urls'       => $status,
            ),
            false
        );

        return array(
            'checked' => $checked,
            'skipped' => $pending,
        );
    }

    /**
     * まだ判定が付いていない下書きリンクの本数を数える。
     *
     * 「一度も叩いていない」と「叩いたが相手が断った」の両方を数える。
     * どちらも利用者から見れば同じ＝まだ分かっていない。
     *
     * @param array $urls   いま台帳にある下書きリンク（キー => URL）。
     * @param array $status 叩いた結果。
     * @return int
     */
    private static function count_pending_draft_links( $urls, $status ) {
        $pending = 0;

        foreach ( $urls as $key => $url ) {
            if ( empty( $status[ $key ]['verdict'] ) || 'unknown' === $status[ $key ]['verdict'] ) {
                ++$pending;
            }
        }

        return $pending;
    }

    /**
     * 1本ぶんの結果を「行き止まり／生きている」に振り分ける。
     *
     * 🚨 分からないものは分からないままにする（null を返す）。
     *    403・429・タイムアウト・接続不可は「相手が自動チェックを断った」だけで、
     *    訪問者が開けないという意味ではない（class-checker.php の UNVERIFIED_CODES 参照）。
     *    ここで白黒つけると、R10 がまた誤検出に戻る。
     *
     * @param array $result LW_Broken_Link_Check_Checker::check_url() の戻り値。
     * @return array|null verdict / code / goes_to。分からなければ null。
     */
    private static function judge_draft_url( $result ) {
        $status = isset( $result['status'] ) ? $result['status'] : '';
        $code   = isset( $result['status_code'] ) ? $result['status_code'] : null;

        if ( 'not_found' === $status ) {
            return array(
                'verdict' => 'dead',
                'code'    => $code,
                'goes_to' => '',
            );
        }

        if ( 'redirect' === $status || 'ok' === $status ) {
            return array(
                'verdict' => 'alive',
                'code'    => $code,
                'goes_to' => isset( $result['redirect_url'] ) ? (string) $result['redirect_url'] : '',
            );
        }

        return null;
    }

    /**
     * 前回叩いた結果（キー => verdict / code / goes_to）。
     *
     * 一度も叩いていなければ空。R10 はそのとき全部「確認していない」として扱う。
     *
     * @return array
     */
    public static function draft_link_status() {
        $saved = get_option( LW_SITE_DRAFT_LINK_STATUS_OPTION, null );

        if ( ! is_array( $saved ) || empty( $saved['urls'] ) || ! is_array( $saved['urls'] ) ) {
            return array();
        }

        return $saved['urls'];
    }

    /**
     * まだ判定が付いていない下書きリンクの本数。
     *
     * 0 でなければ、画面で「あと◯本は確かめきれていない」と伝える。
     * もう一度「ページを開いて全部調べる」を実行すれば、未確認のものから順に続きを確かめる
     * （前回の結果は引き継ぐので、やり直しにはならない）。
     *
     * @return int
     */
    public static function draft_link_pending() {
        $saved = get_option( LW_SITE_DRAFT_LINK_STATUS_OPTION, null );

        return ( is_array( $saved ) && isset( $saved['skipped'] ) ) ? (int) $saved['skipped'] : 0;
    }

    /**
     * 下書きリンクを最後に確かめた日時（画面が「まだ確かめていない」を出し分ける根拠）。
     *
     * @return string|null
     */
    public static function draft_link_checked_at() {
        $saved = get_option( LW_SITE_DRAFT_LINK_STATUS_OPTION, null );

        return ( is_array( $saved ) && ! empty( $saved['checked_at'] ) ) ? (string) $saved['checked_at'] : null;
    }

    /**
     * 巡回が終わったら、いつ採ったかを控える。
     *
     * @return void
     */
    public static function finish_page_rules() {
        $meta = lw_site_issues_get_meta();

        lw_site_issues_set_meta(
            array_merge( $meta, array( 'page_rules_at' => current_time( 'mysql' ) ) )
        );
    }

    /* ---------------------------------------------------------
     * 材料づくり
     * ------------------------------------------------------- */

    /**
     * 公開ページのHTMLから、タイトルと h1 の数を取り出す。
     *
     * 🚨 ここは DOMDocument を使わない。1ページ200KB を超えることがあり、
     *    2つの値のために全体を構文解析するのは割に合わない。
     *
     * @param string $html 取得したHTML。
     * @return array
     */
    private static function parse_view( $html ) {
        $title = '';

        if ( preg_match( '#<title[^>]*>(.*?)</title>#is', $html, $m ) ) {
            $title = trim( html_entity_decode( wp_strip_all_tags( $m[1] ), ENT_QUOTES, 'UTF-8' ) );
        }

        return array(
            'title'    => $title,
            'h1_count' => preg_match_all( '#<h1[\s>]#i', $html ),
        );
    }

    /**
     * 本文の画像を数える。
     *
     * alt 属性が無いもの（🟡）と、空のもの（🔵 装飾なら正しい）を分けて数える。
     *
     * @param WP_Post $post 対象。
     * @return array
     */
    private static function parse_content( $post ) {
        $result = array(
            'img_total'     => 0,
            'img_no_alt'    => 0,
            'img_empty_alt' => 0,
        );

        $html = (string) $post->post_content;

        if ( '' === trim( $html ) || false === stripos( $html, '<img' ) ) {
            return $result;
        }

        $dom = new DOMDocument();

        // 不正なHTMLでも止まらない（class-scanner.php と同じ扱い）
        libxml_use_internal_errors( true );
        $dom->loadHTML( '<?xml encoding="UTF-8">' . $html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        libxml_clear_errors();

        foreach ( $dom->getElementsByTagName( 'img' ) as $img ) {
            ++$result['img_total'];

            if ( ! $img->hasAttribute( 'alt' ) ) {
                ++$result['img_no_alt'];
                continue;
            }

            if ( '' === trim( $img->getAttribute( 'alt' ) ) ) {
                ++$result['img_empty_alt'];
            }
        }

        return $result;
    }
}
