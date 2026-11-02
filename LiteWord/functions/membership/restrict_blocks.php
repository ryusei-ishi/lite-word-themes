<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（WordPress 標準のブロック）
 *
 * restrict_front.php はページの表示、restrict_api.php は REST（posts・pages）と RSS を止めている。
 * それ以外に、WordPress 標準のブロックが会員限定の記事の本文を出していた（2026-11-02 再点検 R7・手元で確かめ済み）。
 *   ① 最新の投稿（core/latest-posts）… 「抜粋」「全文」を出す設定にすると、会員限定の記事の本文が誰にでも出る
 *   ② クエリーループの本文・抜粋（core/post-content・core/post-excerpt）… 同じ
 *   ③ /wp/v2/block-renderer … 上のブロックをサーバーで描かせる REST。寄稿者でも呼べる
 *
 * どれもブロックの描画の関数（render_callback）を包んで止める（③も同じ関数を通るので一緒に止まる）。
 *   - 見てよいかは REST と同じ lw_membership_rest_can_read()（会員の権限がある人・管理者・その記事を編集できる人）
 *   - ①は本文・抜粋の所だけを空にする（題名・リンク・画像・日付は今までどおり。一覧の決まりと同じ）
 *   - ②は、見られない記事のときだけブロックごと空にする（ほかの記事は今までどおり）
 * 単一の記事の画面（ログインのお願い）と、テーマの一覧の抜粋の動きはここでは触らない。
 * =============================================================== */

add_filter( 'register_block_type_args', 'lw_membership_wrap_core_block_render', 10, 2 );
/**
 * 本文・抜粋を出す標準のブロックの描画を包む
 *
 * @param array  $args       ブロックの登録の引数
 * @param string $block_type ブロック名
 * @return array
 */
function lw_membership_wrap_core_block_render( $args, $block_type ) {

	$targets = array( 'core/latest-posts', 'core/post-content', 'core/post-excerpt' );
	if ( ! in_array( $block_type, $targets, true ) || empty( $args['render_callback'] ) || ! is_callable( $args['render_callback'] ) ) {
		return $args;
	}

	$original                = $args['render_callback'];
	$args['render_callback'] = static function ( $attributes, $content = '', $block = null ) use ( $original, $block_type ) {
		return lw_membership_render_core_block( $block_type, $original, $attributes, $content, $block );
	};

	return $args;
}

/**
 * 包んだ描画の本体
 *
 * @param string        $block_type ブロック名
 * @param callable      $original   もとの描画の関数
 * @param array         $attributes ブロックの設定
 * @param string        $content    中身
 * @param WP_Block|null $block      ブロック
 * @return string
 */
function lw_membership_render_core_block( $block_type, $original, $attributes, $content, $block ) {

	if ( 'core/latest-posts' === $block_type ) {
		lw_membership_latest_posts_guard( true );
		try {
			return call_user_func( $original, $attributes, $content, $block );
		} finally {
			lw_membership_latest_posts_guard( false );
		}
	}

	// core/post-content・core/post-excerpt … どの記事かはブロックの文脈（postId）にある
	$post_id = ( $block instanceof WP_Block && isset( $block->context['postId'] ) ) ? (int) $block->context['postId'] : 0;
	if ( $post_id > 0 ) {
		$post = get_post( $post_id );
		if ( $post && ! lw_membership_rest_can_read( $post ) ) {
			return '';
		}
	}

	return call_user_func( $original, $attributes, $content, $block );
}

/**
 * 最新の投稿ブロックを描いている間だけ、見られない記事を「パスワードで守られた記事」として扱わせる
 *
 * core/latest-posts は本文・抜粋を出す前に post_password_required() を見て、真なら本文の代わりに
 * 「このコンテンツはパスワードで保護されています。」を出す（本文は読まない）。
 * それを使って本文を止め、その一文だけを空にする（gettext）。
 * ⚠️ WordPress がその一文を変えても、本文が出ないことは変わらない（一文が出るだけ）。
 *
 * @param bool $on 描き始めなら true・描き終わりなら false（入れ子でも数えて戻す）
 * @return void
 */
function lw_membership_latest_posts_guard( $on ) {
	static $depth = 0;

	if ( $on ) {
		if ( 0 === $depth++ ) {
			add_filter( 'post_password_required', 'lw_membership_latest_posts_password', 10, 2 );
			add_filter( 'gettext', 'lw_membership_latest_posts_message', 10, 3 );
			add_action( 'the_post', 'lw_membership_latest_posts_next_post' );
		}
		return;
	}

	if ( $depth > 0 && 0 === --$depth ) {
		remove_filter( 'post_password_required', 'lw_membership_latest_posts_password', 10 );
		remove_filter( 'gettext', 'lw_membership_latest_posts_message', 10 );
		remove_action( 'the_post', 'lw_membership_latest_posts_next_post' );
		lw_membership_latest_posts_flag( false );
	}
}

/**
 * 次の記事に移ったら印を消す（前の記事の印が残って、別の記事のお知らせまで空にしないため）
 *
 * @return void
 */
function lw_membership_latest_posts_next_post() {
	lw_membership_latest_posts_flag( false );
}

/**
 * 見られない記事のとき、この記事は「パスワードが要る」と答える（最新の投稿ブロックの中だけ）
 *
 * @param bool         $required もとの判定
 * @param WP_Post|null $post     記事
 * @return bool
 */
function lw_membership_latest_posts_password( $required, $post ) {
	if ( $required ) {
		return $required;   // 本当にパスワードのある記事は WordPress のまま
	}
	$post = get_post( $post );
	if ( $post && ! lw_membership_rest_can_read( $post ) ) {
		lw_membership_latest_posts_flag( true );
		return true;
	}
	return $required;
}

/**
 * 会員限定で止めたときだけ、パスワードのお知らせの一文を空にする
 *
 * @param string $translation 訳した文
 * @param string $text        もとの文
 * @param string $domain      テキストドメイン
 * @return string
 */
function lw_membership_latest_posts_message( $translation, $text, $domain ) {
	if ( 'default' === $domain && 'This content is password protected.' === $text && lw_membership_latest_posts_flag() ) {
		lw_membership_latest_posts_flag( false );
		return '';
	}
	return $translation;
}

/**
 * 「いま会員限定で止めた」の印
 *
 * @param bool|null $set null なら読むだけ
 * @return bool
 */
function lw_membership_latest_posts_flag( $set = null ) {
	static $flag = false;
	if ( null !== $set ) {
		$flag = (bool) $set;
	}
	return $flag;
}
