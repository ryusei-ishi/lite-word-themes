<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ==================================================
 *  共通ヘルパ
 * =================================================*/

/**
 * 「計測タグを出力してよいか」を判定するヘルパ
 *
 * ・管理者または編集者の場合だけ、カスタマイザーの
 *   「SEO設定 › 管理者計測スイッチ」で ON/OFF を切り替える
 * ・それ以外の権限（購読者・寄稿者・未ログインなど）は常に計測
 *
 * @return bool  true  = 計測タグを出力する  
 *               false = 出力しない
 */
function lw_should_track() : bool {

	// カスタマイザー値：'on'（計測する） / 'off'（計測しない）
	$admin_switch = get_theme_mod( 'seo_set_admin_switch', 'on' );

	// 管理者 or 編集者 かつ スイッチが off ⇒ 計測しない
	if ( $admin_switch === 'off' && ( current_user_can( 'administrator' ) || current_user_can( 'editor' ) ) ) {
		return false;
	}

	// それ以外は計測
	return true;
}


/* ==================================================
 *  Google Tag Manager
 * =================================================*/

/**
 * <head> 内へインライン GTM スニペットを 1 回だけ出力
 */
function lw_gtm_head() : void {
	if ( ! lw_should_track() ) {
		return;
	}

	$gtm_id = sanitize_text_field( get_theme_mod( 'seo_set_gtm_id', '' ) );
	if ( empty( $gtm_id ) ) {
		return;
	}
	?>
	<!-- Google Tag Manager -->
	<script>
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','<?php echo esc_js( $gtm_id ); ?>');
	</script>
	<!-- End Google Tag Manager -->
	<?php
}
add_action( 'wp_head', 'lw_gtm_head', 1 );

/**
 * <body> 直後へ noscript タグを出力
 */
function lw_gtm_noscript() : void {
	if ( ! lw_should_track() ) {
		return;
	}

	$gtm_id = sanitize_text_field( get_theme_mod( 'seo_set_gtm_id', '' ) );
	if ( empty( $gtm_id ) ) {
		return;
	}
	?>
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_attr( $gtm_id ); ?>"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
	<?php
}
add_action( 'wp_body_open', 'lw_gtm_noscript' );

/* ==================================================
 *  Google Analytics 4（必要な場合のみ）
 * =================================================*/

/**
 * GA4 用 gtag.js を読み込む（ID が設定されているときだけ）
 *
 * ※ GTM コンテナで GA4 を管理するなら ID を空にしておくこと
 */
function lw_enqueue_ga4() : void {
	if ( ! lw_should_track() ) {
		return;
	}

	$ga_id = sanitize_text_field( get_theme_mod( 'seo_set_google_analytics_id', '' ) );
	if ( empty( $ga_id ) ) {
		return;
	}

	// gtag.js（head で読み込み）
	wp_enqueue_script(
		'lw-gtag-js',
		sprintf( 'https://www.googletagmanager.com/gtag/js?id=%s', rawurlencode( $ga_id ) ),
		[],
		null,
		false
	);

	// 初期設定をインラインで
	wp_add_inline_script(
		'lw-gtag-js',
		"window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '" . esc_js( $ga_id ) . "');"
	);
}
add_action( 'wp_enqueue_scripts', 'lw_enqueue_ga4', 0 );
