<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ---------- 共通関数 ---------- */
require_once __DIR__ . '/functions.php';

/* ---------- CSS ---------- */
wp_enqueue_style(
	'lw_seo_bulk_edit',
	get_template_directory_uri() . '/functions/seo/css/lw_seo_bulk_edit.css',
	[],
	css_version(),
	'all'
);
?>

<div class="none_plugin_message"></div>

<!-- =======================================================
     アクセス解析設定
     ======================================================= -->
<div class="lw_seo_base_setting">
	<div class="lw-page-title-with-help">
		<h1>アクセス解析</h1>
		<?php lw_voice_help_button( 'lw-analysis-guide' ); ?>
	</div>
	<?php lw_voice_help_text( 'lw-analysis-guide', lw_get_analysis_guide_text() ); ?>
    <div class="lw_seo_base_setting_form_in">
        <form method="post">
            <h2>Google関係</h2>


            <h3>アナリティクス ID</h3>
            <?php Lw_theme_mod_text( 'seo_set_google_analytics_id' ); ?>
            <p class="description">例）G-XXXXXXXXX</p>
            <h3>タグマネージャー ID</h3>
            <?php Lw_theme_mod_text( 'seo_set_gtm_id' ); ?>
            <p class="description">例）GTM-XXXXXXX</p>
            <h3>ログインしている場合</h3>
            <p>管理者・編集者はアクセス解析を無効にしますか？</p>
            <?php Lw_theme_mod_select( 'seo_set_admin_switch', [
                "on" => '有効にする',
                "off" => '無効にする',
            ] ); ?>


            <br><br><input type="submit" value="保存" class="button">
        </form>
    </div>
</div>

<!-- ====================================
     初心者向けガイド（formの外に配置）
     ==================================== -->
<div class="lw_seo_base_setting">
    <div class="lw-guide-section">
        <?php lw_guide_header( 'アクセス解析ガイド（初心者向け）', 'chart-area' ); ?>

        <div class="lw-guide-content">
            <!-- イントロダクション -->
            <div class="lw-guide-intro">
                <p>
                    <strong>アクセス解析とは？</strong><br>
                    アクセス解析は、あなたのウェブサイトに「誰が」「いつ」「どこから」「どのページを」訪問したかを記録・分析するためのツールです。
                    これにより、サイトの人気ページ、訪問者の行動パターン、効果的な集客方法などを把握することができます。
                    Googleが提供する無料のアクセス解析ツールを使うことで、初心者でも簡単にサイトの分析を始められます。
                </p>
            </div>

            <!-- Googleアナリティクス -->
            <?php lw_guide_item( 'Googleアナリティクス ID', 'guide-analytics', function() { ?>
                    <p>
                        <strong>Googleアナリティクス</strong>は、Googleが提供する世界で最も使われているアクセス解析ツールです。
                        完全無料で利用でき、以下のような情報を詳しく把握できます。
                    </p>
                    <ul>
                        <li><strong>訪問者数：</strong>サイトに何人が訪れたか</li>
                        <li><strong>ページビュー：</strong>どのページが何回見られたか</li>
                        <li><strong>滞在時間：</strong>訪問者がどれくらいサイトに滞在したか</li>
                        <li><strong>流入元：</strong>Google検索、SNS、他サイトなど、どこから来たか</li>
                        <li><strong>デバイス：</strong>パソコン、スマホ、タブレットの割合</li>
                        <li><strong>地域：</strong>訪問者がどの地域からアクセスしているか</li>
                    </ul>
                    <div class="lw-guide-example">
                        <div class="lw-guide-example-label">IDの形式</div>
                        <code>G-XXXXXXXXX</code>（GA4の場合）<br>
                        <code>UA-XXXXXXXX-X</code>（旧ユニバーサルアナリティクスの場合）
                    </div>
                    <p style="margin-top: 12px;">
                        <strong>設定手順：</strong><br>
                        1. <a href="https://analytics.google.com/" target="_blank" rel="noopener">Googleアナリティクス</a>にアクセスしてGoogleアカウントでログイン<br>
                        2. 「管理」→「プロパティを作成」でサイトを登録<br>
                        3. 発行された「測定ID」（G-XXXXXXXXXの形式）をこの欄に入力
                    </p>
            <?php }, 'chart-bar' ); ?>

            <!-- Googleタグマネージャー -->
            <?php lw_guide_item( 'Googleタグマネージャー ID', 'guide-gtm', function() { ?>
                    <p>
                        <strong>Googleタグマネージャー（GTM）</strong>は、サイトに様々な「タグ」を簡単に管理・設置できるツールです。
                        タグとは、アクセス解析や広告トラッキングなどのためにサイトに埋め込む小さなコードのことです。
                    </p>
                    <p>
                        <strong>GTMを使うメリット：</strong>
                    </p>
                    <ul>
                        <li><strong>一元管理：</strong>アナリティクス、広告タグ、ヒートマップツールなど、複数のタグを一箇所で管理</li>
                        <li><strong>簡単設定：</strong>HTMLを直接編集せずに、ブラウザ上でタグの追加・削除が可能</li>
                        <li><strong>高度な計測：</strong>ボタンクリック、スクロール、フォーム送信などの行動を詳細に追跡</li>
                        <li><strong>サイト軽量化：</strong>タグを効率的に読み込むため、サイトの表示速度を維持</li>
                    </ul>
                    <div class="lw-guide-example">
                        <div class="lw-guide-example-label">IDの形式</div>
                        <code>GTM-XXXXXXX</code>
                    </div>
                    <p style="margin-top: 12px;">
                        <strong>初心者へのアドバイス：</strong><br>
                        まずはGoogleアナリティクスのみ設定すれば十分です。
                        GTMは、複数のツールを導入したい場合や、より詳細な計測をしたい場合に検討してください。
                    </p>
            <?php }, 'tag' ); ?>

            <!-- 管理者除外設定 -->
            <?php lw_guide_item( '管理者・編集者の除外設定', 'guide-admin-switch', function() { ?>
                    <p>
                        この設定は、サイト管理者や編集者がログインしている状態でサイトを見たときに、
                        そのアクセスをカウントするかどうかを選択できます。
                    </p>
                    <p>
                        <strong>「無効にする」を推奨する理由：</strong>
                    </p>
                    <ul>
                        <li><strong>正確なデータ：</strong>自分自身のアクセスが含まれないため、実際の訪問者数を正確に把握できます</li>
                        <li><strong>ノイズ除去：</strong>記事の編集確認やデザインチェックなどのアクセスが除外されます</li>
                        <li><strong>分析精度向上：</strong>純粋なユーザー行動のみを分析できます</li>
                    </ul>
                    <div class="lw-guide-example">
                        <div class="lw-guide-example-label">設定の選び方</div>
                        <strong>無効にする（推奨）：</strong>管理者・編集者のアクセスはカウントしない<br>
                        <strong>有効にする：</strong>全てのアクセスをカウントする（テスト時など）
                    </div>
            <?php }, 'admin-users' ); ?>

            <!-- FAQ -->
            <?php lw_guide_item( 'よくある質問', 'guide-faq', function() { ?>
                <div class="lw-guide-faq">
                    <div class="lw-guide-faq-item">
                    <div class="lw-guide-faq-q">アナリティクスとタグマネージャー、両方設定する必要がありますか？</div>
                    <div class="lw-guide-faq-a">
                        <div class="lw-guide-faq-a-content">
                            いいえ、両方設定する必要はありません。
                            <ul>
                                <li><strong>初心者の方：</strong>Googleアナリティクス IDのみ設定すれば、基本的なアクセス解析は十分できます</li>
                                <li><strong>中級者以上：</strong>タグマネージャーを使う場合は、アナリティクスのタグもGTM経由で設定するのが一般的です。その場合、ここではGTM IDのみ設定します</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="lw-guide-faq-item">
                    <div class="lw-guide-faq-q">設定後、すぐにデータが見れますか？</div>
                    <div class="lw-guide-faq-a">
                        <div class="lw-guide-faq-a-content">
                            Googleアナリティクスの「リアルタイム」レポートでは、設定直後から訪問者を確認できます。
                            ただし、詳細なレポートデータは24〜48時間後から表示されます。
                            まずは自分でサイトを訪問して、リアルタイムレポートでカウントされるか確認してみましょう。
                        </div>
                    </div>
                </div>

                <div class="lw-guide-faq-item">
                    <div class="lw-guide-faq-q">IDはどこで確認できますか？</div>
                    <div class="lw-guide-faq-a">
                        <div class="lw-guide-faq-a-content">
                            <strong>Googleアナリティクス：</strong>
                            アナリティクスにログイン → 左下の「管理」（歯車アイコン）→ プロパティ列の「データストリーム」→ 該当のストリームをクリック → 「測定ID」
                            <br><br>
                            <strong>Googleタグマネージャー：</strong>
                            タグマネージャーにログイン → コンテナ名の右側に表示されている「GTM-XXXXXXX」
                        </div>
                    </div>
                </div>

                <div class="lw-guide-faq-item">
                    <div class="lw-guide-faq-q">アクセス解析でプライバシーの問題はありますか？</div>
                    <div class="lw-guide-faq-a">
                        <div class="lw-guide-faq-a-content">
                            Googleアナリティクスは個人を特定する情報は収集しませんが、EU圏のユーザーがいる場合はGDPR対応のCookie同意バナーの設置が推奨されます。
                            日本国内向けサイトでも、プライバシーポリシーページでアクセス解析ツールの使用について明記しておくと良いでしょう。
                        </div>
                    </div>
                </div>
            <?php }, 'editor-help' ); ?>

            <!-- 注意事項 -->
            <div class="lw-guide-notice">
                <div class="lw-guide-notice-title">
                    <span class="dashicons dashicons-warning"></span>
                    設定時の注意点
                </div>
                <p>
                    ・IDを入力する際は、余分なスペースが入らないようご注意ください<br>
                    ・設定を変更したら必ず「保存」ボタンをクリックしてください<br>
                    ・アナリティクスとタグマネージャーの両方でアナリティクスタグを設定すると、二重計測になる可能性があります
                </p>
            </div>
        </div>
    </div>
</div>
