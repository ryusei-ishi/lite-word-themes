<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord 動画マニュアルの案内ページ
 *
 * 動画マニュアルはクロラボ（app.kurosuta.supologe.com）へ移設したため、
 * テーマに内蔵していたマニュアル本体（旧 contents.php ＋ pages/*.php・13ページ）は削除した。
 * このファイルは「クロラボに動画マニュアルがあること」を伝えてリンクへ送るだけの1枚。
 *
 * 🚨 メニューのスラッグ 'lw-manual-viewer' は変えないこと。
 *    ①ダッシュボード左の「動画マニュアル」ボタン（dashboard_top/index.php）
 *    ②お知らせ欄の「動画マニュアル」ボタン（components/news-widget/news-widget.php）
 *    ③お問い合わせフォーム画面の「解説動画」リンク（functions/mail_form/form_list.php）
 *    ④AIヒント（dashboard_top/dashboard-ai-hints.json の layout.sidebar.buttons と components.newsWidget）
 *    ⑤AI向けインデックス（テーマ直下 ai-index.json の aiResources.videoManual）
 *    がこのスラッグを指しているため、変えると既存の導線が全部リンク切れになる。
 *    ⚠️ ①②は定数ではなく文字列で持っている（manual/ は functions/index.php で
 *       dashboard_top より後に読まれるため、定数にすると読み込み順次第で未定義定数になる）。
 */

define( 'LW_MANUAL_MENU_SLUG', 'lw-manual-viewer' );
define( 'LW_MANUAL_PATH', get_template_directory() . '/functions/manual/' );
define( 'LW_MANUAL_URL', get_template_directory_uri() . '/functions/manual/' );

// クロラボの「LiteWordの使い方」コース（メニューID 18・全67レッスン）
define( 'LW_MANUAL_KURORABO_URL', 'https://app.kurosuta.supologe.com/menu/18' );
// 迷ったとき用のクロラボのトップ
define( 'LW_MANUAL_KURORABO_TOP_URL', 'https://app.kurosuta.supologe.com/' );

add_action( 'admin_menu', 'lw_manual_add_menu' );
function lw_manual_add_menu() {
    add_menu_page(
        'LiteWord 動画マニュアル',
        '動画マニュアル',
        'manage_options',
        LW_MANUAL_MENU_SLUG,
        'lw_manual_render_page',
        'dashicons-video-alt3',
        3
    );
}

// この画面でだけCSSを読み込む
add_action( 'admin_enqueue_scripts', 'lw_manual_enqueue_assets' );
function lw_manual_enqueue_assets( $hook_suffix ) {
    // 🚨 hook名を手で組み立てない（トップレベルメニューは 'toplevel_page_{slug}' になる規則だが、
    //    WPのバージョン・環境依存を避けるため関数に生成させる）。
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
    if ( get_plugin_page_hookname( LW_MANUAL_MENU_SLUG, '' ) !== $hook_suffix ) {
        return;
    }

    $path = LW_MANUAL_PATH . 'css/manual-link.css';
    wp_enqueue_style( 'lw-manual-link', LW_MANUAL_URL . 'css/manual-link.css', array(), filemtime( $path ) );
}

function lw_manual_render_page() {
    $steps = array(
        '最初の設定（テーマの有効化・基本情報）',
        '共通デザイン（色・文字・ヘッダー・フッター）',
        '固定ページの作り方とブロックの使い分け',
        '投稿・カテゴリー・アーカイブの設定',
        'お問い合わせフォームの設置',
        'SEO設定と公開前のチェック',
    );
    ?>
    <div class="wrap lw-manual-wrap">
        <div class="lw-manual-card">
            <p class="lw-manual-eyebrow">
                <span class="dashicons dashicons-video-alt3"></span>
                LiteWord 動画マニュアル
            </p>

            <h1 class="lw-manual-title">動画マニュアルは「クロラボ」へ移動しました</h1>

            <p class="lw-manual-lead">
                LiteWord の使い方は、<strong>動画と手順で最初から最後まで</strong>見られる形になりました。
                これまでこの画面にあった文章のマニュアルは、すべて動画に置きかえています。
            </p>

            <ul class="lw-manual-steps">
                <?php foreach ( $steps as $step ) : ?>
                    <li><?php echo esc_html( $step ); ?></li>
                <?php endforeach; ?>
            </ul>

            <a href="<?php echo esc_url( LW_MANUAL_KURORABO_URL ); ?>"
               target="_blank" rel="noopener noreferrer" class="lw-manual-btn">
                クロラボで動画を見る
                <span class="dashicons dashicons-arrow-right-alt2"></span>
            </a>

            <?php // 🚨 flexの直下にテキストと<strong>を並べない。地の文と<strong>が別々のflexアイテムに
                  //    なって、文章がgapの幅で分断される。文字はまとめて<span>1つに入れること。 ?>
            <p class="lw-manual-note">
                <span class="dashicons dashicons-info-outline"></span>
                <span class="lw-manual-note-text">クロラボは新しいタブで開きます。視聴には<strong>クロラボへの登録（無料）</strong>が必要です。動画マニュアルそのものは<span class="lw-manual-nobreak">無料</span>で全部ご覧いただけます。</span>
            </p>

            <p class="lw-manual-sub">
                うまく開けないときは
                <a href="<?php echo esc_url( LW_MANUAL_KURORABO_TOP_URL ); ?>" target="_blank" rel="noopener noreferrer">クロラボのトップ</a>
                から「WordPress」→「LiteWordの使い方」と進んでください。
            </p>
        </div>
    </div>
    <?php
}
