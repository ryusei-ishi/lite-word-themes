<?php
/**
 * R23 — タイトルが長すぎて検索結果で切れる。
 *
 * 🚨 必ず「公開ページを開いて得た <title>」で測ること。
 *    データベースのページ名（post_title）で測ると答えが逆になる。
 *    実測（lite-word.com・175ページ・2026-08-22）:
 *      post_title で測ると「短すぎ105ページ・長すぎ13ページ」
 *      実際の <title> で測ると「ほぼ全ページが長すぎ」（サイト名30文字が後ろに付くため）
 *    テーマが後ろに足す文字列（R34）を勘定に入れないと、こうなる。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 判定する。
 *
 * @param WP_Post $post 対象。
 * @param array   $view 公開ページから読み取った値（title / h1_count）。
 * @return array 指摘の配列。
 */
function lw_site_rule_title_length( $post, $view ) {
    if ( empty( $view['title'] ) ) {
        return array();
    }

    $title = (string) $view['title'];
    $total = LW_Site_Diagnostics::text_length( $title );

    // 🚨 サイト名の接尾辞が長い場合は、その分をここで数えない。
    //    数えると「検索に出す全ページのタイトルが長い」と出るが、原因も直し方も
    //    R34（設定1か所）と同じで、同じことを2つのルールが別々に言うことになる。
    //    実測: lite-word.com は接尾辞31文字のせいで対象22ページの【全部】が指摘対象になった。
    //    ここで見たいのは「ページ名そのものが長すぎないか」。
    $suffix = lw_site_rule_title_suffix_text( $post->post_type );
    $main   = $title;

    if ( '' !== $suffix
        && LW_Site_Diagnostics::text_length( $suffix ) >= LW_SITE_TITLE_SUFFIX_LIMIT
        && $suffix === substr( $title, - strlen( $suffix ) )
    ) {
        $main = rtrim( substr( $title, 0, - strlen( $suffix ) ), " \t|｜-–—/・" );
    }

    $length = LW_Site_Diagnostics::text_length( $main );

    if ( $length <= LW_SITE_TITLE_LIMIT ) {
        return array();
    }

    $message = ( $main === $title )
        ? sprintf( 'タイトルが%d文字あります。検索結果では%d文字前後で切れます', $length, LW_SITE_TITLE_LIMIT )
        : sprintf( 'ページ名だけで%d文字あります（サイト名を足すと%d文字）。検索結果では%d文字前後で切れます', $length, $total, LW_SITE_TITLE_LIMIT );

    return array(
        lw_site_issue_make(
            (int) $post->ID,
            'R23',
            'warning',
            $message,
            array(
                'length' => $length,
                'total'  => $total,
                'title'  => $title,
            )
        ),
    );
}
