<?php
/**
 * 会員限定ページのログイン画面 ― パターン2（シンプル）
 *
 * カードの枠を持たず、余白だけで見せる。本文の一部のように馴染ませたいとき用。
 * 読み込み元は templates/membership/login/index.php（CSSもそちらで enqueue 済み）。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_reason   = function_exists( 'lw_membership_block' ) ? lw_membership_block() : 'login';
$lw_page_url = function_exists( 'lw_membership_current_url' ) ? lw_membership_current_url() : home_url( '/' );
$lw_ttl      = function_exists( 'lw_membership_title_tag' ) ? lw_membership_title_tag() : 'h1';
?>

<section class="lw_member_login ptn_2">
    <div class="inner">

        <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
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

            <div class="actions">
                <a class="submit" href="<?php echo esc_url( wp_logout_url( $lw_page_url ) ); ?>">別のアカウントでログインする</a>
                <a class="link" href="<?php echo esc_url( home_url( '/' ) ); ?>">トップページへ戻る</a>
            </div>

        <?php else : ?>

            <<?php echo $lw_ttl; ?> class="title">会員限定ページ</<?php echo $lw_ttl; ?>>
            <p class="lead">このページをご覧いただくにはログインが必要です。</p>

            <?php get_template_part( 'templates/membership/login/form' ); ?>

            <div class="actions">
                <a class="link" href="<?php echo esc_url( wp_lostpassword_url( $lw_page_url ) ); ?>">パスワードをお忘れの方</a>
                <?php get_template_part( 'templates/membership/login/register_link' ); ?>
            </div>

        <?php endif; ?>

    </div>
</section>
