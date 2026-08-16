<?php
/**
 * 会員限定ページのログインフォーム（デザインパターン共通の中身）
 *
 * 見た目だけを各パターン（ptn_*）が持ち、認証まわり（送信先・hidden・エラー表示）は
 * ここ1か所にまとめる。認証そのものは WordPress 標準の wp-login.php に任せる。
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さないので、
 *    必要な値はこのファイルの中で取り直している。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_page_url = function_exists( 'lw_membership_current_url' ) ? lw_membership_current_url() : home_url( '/' );
$lw_failed   = ( isset( $_GET['lw_login'] ) && $_GET['lw_login'] === 'failed' );
?>
<?php if ( $lw_failed ) : ?>
    <p class="error" role="alert">ユーザー名またはパスワードが正しくありません。</p>
<?php endif; ?>

<form class="form" method="post" action="<?php echo esc_url( site_url( 'wp-login.php', 'login_post' ) ); ?>">

    <label class="label" for="lw_member_login_user">ユーザー名またはメールアドレス</label>
    <input class="input" type="text" name="log" id="lw_member_login_user"
           autocomplete="username" autocapitalize="off" spellcheck="false" required>

    <label class="label" for="lw_member_login_pass">パスワード</label>
    <input class="input" type="password" name="pwd" id="lw_member_login_pass"
           autocomplete="current-password" required>

    <label class="remember" for="lw_member_login_remember">
        <input type="checkbox" name="rememberme" id="lw_member_login_remember" value="forever">
        <span>ログイン状態を保存する</span>
    </label>

    <input type="hidden" name="redirect_to" value="<?php echo esc_url( $lw_page_url ); ?>">
    <input type="hidden" name="lw_member_login" value="1">

    <button class="submit" type="submit">ログインする</button>
</form>
