<?php
if ( !defined( 'ABSPATH' ) ) exit;

/* ───────────────────────────────────────────────
 * LiteWord ─ テンプレート管理メニュー
 *  ・メイン　　 : 一覧
 *  ・サブメニュー: テンプレ購入（外部リンク / 新規タブ）
 *  ・サブメニュー: 購入済みデータの反映処理
 * ──────────────────────────────────────────── */

/* 共通関数の読み込み */
get_template_part( './functions/lw_template_management/lw_template_functions' );

/* メニュー登録 */
add_action( 'admin_menu', 'template_activate_management_menu' );
function template_activate_management_menu() {

	/* メインメニュー：一覧 */
	add_menu_page(
		'データ反映処理',
		'Lwデータ反映処理',
		'manage_options',
		'lw_template_management',
		'lw_template_management_active',
		'dashicons-admin-generic',
		24
	);

	/* サブメニュー ①：テンプレ購入（外部サイトへ） */
	// ここではダミーのコールバックで登録し、JS で href と target を書き換える
	add_submenu_page(
		'lw_template_management',
		'契約状態の確認・変更',
		'契約状態の確認・変更',
		'manage_options',
		'lw_template_management_purchase',
		'__return_null'       // 何も表示しないダミー
	);


}

/* 反映処理ページ */
function lw_template_management_active() {

	if ( ! isset( $_GET['activate_page'] ) ) {

		get_template_part( './functions/lw_template_management/lw_template_activate' );

	} elseif ( $_GET['activate_page'] === 'json' ) {

		get_template_part( './functions/lw_template_management/lw_template_activate_json' );
	}
}

/* --------------------------------------------------------------
 * サブメニュー「契約状態の確認・変更」をクリックでログインポップアップを表示
 * ----------------------------------------------------------- */
add_action( 'admin_footer', 'lw_template_purchase_link_replace' );
function lw_template_purchase_link_replace() {
	?>
	<script>
	(function() {
		// ページ読み込み完了後に実行
		document.addEventListener( 'DOMContentLoaded', function () {
			var link = document.querySelector( 'a[href="admin.php?page=lw_template_management_purchase"]' );
			if ( link ) {
				link.href = '#';
				link.setAttribute('data-lw-shop-action', 'login');
				link.setAttribute('data-redirect', '/account/');
			}
		});
	})();
	</script>
	<?php
}

/* --------------------------------------------------------------
 * 管理バーにLiteWordステータスを表示（色付き版）
 * ----------------------------------------------------------- */
function add_liteword_status_to_admin_bar($wp_admin_bar) {
    // プレミアムかフリーかで表示を切り替え
    if (defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true) {
        $title = '<span style="color: #FFD700;">LiteWordプレミアム</span>';
    } else {
        $title = '<span style="color: #999;">LiteWordフリー</span>';
    }
    
    $wp_admin_bar->add_node(array(
        'id'    => 'liteword-status',
        'title' => $title,
        'href'  => '#',
        'parent' => 'top-secondary',  // これで右側に表示
        'meta'  => array(
            'class' => 'lw-shop-login-trigger',
            'onclick' => 'return false;'  // デフォルト動作を防止
        )
    ));
}
add_action('admin_bar_menu', 'add_liteword_status_to_admin_bar', 20);