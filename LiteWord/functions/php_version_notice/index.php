<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * PHP が古いときの警告（ポップアップ）
 *
 * 管理者がログインしたとき、PHP が 8.3 未満なら、最初に開いた管理画面で1回だけ出す（2026-11-25）。
 * 流れ: ログイン（wp_login）で印（ユーザーメタ）を付ける → 管理画面の admin_footer で出して印を消す。
 *
 * 🚨 ログインの処理（wp-login.php）では is_admin() が false。このファイルは functions/index.php の
 *    is_admin() の外で読むこと（中に入れると wp_login に付かず、ポップアップが二度と出ない）。
 *
 * プレミアムのお試しのポップアップ（lw_template_management/lw_check_trial_popup.php）との重なり:
 *   ・ログインで出るもの（お試しの印が付いている画面）… こちらを次の画面に回す
 *   ・期限切れで出るもの（管理画面のどこでも出る）… 重ね順をお試しより下にして、閉じると見えるようにする（CSS）
 *
 * 各版のセキュリティの更新が終わる日は php.net（supported-versions.php）で確かめた値:
 *   8.1 以下＝終了済み（8.1 は 2025-12-31）／8.2＝2026-12-31／8.3＝2027-12-31
 */

define( 'LW_PHP_NOTICE_MIN', '8.3' );                     // これより古いと出す
define( 'LW_PHP_NOTICE_82_END', '2026-12-31' );          // PHP 8.2 のセキュリティの更新が終わる日
define( 'LW_PHP_NOTICE_META', 'lw_php_notice_pending' ); // ログインで付ける印
// 「理由と切り替え方を見る」の行き先（lite-word.com の記事「PHPの脆弱性について」）
define( 'LW_PHP_NOTICE_ARTICLE_URL', 'https://lite-word.com/php-vulnerability-2026-10/' );

/**
 * いま動いている PHP の版（例 "8.2.27"）。
 * PHP_VERSION は "8.2.27-1+ubuntu" のように後ろが付くことがあるので、数字の3つから組む。
 * フィルター lw_php_notice_version で差し替えられる（手元で古い版のふりをして画面を確かめるとき用）。
 */
function lw_php_notice_version() {
    $version = PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '.' . PHP_RELEASE_VERSION;
    return (string) apply_filters( 'lw_php_notice_version', $version );
}

function lw_php_notice_is_old( $version ) {
    return version_compare( $version, LW_PHP_NOTICE_MIN, '<' );
}

/**
 * 版ごとの言い方（ポップアップの2文目）。$today はサイトの時刻の 'Y-m-d'。
 */
function lw_php_notice_status_text( $version, $today ) {
    if ( version_compare( $version, '8.2', '<' ) ) {
        return 'PHP 8.1 以下は、すでにセキュリティの更新が終わっています。';
    }
    if ( $today > LW_PHP_NOTICE_82_END ) {
        return 'PHP 8.2 のセキュリティの更新は2026年12月31日で終わりました。';
    }
    return 'PHP 8.2 のセキュリティの更新は2026年12月31日で終わります。';
}

// ログインしたとき: 管理者で、PHP が古ければ印を付ける
add_action( 'wp_login', 'lw_php_notice_flag_on_login', 10, 2 );
function lw_php_notice_flag_on_login( $user_login, $user ) {
    if ( ! ( $user instanceof WP_User ) || ! user_can( $user, 'manage_options' ) ) {
        return;
    }
    if ( ! lw_php_notice_is_old( lw_php_notice_version() ) ) {
        return;
    }
    update_user_meta( $user->ID, LW_PHP_NOTICE_META, 1 );
}

/**
 * この画面で出すか（1回のリクエストの中では同じ答えを返す）。
 * admin_enqueue_scripts（CSS・JS を読む）と admin_footer（出す）の両方から呼ぶ。
 */
function lw_php_notice_should_show() {
    static $result = null;
    if ( null !== $result ) {
        return $result;
    }
    $result = false;

    if ( ! is_admin() || wp_doing_ajax() || ( defined( 'IFRAME_REQUEST' ) && IFRAME_REQUEST ) ) {
        return $result;
    }
    if ( ! current_user_can( 'manage_options' ) ) {
        return $result;
    }

    $user_id = get_current_user_id();
    if ( ! get_user_meta( $user_id, LW_PHP_NOTICE_META, true ) ) {
        return $result;
    }

    // ログインのあとに PHP を切り替え済みなら、印だけ消して出さない
    if ( ! lw_php_notice_is_old( lw_php_notice_version() ) ) {
        delete_user_meta( $user_id, LW_PHP_NOTICE_META );
        return $result;
    }

    // お試しのポップアップがこの画面に出るときは、重ならないよう次の画面に回す（印は消さない）
    foreach ( array( 'lw_show_trial_popup_', 'lw_show_trial_warning_popup_', 'lw_show_trial_expired_popup_' ) as $prefix ) {
        if ( false !== get_transient( $prefix . $user_id ) ) {
            return $result;
        }
    }

    $result = true;
    return $result;
}

add_action( 'admin_enqueue_scripts', 'lw_php_notice_enqueue' );
function lw_php_notice_enqueue() {
    if ( ! lw_php_notice_should_show() ) {
        return;
    }
    $dir = get_template_directory() . '/functions/php_version_notice/';
    $uri = get_template_directory_uri() . '/functions/php_version_notice/';

    wp_enqueue_style( 'lw-php-version-notice', $uri . 'css/php-version-notice.css', array( 'dashicons' ), filemtime( $dir . 'css/php-version-notice.css' ) );
    wp_enqueue_script( 'lw-php-version-notice', $uri . 'js/php-version-notice.js', array(), filemtime( $dir . 'js/php-version-notice.js' ), true );
}

// お試しのポップアップ（admin_footer の 10）より先に出す。出したら印を消す（ログインごとに1回）
add_action( 'admin_footer', 'lw_php_notice_render', 5 );
function lw_php_notice_render() {
    if ( ! lw_php_notice_should_show() ) {
        return;
    }
    delete_user_meta( get_current_user_id(), LW_PHP_NOTICE_META );

    $version = lw_php_notice_version();
    $status  = lw_php_notice_status_text( $version, current_time( 'Y-m-d' ) );
    $article = LW_PHP_NOTICE_ARTICLE_URL;

    include __DIR__ . '/notice-template.php';
}
