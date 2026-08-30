<?php
/**
 * AJAX — 一覧からリンクURLを直接書き換える。
 *
 * 🚨 このエンドポイントだけは投稿本文を書き換える。
 *    nonce が無いと、管理者がログイン中に罠サイトを踏んだだけで
 *    サイト中のリンク先を差し替えられる（2026-07-24 監査の指摘の中心）。
 *    lw_link_list_verify_ajax() を外さないこと。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 書き換えを許さないスキームか
 *
 * @param string $href 入力。
 * @return bool
 */
function lw_link_list_is_forbidden_href( $href ) {
    // 先頭の空白・制御文字を剥いでから判定する（" javascript:" 等をすり抜けさせない）
    $normalized = strtolower( preg_replace( '/[\s\x00-\x1F]+/', '', $href ) );

    foreach ( array( 'javascript:', 'data:', 'vbscript:' ) as $scheme ) {
        if ( 0 === strpos( $normalized, $scheme ) ) {
            return true;
        }
    }

    return false;
}

/**
 * リンクURLを直接編集する
 *
 * @return void
 */
function lw_link_list_update_href_ajax() {
    lw_link_list_verify_ajax();

    $post_id    = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
    $new_href   = isset( $_POST['new_href'] ) ? trim( wp_unslash( $_POST['new_href'] ) ) : '';
    $link_index = isset( $_POST['link_index'] ) ? (int) $_POST['link_index'] : -1;

    if ( $post_id <= 0 ) {
        wp_send_json_error( array( 'message' => '投稿IDが無効です。' ) );
    }

    // -1 は「フィルター適用後にしか現れないリンク」＝ post_content 内に実体が無い。
    // 位置で特定できないので書き換えを受け付けない（別のリンクを壊すため）
    if ( $link_index < 0 ) {
        wp_send_json_error(
            array( 'message' => 'このリンクは本文に直接書かれていないため、ここからは編集できません。編集画面で該当ブロックを直してください。' )
        );
    }

    if ( lw_link_list_is_forbidden_href( $new_href ) ) {
        wp_send_json_error( array( 'message' => 'このスキームのURLは設定できません。' ) );
    }

    $post = get_post( $post_id );
    if ( ! $post ) {
        wp_send_json_error( array( 'message' => '投稿が見つかりません。' ) );
    }

    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        wp_send_json_error( array( 'message' => 'この投稿を編集する権限がありません。' ), 403 );
    }

    $content = $post->post_content;

    // aタグの開始タグの位置を全て取得（DOMDocumentと同じ順序で）
    $a_tag_positions = array();

    if ( preg_match_all( '/<a\s[^>]*>/i', $content, $matches, PREG_OFFSET_CAPTURE ) ) {
        foreach ( $matches[0] as $match ) {
            $a_tag_positions[] = array(
                'tag' => $match[0],
                'pos' => $match[1],
            );
        }
    }

    if ( ! isset( $a_tag_positions[ $link_index ] ) ) {
        wp_send_json_error(
            array(
                'message' => '該当するリンクが見つかりませんでした。一覧を再生成してからもう一度お試しください。',
                'debug'   => array(
                    'link_index'   => $link_index,
                    'total_a_tags' => count( $a_tag_positions ),
                ),
            )
        );
    }

    $target  = $a_tag_positions[ $link_index ];
    $old_tag = $target['tag'];
    $pos     = $target['pos'];

    if ( preg_match( '/\shref\s*=\s*(["\'])(.*?)\1/i', $old_tag ) ) {
        // href属性を置換
        $new_tag = preg_replace(
            '/(\shref\s*=\s*["\'])([^"\']*)(["\'])/i',
            '${1}' . esc_attr( $new_href ) . '${3}',
            $old_tag,
            1
        );
    } else {
        // href属性がない場合は追加
        $new_tag = preg_replace( '/^<a\s/i', '<a href="' . esc_attr( $new_href ) . '" ', $old_tag, 1 );
    }

    if ( null === $new_tag || $new_tag === $old_tag ) {
        wp_send_json_error( array( 'message' => 'リンクを書き換えられませんでした。' ) );
    }

    $content = substr_replace( $content, $new_tag, $pos, strlen( $old_tag ) );

    // 🚨 wp_update_post() は渡された値に wp_unslash() をかける。
    //    wp_slash() を通さずに渡すとバックスラッシュが1段消える
    $result = wp_update_post(
        array(
            'ID'           => $post_id,
            'post_content' => wp_slash( $content ),
        ),
        true
    );

    if ( is_wp_error( $result ) ) {
        wp_send_json_error( array( 'message' => '投稿の更新に失敗しました: ' . $result->get_error_message() ) );
    }

    // 保存し直した本文で、そのページの行だけ作り直す
    $updated = LW_Broken_Link_Check_Scanner::scan_post( get_post( $post_id ) );
    lw_link_list_update_page( $post_id, $updated['links'], $updated['ids'] );

    wp_send_json_success(
        array(
            'message'  => 'リンクを更新しました。',
            'new_href' => $new_href,
            'links'    => $updated['links'],
            'ids'      => $updated['ids'],
        )
    );
}
add_action( 'wp_ajax_lw_link_list_update_href', 'lw_link_list_update_href_ajax' );
