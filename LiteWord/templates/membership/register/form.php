<?php
/**
 * 会員登録フォーム（デザインパターン共通の中身）
 *
 * 見た目だけを各パターン（ptn_*）が持ち、入力欄・hidden・エラー表示は
 * ここ1か所にまとめる。受け取りと登録は functions/membership/register/handler.php。
 *
 * ⚠️ get_template_part() は呼び出し元のローカル変数を渡さないので、
 *    必要な値はこのファイルの中で取り直している。
 *
 * 🚨 ここに書いてある required や type="email" は入力の手助けでしかない。
 *    実際の判定はすべてサーバー側（validate.php）で行っている。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_action   = lw_member_register_form_action();
$lw_general  = lw_member_register_general_errors();
$lw_err_name = lw_member_register_field_error( 'name' );
$lw_err_mail = lw_member_register_field_error( 'email' );
$lw_err_user = lw_member_register_field_error( 'login' );
$lw_err_cons = lw_member_register_field_error( 'consent' );
?>

<?php if ( $lw_general ) : ?>
    <div class="error" role="alert">
        <?php foreach ( $lw_general as $lw_message ) : ?>
            <p><?php echo esc_html( $lw_message ); ?></p>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<form class="form lw_member_register_form" method="post" action="<?php echo esc_url( $lw_action ); ?>">

    <?php wp_nonce_field( 'lw_member_register', 'lw_member_register_nonce' ); ?>
    <input type="hidden" name="lw_member_register" value="1">
    <input type="hidden" name="lw_reg_redirect" value="<?php echo esc_url( $lw_action ); ?>">

    <?php /* ハニーポット。人には見えない欄で、埋まっていたらボットとして捨てる。
             CSS が読めなかったときにも隠れているよう、ここだけは直接指定する。 */ ?>
    <div class="honeypot" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
        <label>ウェブサイト
            <input type="text" name="<?php echo esc_attr( lw_member_register_honeypot_name() ); ?>" tabindex="-1" autocomplete="off">
        </label>
    </div>

    <?php if ( lw_member_register_ask_name() ) : ?>
        <label class="label" for="lw_reg_name">お名前<span class="req">必須</span></label>
        <input class="input" type="text" id="lw_reg_name" name="lw_reg_name"
               value="<?php echo esc_attr( lw_member_register_old_value( 'name' ) ); ?>"
               autocomplete="name" required>
        <?php if ( $lw_err_name !== '' ) : ?>
            <p class="field_error"><?php echo esc_html( $lw_err_name ); ?></p>
        <?php endif; ?>
    <?php endif; ?>

    <label class="label" for="lw_reg_email">メールアドレス<span class="req">必須</span></label>
    <input class="input" type="email" id="lw_reg_email" name="lw_reg_email"
           value="<?php echo esc_attr( lw_member_register_old_value( 'email' ) ); ?>"
           autocomplete="email" autocapitalize="off" spellcheck="false" required>
    <?php if ( $lw_err_mail !== '' ) : ?>
        <p class="field_error"><?php echo esc_html( $lw_err_mail ); ?></p>
    <?php endif; ?>

    <?php if ( lw_member_register_ask_login() ) : ?>
        <label class="label" for="lw_reg_login">ユーザー名<span class="req">必須</span></label>
        <input class="input" type="text" id="lw_reg_login" name="lw_reg_login"
               value="<?php echo esc_attr( lw_member_register_old_value( 'login' ) ); ?>"
               autocomplete="username" autocapitalize="off" spellcheck="false" required>
        <?php if ( $lw_err_user !== '' ) : ?>
            <p class="field_error"><?php echo esc_html( $lw_err_user ); ?></p>
        <?php endif; ?>
    <?php endif; ?>

    <?php get_template_part( 'templates/membership/register/profile_fields' ); ?>

    <?php if ( lw_member_register_ask_consent() ) : ?>
        <label class="consent" for="lw_reg_consent">
            <input type="checkbox" id="lw_reg_consent" name="lw_reg_consent" value="1"
                   <?php checked( ! empty( $_POST['lw_reg_consent'] ) ); ?> required>
            <?php /* リンクを張れるよう、設定側で許可タグだけ残してある（wp_kses 済み） */ ?>
            <span><?php echo lw_member_register_consent_text(); ?></span>
        </label>
        <?php if ( $lw_err_cons !== '' ) : ?>
            <p class="field_error"><?php echo esc_html( $lw_err_cons ); ?></p>
        <?php endif; ?>
    <?php endif; ?>

    <p class="note">
        この後、ご入力のメールアドレスに6桁の認証番号をお送りします。<br>
        番号を入力していただくと登録が完了します。
    </p>

    <button class="submit" type="submit">認証番号を受け取る</button>
</form>
