<?php
/**
 * LiteWord ─ テーマ自動アップデート処理
 * ---------------------------------------
 * 1) pre_set_site_transient_update_themes + site_transient_update_themes で更新情報を流し込む
 * 2) admin_notices で更新通知＋2種類のボタンを表示
 *
 * マルチサイト対応: checked が空でも動作、読み取り時フィルターにもフック
 * キャッシュ: site_transient で6時間キャッシュ（外部リクエスト頻度を削減）
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ─ テーマスラッグ（ディレクトリ名）─ */
define( 'LW_THEME_SLUG', 'LiteWord' );

/*====================================
 * 0) 更新情報JSONの取得（キャッシュ付き共通関数）
 *===================================*/

/**
 * lite-word.com から更新情報JSONを取得する。
 * site_transient でキャッシュし、6時間に1回だけ外部リクエストを飛ばす。
 *
 * @return object|false 成功時: JSONオブジェクト、失敗時: false
 */
function lw_get_remote_update_data() {

	$cache_key = 'lw_theme_update_data';

	$cached = get_site_transient( $cache_key );
	if ( false !== $cached ) {
		// 'none' は「更新なし」または「取得失敗」のキャッシュ
		return $cached === 'none' ? false : $cached;
	}

	$update_url = 'https://lite-word.com/theme-files/theme-update.json';
	$response   = wp_remote_get( $update_url, array( 'timeout' => 10 ) );

	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		set_site_transient( $cache_key, 'none', 30 * MINUTE_IN_SECONDS );
		return false;
	}

	$data = json_decode( wp_remote_retrieve_body( $response ) );
	if ( ! is_object( $data ) || ! isset( $data->version, $data->download_url ) ) {
		set_site_transient( $cache_key, 'none', 30 * MINUTE_IN_SECONDS );
		return false;
	}

	set_site_transient( $cache_key, $data, 6 * HOUR_IN_SECONDS );
	return $data;
}

/*====================================
 * 1) 更新情報を流し込む（マルチサイト対応版）
 *===================================*/

// 書き込み時: トランジェント保存前に更新情報を注入
add_filter( 'pre_set_site_transient_update_themes', 'lw_check_for_theme_update' );
// 読み取り時: 子サイトが transient を読むだけの場合にも更新情報を補完
add_filter( 'site_transient_update_themes', 'lw_check_for_theme_update' );

function lw_check_for_theme_update( $transient ) {

	if ( ! is_object( $transient ) ) {
		$transient = new stdClass();
	}

	$theme_slug = LW_THEME_SLUG;

	// LiteWordテーマの情報を直接取得（checked に依存しない）
	$theme = wp_get_theme( $theme_slug );
	if ( ! $theme->exists() ) {
		return $transient;
	}
	$current_version = $theme->get( 'Version' );

	// checked が空の場合は自前で埋める（マルチサイト対策の核心）
	if ( ! isset( $transient->checked ) || ! is_array( $transient->checked ) ) {
		$transient->checked = array();
	}
	if ( ! isset( $transient->checked[ $theme_slug ] ) ) {
		$transient->checked[ $theme_slug ] = $current_version;
	}

	// response に既にセット済みならスキップ（重複防止）
	if ( isset( $transient->response[ $theme_slug ] ) ) {
		return $transient;
	}

	// 更新情報をキャッシュ付きで取得
	$update_data = lw_get_remote_update_data();
	if ( false === $update_data ) {
		return $transient;
	}

	// バージョン比較
	if ( version_compare( $current_version, $update_data->version, '<' ) ) {
		$transient->response[ $theme_slug ] = array(
			'theme'       => $theme_slug,
			'new_version' => $update_data->version,
			'url'         => 'https://lite-word.com',
			'package'     => $update_data->download_url,
		);
	} else {
		// 最新版の場合は response から除去
		unset( $transient->response[ $theme_slug ] );
	}

	return $transient;
}

/*====================================
 * 2) 通知＋2種類のボタン
 *===================================*/
add_action( 'admin_notices', 'lw_theme_update_notice' );
function lw_theme_update_notice() {

	// ダッシュボードでは表示しない（カスタムエリアで表示するため）
	$screen = get_current_screen();
	if ( $screen && $screen->id === 'dashboard' ) {
		return;
	}

	// 権限チェック
	if ( ! current_user_can( 'update_themes' ) ) {
		return;
	}

	// テーマ情報
	$theme = wp_get_theme( LW_THEME_SLUG );
	if ( ! $theme->exists() ) {
		return;
	}
	$current_version = $theme->get( 'Version' );
	$theme_slug      = LW_THEME_SLUG;

	// 更新情報をキャッシュ付きで取得
	$update_data = lw_get_remote_update_data();
	if ( false === $update_data || ! isset( $update_data->changelog ) ) {
		return;
	}

	// 旧 → 新 なら通知
	if ( version_compare( $current_version, $update_data->version, '<' ) ) {

		$upgrade_url = wp_nonce_url(
			self_admin_url( 'update.php?action=upgrade-theme&theme=' . $theme_slug ),
			'upgrade-theme_' . $theme_slug
		);
		$update_core_url = self_admin_url( 'update-core.php#themes' );

		?>
		<div class="lw-update-notice">
			<div class="lw-update-notice-inner">
				<div class="lw-update-icon">
					<span class="dashicons dashicons-update"></span>
				</div>
				<div class="lw-update-content">
					<div class="lw-update-header">
						<span class="lw-update-badge">NEW</span>
						<h3 class="lw-update-title">LiteWord v<?php echo esc_html( $update_data->version ); ?> が利用可能です</h3>
					</div>
					<p class="lw-update-changelog">
						<span class="dashicons dashicons-info-outline"></span>
						<?php echo esc_html( $update_data->changelog ); ?>
					</p>
					<div class="lw-update-meta">
						<span class="lw-update-current">現在: v<?php echo esc_html( $current_version ); ?></span>
						<span class="lw-update-arrow">→</span>
						<span class="lw-update-new">最新: v<?php echo esc_html( $update_data->version ); ?></span>
					</div>
				</div>
				<div class="lw-update-actions">
					<a href="<?php echo esc_url( $upgrade_url ); ?>" class="lw-update-btn lw-update-btn-primary">
						<span class="dashicons dashicons-download"></span>
						今すぐ更新
					</a>
					<a href="<?php echo esc_url( $update_core_url ); ?>" class="lw-update-btn lw-update-btn-secondary">
						更新ページへ
					</a>
				</div>
			</div>
		</div>
		<style>
		.lw-update-notice {
			margin: 20px 20px 10px 2px;
			padding: 0;
			border: none;
			border-radius: 16px;
			background: linear-gradient(135deg, #1e3a5f 0%, #2b72b5 50%, #3d8fd1 100%);
			box-shadow: 0 4px 20px rgba(43, 114, 181, 0.25);
			overflow: hidden;
			position: relative;
		}
		.lw-update-notice::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
			pointer-events: none;
		}
		.lw-update-notice-inner {
			display: flex;
			align-items: center;
			gap: 20px;
			padding: 20px 24px;
			position: relative;
			z-index: 1;
		}
		.lw-update-icon {
			width: 56px;
			height: 56px;
			background: rgba(255, 255, 255, 0.15);
			backdrop-filter: blur(10px);
			border-radius: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			animation: lw-rotate 3s linear infinite;
		}
		@keyframes lw-rotate {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		.lw-update-icon .dashicons {
			font-size: 28px;
			width: 28px;
			height: 28px;
			color: #fff;
		}
		.lw-update-content {
			flex: 1;
			min-width: 0;
		}
		.lw-update-header {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 6px;
		}
		.lw-update-badge {
			background: linear-gradient(135deg, #44ea76, #36d068);
			color: #fff;
			font-size: 10px;
			font-weight: 700;
			padding: 3px 8px;
			border-radius: 6px;
			letter-spacing: 0.5px;
			box-shadow: 0 2px 8px rgba(68, 234, 118, 0.3);
		}
		.lw-update-title {
			margin: 0;
			font-size: 17px;
			font-weight: 600;
			color: #fff;
		}
		.lw-update-changelog {
			display: flex;
			align-items: flex-start;
			gap: 6px;
			margin: 0 0 8px;
			font-size: 13px;
			color: rgba(255, 255, 255, 0.85);
			line-height: 1.5;
		}
		.lw-update-changelog .dashicons {
			font-size: 16px;
			width: 16px;
			height: 16px;
			flex-shrink: 0;
			margin-top: 1px;
		}
		.lw-update-meta {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 12px;
		}
		.lw-update-current {
			color: rgba(255, 255, 255, 0.6);
		}
		.lw-update-arrow {
			color: rgba(255, 255, 255, 0.4);
		}
		.lw-update-new {
			color: #44ea76;
			font-weight: 600;
		}
		.lw-update-actions {
			display: flex;
			gap: 10px;
			flex-shrink: 0;
		}
		.lw-update-btn {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 10px 20px;
			border-radius: 10px;
			font-size: 13px;
			font-weight: 600;
			text-decoration: none;
			transition: all 0.2s ease;
			cursor: pointer;
		}
		.lw-update-btn .dashicons {
			font-size: 16px;
			width: 16px;
			height: 16px;
		}
		.lw-update-btn-primary {
			background: #fff;
			color: #2b72b5;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
		}
		.lw-update-btn-primary:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
			color: #1e5a8a;
		}
		.lw-update-btn-secondary {
			background: rgba(255, 255, 255, 0.15);
			color: #fff;
			border: 1px solid rgba(255, 255, 255, 0.3);
		}
		.lw-update-btn-secondary:hover {
			background: rgba(255, 255, 255, 0.25);
			color: #fff;
		}
		@media (max-width: 782px) {
			.lw-update-notice-inner {
				flex-direction: column;
				text-align: center;
				padding: 24px 20px;
			}
			.lw-update-header {
				justify-content: center;
				flex-wrap: wrap;
			}
			.lw-update-changelog {
				justify-content: center;
			}
			.lw-update-meta {
				justify-content: center;
			}
			.lw-update-actions {
				width: 100%;
				flex-direction: column;
			}
			.lw-update-btn {
				justify-content: center;
			}
		}
		</style>
		<?php
	}
}

/*====================================
 * 3) ダッシュボード用更新通知（カスタムエリア用）
 *===================================*/
function lw_get_theme_update_notice_html() {

	// 権限チェック
	if ( ! current_user_can( 'update_themes' ) ) {
		return '';
	}

	// テーマ情報
	$theme = wp_get_theme( LW_THEME_SLUG );
	if ( ! $theme->exists() ) {
		return '';
	}
	$current_version = $theme->get( 'Version' );
	$theme_slug      = LW_THEME_SLUG;

	// 更新情報をキャッシュ付きで取得
	$update_data = lw_get_remote_update_data();
	if ( false === $update_data || ! isset( $update_data->changelog ) ) {
		return '';
	}

	// 旧 → 新 なら通知HTML生成
	if ( version_compare( $current_version, $update_data->version, '<' ) ) {

		$upgrade_url = wp_nonce_url(
			self_admin_url( 'update.php?action=upgrade-theme&theme=' . $theme_slug ),
			'upgrade-theme_' . $theme_slug
		);
		$update_core_url = self_admin_url( 'update-core.php#themes' );

		ob_start();
		?>
		<div class="lw-update-notice lw-update-notice-dashboard">
			<div class="lw-update-notice-inner">
				<div class="lw-update-icon">
					<span class="dashicons dashicons-update"></span>
				</div>
				<div class="lw-update-content">
					<div class="lw-update-header">
						<span class="lw-update-badge">NEW</span>
						<h3 class="lw-update-title">LiteWord v<?php echo esc_html( $update_data->version ); ?> が利用可能です</h3>
					</div>
					<p class="lw-update-changelog">
						<span class="dashicons dashicons-info-outline"></span>
						<?php echo esc_html( $update_data->changelog ); ?>
					</p>
					<div class="lw-update-meta">
						<span class="lw-update-current">現在: v<?php echo esc_html( $current_version ); ?></span>
						<span class="lw-update-arrow">→</span>
						<span class="lw-update-new">最新: v<?php echo esc_html( $update_data->version ); ?></span>
					</div>
				</div>
				<div class="lw-update-actions">
					<a href="<?php echo esc_url( $upgrade_url ); ?>" class="lw-update-btn lw-update-btn-primary">
						<span class="dashicons dashicons-download"></span>
						今すぐ更新
					</a>
					<a href="<?php echo esc_url( $update_core_url ); ?>" class="lw-update-btn lw-update-btn-secondary">
						更新ページへ
					</a>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	return '';
}

/*====================================
 * 4) ダッシュボードで他の通知を非表示
 *===================================*/
add_action( 'admin_head-index.php', 'lw_hide_dashboard_notices' );
function lw_hide_dashboard_notices() {
	// ダッシュボードのadmin_noticesを全て除去
	remove_all_actions( 'admin_notices' );
	remove_all_actions( 'all_admin_notices' );
}
