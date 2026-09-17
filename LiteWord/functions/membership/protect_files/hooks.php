<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― いつ動くか
 *
 * 設定の切り替え以外は「ON にされていて準備済み」のときだけ動く。OFF のサイトでは何もしない。
 * 作り直すかどうかと急ぐかどうかの判定は related.php。
 * =============================================================== */

/* ---------- 設定の保存・テーマの切り替え ---------- */

add_action( 'customize_save_after', 'lw_member_files_on_customize_save' );
function lw_member_files_on_customize_save() {
	lw_member_files_apply_setting( true );
}

add_action( 'switch_theme', 'lw_member_files_on_switch_theme', 10, 3 );
function lw_member_files_on_switch_theme( $new_name, $new_theme, $old_theme ) {
	// LiteWord とその子テーマどうしなら、切り替え先の設定に合わせる（after_switch_theme）
	if ( $new_theme instanceof WP_Theme && $old_theme instanceof WP_Theme && $new_theme->get_template() === $old_theme->get_template() ) {
		return;
	}
	$state = lw_member_files_state();
	if ( $state['active'] || $state['error'] !== '' || is_dir( lw_member_files_marker_root() ) ) {
		lw_member_files_turn_off();
	}
}

add_action( 'after_switch_theme', 'lw_member_files_on_after_switch_theme' );
function lw_member_files_on_after_switch_theme() {
	lw_member_files_apply_setting( false );
}

/* ---------- 記事・メディア・カテゴリー・サイトの設定が変わったとき ---------- */

add_action( 'wp_after_insert_post', 'lw_member_files_on_post_saved', 10, 2 );
function lw_member_files_on_post_saved( $post_id, $post ) {
	if ( ! lw_member_files_is_active() || ! ( $post instanceof WP_Post ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}
	if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) || in_array( $post->post_type, [ 'revision', 'customize_changeset', 'oembed_cache', 'user_request' ], true ) ) {
		return;
	}
	lw_member_files_request_rebuild( $post->post_type === 'attachment' ? lw_member_files_attachment_change( $post->ID ) : lw_member_files_post_change( $post ) );
}

add_action( 'deleted_post', 'lw_member_files_on_post_deleted' );
function lw_member_files_on_post_deleted( $post_id ) {
	if ( ! lw_member_files_is_active() ) {
		return;
	}
	$index = lw_member_files_get_index();
	if ( isset( $index['posts'][ $post_id ] ) || isset( $index['attachments'][ $post_id ] ) ) {
		lw_member_files_request_rebuild( 'later' );
	}
}

add_action( 'add_attachment', 'lw_member_files_on_attachment_added' );
function lw_member_files_on_attachment_added( $attachment_id ) {
	if ( lw_member_files_is_active() ) {
		lw_member_files_request_rebuild( lw_member_files_attachment_change( $attachment_id ) );
	}
}

// サイズ違いの画像は、アップロードの後に作られる
add_filter( 'wp_update_attachment_metadata', 'lw_member_files_on_attachment_metadata', 10, 2 );
function lw_member_files_on_attachment_metadata( $data, $attachment_id ) {
	if ( lw_member_files_is_active() ) {
		lw_member_files_request_rebuild( lw_member_files_attachment_change( $attachment_id, $data ) );
	}
	return $data;
}

// メディア一覧の「添付」「添付を外す」（post_parent を直接書き換えるので、記事の保存フックが出ない）
add_action( 'wp_media_attach_action', 'lw_member_files_on_media_attach', 10, 3 );
function lw_member_files_on_media_attach( $action, $attachment_id, $parent_id ) {
	if ( ! lw_member_files_is_active() ) {
		return;
	}
	// このフックの時点では、メディアのキャッシュにまだ古い親が残っているので、渡された親で判定する
	lw_member_files_request_rebuild( $action === 'attach' ? lw_member_files_attachment_change( $attachment_id, null, (int) $parent_id ) : ( lw_member_files_has_index() ? 'later' : '' ) );
}

add_action( 'added_post_meta', 'lw_member_files_on_post_meta', 10, 3 );
add_action( 'updated_post_meta', 'lw_member_files_on_post_meta', 10, 3 );
add_action( 'deleted_post_meta', 'lw_member_files_on_post_meta', 10, 3 );
function lw_member_files_on_post_meta( $meta_id, $object_id, $meta_key ) {
	if ( $meta_key !== '' && ( $meta_key[0] === '_' || in_array( $meta_key, lw_member_files_ogp_meta_keys(), true ) ) ) {   // 関係するキーだけ、先に安く絞る
		$when = lw_member_files_post_meta_change( $meta_key );
		if ( $when !== '' && lw_member_files_is_active() ) {
			lw_member_files_request_rebuild( $when );
		}
	}
}

add_action( 'added_term_meta', 'lw_member_files_on_term_meta', 10, 3 );
add_action( 'updated_term_meta', 'lw_member_files_on_term_meta', 10, 3 );
add_action( 'deleted_term_meta', 'lw_member_files_on_term_meta', 10, 3 );
function lw_member_files_on_term_meta( $meta_id, $object_id, $meta_key ) {
	$when = lw_member_files_term_meta_change( $meta_key );
	if ( $when !== '' && lw_member_files_is_active() ) {
		lw_member_files_request_rebuild( $when );
	}
}

// カテゴリーの付け替え（クイック編集・一括編集・プラグインからの変更を含む）
// WordPress は保存のたびに同じカテゴリーを付け直すので、本当に変わったときだけ反応する
add_action( 'set_object_terms', 'lw_member_files_on_object_terms', 10, 6 );
function lw_member_files_on_object_terms( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {
	if ( $taxonomy !== 'category' || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}
	$new = array_map( 'intval', (array) $tt_ids );
	$old = array_map( 'intval', (array) $old_tt_ids );
	sort( $new );
	sort( $old );
	if ( $new === $old || ! lw_member_files_is_active() || ! in_array( get_post_type( $object_id ), [ 'post', 'page' ], true ) ) {
		return;
	}
	if ( lw_member_files_post_roles( $object_id ) ) {
		lw_member_files_request_rebuild( 'now' );     // 会員限定のカテゴリーに入った
	} elseif ( isset( lw_member_files_get_index()['posts'][ $object_id ] ) ) {
		lw_member_files_request_rebuild( 'later' );   // 会員限定のカテゴリーから出た
	}
}

foreach ( [ 'created_category', 'edited_category', 'delete_category' ] as $lw_member_files_hook ) {
	add_action( $lw_member_files_hook, 'lw_member_files_on_terms_changed', 99 );
}
function lw_member_files_on_terms_changed() {
	if ( lw_member_files_is_active() ) {
		lw_member_files_request_rebuild( 'now' );
	}
}

add_action( 'wp_update_nav_menu', 'lw_member_files_on_menu_updated' );
function lw_member_files_on_menu_updated() {
	if ( lw_member_files_is_active() && lw_member_files_has_index() ) {
		lw_member_files_request_rebuild( 'later' );
	}
}

add_action( 'added_option', 'lw_member_files_on_option_updated' );     // 初めて保存したとき（OGP の既定画像・新しいウィジェット）
add_action( 'updated_option', 'lw_member_files_on_option_updated' );
function lw_member_files_on_option_updated( $option ) {
	if ( ( strpos( $option, 'widget_' ) === 0 || strpos( $option, 'theme_mods_' ) === 0 || strpos( $option, 'lw_' ) === 0 || $option === 'site_icon' ) && lw_member_files_is_active() ) {
		lw_member_files_request_rebuild( lw_member_files_option_change( $option ) );
	}
}
