<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_set_custom' );
function follow_bottom_cta_set_custom( $wp_customize ) {
    
    // パネル設定
    $panel = 'follow_bottom_cta_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'ページ下の追従CTAボタン', // パネルタイトル
            'priority' => 120,
        )
    );
    // 入力ID（共通）
    $set = 'follow_bottom_cta_set'; 

    // パターンの選択
    $set_ttl = 'パターンの選択'; 
    $sec = 'follow_bottom_cta_set_ptn_sec'; 
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [
        [
            ['radio', 'ptn_df', '', '<h2 class="ctm_ttl_ptn_1" >全ページ共通</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_page', '', '<h2 class="ctm_ttl_ptn_1" >固定ページ</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_post', '', '<h2 class="ctm_ttl_ptn_1" >投稿ページ</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_archive', '', '<h2 class="ctm_ttl_ptn_1" >アーカイブページ</h2>', follow_bottom_cta_arr()],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);
}

/* ==========================================================
 * 各パターンの完成イメージ（画像＋用途の説明）
 * ------------------------------------------------------------
 * カスタマイザーの項目名だけでは見た目が分からないため、各パターンの
 * 設定セクションに「？」の説明トグル（WP標準のdescription_hidden）を
 * 付け、開くと完成イメージの画像と用途の説明が出るようにする。
 * 画像は functions/customizer/follow_bottom_cta/preview/ptn_N.png。
 * 題と説明は、パターンの表 lw_follow_bottom_cta_patterns()（functions/customizer/functions.php）から作る（2026-11-07）。
 * ======================================================= */
function lw_follow_bottom_cta_preview_meta(){
    $meta = [];
    foreach(lw_follow_bottom_cta_patterns() as $ptn => $pattern){
        $meta[$ptn] = ['title' => $pattern['name'], 'desc' => $pattern['desc']];
    }
    return $meta;
}

function lw_follow_bottom_cta_preview_description($ptn){
    $meta = lw_follow_bottom_cta_preview_meta();
    if(!isset($meta[$ptn])){
        return '';
    }
    $title    = $meta[$ptn]['title'];
    $desc     = $meta[$ptn]['desc'];
    $img_path = get_template_directory() . "/functions/customizer/follow_bottom_cta/preview/{$ptn}.png";
    if(!file_exists($img_path)){
        return '<p class="lw_cta_preview__desc">' . esc_html($desc) . '</p>';
    }
    $img_url = get_template_directory_uri() . "/functions/customizer/follow_bottom_cta/preview/{$ptn}.png";
    $html  = '<div class="lw_cta_preview">';
    $html .= '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($title . 'の完成イメージ') . '" class="lw_cta_preview__img">';
    $html .= '<p class="lw_cta_preview__title">' . esc_html($title) . '</p>';
    $html .= '<p class="lw_cta_preview__desc">' . esc_html($desc) . '</p>';
    $html .= '</div>';
    return $html;
}

add_action( 'customize_controls_enqueue_scripts', 'lw_follow_bottom_cta_preview_admin_assets' );
function lw_follow_bottom_cta_preview_admin_assets() {
    ?>
    <style>
    .lw_cta_preview{ margin-top: 8px; }
    .lw_cta_preview__img{ display: block; width: 100%; border: 1px solid #dcdcde; border-radius: 4px; cursor: zoom-in; }
    .lw_cta_preview__title{ font-weight: bold; margin: 8px 0 2px; }
    .lw_cta_preview__desc{ font-size: 12px; color: #666; margin: 0; line-height: 1.6; }
    #lw_cta_preview_overlay{ position: fixed; inset: 0; z-index: 999999; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.8); cursor: zoom-out; }
    #lw_cta_preview_overlay.is_open{ display: flex; }
    #lw_cta_preview_overlay img{ max-width: 92vw; max-height: 92vh; border-radius: 4px; box-shadow: 0 4px 24px rgba(0,0,0,.4); }
    </style>
    <script>
    'use strict';
    {
        // クリックで拡大表示（画像は説明トグルを開いた時に初めてDOMへ入るため、
        // DOMContentLoaded時点の個別バインドではなくイベント委譲で拾う）
        document.addEventListener('click', function (e) {
            var img = e.target.closest('.lw_cta_preview__img');
            if (!img) return;
            e.preventDefault();
            var overlay = document.getElementById('lw_cta_preview_overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'lw_cta_preview_overlay';
                overlay.innerHTML = '<img>';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', function () {
                    overlay.classList.remove('is_open');
                });
            }
            overlay.querySelector('img').src = img.src;
            overlay.querySelector('img').alt = img.alt;
            overlay.classList.add('is_open');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                var overlay = document.getElementById('lw_cta_preview_overlay');
                if (overlay) overlay.classList.remove('is_open');
            }
        });
    }
    </script>
    <?php
}