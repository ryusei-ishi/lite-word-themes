<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 投稿・固定ページの設定（投稿メタ）の守り（2026-11-02 再チェック R1）
 *
 * テーマの投稿・固定ページの設定は、名前が _ で始まらない投稿メタに入っている
 * （seo_custom_head・lw_custom_css・ttl_main・color_main など）。
 * WordPress は _ で始まらないメタを「保護されていない」と見なすので、投稿を編集できる人なら誰でも
 * 標準の「カスタムフィールド」（admin-ajax の add-meta）や XML-RPC から、生の値で書けた。
 * テーマの保存（形の確かめ・kses）を通らないため、寄稿者が自分の下書きに入れた値で、
 * 管理者がプレビューした画面に JS を仕込めた（投稿者なら公開して訪問者全員にも）。
 *
 * ① テーマの欄を「保護されたメタ」にする
 *    → 標準のカスタムフィールドの欄・add-meta・XML-RPC からは誰も書けない・欄にも出ない。
 *      テーマの入力フォームの保存は update_post_meta() で書くので今までどおり。
 * ② 出すときも形を確かめる（下の lw_is_safe_css_color() などを、出す側のテンプレートで使う）
 *    → ①より前に入っていた値や、ほかのプラグインの口から入った値も効かない。
 *
 * このファイルは管理画面だけでなく表側・XML-RPC でも読み込む（XML-RPC は is_admin() が false）。
 * =============================================================== */

/**
 * テーマが入力フォームで扱い、テンプレートで出す投稿メタのキー（_ で始まらないもの）。
 * 新しい欄を足したら、ここにも足すこと。
 * 「このキーは標準のカスタムフィールドでも書きたい」場合は、フィルタ lw_protected_post_meta_keys で外せる。
 *
 * @return array<string,bool> キー => true
 */
function lw_theme_protected_post_meta_keys() {
	static $keys = null;
	if ( $keys !== null ) {
		return $keys;
	}
	$list = array(
		'color_1', 'color_2', 'color_3', 'color_accent', 'color_content_bg_pc', 'color_content_bg_sp',
		'color_main', 'color_page_bg_pc', 'color_page_bg_pc_opacity', 'color_page_bg_sp', 'color_return_btn',
		'color_sub', 'color_text', 'comment_page_switch', 'drawer_menu_select', 'drawer_page_switch',
		'follow_bottom_cta_ptn', 'font_body', 'font_body_weight', 'font_size_pc', 'font_size_sp', 'font_size_tb',
		'footer_menu_select', 'footer_select', 'fv_filter_color', 'fv_filter_opacity', 'fv_image',
		'fv_image_ratio', 'fv_image_sp', 'fv_select', 'header_menu_select', 'header_page_cta_color_bg',
		'header_select', 'loading_anime_page_switch', 'logo_footer_page_img', 'logo_footer_page_size_pc',
		'logo_footer_page_size_sp', 'logo_footer_page_size_tb', 'logo_footer_page_switch', 'logo_footer_page_text',
		'logo_footer_page_url', 'logo_footer_text_font_family', 'logo_footer_text_font_weight',
		'logo_header_page_img', 'logo_header_page_size_pc', 'logo_header_page_size_sp', 'logo_header_page_size_tb',
		'logo_header_page_switch', 'logo_header_page_text', 'logo_header_page_url', 'logo_text_font_family',
		'logo_text_font_weight', 'lw_custom_css', 'lw_custom_json_ld', 'lw_page_animation_switch',
		'lw_page_bg_img', 'max_width_clm_1', 'padding_lr_set', 'padding_tb_set', 'page_comment',
		'page_content_shadow', 'page_pickup_menu_page_switch', 'page_title_display', 'pr_notice_page_switch',
		'seo_301_redirect_url', 'seo_canonical', 'seo_custom_footer', 'seo_custom_head', 'seo_description',
		'seo_noindex', 'seo_og_image', 'seo_title', 'toc_page_switch', 'ttl_btm_p', 'ttl_main', 'ttl_sub',
	);
	$list = apply_filters( 'lw_protected_post_meta_keys', $list );
	$keys = array();
	foreach ( (array) $list as $key ) {
		if ( is_string( $key ) && $key !== '' ) {
			$keys[ $key ] = true;
		}
	}
	return $keys;
}

add_filter( 'is_protected_meta', 'lw_protect_theme_post_meta', 10, 3 );
/**
 * テーマの欄を「保護されたメタ」にする（標準のカスタムフィールド・add-meta・XML-RPC から書けなくする）。
 *
 * @param bool        $protected  ほかで決まった値
 * @param string      $meta_key   メタのキー
 * @param string|null $meta_type  'post' など
 * @return bool
 */
function lw_protect_theme_post_meta( $protected, $meta_key, $meta_type = null ) {
	if ( $protected || $meta_type !== 'post' || ! is_string( $meta_key ) ) {
		return $protected;
	}
	$keys = lw_theme_protected_post_meta_keys();
	return isset( $keys[ $meta_key ] ) ? true : $protected;
}

/* ---------------------------------------------------------------
 * 出すときの確かめ（表側でも使えるようにここに置く）
 * ------------------------------------------------------------- */

if ( ! function_exists( 'lw_is_safe_css_color' ) ) {
	/**
	 * CSS の色として安全か（#rgb〜#rrggbbaa・rgb()/rgba()/hsl()/hsla() の数字だけ・transparent）。
	 * （2.6.0 では custom_post/post.php にあったが、post.php は管理画面でしか読まないので、表側でも使えるようにここへ移した）
	 *
	 * @param string $value
	 * @return bool
	 */
	function lw_is_safe_css_color( $value ) {
		$value = trim( (string) $value );
		if ( $value === 'transparent' ) {
			return true;
		}
		if ( preg_match( '/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $value ) ) {
			return true;
		}
		return (bool) preg_match( '/^(?:rgba?|hsla?)\(\s*[0-9.%\s,\/]+\)$/i', $value );
	}
}

/**
 * 投稿メタの色。安全な色でなければ ''（未設定と同じ扱い）。
 * '#ada993'（色の欄の「未設定」の印）はそのまま返す（呼ぶ側が今までどおり判定する）。
 *
 * @param int    $post_id
 * @param string $key
 * @return string
 */
function lw_meta_color( $post_id, $key ) {
	$value = trim( (string) get_post_meta( $post_id, $key, true ) );
	if ( $value === '' ) {
		return '';
	}
	return lw_is_safe_css_color( $value ) ? $value : '';
}

/**
 * 投稿メタの CSS の長さ（例 1120px・80%）。形が違えば ''。
 *
 * @param int    $post_id
 * @param string $key
 * @return string
 */
function lw_meta_css_length( $post_id, $key ) {
	$value = trim( (string) get_post_meta( $post_id, $key, true ) );
	if ( $value === '' ) {
		return '';
	}
	return preg_match( '/^\d{1,5}(?:\.\d{1,3})?(?:px|%|em|rem|vw|vh)?$/', $value ) ? $value : '';
}

/**
 * 数字（小数を含む）だけを返す。数字でなければ $default。
 *
 * @param mixed  $value
 * @param string $default
 * @return string
 */
function lw_meta_number( $value, $default = '' ) {
	$value = trim( (string) $value );
	return ( $value !== '' && is_numeric( $value ) ) ? $value : (string) $default;
}

/**
 * <style> の中に入れる CSS から、style 要素を閉じる文字列を無害にする。
 * （</style のあとに書いたタグが HTML として動くのを止める。普通の CSS には影響しない）
 *
 * @param string $css
 * @return string
 */
function lw_css_for_style_tag( $css ) {
	return (string) preg_replace( '#<(\s*)/(\s*)style#i', '<$1\\\\/$2style', (string) $css );
}

/**
 * ロゴの文字（固定ページの設定）で使ってよいタグ。保存（custom_post/page.php）と出す側で同じものを使う。
 *
 * @return array
 */
function lw_logo_text_allowed_tags() {
	return array(
		'a'      => array( 'href' => array(), 'title' => array(), 'target' => array() ),
		'span'   => array(
			'class'            => array(),
			'style'            => array(),
			'data-lw_font_set' => array(),
		),
		'mark'   => array( 'style' => array() ),
		'br'     => array(),
		'b'      => array(),
		'strong' => array(),
		'i'      => array(),
		'em'     => array(),
		'u'      => array(),
		'small'  => array(),
		'sup'    => array(),
		'sub'    => array(),
	);
}
