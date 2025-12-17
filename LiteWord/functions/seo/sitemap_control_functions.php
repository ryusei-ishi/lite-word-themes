<?php
/**
 * LiteWord SEO - サイトマップ制御
 * noindex設定された投稿・カテゴリー・ユーザーをサイトマップから除外
 * キャッシュ機能により高速化
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class LW_SEO_Sitemap_Control {

	/**
	 * キャッシュオプション名
	 */
	const CACHE_KEY = 'lw_noindex_cache';
	const CACHE_VERSION = '1.0.0';

	/**
	 * 初期化
	 */
	public static function init() {
		// ログイン時にキャッシュを更新
		add_action( 'wp_login', [ __CLASS__, 'rebuild_noindex_cache' ], 10, 2 );
		
		// 管理画面での投稿保存時にもキャッシュ更新
		add_action( 'save_post', [ __CLASS__, 'maybe_update_cache' ], 999 );
		add_action( 'edited_category', [ __CLASS__, 'maybe_update_cache' ], 999 );
		
		// サイトマップから除外（クエリ段階で除外）
		add_filter( 'wp_sitemaps_posts_query_args', [ __CLASS__, 'exclude_noindex_posts_from_query' ], 10, 2 );
		add_filter( 'wp_sitemaps_taxonomies_query_args', [ __CLASS__, 'exclude_noindex_categories_from_query' ], 10, 2 );
		add_filter( 'wp_sitemaps_users_query_args', [ __CLASS__, 'exclude_noindex_users_from_query' ], 10 );
		
		// 管理画面に再構築ボタン追加（デバッグ用）
		add_action( 'admin_init', [ __CLASS__, 'handle_manual_rebuild' ] );
	}

	/**
	 * noindexデータをキャッシュに保存
	 */
	public static function rebuild_noindex_cache( $user_login = null, $user = null ) {
		global $wpdb;
		
		$cache_data = [
			'version'    => self::CACHE_VERSION,
			'updated_at' => current_time( 'mysql' ),
			'posts'      => [],
			'categories' => [],
			'users'      => [],
			'posts_by_category' => []
		];

		// 1. noindex設定された投稿を取得（固定ページも含む）
		$noindex_posts = $wpdb->get_col( 
			"SELECT post_id 
			 FROM {$wpdb->postmeta} 
			 WHERE meta_key = 'seo_noindex' 
			   AND meta_value = 'noindex'"
		);
		$cache_data['posts'] = array_map( 'intval', $noindex_posts );

		// 2. noindex設定されたカテゴリーを取得
		$noindex_categories = $wpdb->get_col(
			"SELECT term_id 
			 FROM {$wpdb->termmeta} 
			 WHERE meta_key = 'category_noindex' 
			   AND meta_value = 'noindex'"
		);
		$cache_data['categories'] = array_map( 'intval', $noindex_categories );

		// 3. noindex設定されたユーザーを取得（デフォルトがnoindex）
		$all_users = $wpdb->get_col("SELECT ID FROM {$wpdb->users}");
		$follow_users = $wpdb->get_col(
			"SELECT user_id 
			 FROM {$wpdb->usermeta} 
			 WHERE meta_key = 'user_noindex' 
			   AND meta_value = 'follow'"
		);
		$noindex_users = array_diff($all_users, $follow_users);
		$cache_data['users'] = array_map( 'intval', $noindex_users );

		// 4. noindexカテゴリーに属する投稿を取得
		if ( ! empty( $cache_data['categories'] ) ) {
			$cat_ids_placeholder = implode( ',', array_fill( 0, count( $cache_data['categories'] ), '%d' ) );
			$query = $wpdb->prepare(
				"SELECT DISTINCT object_id 
				 FROM {$wpdb->term_relationships} tr
				 INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
				 WHERE tt.taxonomy = 'category' 
				   AND tt.term_id IN ({$cat_ids_placeholder})",
				...$cache_data['categories']
			);
			$posts_in_noindex_cats = $wpdb->get_col( $query );
			$cache_data['posts_by_category'] = array_map( 'intval', $posts_in_noindex_cats );
		}

		// 5. 全体のnoindex投稿リストを統合（重複削除）
		$all_noindex_posts = array_unique( array_merge( 
			$cache_data['posts'], 
			$cache_data['posts_by_category'] 
		) );
		$cache_data['all_posts'] = $all_noindex_posts;

		// キャッシュを保存
		update_option( self::CACHE_KEY, $cache_data, false );
				
		return $cache_data;
	}

	/**
	 * 投稿保存時のキャッシュ更新判定
	 */
	public static function maybe_update_cache( $id = null ) {
		// 自動保存やリビジョンは無視
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
		if ( wp_is_post_revision( $id ) ) return;
		
		// 管理者のみキャッシュ更新を実行
		if ( ! current_user_can( 'manage_options' ) ) return;
		
		// 遅延実行（他の保存処理完了後）
		wp_schedule_single_event( time() + 2, 'lw_rebuild_noindex_cache' );
	}

	/**
	 * キャッシュデータ取得
	 */
	public static function get_noindex_cache() {
		$cache = get_option( self::CACHE_KEY );
		
		// キャッシュが無い、または古いバージョンの場合は再構築
		if ( ! $cache || ! isset( $cache['version'] ) || $cache['version'] !== self::CACHE_VERSION ) {
			$cache = self::rebuild_noindex_cache();
		}
		
		return $cache;
	}

	/**
	 * 投稿がnoindexかチェック
	 */
	public static function is_post_noindex( $post_id ) {
		$cache = self::get_noindex_cache();
		return in_array( (int) $post_id, $cache['all_posts'] ?? [], true );
	}

	/**
	 * カテゴリーがnoindexかチェック
	 */
	public static function is_category_noindex( $term_id ) {
		$cache = self::get_noindex_cache();
		return in_array( (int) $term_id, $cache['categories'] ?? [], true );
	}

	/**
	 * ユーザーがnoindexかチェック
	 */
	public static function is_user_noindex( $user_id ) {
		$cache = self::get_noindex_cache();
		return in_array( (int) $user_id, $cache['users'] ?? [], true );
	}

	/**
	 * サイトマップクエリから投稿を除外
	 */
	public static function exclude_noindex_posts_from_query( $args, $post_type ) {
		$cache = self::get_noindex_cache();
		
		if ( ! empty( $cache['all_posts'] ) ) {
			// 既存の post__not_in と結合
			$existing_excludes = isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : [];
			$args['post__not_in'] = array_merge( $existing_excludes, $cache['all_posts'] );
			$args['post__not_in'] = array_unique( $args['post__not_in'] );
		}
		
		return $args;
	}

	/**
	 * サイトマップクエリからカテゴリーを除外
	 */
	public static function exclude_noindex_categories_from_query( $args, $taxonomy ) {
		if ( $taxonomy !== 'category' ) {
			return $args;
		}
		
		$cache = self::get_noindex_cache();
		
		if ( ! empty( $cache['categories'] ) ) {
			// 既存の exclude と結合
			$existing_excludes = isset( $args['exclude'] ) ? (array) $args['exclude'] : [];
			$args['exclude'] = array_merge( $existing_excludes, $cache['categories'] );
			$args['exclude'] = array_unique( $args['exclude'] );
		}
		
		return $args;
	}

	/**
	 * サイトマップクエリからユーザーを除外（デフォルトでnoindex）
	 */
	public static function exclude_noindex_users_from_query( $args ) {
		global $wpdb;
		
		// user_noindex = 'follow' のユーザーのみサイトマップに含める
		$indexed_users = $wpdb->get_col(
			"SELECT user_id 
			 FROM {$wpdb->usermeta} 
			 WHERE meta_key = 'user_noindex' 
			   AND meta_value = 'follow'"
		);
		
		if ( empty( $indexed_users ) ) {
			// 全ユーザーを除外
			$args['include'] = [0]; // 存在しないID
		} else {
			// followのユーザーのみ含める
			$args['include'] = $indexed_users;
		}
		
		return $args;
	}


	/**
	 * 手動更新の処理
	 */
	public static function handle_manual_rebuild() {
		if ( ! isset( $_GET['lw_rebuild_noindex'] ) ) return;
		if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'lw_rebuild_noindex' ) ) return;
		if ( ! current_user_can( 'manage_options' ) ) return;
		
		self::rebuild_noindex_cache();
		
		// 成功メッセージを追加
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-success is-dismissible"><p>noindexキャッシュを更新しました。</p></div>';
		} );
		
		wp_redirect( remove_query_arg( [ 'lw_rebuild_noindex', '_wpnonce' ] ) );
		exit;
	}

	/**
	 * テーマ切り替え時のクリーンアップ
	 */
	public static function cleanup() {
		delete_option( self::CACHE_KEY );
		wp_clear_scheduled_hook( 'lw_rebuild_noindex_cache' );
	}
}

// 初期化
add_action( 'init', [ 'LW_SEO_Sitemap_Control', 'init' ] );

// スケジュールイベント登録
add_action( 'lw_rebuild_noindex_cache', [ 'LW_SEO_Sitemap_Control', 'rebuild_noindex_cache' ] );

// テーマ切り替え時のクリーンアップ
add_action( 'switch_theme', [ 'LW_SEO_Sitemap_Control', 'cleanup' ] );