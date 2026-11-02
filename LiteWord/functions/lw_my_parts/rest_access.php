<?php
/**
 * マイパーツを REST で読めるのは、投稿を書ける人（edit_posts）だけにする（2026-11-02 再点検 R5）
 *
 * マイパーツは public=false（表に出さない）だが、ブロックエディタで使うため show_in_rest=true にしている。
 * WordPress の REST は「公開済み」なら誰でも読めるので、未ログインでも /wp-json/wp/v2/lw_my_parts から
 * 題名・本文・抜粋が読めていた（会員限定の記事にだけ埋めたパーツの本文も）。パーツカテゴリー（/wp/v2/lw_parts_cat）も同じ。
 *
 * - 一覧・1件とも、edit_posts を持たない人には 401（未ログイン）か 403 を返す
 * - ブロックエディタ（マイパーツの挿入・パーツの編集）は投稿を書ける人が使うので今までどおり
 * - 作る・直す・消すの確かめは WordPress のまま（ここでは足すだけ）
 * - 表側にパーツを出すのは、今までどおりショートコード [my_parts_content] とマイパーツのブロックだけ
 *
 * クラス名は custom_post_type.php の register_post_type / register_taxonomy（rest_controller_class）で使う。
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST でマイパーツ（とパーツカテゴリー）を読んでよいか。
 *
 * @return true|WP_Error
 */
function lw_my_parts_rest_read_permission() {
	$pto = get_post_type_object( 'lw_my_parts' );
	$cap = ( $pto && isset( $pto->cap->edit_posts ) ) ? $pto->cap->edit_posts : 'edit_posts';
	if ( current_user_can( $cap ) ) {
		return true;
	}
	return new WP_Error(
		'rest_forbidden',
		'マイパーツは、投稿を編集できる人だけが読めます。',
		array( 'status' => rest_authorization_required_code() )
	);
}

if ( class_exists( 'WP_REST_Posts_Controller' ) && ! class_exists( 'LW_My_Parts_REST_Controller' ) ) {
	/**
	 * マイパーツ用の REST コントローラー（読む前に lw_my_parts_rest_read_permission() を通す）
	 */
	class LW_My_Parts_REST_Controller extends WP_REST_Posts_Controller {

		/**
		 * 一覧を読んでよいか
		 *
		 * @param WP_REST_Request $request
		 * @return true|WP_Error
		 */
		public function get_items_permissions_check( $request ) {
			$allowed = lw_my_parts_rest_read_permission();
			if ( true !== $allowed ) {
				return $allowed;
			}
			return parent::get_items_permissions_check( $request );
		}

		/**
		 * 1件を読んでよいか
		 *
		 * @param WP_REST_Request $request
		 * @return true|WP_Error
		 */
		public function get_item_permissions_check( $request ) {
			$allowed = lw_my_parts_rest_read_permission();
			if ( true !== $allowed ) {
				return $allowed;
			}
			return parent::get_item_permissions_check( $request );
		}
	}
}

if ( class_exists( 'WP_REST_Terms_Controller' ) && ! class_exists( 'LW_Parts_Cat_REST_Controller' ) ) {
	/**
	 * パーツカテゴリー用の REST コントローラー（マイパーツと同じ人だけが読める）
	 */
	class LW_Parts_Cat_REST_Controller extends WP_REST_Terms_Controller {

		/**
		 * 一覧を読んでよいか
		 *
		 * @param WP_REST_Request $request
		 * @return true|WP_Error
		 */
		public function get_items_permissions_check( $request ) {
			$allowed = lw_my_parts_rest_read_permission();
			if ( true !== $allowed ) {
				return $allowed;
			}
			return parent::get_items_permissions_check( $request );
		}

		/**
		 * 1件を読んでよいか
		 *
		 * @param WP_REST_Request $request
		 * @return true|WP_Error
		 */
		public function get_item_permissions_check( $request ) {
			$allowed = lw_my_parts_rest_read_permission();
			if ( true !== $allowed ) {
				return $allowed;
			}
			return parent::get_item_permissions_check( $request );
		}
	}
}
