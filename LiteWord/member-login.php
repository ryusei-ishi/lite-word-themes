<?php
/**
 * 会員限定ページのログイン画面
 *
 * 会員限定に設定されたページ・カテゴリーに閲覧権限なしでアクセスしたとき、本文の代わりに表示される。
 * 差し替えているのは functions/membership/login_handler.php の lw_membership_login_template()。
 *
 * 2通りの出し方がある。
 *   ① 通常          … ヘッダー＋ログイン画面＋フッターだけ（page.php と同じ並び）
 *   ② FVを残す      … 投稿のタイトル・アイキャッチ等を出したまま、本文の位置にログイン画面
 *                      （カスタマイザー「会員限定ページ設定」＋投稿ごとの上書き）
 * 本文と抜粋は lw_membership_block() が空にしているので、②でも本文は漏れない。
 */
if ( !defined( 'ABSPATH' ) ) exit;

$lw_keep_fv = function_exists( 'lw_membership_keep_post_fv' ) ? lw_membership_keep_post_fv() : false;

get_header();
get_template_part( "templates/loading_anime/index" );
get_template_part( 'templates/header/index' );
get_template_part( 'templates/drawer/index' );

if ( $lw_keep_fv ) :

    /* ---------- ② FVを残す（投稿のみ・single.php と同じ並びに寄せる） ---------- */
    // レイアウト（カラム数）は single.php と同じ決め方: カテゴリー設定 → カスタマイザー
    // ⚠️ get_category_layout_setting() は single.php の中で定義されている。
    //    テンプレートを差し替えるとそちらは読み込まれないので、ここで同じ処理を持つ。
    $lw_clm_set = '';
    $lw_cats    = get_the_category();
    if ( ! empty( $lw_cats ) ) {
        $lw_clm_set = (string) get_term_meta( $lw_cats[0]->term_id, 'category_layout', true );
    }
    if ( empty( $lw_clm_set ) ) {
        $lw_clm_set = Lw_theme_mod_set( "single_post_layout_clm", "clm_2_right" );
    }
    ?>
    <div class="lw_content_wrap single <?php echo esc_attr( $lw_clm_set ); ?>">
        <?php
            if ( ! is_front_page() && ! is_home() ) {
                get_template_part( 'templates/breadcrumbs/index' );
            }
        ?>
        <div class="main_content">
            <main>
                <article class="post_content">
                    <?php get_template_part( 'templates/post_fv/index' ); ?>
                    <?php get_template_part( 'templates/membership/login/index' ); ?>
                </article>
            </main>
        </div>
        <?php if ( is_active_sidebar( 'sidebar_pc' ) && $lw_clm_set !== "clm_1" ) : ?>
            <aside id="sidebar_pc" class="sidebar_pc">
                <?php dynamic_sidebar( 'sidebar_pc' ); ?>
            </aside>
        <?php endif; ?>
    </div>
    <?php

else :

    /* ---------- ① 通常（ログイン画面だけ） ---------- */
    ?>
    <main>
        <div class="lw_content_wrap page">
            <div class="main_content">
                <?php get_template_part( 'templates/membership/login/index' ); ?>
            </div>
        </div>
    </main>
    <?php

endif;

get_template_part( "templates/footer/index" );
get_template_part( "templates/return_top/index" );
Lw_theme_mod_set("body_set_after");
get_footer();
