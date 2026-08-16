<?php
/**
 * 会員登録フォーム ― パターン3（横並び）
 *
 * PCでは左に案内文、右にフォーム。スマホでは縦積みになる。
 * ログイン画面のパターン3と対になっている。
 * 読み込み元は templates/membership/register/index.php（CSSもそちらで enqueue 済み）。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_state = lw_member_register_view_state();
?>

<section class="lw_member_register ptn_3">

    <?php if ( $lw_state === 'off' ) : ?>

        <?php /* 受け付けていないときは訪問者に何も見せない。原因が分かるよう管理者にだけ出す */ ?>
        <?php if ( current_user_can( 'manage_options' ) ) : ?>
            <p class="admin_note">
                【管理者にのみ表示】会員登録を受け付けていません。<br>
                「外観 &gt; カスタマイズ &gt; 会員限定ページ設定 &gt; 会員登録を受け付ける」をONにしてください。
            </p>
        <?php endif; ?>

    <?php else : ?>

        <div class="card">

            <div class="side">
                <div class="icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <path d="M19 8v6"></path>
                        <path d="M22 11h-6"></path>
                    </svg>
                </div>

                <?php if ( $lw_state === 'done' ) : ?>
                    <h2 class="title">登録が完了しました</h2>
                    <p class="lead">ご登録ありがとうございます。</p>
                <?php elseif ( $lw_state === 'code' ) : ?>
                    <h2 class="title">あと1歩です</h2>
                    <p class="lead">メールに届いた6桁の番号と、<br>これから使うパスワードを<br>ご入力ください。</p>
                <?php elseif ( $lw_state === 'logged_in' ) : ?>
                    <h2 class="title">すでにログインしています</h2>
                    <p class="lead">別のアカウントで登録する場合は、<br>いちどログアウトしてください。</p>
                <?php else : ?>
                    <h2 class="title">会員登録</h2>
                    <p class="lead">登録すると、会員限定のページを<br>ご覧いただけるようになります。</p>
                <?php endif; ?>
            </div>

            <div class="main">

                <?php if ( $lw_state === 'done' ) : ?>

                    <p class="lead">設定したメールアドレスとパスワードでログインできます。</p>

                    <div class="actions">
                        <a class="submit" href="<?php echo esc_url( wp_login_url() ); ?>">ログインする</a>
                        <a class="link" href="<?php echo esc_url( home_url( '/' ) ); ?>">トップページへ戻る</a>
                    </div>

                <?php elseif ( $lw_state === 'code' ) : ?>

                    <?php get_template_part( 'templates/membership/register/code_form' ); ?>

                <?php elseif ( $lw_state === 'logged_in' ) : ?>

                    <div class="actions">
                        <a class="link" href="<?php echo esc_url( wp_logout_url( lw_member_register_form_action() ) ); ?>">ログアウトする</a>
                    </div>

                <?php else : ?>

                    <?php get_template_part( 'templates/membership/register/form' ); ?>

                    <div class="actions">
                        <a class="link" href="<?php echo esc_url( wp_login_url() ); ?>">すでに登録済みの方はこちら</a>
                    </div>

                <?php endif; ?>

            </div>

        </div>

    <?php endif; ?>

</section>
