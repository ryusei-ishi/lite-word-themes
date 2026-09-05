<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * PR表記（広告・アフィリエイト）の設定
 * ------------------------------------------------------------------
 * 2023年10月から、広告であることを隠して商品をすすめると景品表示法違反
 * （いわゆるステマ規制）になる。アフィリエイトリンクを1本でも置くなら
 * 「広告です」と分かる表示が要る。
 *
 * ブロックに置く「PR」の札（商品リンク 01 など）はそのブロックの中しか守れない。
 * 文中にリンクを1本貼っただけの記事には何も出ないので、ページ全体に出す設定をここに置く。
 *
 * 🚨 既定は "off"。すでに配布済みのサイトに勝手に帯を出さないため。
 *    利用者が自分で選んだときだけ出る。
 *
 * 描画 → templates/pr_notice/index.php
 * 記事ごとの上書き → functions/custom_post/post.php ／ page.php の "pr_notice_page_switch"
 */
add_action( 'customize_register', 'lw_pr_notice_custom' );
function lw_pr_notice_custom( $wp_customize ) {
    $set_ttl = 'PR表記（広告・アフィリエイト）';
    $sec     = 'lw_pr_notice_sec';
    $set     = 'lw_pr_notice';
    $wp_customize->add_section( $sec, [
        'title'       => $set_ttl,
        'priority'    => 125,
        'description' => 'アフィリエイトリンクや広告を載せるページの先頭に「広告です」と分かる表示を出します。2023年10月からの景品表示法（ステマ規制）で必要な表示です。',
    ] );

    // コントロール
    $items = [
        [
            [ 'radio', 'switch', '表示する場所', 'アフィリエイトリンクを置くなら必ずどれかを選んでください。「記事ページ」には、投稿のほかにお知らせ・実績などのカスタム投稿も含みます。記事ごとに出す／出さないを変えることもできます（編集画面の「PR表記」）。', [
                'off'  => '表示しない',
                'post' => '記事ページだけ（固定ページには出さない）',
                'all'  => 'すべてのページ（固定ページにも出す）',
            ] ],
            [ 'text', 'text', '文言', '空のままだと「※このページはプロモーション（広告）を含みます」が出ます。' ],
            [ 'radio', 'ptn', '見た目', '', [
                'ptn_1' => '帯（背景つき）',
                'ptn_2' => '文字だけ（控えめ）',
            ] ],
            [ 'color', 'bg_color', '帯の背景色' ],
            [ 'color', 'text_color', '文字の色' ],
            [ 'radio', 'align', '文字の位置', '', [
                'left'   => '左寄せ',
                'center' => '中央',
            ] ],
        ]
    ];

    customize_set( $items, $set, $sec, $wp_customize );
}
