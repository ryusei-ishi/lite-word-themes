<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * CSS の url(…)（引用符なし）に入れる URL を作る（2026-11-02 の点検 T1）。
 * esc_url() だけでは ) や空白が残り、url( を途中で閉じて別の CSS を書き足せる。括弧・空白などを %XX にする。
 *
 * @param string $url
 * @return string
 */
function lw_css_url( $url ) {
    $url = esc_url( (string) $url );
    return str_replace(
        array( '(', ')', ' ', ';', '\\' ),
        array( '%28', '%29', '%20', '%3B', '%5C' ),
        $url
    );
}

//put_text(出力先の処理)
function Lw_put_text($value,$ex = "",$page_id = ""){
    if (is_admin() ){return;}
    if(empty($page_id)){
        $page_id = get_the_ID();
    }

    $put_text = get_post_meta($page_id,$value,true);

    if (!empty($put_text)) {
        return $put_text;
    }else{
        return $ex;
    }
}
/**
 * 投稿の設定の文字（ttl_main など）を、改行を <br> にした HTML で返す（brSt() と同じ形）。
 * 設定の値は文字として出す（エスケープ）。設定が無ければ $fallback（投稿のタイトルなど）を今までどおりそのまま使う。
 * （2026-11-02 再チェック R1）2.6.0 までは設定の値をそのまま HTML に出していたため、
 * 標準のカスタムフィールドから入れたタグがそのまま動いた。
 *
 * @param string $value    投稿メタのキー
 * @param string $fallback 設定が無いときに出す HTML
 * @return string
 */
function Lw_put_text_br($value, $fallback = '') {
    $text = (string) Lw_put_text($value, '');
    $html = ($text !== '') ? esc_html($text) : (string) $fallback;
    return str_replace(array("\r\n", "\r", "\n"), '', nl2br($html));
}

//put_color(出力先の処理)
function Lw_put_color($value, $ex = "#ada993", $page_id = "" ,$df = "") {
    if (is_admin()) { return; }

    if (empty($page_id)) {
        $page_id = get_the_ID();
    }

    $put_color = get_post_meta($page_id, $value, true);

    if ($put_color === "" || $put_color === "#ada993") {
        return $df;
    }

    // 色の形でなければ使わない（style の中にそのまま入るため。2026-11-02 再チェック R1）
    if (!lw_is_safe_css_color($put_color)) {
        return $df;
    }

    return $put_color;
}

//put_range（出力先の処理）
function Lw_put_range($value, $ex = "16", $page_id = "") {
    if (is_admin()) { return; }

    if (empty($page_id)) {
        $page_id = get_the_ID();
    }

    $put_range = get_post_meta($page_id, $value, true);

    if ($put_range !== "" && $put_range !== "100") {
        // 数字でなければ既定の値（CSS の中にそのまま入るため。2026-11-02 再チェック R1）
        return lw_meta_number($put_range, $ex);
    }

    return $ex;
}
