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
		'wdl/lw-pr-button-6',   // ボタン 06
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
