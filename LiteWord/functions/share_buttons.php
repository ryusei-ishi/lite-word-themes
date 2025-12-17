<?php
if ( !defined( 'ABSPATH' ) ) exit;
// ──────────────────────────────────────────
// 1) ボタン定義を返すヘルパー  （static で一度だけ生成）
// ──────────────────────────────────────────
function lw_get_share_buttons(): array {
	static $buttons = null;
	if ( $buttons !== null ) return $buttons;

	$buttons = [
		// 投稿系
		'x'         => [ 'label' => 'シェア',      'aria' => 'X でポスト',           'icon' => 'x',         'enabled' => true ],
		'facebook'  => [ 'label' => 'Share',      'aria' => 'Facebook でシェア',    'icon' => 'facebook',  'enabled' => true ],
		'line'      => [ 'label' => 'LINE',       'aria' => 'LINE で送る',          'icon' => 'line',      'enabled' => true ],
		'linkedin'  => [ 'label' => 'LinkedIn',   'aria' => 'LinkedIn でシェア',    'icon' => 'linkedin',  'enabled' => true ],
		'hatena'    => [ 'label' => 'B! Bookmark','aria' => 'はてなブックマーク',    'icon' => 'hatena',    'enabled' => true ],
		'pocket'    => [ 'label' => 'Pocket',     'aria' => 'Pocket に保存',        'icon' => 'pocket',    'enabled' => true ],
		'reddit'    => [ 'label' => 'Reddit',     'aria' => 'Reddit でシェア',      'icon' => 'reddit',    'enabled' => true ],
		'pinterest' => [ 'label' => 'Pinterest',  'aria' => 'Pinterest へ保存',     'icon' => 'pinterest', 'enabled' => true ],
		'tumblr'    => [ 'label' => 'Tumblr',     'aria' => 'Tumblr でシェア',      'icon' => 'tumblr',    'enabled' => true ],
		'telegram'  => [ 'label' => 'Telegram',   'aria' => 'Telegram で送信',      'icon' => 'telegram',  'enabled' => true ],
		'whatsapp'  => [ 'label' => 'WhatsApp',   'aria' => 'WhatsApp で送信',      'icon' => 'whatsapp',  'enabled' => true ],
		'mastodon'  => [ 'label' => 'Mastodon',   'aria' => 'Mastodon でシェア',    'icon' => 'mastodon',  'enabled' => true ],
		'mail'     => [ 'label' => 'Email',      'aria' => 'メールで送信',         'icon' => 'mail',     'enabled' => true ],
		// ユーティリティ
		'copy'      => [ 'label' => 'Copy URL',   'aria' => 'リンクをコピー',       'icon' => 'copy',      'enabled' => true ],
	];
	return $buttons;
}

// ──────────────────────────────────────────
// 2) ボタン 1 個を出力する関数
//    ※ すでに存在しないかチェックしてから宣言
// ──────────────────────────────────────────
if ( ! function_exists( 'lw_render_share_button' ) ) {
	function lw_render_share_button( string $type ): string {
		$buttons = lw_get_share_buttons();

		if ( empty( $buttons[ $type ] ) || empty( $buttons[ $type ]['enabled'] ) ) {
			return ''; // 未定義 or 無効
		}
		$d = $buttons[ $type ];

		ob_start(); ?>
		<button class="lw_share <?php echo esc_attr( $type ); ?>"
		        data-type="<?php echo esc_attr( $type ); ?>"
		        aria-label="<?php echo esc_attr( $d['aria'] ); ?>">
			<div class="icon">
				<?php get_template_part( 'assets/image/icon/' . $d['icon'] ); ?>
			</div>
			<span class="text"><?php echo esc_html( $d['label'] ); ?></span>
		</button>
		<?php
		return ob_get_clean();
	}
}
