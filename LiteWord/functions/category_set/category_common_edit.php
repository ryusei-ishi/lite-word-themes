<?php
if ( !defined( 'ABSPATH' ) ) exit;

/*---------------------------------------------*
 * サブメニュー登録（変更なし）
 *--------------------------------------------*/
add_action( 'admin_menu', function () {

    $hook = add_submenu_page(
        'edit.php',
        '全カテゴリー共通設定',
        '全カテゴリー共通設定',
        'manage_categories',
        'lw-category-common',
        'lw_render_cat_common_page',
        16
    );

    add_action( "load-$hook", function () {
        wp_enqueue_media();   // 画像挿入ボタン用
        wp_enqueue_editor();  // TinyMCE など
    } );
} );

/*---------------------------------------------*
 * 画面描画
 *--------------------------------------------*/
function lw_render_cat_common_page() {

    // ① 取得先も新しいキー名に
    $content = get_option( 'lw_cat_common_content_fv_bottom', '' );
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">全カテゴリー共通設定</h1>
        <p>こで設定した内容は、すべてのカテゴリーページのファーストビュー直下（FV下）に共通表示されます。<br>各カテゴリーに同じバナーや説明文をまとめて設置したい場合にご利用ください。</p>
        <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
            <?php
                wp_nonce_field( 'lw_save_cat_common' );
                echo '<input type="hidden" name="action" value="lw_save_cat_common">';

                wp_editor(
                    $content,
                    'lw_cat_common_editor',
                    array(
                        // ② textarea_name も変更
                        'textarea_name' => 'lw_cat_common_content_fv_bottom',
                        'textarea_rows' => 15,
                    )
                );
            ?>
            <p><input type="submit" class="button button-primary" value="保存"></p>
        </form>
    </div>
    <?php
}

/*---------------------------------------------*
 * 保存ハンドラ
 *--------------------------------------------*/
add_action( 'admin_post_lw_save_cat_common', function () {

    if ( ! current_user_can( 'manage_categories' ) ) {
        wp_die( '権限がありません。' );
    }
    check_admin_referer( 'lw_save_cat_common' );

    // ③ POST 名と保存キーをどちらも統一
    $content = isset( $_POST['lw_cat_common_content_fv_bottom'] )
        ? wp_kses_post( $_POST['lw_cat_common_content_fv_bottom'] )
        : '';

    update_option( 'lw_cat_common_content_fv_bottom', $content );

    wp_redirect( add_query_arg( 'lw_saved', '1', wp_get_referer() ) );
    exit;
} );
