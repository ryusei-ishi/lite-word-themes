<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_10_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_10/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

// 評価点・レビュー件数・利用者数は、入れたときだけ出す（前は既定で「4.8」「2,310件のレビュー」「1,000人以上が利用」が出ていた。実在しない数字を公開ページに出さない・2026-11-07）
$rating      = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_rating","");
$review_text = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_review_count_text","");
$users_text  = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_users_text","");
$btn_text    = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_btn_text","人気ランキングを見る");
$btn_link    = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_btn_link","");
$color_btn   = Lw_theme_mod_set("follow_bottom_cta_ptn_10_set_color_btn","");
?>
<div class="follow_bottom_cta_10 follow_bottom_cta<?= $responsive_class ?>">
    <?php if (!empty($rating) || !empty($review_text)) : ?>
    <div class="follow_bottom_cta_10__rating">
        <?php if (!empty($rating)) : ?>
        <svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5-6-3.6-6 3.6 1.5-6.5-5-4.4 6.6-.6z"/></svg>
        <strong><?= esc_html($rating) ?></strong>
        <?php endif; ?>
        <?php if (!empty($review_text)) : ?><span><?= !empty($rating) ? '（' . esc_html($review_text) . '）' : esc_html($review_text) ?></span><?php endif; ?>
    </div>
    <?php endif; ?>
    <?php if (!empty($users_text)) : ?>
    <div class="follow_bottom_cta_10__users">
        <span class="follow_bottom_cta_10__avatars"><i></i><i></i><i></i></span>
        <em><?= esc_html($users_text) ?></em>
    </div>
    <?php endif; ?>
    <a href="<?= esc_url($btn_link) ?>" class="follow_bottom_cta_10__btn" style="background-color:<?=$color_btn?>;"><?= esc_html($btn_text) ?></a>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
