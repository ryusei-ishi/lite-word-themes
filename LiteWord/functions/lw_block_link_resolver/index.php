<?php
/**
 * LiteWord – ブロックのリンク先を「固定ページID／カテゴリーID」から引き直す
 * ------------------------------------------------------------
 * ブロックは静的ブロックのまま。保存されている HTML には手を入れず、
 * 表示するときだけ href を最新の URL に差し替える。
 *
 * 🚨 なぜこの形か
 *  ・動的ブロック（render_callback）に作り替えると save の出力が変わるため、
 *    すでに使われている全ページで「ブロックが壊れています」が出る。それを避ける。
 *  ・エディタ側は選んだ時点の URL を href に焼いてあるので、
 *    このフィルタが効かない場面でもリンクは飛ぶ（保険）。
 *  ・スラッグやパーマリンク設定を後から変えても、表示は常に最新になる。
 *
 * 対象の目印（エディタが付ける）
 *   <a href="…" data-lw-link-type="page|category" data-lw-link-id="12">
 *
 * 対応ブロックを増やすときは lw_link_resolver_blocks() に足すか、
 * フィルタ 'lw_link_resolver_blocks' で追加する。
 * ----------------------------------------------------------- */

if ( ! defined( 'ABSPATH' ) ) exit;

/** リンクを引き直す対象のブロック */
function lw_link_resolver_blocks() {
	return apply_filters( 'lw_link_resolver_blocks', array(
		'wdl/cta-1',                           // CTA 01
		'wdl/cta-2',                           // CTA 02
		'wdl/fv-1',                            // 固定ページタイトル 01（トップ用）
		'wdl/fv-7',                            // 固定ページタイトル 07(トップ用・動画背景)
		'wdl/lw-banner-info-01',               // バナー 01（3カラム）
		'wdl/lw-banner-info-02',               // バナー 02（4カラム）
		'wdl/lw-banner-info-03',               // バナー 03（3カラム）
		'wdl/lw-banner-info-04',               // バナー 04（2カラム2行）
		'wdl/lw-banner-info-05',               // バナー 05（2カラム2行）
		'wdl/lw-button-01',                    // リンクボタン 01
		'wdl/lw-button-02',                    // リンクボタン 02
		'wdl/lw-button-03',                    // リンクボタン 03
		'wdl/lw-content-1',                    // Content 1
		'wdl/lw-content-2',                    // content 02
		'wdl/lw-content-8',                    // Content 08
		'wdl/lw-link-list-1',                  // link list 01
		'wdl/lw-pr-button-1',                  // PRボタン 01
		'wdl/lw-pr-button-2',                  // PRボタン 02
		'wdl/lw-pr-button-3',                  // PRボタン 03
		'wdl/lw-pr-button-4',                  // PRボタン 04
		'wdl/lw-pr-button-5',                  // PRボタン 05
		'wdl/lw-pr-button-6',                  // ボタン 06
		'wdl/lw-pr-content-9',                 // PR Content 9 カードスライダー
		'wdl/lw-pr-fv-13',                     // 固定ページタイトル 13(動画背景)
		'wdl/lw-pr-fv-14',                     // FV 14 ヘッダーまで回り込む全画背景
		'wdl/lw-pr-fv-15',                     // 固定ページタイトル 15(動画背景)
		'wdl/lw-pr-fv-16',                     // 固定ページタイトル 16(動画背景)
		'wdl/lw-pr-fv-18',                     // FV 18 リード獲得（フォーム一体型）
		'wdl/lw-pr-fv-19',                     // FV 19 リード獲得（電話とフォームの二択）
		'wdl/lw-pr-fv-20',                     // FV 20 リード獲得（実績の数字つき）
		'wdl/lw-pr-fv-21',                     // FV 21 リード獲得（もらえる物と締切）
		'wdl/lw-pr-fv-22',                     // FV 22 リード獲得（選んで進む入口）
		'wdl/lw-pr-fv-23',                     // FV 23 リード獲得（QRコードで登録）
		'wdl/lw-pr-image-0',                   // 画像 00
		'wdl/lw-pr-image-1',                   // PR画像グリッド 01
		'wdl/lw-pr-waku-1',                    // 枠 01
		'wdl/paid-block-content-3',            // Content 03
		'wdl/paid-block-content-4',            // Content 04
		'wdl/paid-block-content-6',            // Content 06
		'wdl/paid-block-content-7',            // Content 07
		'wdl/paid-block-cta-4',                // CTA 04
		'wdl/paid-block-fv-11',                // FV 11 背景画像スライダー
		'wdl/paid-block-fv-12',                // FV 12 ヘッダーまで回り込む全画背景
		'wdl/paid-block-fv-9',                 // FV 09 画像スライダー用ブロック
		'wdl/paid-block-image-1',              // 画像 01
		'wdl/paid-block-link-2',               // リンクリスト 2
		'wdl/paid-block-lw-button-4',          // リンクボタン 04
		'wdl/paid-block-lw-button-5',          // リンクボタン 05
		'wdl/paid-block-lw-step-6',            // step 06
		'wdl/shin-gas-station-01-button-01',   // リンクボタン 01 shin shop pattern 01
		'wdl/shin-gas-station-01-cta',         // CTA 1 shin shop pattern 01
		'wdl/shin-gas-station-01-cta2',        // CTA 2 shin shop pattern 01
		'wdl/shin-gas-station-01-list-1',      // インフォリスト 1 shin shop pattern 01
		'wdl/shin-gas-station-01-list-2',      // インフォリスト 2 shin shop pattern 01
		'wdl/shin-gas-station-01-list-4',      // インフォリスト 4 shin info pattern 01
		'wdl/shin-gas-station-01-news',        // お知らせ一覧 1 shin shop pattern 01
		'wdl/shin-gas-station-01-post-list',   // 投稿一覧 1 shin shop pattern 01
	) );
}

add_filter( 'render_block', 'lw_resolve_block_links', 10, 2 );
function lw_resolve_block_links( $content, $block ) {
	if ( empty( $block['blockName'] ) ) return $content;
	if ( ! in_array( $block['blockName'], lw_link_resolver_blocks(), true ) ) return $content;
	// 目印が無いブロック（＝URL直接指定だけ）は一切触らない
	if ( strpos( $content, 'data-lw-link-type' ) === false ) return $content;

	return preg_replace_callback( '/<a\s[^>]*>/i', 'lw_resolve_link_tag', $content );
}

/** <a …> の開始タグ1つぶんを受け取って href を差し替える */
function lw_resolve_link_tag( $m ) {
	$tag = $m[0];
	if ( strpos( $tag, 'data-lw-link-type' ) === false ) return $tag;
	if ( ! preg_match( '/data-lw-link-type="([a-z]+)"/i', $tag, $t ) ) return $tag;
	if ( ! preg_match( '/data-lw-link-id="(\d+)"/i', $tag, $i ) ) return $tag;

	$type = strtolower( $t[1] );
	$id   = (int) $i[1];
	if ( $id <= 0 ) return $tag;

	$url = lw_resolve_link_url( $type, $id );
	// 見つからない（消された・非公開になった）ときは、焼いてある URL のままにする
	if ( $url === '' ) return $tag;

	if ( preg_match( '/\shref="[^"]*"/i', $tag, $h ) ) {
		// str_replace を使う。preg_replace だと URL 内の $ や \ が置換記号として解釈される
		$tag = str_replace( $h[0], ' href="' . esc_url( $url ) . '"', $tag );
	} else {
		$tag = substr_replace( $tag, '<a href="' . esc_url( $url ) . '"', 0, 2 );
	}
	return $tag;
}

/** 種別とIDから URL を引く。引けなければ空文字 */
function lw_resolve_link_url( $type, $id ) {
	if ( $type === 'page' ) {
		$post = get_post( $id );
		if ( ! $post || $post->post_status !== 'publish' ) return '';
		$url = get_permalink( $id );
		return $url ? $url : '';
	}
	if ( $type === 'category' ) {
		$term = get_term( $id, 'category' );
		if ( ! $term || is_wp_error( $term ) ) return '';
		$url = get_category_link( $id );
		return is_wp_error( $url ) ? '' : $url;
	}
	return '';
}
