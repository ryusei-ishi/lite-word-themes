<?php
/**
 * LiteWord ─ マークダウンを貼って記事にする
 * ---------------------------------------------------------------
 * 投稿・固定ページの編集画面に「マークダウンを貼る」サイドバーを足す。
 *
 * 変換はすべてブラウザの中で終わる（サーバーには完成した本文を送らない）。
 * これは KSES が <picture>/<svg>/<iframe> を削り、バックスラッシュが1段
 * 剥がれる罠を構造的に避けるため。詳しくは
 * skills/sample-page-factory/SKILL.md の「5つの罠」。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LW_MD_PASTE_DIR', get_theme_file_path( '/functions/lw_markdown_paste/' ) );
define( 'LW_MD_PASTE_URL', get_theme_file_uri( '/functions/lw_markdown_paste/' ) );

/**
 * この画面でパネルを出してよいか
 *
 * @return bool
 */
function lw_md_paste_is_target_screen() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}
	$screen = get_current_screen();
	if ( ! $screen || ! $screen->is_block_editor() ) {
		return false;
	}
	if ( ! in_array( $screen->post_type, array( 'post', 'page' ), true ) ) {
		return false;
	}
	return current_user_can( 'edit_posts' );
}

/**
 * ファイルの更新時刻をバージョンにする（キャッシュ対策）
 *
 * @param string $rel テーマ内の相対パス
 * @return string
 */
function lw_md_paste_ver( $rel ) {
	$path = LW_MD_PASTE_DIR . $rel;
	return file_exists( $path ) ? (string) filemtime( $path ) : wp_get_theme()->get( 'Version' );
}

/**
 * ブロックエディタに読み込む
 */
function lw_md_paste_enqueue_block_editor_assets() {
	if ( ! lw_md_paste_is_target_screen() ) {
		return;
	}

	// 依存の順に登録する。後ろのファイルが前のファイルの window.LWMd* を使う。
	$modules = array(
		'frontmatter'   => array(),
		'directives'    => array(),
		'block-helpers' => array( 'wp-blocks' ),
		'inline-format' => array(),
		'sanitize'      => array( 'lw-md-paste-directives' ),
		'inspect'       => array( 'lw-md-paste-directives', 'lw-md-paste-inline-format' ),
		'blocks-cta'    => array( 'lw-md-paste-block-helpers', 'lw-md-paste-directives' ),
		'blocks'        => array( 'lw-md-paste-blocks-cta', 'lw-md-paste-frontmatter' ),
		'convert'       => array( 'wp-blocks', 'lw-md-paste-blocks', 'lw-md-paste-inline-format', 'lw-md-paste-sanitize', 'lw-md-paste-inspect' ),
		'apply-meta'    => array( 'wp-data', 'wp-api-fetch' ),
		'panel'         => array(
			'lw-md-paste-convert',
			'lw-md-paste-apply-meta',
			'wp-data',
			'wp-element',
			'wp-components',
			'wp-plugins',
			'wp-editor',
			'wp-block-editor',
		),
	);

	foreach ( $modules as $name => $deps ) {
		$rel = 'assets/js/' . $name . '.js';
		wp_enqueue_script(
			'lw-md-paste-' . $name,
			LW_MD_PASTE_URL . $rel,
			$deps,
			lw_md_paste_ver( $rel ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}

	wp_enqueue_style(
		'lw-md-paste-panel',
		LW_MD_PASTE_URL . 'assets/css/panel.css',
		array(),
		lw_md_paste_ver( 'assets/css/panel.css' )
	);
}
add_action( 'enqueue_block_editor_assets', 'lw_md_paste_enqueue_block_editor_assets' );
