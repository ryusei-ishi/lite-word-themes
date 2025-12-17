<?php
if ( !defined( 'ABSPATH' ) ) exit;
$loading_anime_ptn = Lw_theme_mod_set("loading_anime_ptn_df", "none");

if(is_page()){
    // プレミアムプランの固定ページ設定を優先
    if(defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true){
        $page_loading_switch = get_post_meta(get_the_ID(), 'loading_anime_page_switch', true);
        if($page_loading_switch === "off"){
            return; // このページではローディングアニメーションを表示しない
        }
    }
    $loading_anime_ptn = Lw_theme_mod_set("loading_anime_ptn_page", $loading_anime_ptn);
}
else if(is_single()){
    $loading_anime_ptn = Lw_theme_mod_set("loading_anime_ptn_post", $loading_anime_ptn);
}
else if(is_archive()){
    $loading_anime_ptn = Lw_theme_mod_set("loading_anime_ptn_archive", $loading_anime_ptn);
}

// "none"の場合は何も表示しない（無効化）
if ($loading_anime_ptn === "none") {
    return;
}

// アニメーションパターンを読み込み
get_template_part( "templates/loading_anime/".$loading_anime_ptn."/index" );
?>
<script>
    // パフォーマンス最適化：DOMContentLoadedを使用
    // window.onloadではなくDOMContentLoadedを使うことで、
    // 画像の読み込みを待たずに高速表示
    document.addEventListener('DOMContentLoaded', function() {
        const loadingElement = document.querySelector('.lw_loading_anime');

        // 要素が存在する場合のみ処理を実行
        if (loadingElement) {
            // 0.3秒の遅延でスムーズに表示
            setTimeout(function() {
                loadingElement.classList.add('off');

                // 1秒後に完全に削除（CSSのtransition時間を考慮）
                setTimeout(function() {
                    loadingElement.style.display = 'none';
                }, 1000);
            }, 300);
        }
    });
</script>