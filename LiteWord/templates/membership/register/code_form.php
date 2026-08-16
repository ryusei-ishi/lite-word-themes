<?php
/**
 * 会員登録 ― 2段目（認証番号とパスワード）の入力欄
 *
 * ここを通って初めてユーザーができる。1段目の時点では、まだ誰も作られていない。
 * 受け取りは functions/membership/register/handler.php。
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さないので、
 *    必要な値はこのファイルの中で取り直している。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_action    = lw_member_register_code_form_action();
$lw_general   = lw_member_register_general_errors();
$lw_err_code  = lw_member_register_field_error( 'code' );
$lw_err_pass  = lw_member_register_field_error( 'password' );
?>

<?php if ( $lw_general ) : ?>
    <div class="error" role="alert">
        <?php foreach ( $lw_general as $lw_message ) : ?>
            <p><?php echo esc_html( $lw_message ); ?></p>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<form class="form lw_member_register_form" method="post" action="<?php echo esc_url( $lw_action ); ?>">

    <?php wp_nonce_field( 'lw_member_register_code', 'lw_member_register_code_nonce' ); ?>
    <input type="hidden" name="lw_member_register_code" value="1">
    <input type="hidden" name="lw_reg_token" value="<?php echo esc_attr( lw_member_register_token() ); ?>">
    <input type="hidden" name="lw_reg_redirect" value="<?php echo esc_url( lw_member_register_form_action() ); ?>">

    <label class="label" for="lw_reg_code">認証番号<span class="req">必須</span></label>
    <?php /* 数字だけのキーボードを出す。inputmode は入力の手助けで、判定はサーバー側 */ ?>
    <input class="input code" type="text" id="lw_reg_code" name="lw_reg_code"
           inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code"
           autocapitalize="off" spellcheck="false" required>
    <?php if ( $lw_err_code !== '' ) : ?>
        <p class="field_error"><?php echo esc_html( $lw_err_code ); ?></p>
    <?php endif; ?>

    <label class="label" for="lw_reg_password">パスワード<span class="req">必須</span></label>
    <input class="input" type="password" id="lw_reg_password" name="lw_reg_password"
           autocomplete="new-password" required>
    <p class="field_note"><?php echo esc_html( sprintf( '%d文字以上で決めてください。', LW_MEMBER_REGISTER_PASS_MIN ) ); ?></p>

    <label class="label" for="lw_reg_password_2">パスワード（確認）<span class="req">必須</span></label>
    <input class="input" type="password" id="lw_reg_password_2" name="lw_reg_password_2"
           autocomplete="new-password" required>
    <?php if ( $lw_err_pass !== '' ) : ?>
        <p class="field_error"><?php echo esc_html( $lw_err_pass ); ?></p>
    <?php endif; ?>

    <p class="note">
        メールが届かない場合は、迷惑メールフォルダもご確認ください。<br>
        認証番号は<?php echo (int) round( LW_MEMBER_REGISTER_PENDING_TTL / MINUTE_IN_SECONDS ); ?>分で使えなくなります。
    </p>

    <button class="submit" type="submit">登録する</button>
</form>
