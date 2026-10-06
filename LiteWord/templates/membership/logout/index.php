<?php
/**
 * 会員限定ページの中のログアウト（「ログイン中です」とボタン）
 *
 * 出すかどうか・どこに出すかは functions/membership/logout/box.php の lw_membership_logout_box()。
 * CSS もそちらで <head> に読んでいる（style.css）。
 *
 * 受け取る値（get_template_part() の第3引数 $args）
 *   position … 'top'＝本文の上 ／ 'bottom'＝本文の下
 *   wide     … true＝本文の枠の外（カテゴリーの一覧・左右の余白が無い固定ページ）。ボタンの側で幅を決める
 *
 * 名前は出さない（共通の ID を配って使うサイトもあるため）。
 * 作りの理由（<p> にしない・余白を padding で持つ）→ doc/specs/membership-logout.md
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_position = ( isset( $args['position'] ) && $args['position'] === 'top' ) ? 'top' : 'bottom';
$lw_classes  = 'lw_member_logout type_' . $lw_position . ( ! empty( $args['wide'] ) ? ' type_wide' : '' );
?>
<div class="<?php echo esc_attr( $lw_classes ); ?>">
    <div class="wrap">
        <span class="text">ログイン中です</span>
        <a class="btn" href="<?php echo esc_url( lw_membership_logout_url() ); ?>" rel="nofollow">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <path d="M16 17l5-5-5-5"></path>
                <path d="M21 12H9"></path>
            </svg>
            <span><?php echo lw_membership_logout_label(); // エスケープ済み ?></span>
        </a>
    </div>
</div>
