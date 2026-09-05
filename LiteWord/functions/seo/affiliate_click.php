<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 広告リンク（アフィリエイト）のクリック計測
 * ==================================================================
 * どのリンクが押されたか分からないと、順番も文言も直しようがない。
 * Google アナリティクスのタグはもともとテーマに入っているが、
 * **イベントは1つも送っていなかった**ので、ここで足す。
 *
 * 🚨 見るのは `rel="sponsored"` が付いたリンクだけ。
 *    これ1つで、今日入れたものが全部かかる:
 *      ・ボタン系ブロック11種の「広告リンク」設定
 *      ・商品リンク 01 / ランキング 01 のお店のボタン
 *      ・文中リンクの「広告リンク」の書式ボタン
 *    ブロックごとに仕込むより漏れがない。
 *
 * 🚨 送るのは URL・ドメイン・リンクの文字だけ。個人を特定するものは送らない。
 *
 * 出さない条件（どれか1つでも当てはまれば何も出力しない）
 *   ・カスタマイザーで「計測しない」にしている
 *   ・アナリティクスID も タグマネージャーID も未設定（送り先が無い）
 *   ・lw_should_track() が false（管理者・編集者を計測から外す設定）
 *
 * 設定 → functions/customizer/analysis.php の「広告リンクのクリック計測」
 */

/** 計測スクリプトを出してよいか */
function lw_affiliate_click_enabled() : bool {
	if ( is_admin() ) {
		return false;
	}
	if ( get_theme_mod( 'seo_set_affiliate_click_switch', 'on' ) === 'off' ) {
		return false;
	}
	if ( function_exists( 'lw_should_track' ) && ! lw_should_track() ) {
		return false;
	}
	// 送り先が無いなら出さない
	$ga  = trim( (string) get_theme_mod( 'seo_set_google_analytics_id', '' ) );
	$gtm = trim( (string) get_theme_mod( 'seo_set_gtm_id', '' ) );

	return ( $ga !== '' || $gtm !== '' );
}

/**
 * フッターに1本だけ置く。
 * リンクは記事中に何本あってもよいので、1つずつではなく document で受ける（委譲）。
 */
function lw_affiliate_click_script() : void {
	if ( ! lw_affiliate_click_enabled() ) {
		return;
	}

	/* 🚨 送り先は PHP 側で決める。
	   JS で「gtag があれば gtag、無ければ dataLayer」と分けていたが、
	   タグマネージャーだけのサイトでは GTM のコンテナが読み込まれたあとに
	   window.gtag が生えることがある。**押した時刻によって送り先が変わり、
	   同じサイトの数が2か所に割れる。**
	   アナリティクスIDが入っていれば gtag.js は必ず出ていて、
	   function gtag(){} は head のインラインで先に定義される
	   （functions/seo/google.php）。だから ID の有無だけで決めきれる。 */
	$lw_ac_use_gtag = trim( (string) get_theme_mod( 'seo_set_google_analytics_id', '' ) ) !== '';
	?>
<script>
(function () {
	var SEL = 'a[rel~="sponsored"]';
	/* true = アナリティクスIDあり（gtag へ） / false = タグマネージャーだけ（dataLayer へ） */
	var USE_GTAG = <?php echo $lw_ac_use_gtag ? 'true' : 'false'; ?>;

	function send( a ) {
		var url  = a.href || '';
		var text = ( a.textContent || '' ).replace( /\s+/g, ' ' ).trim().slice( 0, 100 );
		var host = '';
		try { host = new URL( url, location.href ).hostname; } catch ( e ) {}

		var p = { link_url: url, link_domain: host, link_text: text };

		/* 送り先は上で決めてある。両方に送ると GA4 で二重に数えるので必ず片方だけ。 */
		if ( USE_GTAG ) {
			if ( typeof window.gtag === 'function' ) {
				window.gtag( 'event', 'affiliate_click', p );
			}
		} else if ( window.dataLayer && typeof window.dataLayer.push === 'function' ) {
			window.dataLayer.push( { event: 'affiliate_click', link_url: p.link_url, link_domain: p.link_domain, link_text: p.link_text } );
		}
	}

	function onClick( e ) {
		if ( ! e.target || ! e.target.closest ) { return; }
		var a = e.target.closest( SEL );
		if ( a ) { send( a ); }
	}

	/* 別タブで開く設定でも取りこぼさないように、captureで受ける。
	   ホイールクリック（新しいタブで開く）も拾う。 */
	document.addEventListener( 'click', onClick, true );
	document.addEventListener( 'auxclick', function ( e ) { if ( e.button === 1 ) { onClick( e ); } }, true );
})();
</script>
	<?php
}
add_action( 'wp_footer', 'lw_affiliate_click_script', 20 );
