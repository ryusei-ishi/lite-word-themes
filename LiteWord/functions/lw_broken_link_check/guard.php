<?php
/**
 * リンク一覧 — 権限まわりの唯一の入口。
 *
 * 🚨 AJAX ハンドラは必ず先頭で lw_link_list_verify_ajax() を呼ぶこと。
 *    2026-07-24 のセキュリティ監査で「再有効化するなら nonce を先に入れること」と条件が付いている。
 *    nonce が無いと、管理者がログイン中に罠サイトを踏んだだけで
 *    lw_link_list_update_href が投稿本文のリンク先を書き換えられてしまう。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * この機能を使えるユーザーか。
 *
 * ⚠️ LW_HAS_SUBSCRIPTION は「有料・sub_pre_set・14日試用」のいずれかで true になる
 *    （lw_template_management/lw_template_functions.php の lw_define_subscription_constant）。
 *    無料お試しを殺さないため、独自にサブスクだけを見る判定へ置き換えないこと。
 *    なお LW_EXPANSION_BASE が false のサイトでは定数自体が未定義なので defined() は必須。
 *
 * @return bool
 */
function lw_link_list_can_use() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return false;
    }

    $has_subscription = defined( 'LW_HAS_SUBSCRIPTION' ) && true === LW_HAS_SUBSCRIPTION;

    /**
     * リンク一覧の利用可否を差し替える。
     *
     * @param bool $has_subscription 契約状態による既定の判定。
     */
    return (bool) apply_filters( 'lw_link_list_can_use', $has_subscription );
}

/**
 * AJAX の共通ガード。通らなければ JSON を返してその場で終了する。
 *
 * 順番は nonce → 権限 → 契約。CSRF を最初に落とすため。
 *
 * @return void
 */
function lw_link_list_verify_ajax() {
    // 第3引数 false で「死なずに false を返す」。メッセージを自前で出すため
    if ( ! check_ajax_referer( LW_LINK_LIST_NONCE_ACTION, 'nonce', false ) ) {
        wp_send_json_error(
            array( 'message' => '画面が古くなっています。再読み込みしてからもう一度お試しください。' ),
            403
        );
    }

    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( array( 'message' => '権限がありません。' ), 403 );
    }

    if ( ! lw_link_list_can_use() ) {
        wp_send_json_error(
            array( 'message' => 'この機能はプレミアムプラン限定です。' ),
            403
        );
    }
}
