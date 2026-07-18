<?php
if ( !defined( 'ABSPATH' ) ) exit;
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
        return $put_range;
    }

    return $ex;
}
