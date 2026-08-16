<?php
/**
 * 会員限定ページのログイン画面 ― パターン3（横並び）
 *
 * PCでは左に案内文、右にフォーム。スマホでは縦積みになる。
 * 読み込み元は templates/membership/login/index.php（CSSもそちらで enqueue 済み）。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_reason   = function_exists( 'lw_membership_block' ) ? lw_membership_block() : 'login';
$lw_page_url = function_exists( 'lw_membership_current_url' ) ? lw_membership_current_url() : home_url( '/' );
$lw_ttl      = function_exists( 'lw_membership_title_tag' ) ? lw_membership_title_tag() : 'h1';
?>

<section class="lw_member_login ptn_3">
    <div class="card">

        <div class="side">
            <div class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>

            <?php if ( $lw_reason === 'denied' ) : ?>
                <<?php echo $lw_ttl; ?> class="title">このページは閲覧できません</<?php echo $lw_ttl; ?>>
                <p class="lead">
                    現在ログイン中のアカウントには、このページを閲覧する権限がありません。<br>
                    権限のあるアカウントでログインし直してください。
                </p>
            <?php else : ?>
                <<?php echo $lw_ttl; ?> class="title">会員限定ページ</<?php echo $lw_ttl; ?>>
                <p class="lead">この先は会員の方限定です。<br>ログインするとご覧いただけます。</p>
            <?php endif; ?>
        </div>

        <div class="main">
            <?php if ( $lw_reason === 'denied' ) : ?>

                <div class="actions">
                    <a class="submit" href="<?php echo esc_url( wp_logout_url( $lw_page_url ) ); ?>">別のアカウントでログインする</a>
                    <a class="link" href="<?php echo esc_url( home_url( '/' ) ); ?>">トップページへ戻る</a>
                </div>

            <?php else : ?>

                <?php get_template_part( 'templates/membership/login/form' ); ?>

                <div class="actions">
                    <a class="link" href="<?php echo esc_url( wp_lostpassword_url( $lw_page_url ) ); ?>">パスワードをお忘れの方</a>
                    <?php get_template_part( 'templates/membership/login/register_link' ); ?>
                </div>

            <?php endif; ?>
        </div>

    </div>
</section>
