<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LWマイパーツ本文を呼び出すショートコード
 * 使い方: [my_parts_content id="123" show_draft="true"]
 */

// ★ CSS/JS出力用のグローバル配列
global $lw_my_parts_styles;
global $lw_my_parts_scripts;
if ( ! isset( $lw_my_parts_styles ) ) {
	$lw_my_parts_styles = array();
}
if ( ! isset( $lw_my_parts_scripts ) ) {
	$lw_my_parts_scripts = array();
}

/**
 * ★ ページ読み込み前にマイパーツのショートコードをスキャンしてCSS/JSを事前取得
 */
add_action( 'wp', 'lw_preload_my_parts_assets' );
function lw_preload_my_parts_assets() {
	// 管理画面では実行しない
	if ( is_admin() ) {
		return;
	}

	global $lw_my_parts_styles;
	global $lw_my_parts_scripts;
	global $post;

	// 投稿がない場合は終了
	if ( ! $post ) {
		return;
	}

	// 投稿コンテンツからマイパーツのショートコードを検出
	$content = $post->post_content;

	// [my_parts_content id="xxx"] パターンを検索
	if ( preg_match_all( '/\[my_parts_content[^\]]*id=["\']?(\d+)["\']?[^\]]*\]/', $content, $matches ) ) {
		foreach ( $matches[1] as $parts_id ) {
			$parts_id = absint( $parts_id );
			if ( ! $parts_id ) {
				continue;
			}

			// 既に処理済みならスキップ
			if ( isset( $lw_my_parts_styles[ $parts_id ] ) ) {
				continue;
			}

			$parts_post = get_post( $parts_id );
			if ( ! $parts_post || 'lw_my_parts' !== $parts_post->post_type ) {
				continue;
			}

			// コードエディタモードのみ処理
			$editor_mode = get_post_meta( $parts_id, '_lw_editor_mode', true );
			if ( 'code' !== $editor_mode ) {
				continue;
			}

			// CSS取得
			$custom_css = get_post_meta( $parts_id, '_lw_custom_css', true );
			if ( ! empty( $custom_css ) ) {
				$lw_my_parts_styles[ $parts_id ] = $custom_css;
			}

			// JS取得
			$custom_js = get_post_meta( $parts_id, '_lw_custom_js', true );
			if ( ! empty( $custom_js ) ) {
				$lw_my_parts_scripts[ $parts_id ] = $custom_js;
			}
		}
	}
}

/**
 * ★ wp_headでCSSを<head>内に出力
 */
add_action( 'wp_head', 'lw_output_my_parts_styles', 999 );
function lw_output_my_parts_styles() {
	global $lw_my_parts_styles;

	// CSSが1つも登録されていない場合は何もしない
	if ( empty( $lw_my_parts_styles ) || ! is_array( $lw_my_parts_styles ) ) {
		return;
	}

	// 登録されているすべてのCSSを出力
	foreach ( $lw_my_parts_styles as $post_id => $css_code ) {
		if ( ! empty( $css_code ) ) {
			echo "\n<!-- LW MyParts CSS (ID: " . esc_html( $post_id ) . ") -->\n";
			echo '<style id="lw-myparts-css-' . esc_attr( $post_id ) . '">' . "\n";
			echo $css_code . "\n";
			echo '</style>' . "\n";
		}
	}
}

/**
 * ★ wp_footerでJavaScriptを</body>直前に出力
 */
add_action( 'wp_footer', 'lw_output_my_parts_scripts', 999 );
function lw_output_my_parts_scripts() {
	global $lw_my_parts_scripts;

	// JavaScriptが1つも登録されていない場合は何もしない
	if ( empty( $lw_my_parts_scripts ) || ! is_array( $lw_my_parts_scripts ) ) {
		return;
	}

	// 登録されているすべてのJavaScriptを出力
	foreach ( $lw_my_parts_scripts as $post_id => $js_code ) {
		if ( ! empty( $js_code ) ) {
			echo "\n<!-- LW MyParts JS (ID: " . esc_html( $post_id ) . ") -->\n";
			echo '<script id="lw-myparts-js-' . esc_attr( $post_id ) . '">' . "\n";
			echo $js_code . "\n";
			echo '</script>' . "\n";
		}
	}
}

/**
 * ★ ショートコード本体（HTMLのみ出力）
 */
function lw_shortcode_my_parts_content( $atts ) {
	global $lw_my_parts_styles;
	global $lw_my_parts_scripts;

	$atts = shortcode_atts(
		[
			'id'         => 0,        // 取得したい投稿の ID
			'show_draft' => 'true',   // ドラフトも表示するとき true
		],
		$atts,
		'my_parts_content'
	);

	$post_id = absint( $atts['id'] );
	if ( ! $post_id ) {
		return '';                 // ID 未指定
	}

	$post = get_post( $post_id );
	if ( ! $post || 'lw_my_parts' !== $post->post_type ) {
		return '';                 // 投稿タイプ違い
	}

	// ドラフトを一般公開したくない場合はここで制御
	if ( 'draft' === $post->post_status && 'true' !== $atts['show_draft'] ) {
		return '';
	}

	// エディタモードを確認
	$editor_mode = get_post_meta( $post_id, '_lw_editor_mode', true );

	// 全幅設定を確認
	$full_width = get_post_meta( $post_id, '_lw_full_width', true );
	$is_full_width = ( $full_width === 'on' );

	// コードエディタモードの場合
	if ( 'code' === $editor_mode ) {
		$custom_html = get_post_meta( $post_id, '_lw_custom_html', true );
		$custom_css = get_post_meta( $post_id, '_lw_custom_css', true );
		$custom_js = get_post_meta( $post_id, '_lw_custom_js', true );

		$output = '';

		// ★ CSSは事前スキャンで取得できなかった場合のみ登録（フォールバック）
		// 例：ウィジェットやテンプレートパーツからの呼び出し時
		if ( ! empty( $custom_css ) && ! isset( $lw_my_parts_styles[ $post_id ] ) ) {
			// wp_headが既に実行済みの場合はインラインで出力
			if ( did_action( 'wp_head' ) ) {
				$output .= '<style id="lw-myparts-css-' . esc_attr( $post_id ) . '">' . $custom_css . '</style>';
			} else {
				$lw_my_parts_styles[ $post_id ] = $custom_css;
			}
		}

		// HTMLを出力
		if ( ! empty( $custom_html ) ) {
			// ★ 全幅ONの時だけdivで囲む
			if ( $is_full_width ) {
				$output .= '<div class="lw_width_full_on">' . $custom_html . '</div>';
			} else {
				// ★ 全幅OFFの時はそのまま出力（divで囲まない）
				$output .= $custom_html;
			}
		}

		// ★ JSは事前スキャンで取得できなかった場合のみ登録（フォールバック）
		if ( ! empty( $custom_js ) && ! isset( $lw_my_parts_scripts[ $post_id ] ) ) {
			$lw_my_parts_scripts[ $post_id ] = $custom_js;
		}

		return $output;
	}

	// 通常モード: Gutenberg ブロック等のフィルターも通す
	$content = apply_filters( 'the_content', $post->post_content );

	// ★ 通常モードでも全幅ONの時だけdivで囲む
	if ( $is_full_width && ! empty( $content ) ) {
		$content = '<div class="lw_width_full_on">' . $content . '</div>';
	}
	// ★ 全幅OFFの時は $content をそのまま返す（divで囲まない）

	return $content;
}
add_shortcode( 'my_parts_content', 'lw_shortcode_my_parts_content' );
