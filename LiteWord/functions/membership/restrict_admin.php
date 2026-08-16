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

    // 投稿はカテゴリー側にも設定でき、こちらが優先される（roles.php）
    $is_post = ( $post->post_type === 'post' );

    $note = $is_post
        ? 'チェックを付けた権限だけ閲覧可。<br>無選択ならカテゴリーの設定に従います（カテゴリーも無選択なら全員可）。'
        : 'チェックを付けた権限だけ閲覧可（無選択なら全員可）';

    echo '<p style="margin-bottom:4px">' . $note . '</p><br>';

    /* ---------- カテゴリーの設定を無視して公開する（投稿のみ） ---------- */
    // 固定ページはカテゴリーを持たないので出さない
    if ( $is_post ) {
        $ignore = lw_post_ignores_category_roles( $post->ID );
        printf(
            '<label style="display:block;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #dcdcde;">
                <input type="checkbox" name="lw_ignore_category_roles" id="lw_ignore_category_roles" value="1" %1$s>
                <strong>誰でも閲覧できるようにする</strong>
                <span style="display:block;margin-left:24px;color:#646970;">
                    カテゴリーが会員限定でも、この記事だけ公開します。<br>この設定が最優先です。
                </span>
            </label>',
            checked( $ignore, true, false )
        );
    }

    echo '<div id="lw_allowed_roles_list">';
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
    echo '</div>';

    /* ---------- ログイン画面でタイトル部分（FV）を残すか（投稿のみ） ---------- */
    // 全体設定はカスタマイザー「会員限定ページ設定」。ここはその上書き
    if ( $is_post ) {
        $keep = (string) get_post_meta( $post->ID, '_lw_keep_post_fv', true );
        $opts = [
            ''    => 'サイト全体の設定に従う',
            'on'  => 'タイトル部分を残す',
            'off' => '残さない（ログイン画面だけ）',
        ];

        echo '<p style="margin:16px 0 4px;padding-top:12px;border-top:1px solid #dcdcde;"><strong>ログイン画面の出し方</strong></p>';
        // ⚠️ width:100% だけだと padding と border が外に出て、サイドバーからはみ出す
        //    （管理画面の select には box-sizing:border-box がかかっていない）
        echo '<select name="lw_keep_post_fv" style="width:100%;max-width:100%;box-sizing:border-box;">';
        foreach ( $opts as $value => $label ) {
            printf(
                '<option value="%1$s" %3$s>%2$s</option>',
                esc_attr( $value ),
                esc_html( $label ),
                selected( $keep, $value, false )
            );
        }
        echo '</select>';
        echo '<p style="margin-top:4px;color:#646970;">「残す」にすると、タイトル・アイキャッチ・日付・カテゴリーを表示したまま、本文の位置にログイン画面を出します。</p>';
    }

    /* ---------- 「誰でも閲覧可」ONのときは権限リストを無効化して見せる ---------- */
    // 保存時もサーバー側で優先しているが、矛盾した状態を触れないようにしておく
    if ( $is_post ) {
        ?>
        <script>
        (function () {
            var toggle = document.getElementById('lw_ignore_category_roles');
            var list   = document.getElementById('lw_allowed_roles_list');
            if ( ! toggle || ! list ) return;

            // ⚠️ disabled にはしない。disabled のチェックボックスは送信されないので、
            //    「誰でも閲覧可」を外したときに元のチェックが消えてしまう
            function sync() {
                list.style.opacity       = toggle.checked ? '0.4' : '';
                list.style.pointerEvents = toggle.checked ? 'none' : '';
            }
            toggle.addEventListener('change', sync);
            sync();
        })();
        </script>
        <?php
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

    // 「誰でも閲覧できるようにする」（カテゴリーの設定を無視する例外・投稿のみ）
    if ( isset( $_POST['lw_ignore_category_roles'] ) && $_POST['lw_ignore_category_roles'] === '1' ) {
        update_post_meta( $post_id, '_lw_ignore_category_roles', '1' );
    } else {
        delete_post_meta( $post_id, '_lw_ignore_category_roles' );
    }

    // ログイン画面でタイトル部分（FV）を残すか（'' = サイト全体の設定に従う）
    $keep_fv = isset( $_POST['lw_keep_post_fv'] ) ? sanitize_key( $_POST['lw_keep_post_fv'] ) : '';
    if ( in_array( $keep_fv, [ 'on', 'off' ], true ) ) {
        update_post_meta( $post_id, '_lw_keep_post_fv', $keep_fv );
    } else {
        delete_post_meta( $post_id, '_lw_keep_post_fv' );
    }

    // 判定結果のキャッシュを無効化する（roles.php）
    if ( function_exists( 'lw_bump_allowed_roles_cache_version' ) ) {
        lw_bump_allowed_roles_cache_version();
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

/** 列内容
 *  ⚠️ 固定ページは manage_pages_custom_column が正しいフック。
 *     manage_posts_custom_column だけだと固定ページ一覧の列が空になる。
 */
add_action( 'manage_posts_custom_column', 'lw_render_role_column', 10, 2 );
add_action( 'manage_pages_custom_column', 'lw_render_role_column', 10, 2 );
function lw_render_role_column( $col, $post_id ) {

    if ( $col !== 'lw_view_roles' ) return;

    $roles = lw_get_post_allowed_roles( $post_id );

    /* ---------- ロール名をカンマ区切りにする ---------- */
    $to_names = function ( $keys ) {
        $all = wp_roles()->roles;
        return implode( ', ', array_map( function ( $rk ) use ( $all ) {
            return translate_user_role( $all[ $rk ]['name'] ?? $rk );
        }, $keys ) );
    };

    /* ---------- ① カテゴリーを無視して公開 ---------- */
    if ( lw_post_ignores_category_roles( $post_id ) ) {
        echo '<span class="lw-role-label">全員可（カテゴリー設定を無視）</span>';

    /* ---------- ② 投稿自身の設定 ---------- */
    } elseif ( ! empty( $roles ) ) {
        echo esc_html( $to_names( $roles ) );

    /* ---------- ③ カテゴリーから継いだ設定 ---------- */
    } else {
        $inherited = lw_get_category_allowed_roles_for_post( $post_id );
        echo empty( $inherited )
            ? '<span class="lw-role-label">全員可</span>'
            : '<span class="lw-role-label">カテゴリー設定: ' . esc_html( $to_names( $inherited ) ) . '</span>';
    }

    // Quick Edit 用に JSON も埋め込む（投稿自身の設定のみ）
    printf( '<span class="lw-role-json" data-roles="%s"></span>', esc_attr( json_encode( $roles ) ) );
}