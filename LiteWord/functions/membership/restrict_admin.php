<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（管理画面）
 * =============================================================== */

/**
 * ① メタボックスを追加（投稿・固定ページ）
 */
add_action( 'add_meta_boxes', 'lw_add_view_role_metabox' );
function lw_add_view_role_metabox() {

    $post_types = [ 'post', 'page' ];   // 必要ならカスタム投稿タイプも追加
    foreach ( $post_types as $pt ) {
        add_meta_box(
            'lw_view_role_box',
            '観覧権限',
            'lw_view_role_box_callback',
            $pt,
            'side',
            'default'
        );
    }
}

/**
 * ② メタボックスの中身
 */
function lw_view_role_box_callback( $post ) {

    // 現在保存されている値を取得（配列 or 空配列）
    $saved = (array) get_post_meta( $post->ID, '_lw_allowed_roles', true );

    // すべてのロールを取得
    $roles = wp_roles()->roles;

    // nonce
    wp_nonce_field( 'lw_view_role_save', 'lw_view_role_nonce' );

    echo '<p style="margin-bottom:4px">チェックを付けた権限だけ閲覧可（無選択なら全員可）</p><br>';

    foreach ( $roles as $role_key => $role_data ) {
        $checked = checked( in_array( $role_key, $saved, true ), true, false );
        printf(
            '<label style="display:block;margin-bottom:4px;">
                <input type="checkbox" name="lw_allowed_roles[]" value="%1$s" %3$s> %2$s
            </label>',
            esc_attr( $role_key ),
            esc_html( translate_user_role( $role_data['name'] ) ),
            $checked
        );
    }
}

/**
 * ③ 保存処理
 */
add_action( 'save_post', 'lw_save_view_role_meta' );
function lw_save_view_role_meta( $post_id ) {

    // 自動保存・権限チェック
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) )      return;
    if ( ! isset( $_POST['lw_view_role_nonce'] ) ||
         ! wp_verify_nonce( $_POST['lw_view_role_nonce'], 'lw_view_role_save' ) ) return;

    // 入力値を取得
    $roles = ( isset( $_POST['lw_allowed_roles'] ) && is_array( $_POST['lw_allowed_roles'] ) )
           ? array_values( array_filter( array_map( 'sanitize_key', $_POST['lw_allowed_roles'] ) ) )
           : [];

    // 空なら削除、そうでなければ保存
    if ( empty( $roles ) ) {
        delete_post_meta( $post_id, '_lw_allowed_roles' );
    } else {
        update_post_meta( $post_id, '_lw_allowed_roles', $roles );
    }
}

/* -------------------------------------------------- *
 * 一覧テーブルに列を追加
 * -------------------------------------------------- */
/** 列追加 */
add_filter( 'manage_edit-post_columns', 'lw_add_role_column' );
add_filter( 'manage_edit-page_columns', 'lw_add_role_column' );
function lw_add_role_column( $cols ) {
    $cols['lw_view_roles'] = '閲覧権限';
    return $cols;
}

/** 列内容 */
add_action( 'manage_posts_custom_column', 'lw_render_role_column', 10, 2 );
function lw_render_role_column( $col, $post_id ) {

    if ( $col !== 'lw_view_roles' ) return;

    $roles = (array) get_post_meta( $post_id, '_lw_allowed_roles', true );
    if ( empty( $roles ) ) {
        echo '<span class="lw-role-label">全員可</span>';
        // JS 用に空配列をデータ属性へ
        printf( '<span class="lw-role-json" data-roles="%s"></span>', esc_attr( json_encode( [] ) ) );
        return;
    }

    // 表示はカンマ区切り
    $names = array_map( function( $rk ){
        return esc_html( translate_user_role( wp_roles()->roles[ $rk ]['name'] ?? $rk ) );
    }, $roles );
    echo esc_html( implode( ', ', $names ) );

    // Quick Edit 用に JSON も埋め込む
    printf( '<span class="lw-role-json" data-roles="%s"></span>', esc_attr( json_encode( $roles ) ) );
}