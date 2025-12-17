<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ダッシュボード最上部にカスタム通知を表示
 * ------------------------------------------
 * ・管理者権限のみ
 */
add_action( 'admin_notices', 'lw_show_dashboard_notice' );
function lw_show_dashboard_notice() {

	// 権限チェック（任意）
	if ( ! current_user_can( 'administrator' ) ) {
		return;
	}

	

	// 画面チェック：ダッシュボードだけに限定
	$screen = get_current_screen();
	if ( $screen && 'dashboard' !== $screen->base ) {
		return;
	}
	if (!LW_EXPANSION_BASE ) {
		// アクティベート催促通知
		echo '
			<div class="notice notice-success is-dismissible">
				<p style="font-size:1.2em; line-height: 1.8em;"><strong style="font-size:1.5em;line-height: 1.8em;">🎉 LiteWord へようこそ！</strong><br>
				LiteWordの無料機能を最大限に利用するには『<strong>アクティベート設定</strong>』が必用です！<br>設定方法は<a href="https://youtu.be/A6yBGHkwAVI"  target="_blank" rel="noopener noreferrer"><span style="font-size:1.3em;">こちらの動画</span></a>でご確認いただけます。<br>たった３分で完了します🌟すごく簡単です！</p>
				<p style="margin-top: 1em;">
					<a href="https://shop.lite-word.com/register"   style="font-size:1.2em;"  class="button button-primary" target="_blank" rel="noopener noreferrer">新規登録</a>
					<a href="https://shop.lite-word.com/user_login" style="font-size:1.2em;" class="button"             style="margin-left:8px;" target="_blank" rel="noopener noreferrer">ログイン</a>
				</p>
			</div>
		';
	}
	//no-indexになっていたら、警告する
	if ( get_option( 'blog_public' ) == '0' ) {
		echo '
			<div class="notice notice-warning is-dismissible">
				<p style="font-size:1.2em; line-height: 1.8em;"><strong style="font-size:1.5em;line-height: 1.8em;">⚠️ 注意！</strong><br>
				現在、サイトが検索エンジンにインデックスされない設定になっています。<br>
				サイトを一般公開する場合は、<a href="' . admin_url( 'options-reading.php' ) . '">設定 > 表示設定</a> から「検索エンジンがサイトをインデックスしないようにする」のチェックを外してください。</p>
			</div>
		';
	}
}
