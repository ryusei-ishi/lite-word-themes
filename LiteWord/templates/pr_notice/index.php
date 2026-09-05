<?php
/* --------------------------------
PR表記（広告・アフィリエイト）用
------------------------------------
本文のいちばん上に出す。single.php ／ page.php から呼ばれる。
決め方は 目次（templates/toc/index.php）と同じ順:
  サイト設定 → 記事ごとの上書き（未選択ならサイト設定のまま）
🚨 サイト設定の既定は "off"。配布済みのサイトの見た目を勝手に変えないため。
------------------------------------ */
if ( !defined( 'ABSPATH' ) ) exit;

$pr_switch = Lw_theme_mod_set( 'lw_pr_notice_switch', 'off' );

/* サイト設定でこのページが対象か。
   post = 記事ページだけ。このファイルは single.php と page.php からしか呼ばれないので、
          ! is_page() ＝ 記事ページ。投稿だけでなくカスタム投稿も入る。
   all  = すべてのページ。
   🚨 カスタム投稿を含めるのはわざと。ステマ規制の表示は「出し漏らし」のほうが
      危ないので、is_singular('post') で投稿だけに絞らない。
      出したくないページは、次の行の記事ごとの上書きで個別に消せる。 */
$pr_set = ( $pr_switch === 'all' || ( $pr_switch === 'post' && ! is_page() ) ) ? 'on' : 'off';

/* 記事ごとの上書き（未選択なら上の判定のまま） */
$pr_set = Lw_put_text( 'pr_notice_page_switch', $pr_set );

if ( $pr_set !== 'on' ) return;

$pr_text = Lw_theme_mod_set( 'lw_pr_notice_text', '' );
if ( $pr_text === '' ) {
    $pr_text = '※このページはプロモーション（広告）を含みます';
}
$pr_ptn        = ( Lw_theme_mod_set( 'lw_pr_notice_ptn', 'ptn_1' ) === 'ptn_2' ) ? 'ptn_2' : 'ptn_1';
$pr_bg_color   = Lw_theme_mod_set( 'lw_pr_notice_bg_color', '#f2f3f5' );
$pr_text_color = Lw_theme_mod_set( 'lw_pr_notice_text_color', '#666666' );
$pr_align      = ( Lw_theme_mod_set( 'lw_pr_notice_align', 'left' ) === 'center' ) ? 'center' : 'left';
?>
<p class="lw_pr_notice <?= esc_attr( $pr_ptn ) ?>"><?= esc_html( $pr_text ) ?></p>
<style>
/* 🚨 .post_style p に margin を上書きされるので、詳細度をそろえる（!important は使わない） */
.post_style .lw_pr_notice {
  margin: 0 0 24px;
  padding: 0;
  font-size: 13px;
  line-height: 1.6em;
  text-align: <?= esc_attr( $pr_align ) ?>;
  color: <?= esc_attr( $pr_text_color ) ?>;
  @media (max-width: 750px) {
    margin-bottom: 20px;
    font-size: 12px;
  }
  &.ptn_1 {
    padding: 8px 14px;
    border-radius: 4px;
    background: <?= esc_attr( $pr_bg_color ) ?>;
    @media (max-width: 750px) {
      padding: 7px 12px;
    }
  }
  &.ptn_2 {
    opacity: .8;
  }
}
</style>
