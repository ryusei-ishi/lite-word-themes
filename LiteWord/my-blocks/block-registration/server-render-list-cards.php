<?php
/**
 * 一覧ブロックのカードを作る（サーバー側）。
 *
 * 🚨 出力する形は、各ブロックに埋め込まれているスクリプトと**同じ**にすること。
 *    違うと、JS が上書きするまでの一瞬だけ見た目が変わる（ちらつく）。
 *    元のテンプレートは各ブロックの build/<name>.js の中にある。
 *
 * ブロックごとに微妙に違うので、共通化しすぎないこと（追いにくくなる）。
 *   post-list-1 … cat は border-color + color ／ 抜粋あり
 *   post-list-2 … cat は background-color   ／ 抜粋あり
 *   post-list-3 … cat は background-color   ／ 抜粋なし
 *   news-list-1 … 画像なし ／ 日付→カテゴリの順 ／ h3 が div.post_title の中
 *   pr-post-list-4 … 日付→カテゴリ ／ カテゴリ色は各カテゴリの設定色 ／ 日付の書式を選べる
 *   page-list-1 … 固定ページ ／ 並び順・絞り込み・画像パターン・日付/抜粋の表示切替あり
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 投稿一覧1。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_post_list_1( $attrs ) {
    $posts = lw_server_list_get_posts( $attrs );

    if ( empty( $posts ) ) {
        return '';
    }

    $cat_bg     = lw_server_list_attr( $attrs, 'catBgColor', 'var(--color-main)' );
    $cat_font   = lw_server_list_attr( $attrs, 'catFont', 'Noto Sans JP' );
    $cat_w      = lw_server_list_attr( $attrs, 'catFontWeight', '400' );
    $date_font  = lw_server_list_attr( $attrs, 'dateFont', 'Noto Sans JP' );
    $date_w     = lw_server_list_attr( $attrs, 'dateFontWeight', '400' );
    $title_font = lw_server_list_attr( $attrs, 'titleFont', 'Noto Sans JP' );
    $title_w    = lw_server_list_attr( $attrs, 'titleFontWeight', '500' );
    $p_font     = lw_server_list_attr( $attrs, 'pFont', 'Noto Sans JP' );
    $p_w        = lw_server_list_attr( $attrs, 'pFontWeight', '400' );

    $html = '<ul class="post-list-1__wrap">';

    foreach ( $posts as $post ) {
        $title = get_the_title( $post );

        $html .= '<li><a href="' . esc_url( get_permalink( $post ) ) . '">'
            . '<figure><img loading="lazy" src="' . esc_url( lw_server_list_thumbnail( $post ) ) . '" alt="' . esc_attr( $title ) . '"></figure>'
            . '<div class="in"><div class="data">'
            . '<div class="cat" style="border-color: ' . esc_attr( $cat_bg ) . '; color:' . esc_attr( $cat_bg ) . '; font-weight: ' . esc_attr( $cat_w ) . ';" data-lw_font_set="' . esc_attr( $cat_font ) . '"><span>' . esc_html( lw_server_list_category( $post ) ) . '</span></div>'
            . '<div class="date" style="font-weight: ' . esc_attr( $date_w ) . ';" data-lw_font_set="' . esc_attr( $date_font ) . '"><span>' . esc_html( lw_server_list_date( $post ) ) . '</span></div>'
            . '</div>'
            . '<h3 style="font-weight: ' . esc_attr( $title_w ) . ';" data-lw_font_set="' . esc_attr( $title_font ) . '">' . esc_html( $title ) . '</h3>'
            . '<p style="font-weight: ' . esc_attr( $p_w ) . ';" data-lw_font_set="' . esc_attr( $p_font ) . '">' . esc_html( lw_server_list_excerpt( $post ) ) . '</p>'
            . '</div></a></li>';
    }

    return $html . '</ul>';
}

/**
 * 投稿一覧2・3の共通部分（違いは抜粋の有無だけ）。
 *
 * @param array  $attrs      設定。
 * @param string $wrap_class ul のクラス。
 * @param bool   $with_excerpt 抜粋を出すか。
 * @return string
 */
function lw_server_card_post_list_2_3( $attrs, $wrap_class, $with_excerpt ) {
    $posts = lw_server_list_get_posts( $attrs );

    if ( empty( $posts ) ) {
        return '';
    }

    $cat_bg     = lw_server_list_attr( $attrs, 'catBgColor', 'var(--color-main)' );
    $cat_font   = lw_server_list_attr( $attrs, 'catFont', 'Noto Sans JP' );
    $cat_w      = lw_server_list_attr( $attrs, 'catFontWeight', '400' );
    $date_font  = lw_server_list_attr( $attrs, 'dateFont', 'Noto Sans JP' );
    $date_w     = lw_server_list_attr( $attrs, 'dateFontWeight', '400' );
    $title_font = lw_server_list_attr( $attrs, 'titleFont', 'Noto Sans JP' );
    $title_w    = lw_server_list_attr( $attrs, 'titleFontWeight', '500' );
    $p_font     = lw_server_list_attr( $attrs, 'pFont', 'Noto Sans JP' );
    $p_w        = lw_server_list_attr( $attrs, 'pFontWeight', '400' );

    $html = '<ul class="' . esc_attr( $wrap_class ) . '">';

    foreach ( $posts as $post ) {
        $title = get_the_title( $post );

        $html .= '<li><a href="' . esc_url( get_permalink( $post ) ) . '">'
            . '<figure><img loading="lazy" src="' . esc_url( lw_server_list_thumbnail( $post ) ) . '" alt="' . esc_attr( $title ) . '"></figure>'
            . '<div class="in"><div class="data">'
            . '<div class="cat" style="background-color: ' . esc_attr( $cat_bg ) . '; font-weight: ' . esc_attr( $cat_w ) . ';" data-lw_font_set="' . esc_attr( $cat_font ) . '"><span>' . esc_html( lw_server_list_category( $post ) ) . '</span></div>'
            . '<div class="date" style="font-weight: ' . esc_attr( $date_w ) . ';" data-lw_font_set="' . esc_attr( $date_font ) . '"><span>' . esc_html( lw_server_list_date( $post ) ) . '</span></div>'
            . '</div>'
            . '<h3 style="font-weight: ' . esc_attr( $title_w ) . ';" data-lw_font_set="' . esc_attr( $title_font ) . '">' . esc_html( $title ) . '</h3>';

        if ( $with_excerpt ) {
            $html .= '<p style="font-weight: ' . esc_attr( $p_w ) . ';" data-lw_font_set="' . esc_attr( $p_font ) . '">' . esc_html( lw_server_list_excerpt( $post ) ) . '</p>';
        }

        $html .= '</div></a></li>';
    }

    return $html . '</ul>';
}

/**
 * 投稿一覧2。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_post_list_2( $attrs ) {
    return lw_server_card_post_list_2_3( $attrs, 'post-list-2__wrap', true );
}

/**
 * 投稿一覧3。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_post_list_3( $attrs ) {
    return lw_server_card_post_list_2_3( $attrs, 'post-list-3__wrap', false );
}

/**
 * お知らせ一覧1（画像なし・日付→カテゴリの順）。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_news_list_1( $attrs ) {
    $posts = lw_server_list_get_posts( $attrs );

    if ( empty( $posts ) ) {
        return '';
    }

    $cat_bg     = lw_server_list_attr( $attrs, 'catBgColor', 'var(--color-main)' );
    $cat_font   = lw_server_list_attr( $attrs, 'catFont', 'Noto Sans JP' );
    $cat_w      = lw_server_list_attr( $attrs, 'catFontWeight', '400' );
    $date_font  = lw_server_list_attr( $attrs, 'dateFont', 'Noto Sans JP' );
    $date_w     = lw_server_list_attr( $attrs, 'dateFontWeight', '400' );
    $title_font = lw_server_list_attr( $attrs, 'titleFont', 'Noto Sans JP' );
    $title_w    = lw_server_list_attr( $attrs, 'titleFontWeight', '500' );

    $html = '<ul class="news-list-1__wrap">';

    foreach ( $posts as $post ) {
        $html .= '<li><a href="' . esc_url( get_permalink( $post ) ) . '">'
            . '<div class="data">'
            . '<div class="date" style="font-weight: ' . esc_attr( $date_w ) . ';" data-lw_font_set="' . esc_attr( $date_font ) . '"><span>' . esc_html( lw_server_list_date( $post ) ) . '</span></div>'
            . '<div class="cat" style="background-color: ' . esc_attr( $cat_bg ) . '; font-weight: ' . esc_attr( $cat_w ) . ';" data-lw_font_set="' . esc_attr( $cat_font ) . '"><span>' . esc_html( lw_server_list_category( $post ) ) . '</span></div>'
            . '</div>'
            . '<div class="post_title"><h3 style="font-weight: ' . esc_attr( $title_w ) . ';" data-lw_font_set="' . esc_attr( $title_font ) . '">' . esc_html( get_the_title( $post ) ) . '</h3></div>'
            . '</a></li>';
    }

    return $html . '</ul>';
}

/**
 * 投稿一覧4（カードグリッド・プレミアム）。
 *
 * カテゴリーに色が設定されていればその色を使う（JS と同じ）。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_pr_post_list_4( $attrs ) {
    $posts = lw_server_list_get_posts( $attrs );

    if ( empty( $posts ) ) {
        return '';
    }

    $format     = lw_server_list_attr( $attrs, 'dateFormat', 'md_day' );
    $cat_bg     = lw_server_list_attr( $attrs, 'catBgColor', '' );
    $cat_font   = lw_server_list_attr( $attrs, 'catFont', '' );
    $cat_w      = lw_server_list_attr( $attrs, 'catFontWeight', '' );
    $date_font  = lw_server_list_attr( $attrs, 'dateFont', '' );
    $date_w     = lw_server_list_attr( $attrs, 'dateFontWeight', '' );
    $title_font = lw_server_list_attr( $attrs, 'titleFont', '' );
    $title_w    = lw_server_list_attr( $attrs, 'titleFontWeight', '' );

    $html = '<ul class="pr-post-list-4__wrap">';

    foreach ( $posts as $post ) {
        $title = get_the_title( $post );
        $terms = get_the_category( $post->ID );
        $term  = ! empty( $terms ) ? $terms[0] : null;

        $cat_html = '';

        if ( $term ) {
            $color = function_exists( 'lw_get_category_color' ) ? lw_get_category_color( $term->term_id ) : '';

            if ( ! preg_match( '/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', (string) $color ) ) {
                $color = $cat_bg;
            }

            $cat_html = '<div class="cat" style="background-color:' . esc_attr( $color ) . ';font-weight:' . esc_attr( $cat_w ) . ';" data-lw_font_set="' . esc_attr( $cat_font ) . '"><span>' . esc_html( $term->name ) . '</span></div>';
        }

        $html .= '<li><a href="' . esc_url( get_permalink( $post ) ) . '">'
            . '<figure><img loading="lazy" src="' . esc_url( lw_server_list_thumbnail( $post ) ) . '" alt="' . esc_attr( $title ) . '"></figure>'
            . '<div class="in"><div class="data">'
            . '<div class="date" style="font-weight:' . esc_attr( $date_w ) . ';" data-lw_font_set="' . esc_attr( $date_font ) . '"><span>' . esc_html( lw_server_pr4_date( $post, $format ) ) . '</span></div>'
            . $cat_html
            . '</div>'
            . '<h3 style="font-weight:' . esc_attr( $title_w ) . ';" data-lw_font_set="' . esc_attr( $title_font ) . '">' . esc_html( $title ) . '</h3>'
            . '</div></a></li>';
    }

    return $html . '</ul>';
}

/**
 * 投稿一覧4の日付（JS の formatDate と同じ）。
 *
 * @param WP_Post $post   対象。
 * @param string  $format ymd / ymd_dot / それ以外（月/日 (曜)）。
 * @return string
 */
function lw_server_pr4_date( $post, $format ) {
    if ( 'ymd' === $format ) {
        return get_the_date( 'Y/n/j', $post );
    }

    if ( 'ymd_dot' === $format ) {
        return get_the_date( 'Y.m.d', $post );
    }

    $week = array( '日', '月', '火', '水', '木', '金', '土' );
    $day  = (int) get_the_date( 'w', $post );

    return get_the_date( 'n/j', $post ) . ' (' . $week[ $day ] . ')';
}

/**
 * 固定ページ一覧1。
 *
 * @param array $attrs 設定。
 * @return string
 */
function lw_server_card_page_list_1( $attrs ) {
    $per     = isset( $attrs['numberOfPages'] ) ? (int) $attrs['numberOfPages'] : 6;
    $parent  = isset( $attrs['parentPageId'] ) ? (int) $attrs['parentPageId'] : 0;
    $order   = lw_server_list_attr( $attrs, 'orderOption', 'date_desc' );
    $filter  = isset( $attrs['filterText'] ) ? trim( (string) $attrs['filterText'] ) : '';
    $pattern = lw_server_list_attr( $attrs, 'imagePattern', 'ptn_1' );
    $target  = ! empty( $attrs['openInNewTab'] ) ? '_blank' : '_self';

    $show_date = ! empty( $attrs['showDate'] );
    $show_ex   = ! isset( $attrs['showExcerpt'] ) || $attrs['showExcerpt'];

    $date_font  = lw_server_list_attr( $attrs, 'dateFont', 'Noto Sans JP' );
    $date_w     = lw_server_list_attr( $attrs, 'dateFontWeight', '400' );
    $title_font = lw_server_list_attr( $attrs, 'titleFont', 'Noto Sans JP' );
    $title_w    = lw_server_list_attr( $attrs, 'titleFontWeight', '500' );
    $ex_font    = lw_server_list_attr( $attrs, 'exFont', 'Noto Sans JP' );
    $ex_w       = lw_server_list_attr( $attrs, 'exFontWeight', '400' );

    // 親の指定が無ければ、いま表示しているページの子を出す（JS は body の page-id-N を見ている）
    if ( 0 === $parent && is_page() ) {
        $parent = get_queried_object_id();
    }

    $args = array(
        'post_type'      => 'page',
        'post_status'    => 'publish',
        'orderby'        => ( 'title_asc' === $order ) ? 'title' : 'date',
        'order'          => ( 'date_desc' === $order ) ? 'DESC' : 'ASC',
        'no_found_rows'  => true,
        // 絞り込みがあるときは多めに取ってから絞る（JS も全件取ってから絞っている）
        'posts_per_page' => ( '' !== $filter ) ? 200 : ( ( $per > 0 && $per <= 100 ) ? $per : 6 ),
    );

    if ( $parent ) {
        $args['post_parent'] = $parent;
    }

    $pages = get_posts( $args );

    if ( '' !== $filter ) {
        $needle = strtolower( $filter );
        $pages  = array_values(
            array_filter(
                $pages,
                function ( $page ) use ( $needle ) {
                    return false !== strpos( strtolower( get_the_title( $page ) ), $needle );
                }
            )
        );
        $pages = array_slice( $pages, 0, ( $per > 0 ) ? $per : 6 );
    }

    if ( empty( $pages ) ) {
        return '';
    }

    $rel  = ( '_blank' === $target ) ? ' rel="noopener"' : '';
    $html = '<ul class="page-list-1__wrap">';

    foreach ( $pages as $page ) {
        $title = get_the_title( $page );

        $date_html = $show_date
            ? '<div class="date" style="font-weight:' . esc_attr( $date_w ) . ';" data-lw_font_set="' . esc_attr( $date_font ) . '"><span>' . esc_html( lw_server_list_date( $page ) ) . '</span></div>'
            : '';

        $ex_html = '';

        if ( $show_ex ) {
            $text = wp_strip_all_tags( get_the_excerpt( $page ) );
            $text = ( '' !== trim( $text ) ) ? _mb_substr( $text, 0, 40 ) . '…' : '';
            $ex_html = '<p style="font-weight:' . esc_attr( $ex_w ) . ';" data-lw_font_set="' . esc_attr( $ex_font ) . '">' . esc_html( $text ) . '</p>';
        }

        $html .= '<li><a href="' . esc_url( get_permalink( $page ) ) . '" target="' . esc_attr( $target ) . '"' . $rel . '>'
            . '<figure class="' . esc_attr( $pattern ) . '"><img loading="lazy" src="' . esc_url( lw_server_list_thumbnail( $page ) ) . '" alt="' . esc_attr( $title ) . '"></figure>'
            . '<div class="in"><div class="data">' . $date_html . '</div>'
            . '<h3 style="font-weight:' . esc_attr( $title_w ) . ';" data-lw_font_set="' . esc_attr( $title_font ) . '">' . esc_html( $title ) . '</h3>'
            . $ex_html
            . '</div></a></li>';
    }

    return $html . '</ul>';
}
