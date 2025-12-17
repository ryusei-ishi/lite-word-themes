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

/* ---------- メディアライブラリ用スクリプト ---------- */
wp_enqueue_media();

/* ---------- OGP画像の保存処理 ---------- */
if ( isset( $_POST['lw_og_default_image'] ) ) {
	update_option( 'lw_og_default_image', sanitize_url( $_POST['lw_og_default_image'] ) );
}
if ( isset( $_POST['lw_front_og_image'] ) ) {
	update_option( 'lw_front_og_image', sanitize_url( $_POST['lw_front_og_image'] ) );
}
?>

<div class="none_plugin_message"></div>

<!-- =======================================================
     6) OGP／SNS 全体設定
     ※ 投稿・カテゴリごとの個別 OGP とは別に、
       サイト全体の「初期値」を決めるフォームです
     ======================================================= -->
<div class="lw_seo_base_setting">
	<div class="lw-page-title-with-help">
		<h1>OGP基本設定</h1>
		<?php lw_voice_help_button( 'lw-ogp-guide' ); ?>
	</div>
	<?php lw_voice_help_text( 'lw-ogp-guide', lw_get_ogp_guide_text() ); ?>
    <div class="lw_seo_base_setting_form_in">
        <form method="post">
            <h2>OGP／SNS 共通設定</h2>

            <!-- 6-1) デフォルト OGP 画像 -->
            <h3>デフォルト OGP画像（全ページ共通フォールバック）</h3>
            <p class="description">
                投稿・カテゴリ・フロントなどで個別設定が無い場合に使用される画像です。
            </p>
            <div class="lw-ogp-image-field">
                <div class="lw-ogp-image-preview" id="lw_og_default_image_preview">
                    <?php
                    $default_image = get_option( 'lw_og_default_image', '' );
                    if ( $default_image ) :
                    ?>
                        <img src="<?php echo esc_url( $default_image ); ?>" alt="OGP画像">
                    <?php else : ?>
                        <div class="lw-ogp-no-image">
                            <span class="dashicons dashicons-format-image"></span>
                            <span>画像が設定されていません</span>
                        </div>
                    <?php endif; ?>
                </div>
                <div class="lw-ogp-image-controls">
                    <input type="hidden" name="lw_og_default_image" id="lw_og_default_image" value="<?php echo esc_attr( $default_image ); ?>">
                    <button type="button" class="button lw-ogp-select-btn" data-target="lw_og_default_image">
                        <span class="dashicons dashicons-admin-media"></span>
                        画像を選択
                    </button>
                    <button type="button" class="button lw-ogp-remove-btn" data-target="lw_og_default_image" <?php echo $default_image ? '' : 'style="display:none;"'; ?>>
                        <span class="dashicons dashicons-no-alt"></span>
                        削除
                    </button>
                </div>
            </div>

            <!-- 6-2) フロントページ専用 OGP 画像 -->
            <h3>フロントページ専用 OGP画像</h3>
            <p class="description">
                トップページ（<code>is_front_page()</code> が true の時）だけに使う画像を設定できます。
            </p>
            <div class="lw-ogp-image-field">
                <div class="lw-ogp-image-preview" id="lw_front_og_image_preview">
                    <?php
                    $front_image = get_option( 'lw_front_og_image', '' );
                    if ( $front_image ) :
                    ?>
                        <img src="<?php echo esc_url( $front_image ); ?>" alt="OGP画像">
                    <?php else : ?>
                        <div class="lw-ogp-no-image">
                            <span class="dashicons dashicons-format-image"></span>
                            <span>画像が設定されていません</span>
                        </div>
                    <?php endif; ?>
                </div>
                <div class="lw-ogp-image-controls">
                    <input type="hidden" name="lw_front_og_image" id="lw_front_og_image" value="<?php echo esc_attr( $front_image ); ?>">
                    <button type="button" class="button lw-ogp-select-btn" data-target="lw_front_og_image">
                        <span class="dashicons dashicons-admin-media"></span>
                        画像を選択
                    </button>
                    <button type="button" class="button lw-ogp-remove-btn" data-target="lw_front_og_image" <?php echo $front_image ? '' : 'style="display:none;"'; ?>>
                        <span class="dashicons dashicons-no-alt"></span>
                        削除
                    </button>
                </div>
            </div>

            <!-- 6-3) og:type 既定値 -->
            <h3>og:type（既定値）</h3>
            <?php
                $og_types = [
                    'website' => 'website',
                    'article' => 'article',
                    'product' => 'product',
                    'profile' => 'profile',
                ];
                Lw_opt_select( 'lw_og_default_type', $og_types, '', '', 'website' );
            ?>

            <!-- 6-4) X（旧Twitter）Card -->
            <h3>X (旧Twitter) Card 設定</h3>
            <div class="flex">
                <?php
                    $tw_cards = [
                        'summary_large_image' => 'summary_large_image（大画像）',
                        'summary'             => 'summary（小画像）',
                        'app'                 => 'app',
                        'player'              => 'player',
                    ];
                    Lw_opt_select( 'lw_twitter_card', $tw_cards, '', '', 'summary_large_image' );
                ?>
                <?php Lw_opt_text( 'lw_twitter_site',    'text', '@LiteWord', 'regular-text' ); ?>
                <?php Lw_opt_text( 'lw_twitter_creator', 'text', '',          'regular-text' ); ?>
            </div>
            <p class="description">
                左：Card タイプ　中央：<code>x:site</code>（旧 <code>twitter:site</code>）　
                右：<code>x:creator</code>（旧 <code>twitter:creator</code>）
            </p>

            <!-- 6-5) Facebook App / Page -->
            <h3>Facebook App / Page ID</h3>
            <div class="flex">
                <?php Lw_opt_text( 'lw_fb_app_id',  'text', '', 'regular-text', 10 ); ?>
                <?php Lw_opt_text( 'lw_fb_page_id', 'text', '', 'regular-text', 10 ); ?>
            </div>
            <p class="description">
                左：<code>fb:app_id</code>　右：<code>fb:page_id</code>（不要なら空でOK）
            </p>

            <br><input type="submit" value="保存" class="button">
        </form>
    </div>

    <!-- =======================================================
         OGPについての解説セクション
         ======================================================= -->
    <div class="lw-guide-section">
        <?php lw_guide_header( 'OGPとは？初心者向けガイド', 'share' ); ?>

        <div class="lw-guide-content">
            <!-- OGPの基本説明 -->
            <?php lw_guide_item( 'OGPってなに？', 'ogp-guide-what', function() { ?>
                <p>
                    <strong>OGP（Open Graph Protocol）</strong>とは、WebページがSNSでシェアされた時に、
                    どのように表示されるかを指定するための仕組みです。
                </p>
                <div class="lw-ogp-example-box">
                    <div class="lw-ogp-example-label">例：X（Twitter）やFacebookでリンクをシェアした時</div>
                    <div class="lw-ogp-example-card">
                        <div class="lw-ogp-example-image">
                            <span class="dashicons dashicons-format-image"></span>
                        </div>
                        <div class="lw-ogp-example-text">
                            <div class="lw-ogp-example-title">ページのタイトル</div>
                            <div class="lw-ogp-example-desc">ページの説明文がここに表示されます...</div>
                            <div class="lw-ogp-example-url">example.com</div>
                        </div>
                    </div>
                    <p class="lw-ogp-example-note">↑ このようなカード形式で表示されます。OGP設定をすることで、この表示内容をコントロールできます。</p>
                </div>
            <?php }, 'info-outline' ); ?>

            <!-- 各設定項目の説明 -->
            <?php lw_guide_item( 'デフォルト OGP画像', 'ogp-guide-default', function() { ?>
                <p>
                    投稿やページに個別のアイキャッチ画像が設定されていない場合に使用される、
                    <strong>サイト全体の共通画像</strong>です。サイトのロゴや代表的な画像を設定しておくと良いでしょう。
                </p>
                <div class="lw-ogp-tip">
                    <span class="dashicons dashicons-lightbulb"></span>
                    <span><strong>推奨サイズ：</strong>1200×630ピクセル（横長の画像）</span>
                </div>
            <?php }, 'format-image' ); ?>

            <?php lw_guide_item( 'フロントページ専用 OGP画像', 'ogp-guide-front', function() { ?>
                <p>
                    トップページ専用の画像です。トップページがシェアされた時だけ、この画像が使用されます。
                    空欄の場合は「デフォルト OGP画像」が使用されます。
                </p>
            <?php }, 'admin-home' ); ?>

            <?php lw_guide_item( 'og:type（既定値）', 'ogp-guide-type', function() { ?>
                <p>ページの種類を指定します。通常は以下のように使い分けます：</p>
                <ul>
                    <li><strong>website</strong> - トップページ向け（サイト全体を表す）</li>
                    <li><strong>article</strong> - ブログ記事や投稿ページ向け</li>
                    <li><strong>product</strong> - ECサイトの商品ページ向け</li>
                    <li><strong>profile</strong> - プロフィールページ向け</li>
                </ul>
                <div class="lw-ogp-tip">
                    <span class="dashicons dashicons-lightbulb"></span>
                    <span>迷ったら「website」のままでOKです。</span>
                </div>
            <?php }, 'tag' ); ?>

            <?php lw_guide_item( 'X (旧Twitter) Card 設定', 'ogp-guide-twitter', function() { ?>
                <p>X（旧Twitter）でシェアされた時の表示形式を設定します。</p>
                <ul>
                    <li><strong>summary_large_image</strong> - 大きな画像付きカード（推奨）</li>
                    <li><strong>summary</strong> - 小さな画像付きカード</li>
                </ul>
                <p>
                    <strong>@ユーザー名</strong>には、サイト公式のXアカウント（例：@YourSite）を入力してください。
                    記事の著者アカウントは右側の欄に入力できます。
                </p>
            <?php }, 'twitter' ); ?>

            <?php lw_guide_item( 'Facebook App / Page ID', 'ogp-guide-facebook', function() { ?>
                <p>
                    Facebookページを運営している場合に設定します。
                    Facebook開発者ツールで取得したApp IDや、FacebookページのIDを入力できます。
                </p>
                <div class="lw-ogp-tip">
                    <span class="dashicons dashicons-lightbulb"></span>
                    <span>Facebookページを持っていない場合は、空欄のままでOKです。</span>
                </div>
            <?php }, 'facebook' ); ?>

            <!-- よくある質問 -->
            <?php lw_guide_item( 'よくある質問', 'ogp-guide-faq', function() { ?>
                <div class="lw-ogp-faq">
                    <div class="lw-ogp-faq-item">
                        <div class="lw-ogp-faq-q">
                            <span class="lw-ogp-faq-icon">Q</span>
                            OGP画像が反映されない場合は？
                        </div>
                        <div class="lw-ogp-faq-a">
                            <span class="lw-ogp-faq-icon lw-ogp-faq-icon-a">A</span>
                            <div class="lw-ogp-faq-a-content">
                                SNSには画像のキャッシュがあるため、すぐには反映されないことがあります。
                                以下のツールでキャッシュをクリアしてください：
                                <ul>
                                    <li><strong>Facebook：</strong><a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener">シェアデバッガー</a></li>
                                    <li><strong>X（Twitter）：</strong><a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener">Card Validator</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="lw-ogp-faq-item">
                        <div class="lw-ogp-faq-q">
                            <span class="lw-ogp-faq-icon">Q</span>
                            投稿ごとに違う画像を設定したい場合は？
                        </div>
                        <div class="lw-ogp-faq-a">
                            <span class="lw-ogp-faq-icon lw-ogp-faq-icon-a">A</span>
                            <div class="lw-ogp-faq-a-content">
                                各投稿・固定ページで「アイキャッチ画像」を設定すれば、その画像がOGP画像として使用されます。
                                ここで設定する画像は、アイキャッチが設定されていない時の「フォールバック（予備）」です。
                            </div>
                        </div>
                    </div>

                    <div class="lw-ogp-faq-item">
                        <div class="lw-ogp-faq-q">
                            <span class="lw-ogp-faq-icon">Q</span>
                            画像の推奨サイズは？
                        </div>
                        <div class="lw-ogp-faq-a">
                            <span class="lw-ogp-faq-icon lw-ogp-faq-icon-a">A</span>
                            <div class="lw-ogp-faq-a-content">
                                <strong>1200×630ピクセル</strong>（アスペクト比 1.91:1）が推奨です。
                                この比率であれば、Facebook・X・LINEなど主要なSNSで綺麗に表示されます。
                            </div>
                        </div>
                    </div>
                </div>
            <?php }, 'editor-help' ); ?>
        </div>
    </div>

</div>

<style>
/* OGP画像選択フィールド */
.lw-ogp-image-field {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-top: 12px;
}
.lw-ogp-image-preview {
    width: 320px;
    height: 168px;
    background: #f8fafc;
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
.lw-ogp-image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.lw-ogp-no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
}
.lw-ogp-no-image .dashicons {
    font-size: 48px;
    width: 48px;
    height: 48px;
}
.lw-ogp-no-image span:last-child {
    font-size: 13px;
}
.lw-ogp-image-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.lw-ogp-select-btn,
.lw-ogp-remove-btn {
    display: inline-flex !important;
    align-items: center;
    gap: 6px;
    padding: 10px 18px !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    cursor: pointer;
    transition: all 0.2s ease;
}
.lw-ogp-select-btn {
    background: linear-gradient(135deg, #2b72b5 0%, #3d8fd1 100%) !important;
    color: #fff !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(43, 114, 181, 0.25);
}
.lw-ogp-select-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(43, 114, 181, 0.35);
}
.lw-ogp-select-btn .dashicons {
    font-size: 18px;
    width: 18px;
    height: 18px;
}
.lw-ogp-remove-btn {
    background: #fff !important;
    color: #dc2626 !important;
    border: 2px solid #fecaca !important;
}
.lw-ogp-remove-btn:hover {
    background: #fef2f2 !important;
    border-color: #dc2626 !important;
}
.lw-ogp-remove-btn .dashicons {
    font-size: 16px;
    width: 16px;
    height: 16px;
}

@media (max-width: 782px) {
    .lw-ogp-image-field {
        flex-direction: column;
    }
    .lw-ogp-image-preview {
        width: 100%;
        max-width: 320px;
    }
    .lw-ogp-image-controls {
        flex-direction: row;
    }
}

/* ====================================
   OGPガイドセクション
   ==================================== */
.lw-ogp-guide {
    margin-top: 32px;
    max-width: 1000px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}
.lw-ogp-guide-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 28px;
    background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
}
.lw-ogp-guide-header .dashicons {
    font-size: 24px;
    width: 24px;
    height: 24px;
    color: #fff;
}
.lw-ogp-guide-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
}
.lw-ogp-guide-content {
    padding: 28px;
}
.lw-ogp-guide-section {
    margin-bottom: 32px;
}
.lw-ogp-guide-section:last-child {
    margin-bottom: 0;
}
.lw-ogp-guide-section > h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
    font-size: 16px;
    font-weight: 600;
    color: #1e3a5f;
}
.lw-ogp-guide-section > h3 .dashicons {
    font-size: 20px;
    width: 20px;
    height: 20px;
    color: #14b8a6;
}
.lw-ogp-guide-section p {
    margin: 0 0 12px;
    line-height: 1.8;
    color: #475569;
}

/* サンプルカード表示 */
.lw-ogp-example-box {
    margin: 16px 0;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}
.lw-ogp-example-label {
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
}
.lw-ogp-example-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    max-width: 500px;
}
.lw-ogp-example-image {
    width: 120px;
    min-height: 100px;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.lw-ogp-example-image .dashicons {
    font-size: 36px;
    width: 36px;
    height: 36px;
    color: #94a3b8;
}
.lw-ogp-example-text {
    padding: 12px 16px;
    flex: 1;
}
.lw-ogp-example-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
}
.lw-ogp-example-desc {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 6px;
}
.lw-ogp-example-url {
    font-size: 11px;
    color: #94a3b8;
}
.lw-ogp-example-note {
    margin-top: 12px;
    font-size: 13px;
    color: #64748b;
}

/* 各設定項目の説明 */
.lw-ogp-guide-item {
    margin-bottom: 24px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 10px;
    border-left: 4px solid #14b8a6;
}
.lw-ogp-guide-item:last-child {
    margin-bottom: 0;
}
.lw-ogp-guide-item h4 {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 600;
    color: #0f766e;
}
.lw-ogp-guide-item p {
    margin: 0 0 10px;
    font-size: 14px;
}
.lw-ogp-guide-item ul {
    margin: 10px 0;
    padding-left: 20px;
}
.lw-ogp-guide-item li {
    margin-bottom: 6px;
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
}

/* ヒント表示 */
.lw-ogp-tip {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
    border-radius: 8px;
    border: 1px solid rgba(245, 158, 11, 0.2);
}
.lw-ogp-tip .dashicons {
    font-size: 18px;
    width: 18px;
    height: 18px;
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 2px;
}
.lw-ogp-tip span {
    font-size: 13px;
    color: #92400e;
    line-height: 1.6;
}

/* FAQ */
.lw-ogp-faq {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.lw-ogp-faq-item {
    background: #f8fafc;
    border-radius: 10px;
    overflow: hidden;
}
.lw-ogp-faq-q {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #1e3a5f 0%, #2b72b5 100%);
    font-size: 14px;
    font-weight: 600;
    color: #fff;
}
.lw-ogp-faq-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #fff;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 700;
    color: #2b72b5;
    flex-shrink: 0;
}
.lw-ogp-faq-a {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    font-size: 14px;
    line-height: 1.8;
    color: #475569;
}
.lw-ogp-faq-a > span {
    flex-shrink: 0;
}
.lw-ogp-faq-a-content {
    flex: 1;
}
.lw-ogp-faq-icon-a {
    background: #14b8a6 !important;
    color: #fff !important;
}
.lw-ogp-faq-a-content ul {
    margin: 8px 0 0;
    padding-left: 20px;
}
.lw-ogp-faq-a-content li {
    margin-bottom: 4px;
}
.lw-ogp-faq-a a {
    color: #2b72b5;
    text-decoration: underline;
}
.lw-ogp-faq-a a:hover {
    color: #1e5a8a;
}

@media (max-width: 782px) {
    .lw-ogp-guide-content {
        padding: 20px;
    }
    .lw-ogp-example-card {
        flex-direction: column;
    }
    .lw-ogp-example-image {
        width: 100%;
        height: 120px;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // メディアライブラリを開くボタン
    document.querySelectorAll('.lw-ogp-select-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            var preview = document.getElementById(targetId + '_preview');
            var removeBtn = document.querySelector('.lw-ogp-remove-btn[data-target="' + targetId + '"]');

            var frame = wp.media({
                title: 'OGP画像を選択',
                button: { text: 'この画像を使用' },
                multiple: false,
                library: { type: 'image' }
            });

            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                input.value = attachment.url;
                preview.innerHTML = '<img src="' + attachment.url + '" alt="OGP画像">';
                removeBtn.style.display = 'inline-flex';
            });

            frame.open();
        });
    });

    // 画像を削除するボタン
    document.querySelectorAll('.lw-ogp-remove-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            var preview = document.getElementById(targetId + '_preview');

            input.value = '';
            preview.innerHTML = '<div class="lw-ogp-no-image"><span class="dashicons dashicons-format-image"></span><span>画像が設定されていません</span></div>';
            this.style.display = 'none';
        });
    });
});
</script>