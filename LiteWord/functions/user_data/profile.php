<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * プロフィール › 連絡先情報 に SNS リンク欄を追加（テスト用）
 * 表示されるかをまず確認する
 */
add_filter( 'user_contactmethods', function ( $methods ) {
	$methods['homepage_2']  = 'サイト 2';
	$methods['instagram'] = 'Instagram';
	$methods['x']         = 'X (旧 Twitter)';
	$methods['line']      = 'LINE';
	$methods['threads']   = 'Threads';
	$methods['note']      = 'note';
	return $methods;
}, 99 );  

/* ===============================================================
 * 【LW】プロフィール画像アップロード欄（ユーザープロフィール画面）
 * ============================================================ */
function liteword_user_profile_fields( $user ) { ?>
    <h3><?php _e( '【LW】プロフィール画像', 'liteword' ); ?></h3>

    <table class="form-table">
        <tr>
            <th><label for="profile_image"><?php _e( 'プロフィール画像', 'liteword' ); ?></label></th>
            <td>
                <?php
                    $profile_image = esc_url( get_user_meta( $user->ID, 'profile_image', true ) );
                ?>
                <input type="button" class="button button-secondary" id="profile_image_button" value="<?php _e( '画像を選択', 'liteword' ); ?>" />
                <input type="button" class="button button-secondary" id="profile_image_remove_button" value="<?php _e( '画像を削除', 'liteword' ); ?>" <?php if ( ! $profile_image ) echo 'style="display:none;"'; ?>/>
                <input type="hidden" name="profile_image" id="profile_image" value="<?php echo $profile_image; ?>" />
                <div id="profile_image_preview" style="margin-top:10px;">
                    <?php if ( $profile_image ) : ?>
                        <img src="<?php echo $profile_image; ?>" alt="" style="max-width:150px;">
                    <?php endif; ?>
                </div>
            </td>
        </tr>
    </table>
<?php }

/* プロフィール画像の保存 */
function liteword_save_user_profile_fields( $user_id ) {
    if ( current_user_can( 'edit_user', $user_id ) ) {
        if ( isset( $_POST['profile_image_remove'] ) && $_POST['profile_image_remove'] == '1' ) {
            delete_user_meta( $user_id, 'profile_image' );
        } else {
            update_user_meta( $user_id, 'profile_image', esc_url_raw( $_POST['profile_image'] ) );
        }
    }
}

/* メディアライブラリ用 JS を読み込み */
function liteword_enqueue_media_uploader() {
    wp_enqueue_media();
    wp_enqueue_script(
        'profile-image-uploader',
        get_template_directory_uri() . '/assets/js/profile-image-uploader.js',
        [ 'jquery' ],
        null,
        true
    );
}

add_action( 'show_user_profile',          'liteword_user_profile_fields' );
add_action( 'edit_user_profile',          'liteword_user_profile_fields' );
add_action( 'personal_options_update',    'liteword_save_user_profile_fields' );
add_action( 'edit_user_profile_update',   'liteword_save_user_profile_fields' );
add_action( 'admin_enqueue_scripts',      'liteword_enqueue_media_uploader' );

/* ===============================================================
 * 【LW】プロフィール画像を最優先にするアバター置き換え
 * ---------------------------------------------------------------
 * 1. ユーザーメタ 'profile_image' があれば <img> を自前生成
 * 2. 無ければ WordPress 標準の処理（Gravatar・デフォルト）へフォールバック
 * ============================================================ */
add_filter( 'pre_get_avatar', 'liteword_profile_image_avatar', 10, 3 );

function liteword_profile_image_avatar( $avatar_html, $id_or_email, $args ) {

	/* ---------- 1) WP_User を取得 ---------- */
	$user = false;

	if ( is_object( $id_or_email ) ) {

		// WP_Comment の場合
		if ( $id_or_email instanceof WP_Comment ) {
			if ( $id_or_email->user_id ) {
				$user = get_user_by( 'id', (int) $id_or_email->user_id );
			} else {
				// ゲストコメント（email から取得できる場合のみ）
				$user = get_user_by( 'email', $id_or_email->comment_author_email );
			}

		// すでに WP_User
		} elseif ( $id_or_email instanceof WP_User ) {
			$user = $id_or_email;
		}

	} elseif ( is_numeric( $id_or_email ) ) {
		$user = get_user_by( 'id', (int) $id_or_email );

	} elseif ( is_string( $id_or_email ) ) {
		$user = get_user_by( 'email', $id_or_email );
	}

	/* ---------- 2) profile_image があれば差し替え ---------- */
	if ( $user ) {
		$profile_image = get_user_meta( $user->ID, 'profile_image', true );

		if ( $profile_image ) {

			$size   = (int) $args['size'];                         // <img width/height>
			$alt    = esc_attr( $args['alt'] ?: $user->display_name );
			$src    = esc_url( $profile_image );

			// class="avatar avatar-48 photo" のような WP 標準クラスを踏襲
			$class_attr = trim( 'avatar avatar-' . $size . ' photo ' . ( $args['class'] ?? '' ) );

			// 追加属性（loading, decoding など）も尊重
			$extra_attr = $args['extra_attr'] ?? '';

			// 自前の <img> を返す
			return sprintf(
				'<img alt="%s" src="%s" class="%s" width="%d" height="%d" loading="lazy" %s/>',
				$alt,
				$src,
				esc_attr( $class_attr ),
				$size,
				$size,
				$extra_attr
			);
		}
	}

	/* ---------- 3) フォールバック ---------- */
	return $avatar_html;   // 何もしない → 標準の Gravatar / デフォルトを出力
}

