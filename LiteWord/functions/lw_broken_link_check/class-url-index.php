<?php
/**
 * サイト内URL → 投稿 の対応表。
 *
 * 「そのリンクの先が下書きのままではないか」を、HTTP を1本も叩かずに判定するための土台。
 *
 * 🚨 管理者はログインしているので、下書きページのリンクを踏んでも普通に開けてしまう。
 *    外から見る診断ツール（PSI・一般的なリンクチェッカー）は、そもそも下書きの存在を知らない。
 *    この検査は「中から見る」ものにしかできない。
 *    実例: lite-word.com のフッター「ホーム」が下書きの固定ページ #12 を指していて、
 *    105ページで訪問者だけが404を見ていた（2026-08-22 に発見・修正）。
 *
 * 🚨 url_to_postid() は使わない。公開済みしか返さないため、まさに見つけたいものが見つからない。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LW_Site_Url_Index {

    /** 一度に読む投稿の上限（巨大サイトでメモリを使い切らないための歯止め） */
    const MAX_ROWS = 20000;

    /** @var array|null path => 投稿情報 */
    private static $by_path = null;

    /** @var array id => 投稿情報 */
    private static $by_id = array();

    /** @var array slug => 投稿情報（階層を持たない投稿タイプ用。重複した slug は捨てる） */
    private static $by_slug = array();

    /** @var array 解決結果のキャッシュ（同じURLが何十ページからも張られている） */
    private static $resolved = array();

    /**
     * 対応表を作る（1リクエストに1回だけ）。
     *
     * @return void
     */
    public static function build() {
        if ( null !== self::$by_path ) {
            return;
        }

        self::$by_path = array();

        global $wpdb;

        $types = LW_Broken_Link_Check_Scanner::get_target_post_types();

        if ( empty( $types ) ) {
            return;
        }

        $type_ph = implode( ',', array_fill( 0, count( $types ), '%s' ) );

        // ゴミ箱まで含めるのは「消したページを指したままのリンク」を見つけるため
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT ID, post_name, post_type, post_status, post_parent, post_title
                 FROM {$wpdb->posts}
                 WHERE post_type IN ($type_ph)
                   AND post_status IN ('publish','draft','pending','private','future','trash')
                 LIMIT " . self::MAX_ROWS,
                $types
            ),
            ARRAY_A
        );

        $hierarchical = array();

        foreach ( (array) $rows as $row ) {
            $id = (int) $row['ID'];

            $info = array(
                'post_id'   => $id,
                'post_name' => $row['post_name'],
                'post_type' => $row['post_type'],
                'status'    => $row['post_status'],
                'title'     => $row['post_title'],
                'parent'    => (int) $row['post_parent'],
            );

            self::$by_id[ $id ] = $info;

            if ( is_post_type_hierarchical( $row['post_type'] ) ) {
                $hierarchical[ $id ] = $info;
                continue;
            }

            $slug = (string) $row['post_name'];

            if ( '' === $slug ) {
                continue;
            }

            // 同じ slug が複数あるときは、どれを指しているか決められないので使わない
            self::$by_slug[ $slug ] = isset( self::$by_slug[ $slug ] ) ? false : $info;
        }

        // 階層のある投稿タイプ（固定ページ）は親をたどってフルパスにする
        foreach ( $hierarchical as $id => $info ) {
            $path = self::build_path( $id, $hierarchical );

            if ( '' !== $path ) {
                self::$by_path[ $path ] = $info;
            }
        }
    }

    /**
     * 親をたどって親/子 のパスを作る。
     *
     * @param int   $id    対象。
     * @param array $pages 階層のある投稿だけの一覧。
     * @return string
     */
    private static function build_path( $id, $pages ) {
        $parts = array();
        $guard = 0;

        while ( isset( $pages[ $id ] ) && $guard < 20 ) {
            array_unshift( $parts, $pages[ $id ]['post_name'] );
            $id = (int) $pages[ $id ]['parent'];
            ++$guard;
        }

        return implode( '/', array_filter( $parts ) );
    }

    /**
     * サイト内のURLか。
     *
     * @param string $href リンク先。
     * @return bool
     */
    public static function is_internal( $href ) {
        $href = trim( (string) $href );

        if ( '' === $href ) {
            return false;
        }

        // アンカー・メール・電話・JavaScript は対象外
        // 🚨 区切り文字を # にすると、パターン内の # と衝突して
        //    「Unknown modifier」の警告が全リンクぶん出る（2026-08-22 の実機で判明）
        if ( preg_match( '~^(\#|mailto:|tel:|javascript:|data:)~i', $href ) ) {
            return false;
        }

        // ルート相対・相対
        if ( '/' === substr( $href, 0, 1 ) || ! preg_match( '#^[a-z][a-z0-9+.-]*://#i', $href ) ) {
            return true;
        }

        $host = wp_parse_url( $href, PHP_URL_HOST );
        $home = wp_parse_url( home_url( '/' ), PHP_URL_HOST );

        return ( $host && $home && strtolower( $host ) === strtolower( $home ) );
    }

    /**
     * URL から投稿を引く。見つからなければ null。
     *
     * 見つからない＝リンク切れ、ではない（カテゴリ・アーカイブ・添付・
     * プラグインが作るページなど、投稿以外のURLはいくらでもある）。
     * 判定できないものは黙って対象外にする。誤報を出さないことを優先する。
     *
     * @param string $href リンク先。
     * @return array|null array('post_id','status','post_type','title')
     */
    public static function resolve( $href ) {
        $href = (string) $href;

        if ( isset( self::$resolved[ $href ] ) ) {
            return self::$resolved[ $href ];
        }

        self::build();

        $found = self::lookup( $href );

        self::$resolved[ $href ] = $found;

        return $found;
    }

    /**
     * 実際の引き当て。
     *
     * @param string $href リンク先。
     * @return array|null
     */
    private static function lookup( $href ) {
        if ( ! self::is_internal( $href ) ) {
            return null;
        }

        $parts = wp_parse_url( $href );

        if ( false === $parts ) {
            return null;
        }

        // ?page_id=12 / ?p=123 は ID がそのまま書いてある
        if ( ! empty( $parts['query'] ) ) {
            $query = array();
            parse_str( $parts['query'], $query );

            foreach ( array( 'page_id', 'p', 'attachment_id' ) as $key ) {
                if ( ! empty( $query[ $key ] ) && is_numeric( $query[ $key ] ) ) {
                    $id = (int) $query[ $key ];
                    return isset( self::$by_id[ $id ] ) ? self::$by_id[ $id ] : null;
                }
            }
        }

        $path = isset( $parts['path'] ) ? $parts['path'] : '';
        $path = self::strip_home_path( $path );
        $path = trim( urldecode( $path ), '/' );

        if ( '' === $path ) {
            // トップページ。指摘の対象にしない
            return null;
        }

        // 固定ページ（親/子 のフルパス）
        if ( isset( self::$by_path[ $path ] ) ) {
            return self::$by_path[ $path ];
        }

        // 投稿・カスタム投稿タイプはパーマリンク構造が site ごとに違うので、
        // 末尾の slug が1つに定まるときだけ引き当てる
        $segments = explode( '/', $path );
        $last     = end( $segments );

        if ( '' !== $last && isset( self::$by_slug[ $last ] ) && false !== self::$by_slug[ $last ] ) {
            return self::$by_slug[ $last ];
        }

        return null;
    }

    /**
     * サブディレクトリ運用のときの前置きを外す。
     *
     * 例: https://example.com/blog/ に入れている場合の /blog/about/ → /about/
     *
     * @param string $path パス。
     * @return string
     */
    private static function strip_home_path( $path ) {
        $home = wp_parse_url( home_url( '/' ), PHP_URL_PATH );

        if ( ! $home || '/' === $home ) {
            return $path;
        }

        $home = rtrim( $home, '/' );

        if ( 0 === strpos( $path, $home . '/' ) || $path === $home ) {
            $path = substr( $path, strlen( $home ) );
        }

        return (string) $path;
    }

    /**
     * ID から投稿情報。
     *
     * @param int $post_id 対象。
     * @return array|null
     */
    public static function get_by_id( $post_id ) {
        self::build();

        return isset( self::$by_id[ (int) $post_id ] ) ? self::$by_id[ (int) $post_id ] : null;
    }
}
