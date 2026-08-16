<?php
/**
 * ログイン画面の「はじめての方はこちら」
 *
 * 会員登録を受け付けていて、かつ登録ページが選ばれているときだけ出す。
 * デザインパターン（ptn_*）が増えても同じ判定を書き直さなくていいよう、
 * ここ1か所にまとめている。
 *
 * ⚠️ ログイン済みで権限が足りない人（denied）には出さない。
 *    新しく登録し直しても解決しないため。
 *
 * 設定 → カスタマイザー「会員限定ページ設定 > 会員登録を受け付ける／会員登録ページ」
 */
if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! function_exists( 'lw_member_register_enabled' ) || ! lw_member_register_enabled() ) {
    return;
}

$lw_register_url = lw_member_register_page_url();
if ( $lw_register_url === '' ) {
    return;
}
?>
<a class="link" href="<?php echo esc_url( $lw_register_url ); ?>">はじめての方はこちら（会員登録）</a>
