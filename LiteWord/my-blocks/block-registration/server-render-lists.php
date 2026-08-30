<?php
/**
 * 一覧ブロックを、サーバー側でも出す（検索エンジン対策）。
 *
 * ■ なにが問題だったか
 *   お知らせ一覧・投稿一覧・固定ページ一覧の各ブロックは、保存されるHTMLが
 *   「data-* 付きの空の <div> ＋ その場に埋め込まれた script」だけで、
 *   中身（記事へのリンク）は表示時に JavaScript が REST から取って組み立てている。
 *   つまり **生のHTMLには記事へのリンクが1本も無い**。
 *   Google は JavaScript を実行するので多くの場合は読まれるが、
 *   ①後回しのキューに入るので反映が遅れる ②必ず実行される保証は無い
 *   ③AI系のクローラーや多くのSEOツールは実行しない。HTMLに出したほうが確実に強い。
 *
 * ■ どう直したか（🚨 デザインが変わらないことの根拠）
 *   ブロックの save() は一切触らない。表示のときに PHP で同じ一覧を差し込むだけ。
 *   ページが開かれれば、今までどおり埋め込みスクリプトが走って
 *   `container.innerHTML = ...` で**同じ中身に上書き**する。
 *   つまり訪問者が最終的に見るものは今までと同一。変わるのはクローラーが読む生HTMLだけ。
 *   ローカル実測（2026-08-22）: JS実行後のDOMは ON/OFF でハッシュまで完全一致
 *   （3924081331・4586字・リンク6本・高さ715.63px）。生HTMLだけ リンク0本 → 6本 になった。
 *   おまけに、JS が動かないとき（保存時に script が削られた等）は今まで空だったものが出る。
 *
 * 🚨 JS の挙動を一字一句まねること。違う挙動にすると「デザインが変わらない」保証が崩れる。
 *    とくに **querySelector（単数）のブロックは1ページの1つ目しか埋めない**。
 *    ここでも1つ目だけを埋める（'single' => true）。2つ目以降を埋めると、
 *    いままで何も出ていなかった場所に一覧が出てしまう＝見た目が変わる。
 *
 * カードの作りは server-render-list-cards.php。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/server-render-list-cards.php';

/**
 * 対応するブロック一覧。
 *
 * container … 中身を差し込む div のクラス名（JS が querySelector している名前）
 * render    … カードを作る関数
 * scope     … 埋め込みスクリプトが querySelector（単数）で、自分のコンテナに絞る必要があるか
 *
 * shin 系（ガソリンスタンド）は担当が別なので入れない。
 *
 * @return array
 */
function lw_server_list_blocks() {
    return array(
        'wdl/lw-post-list-1'    => array( 'container' => 'lw_post-list-1',    'render' => 'lw_server_card_post_list_1', 'scope' => true ),
        'wdl/lw-post-list-2'    => array( 'container' => 'lw_post-list-2',    'render' => 'lw_server_card_post_list_2', 'scope' => true ),
        'wdl/lw-post-list-3'    => array( 'container' => 'lw_post-list-3',    'render' => 'lw_server_card_post_list_3', 'scope' => true ),
        'wdl/lw-news-list-1'    => array( 'container' => 'news-list-1',       'render' => 'lw_server_card_news_list_1', 'scope' => true ),
        'wdl/lw-pr-post-list-4' => array( 'container' => 'lw_pr-post-list-4', 'render' => 'lw_server_card_pr_post_list_4', 'scope' => false ),
        'wdl/lw-page-list-1'    => array( 'container' => 'lw_page-list-1',    'render' => 'lw_server_card_page_list_1', 'scope' => false ),
    );
}

/**
 * 表示時に一覧を差し込む。
 *
 * @param string $content ブロックが出力したHTML。
 * @param array  $block   ブロック情報（blockName / attrs）。
 * @return string
 */
function lw_server_render_list_blocks( $content, $block ) {
    if ( is_admin() || empty( $block['blockName'] ) ) {
        return $content;
    }

    $blocks = lw_server_list_blocks();

    if ( ! isset( $blocks[ $block['blockName'] ] ) ) {
        return $content;
    }

    $config = $blocks[ $block['blockName'] ];

    // 🐛 埋め込みスクリプトが querySelector（単数）のブロックは、
    //    1ページに2つ置くと**どちらのスクリプトも1つ目のコンテナを書き換え、2つ目が永久に空**になる。
    //    スクリプトを「自分のコンテナだけ見る」形に包み直して直す（save() は触らない）。
    if ( ! empty( $config['scope'] ) ) {
        $content = lw_server_list_scope_script( $content, $config['container'] );
    }

    $attrs = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
    $items = call_user_func( $config['render'], $attrs );

    if ( '' === $items ) {
        return $content;
    }

    $filled = lw_server_list_inject( $content, $config['container'], $items );

    return ( null === $filled ) ? $content : $filled;
}

/**
 * 埋め込みスクリプトを「自分のコンテナだけ見る」形に包み直す。
 *
 * 🐛 元のスクリプトは `document.querySelector('.クラス名')`（＝ページ内の1つ目）を書き換える。
 *    1ページに同じ一覧ブロックを2つ置くと、2つのスクリプトが**どちらも1つ目**を書き換え、
 *    2つ目のコンテナは永久に空のままになる（設定違いで並べると1つ目の中身も入れ替わる）。
 *
 * 直し方: スクリプト全体を即時関数で包み、`document.currentScript` で自分自身の <script> を掴んで
 * その親の中からコンテナを探す。ブロックの save() は触らないので、
 * **既存ページを保存し直さなくても直る／「ブロックが壊れています」も起きない。**
 *
 * 🚨 currentScript は「解析中に同期実行されている間」しか取れない。
 *    DOMContentLoaded のコールバックの中では null になるので、
 *    即時関数の先頭で変数に控えてから使う（この順番を崩さないこと）。
 *
 * 想定と違う形のスクリプトだったときは何もしない（元のまま返す）。
 *
 * @param string $content    ブロックのHTML。
 * @param string $class_name コンテナのクラス名。
 * @return string
 */
function lw_server_list_scope_script( $content, $class_name ) {
    $needle = "document.querySelector('." . $class_name . "')";

    if ( false === strpos( $content, $needle ) ) {
        return $content;
    }

    return preg_replace_callback(
        '#<script>(.*?)</script>#s',
        function ( $m ) use ( $needle, $class_name ) {
            if ( false === strpos( $m[1], $needle ) ) {
                return $m[0];
            }

            $scoped = str_replace(
                $needle,
                "(__lwSelf && __lwSelf.parentNode && __lwSelf.parentNode.querySelector('." . $class_name . "') || " . $needle . ")",
                $m[1]
            );

            return '<script>(function(){var __lwSelf=document.currentScript;' . $scoped . '})();</script>';
        },
        $content
    );
}
add_filter( 'render_block', 'lw_server_render_list_blocks', 20, 2 );

/**
 * 空のコンテナ div の中に一覧を差し込む。
 *
 * 「空」とみなすのは次の2つ。中身が入っているときは触らない（二重描画を避ける）。
 *   ① 本当に空          … <div class="..."></div>
 *   ② 空の ul だけがある … <div class="..."><ul class="..._wrap"></ul></div>
 *
 * 🚨 ②を拾えるようにしたのは、**古い版のブロックで作られたページ**が
 *    空の <ul> を保存していたため（lite-word.com の /about-developer/ が実際にそうだった）。
 *    ①だけを見ていると、そういうページは永久にサーバー側から出せない。
 *    空の <ul> は見た目に何も出していないので、中身に差し替えても表示は変わらない。
 *
 * @param string $content    ブロックのHTML。
 * @param string $class_name コンテナのクラス名。
 * @param string $items      差し込むHTML。
 * @return string|null 差し込めなければ null。
 */
function lw_server_list_inject( $content, $class_name, $items ) {
    $pattern = '#(<div[^>]*class="[^"]*\b' . preg_quote( $class_name, '#' ) . '\b[^"]*"[^>]*>)'
        . '(\s*(?:<ul[^>]*>\s*</ul>)?\s*)'
        . '(</div>)#';

    if ( ! preg_match( $pattern, $content ) ) {
        return null;
    }

    return preg_replace_callback(
        $pattern,
        function ( $m ) use ( $items ) {
            return $m[1] . $items . $m[3];
        },
        $content,
        1
    );
}

/* -------------------------------------------------------------
 * カードを作るための共通部品（JS と同じ結果になるように）
 * ----------------------------------------------------------- */

/**
 * 投稿を取ってくる（REST の per_page / orderby=date / order=desc / categories と同じ条件）。
 *
 * @param array $attrs ブロックの設定。
 * @return WP_Post[]
 */
function lw_server_list_get_posts( $attrs ) {
    $number    = isset( $attrs['numberOfPosts'] ) ? (int) $attrs['numberOfPosts'] : 6;
    $category  = isset( $attrs['categoryId'] ) ? trim( (string) $attrs['categoryId'] ) : '';
    $post_type = ! empty( $attrs['postType'] ) ? (string) $attrs['postType'] : 'post';

    $args = array(
        'post_type'           => $post_type,
        'post_status'         => 'publish',
        'posts_per_page'      => ( $number > 0 && $number <= 100 ) ? $number : 6,
        'orderby'             => 'date',
        'order'               => 'DESC',
        'ignore_sticky_posts' => true,
        'no_found_rows'       => true,
    );

    if ( '' !== $category && is_numeric( $category ) ) {
        $args['cat'] = (int) $category;
    }

    return get_posts( $args );
}

/**
 * 設定値を取り出す（未設定なら block.json の既定値）。
 *
 * @param array  $attrs   設定。
 * @param string $key     キー。
 * @param string $default 既定値。
 * @return string
 */
function lw_server_list_attr( $attrs, $key, $default ) {
    return ( isset( $attrs[ $key ] ) && '' !== $attrs[ $key ] ) ? (string) $attrs[ $key ] : $default;
}

/**
 * サムネイル（無ければテーマの no_image。JS と同じ）。
 *
 * @param WP_Post $post 対象。
 * @return string
 */
function lw_server_list_thumbnail( $post ) {
    $url = get_the_post_thumbnail_url( $post, 'full' );

    return $url ? $url : get_template_directory_uri() . '/assets/image/no_image/2.webp';
}

/**
 * 最初のカテゴリー名。無ければ 'カテゴリーなし'（JS と同じ）。
 *
 * @param WP_Post $post    対象。
 * @param string  $fallback 無いときの文字列。
 * @return string
 */
function lw_server_list_category( $post, $fallback = 'カテゴリーなし' ) {
    $terms = get_the_category( $post->ID );

    return ! empty( $terms ) ? $terms[0]->name : $fallback;
}

/**
 * 抜粋（タグを外して40文字＋記号。JS と同じ）。
 *
 * @param WP_Post $post 対象。
 * @param string  $tail 末尾に付ける記号（'...' か '…'）。
 * @return string
 */
function lw_server_list_excerpt( $post, $tail = '...' ) {
    $text = wp_strip_all_tags( get_the_excerpt( $post ) );

    if ( '' === trim( $text ) ) {
        return '本文がありません';
    }

    // _mb_substr は mbstring が無い環境でも動く（wp-includes/compat.php）
    return _mb_substr( $text, 0, 40 ) . $tail;
}

/**
 * 日付（JS の new Date(...).toLocaleDateString() ＝日本語環境で 2026/8/22）。
 *
 * @param WP_Post $post 対象。
 * @return string
 */
function lw_server_list_date( $post ) {
    return get_the_date( 'Y/n/j', $post );
}
