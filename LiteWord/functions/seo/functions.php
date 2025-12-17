<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Voice Guide script loader
 */
function lw_enqueue_voice_guide() {
    static $loaded = false;
    if ( $loaded ) return;
    $loaded = true;

    wp_enqueue_script(
        'lw_voice_guide',
        get_template_directory_uri() . '/functions/seo/js/lw-voice-guide.js',
        [],
        css_version(),
        true
    );
}

/**
 * Voice help button (question mark icon)
 *
 * @param string $target_id Hidden text element ID
 */
function lw_voice_help_button( $target_id ) {
    lw_enqueue_voice_guide();
    ?>
    <button type="button" class="lw-voice-help-btn" data-voice-target="<?php echo esc_attr( $target_id ); ?>" title="Click to hear explanation" onclick="console.log('Inline click!'); return true;">
        <span class="dashicons dashicons-editor-help" style="pointer-events: none;"></span>
    </button>
    <style>
    .lw-voice-help-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-left: 12px;
        padding: 0;
        background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
        border: 2px solid #2b72b5;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        position: relative;
        z-index: 10;
    }
    .lw-voice-help-btn .dashicons {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #2b72b5;
        pointer-events: none;
    }
    .lw-voice-help-btn:hover {
        background: linear-gradient(135deg, #2b72b5 0%, #3d8fd1 100%);
        transform: scale(1.1);
    }
    .lw-voice-help-btn:hover .dashicons {
        color: #fff;
    }
    .lw-voice-help-btn.playing {
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        border-color: #dc2626;
        animation: pulse-help 1.5s infinite;
    }
    .lw-voice-help-btn.playing .dashicons {
        color: #fff;
    }
    .lw-voice-help-btn.playing .dashicons::before {
        content: "\f204";
    }
    @keyframes pulse-help {
        0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
        50% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
    }
    .lw-voice-help-text {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
    .lw-page-title-with-help {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .lw-page-title-with-help h1 {
        margin: 0;
    }
    .lw-h2-with-help {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .lw-h2-with-help h2 {
        margin: 0;
    }
    </style>
    <?php
}

/**
 * Hidden text for voice reading only
 *
 * @param string $id   Element ID
 * @param string $text Text to be read
 */
function lw_voice_help_text( $id, $text ) {
    ?>
    <div id="<?php echo esc_attr( $id ); ?>" class="lw-voice-help-text"><?php echo esc_html( $text ); ?></div>
    <?php
}

/**
 * SEO bulk edit guide text
 *
 * 【音声読み上げテキスト作成時の注意】
 * - 各パーツは50文字程度に収める（長すぎるとWeb Speech APIが失敗する）
 * - パーツは配列で管理し、implode('|', $parts) で連結する
 * - JSが | で分割して1つずつ順番に読み上げる
 * - 句読点「。」で自然なポーズが入る
 * - 専門用語は読みやすい表現に（例：SEO → エスイーオー）
 */
function lw_get_seo_bulk_guide_text() {
    $parts = [
        'SEO一括編集ページについてご説明します。',
        'このページでは、タイトル、SEOタイトル、メタディスクリプションなどを一覧で編集できます。',

        'まず、タイトルとSEOタイトルについて。',
        'タイトルは、会社概要、料金プランなど、ページの名前です。',
        'SEOタイトルは、検索結果に表示されるタイトルで、30文字以内がおすすめです。',
        '例えば「料金プラン」なら「初期費用無料、月額3980円からのシンプルな料金プラン」のように具体的に書きます。',

        '次に、メタディスクリプションについて。',
        '検索結果でタイトルの下に表示される説明文で、80文字から120文字程度がおすすめです。',
        'スマホでは70文字程度しか表示されないので、重要な情報は前半に入れましょう。',

        '次に、スラッグについて。',
        'ページのURLになる部分で、英単語で入力してください。',
        '会社概要ならcompany、料金プランならpricingという形です。',

        'ノーインデックス設定は、検索結果に出したくないページをnoindexに設定します。',
        'サンクスページや会員限定ページなどが対象です。',

        'アイキャッチ画像とOGP設定について。',
        'OGPはSNSでシェアされた際の画像なので、ページごとに設定することをおすすめします。',

        '投稿ページの場合は、カテゴリー設定もあります。',
        '基本的には1つのメインカテゴリーに絞ることをおすすめします。',
        'ブログ記事ではアイキャッチ画像の設定を強くおすすめします。',

        '以上がSEO一括編集ページの説明です。',
    ];
    return implode( '|', $parts );
}

/**
 * OGP setting guide text
 *
 * 【音声読み上げテキスト作成時の注意】
 * - 各パーツは50文字程度に収める（長すぎるとWeb Speech APIが失敗する）
 * - パーツは配列で管理し、implode('|', $parts) で連結する
 * - JSが | で分割して1つずつ順番に読み上げる
 */
function lw_get_ogp_guide_text() {
    $parts = [
        'OGP基本設定ページについてご説明します。',
        'OGPとは、オープングラフプロトコルの略です。',
        'SNSでページがシェアされた時に、どのように表示されるかを設定できます。',

        'まず、デフォルトOGP画像について。',
        'これは、サイト全体の共通画像です。',
        '個別に画像が設定されていないページで使用されます。',
        '推奨サイズは1200かける630ピクセルの横長画像です。',

        '次に、フロントページ専用OGP画像について。',
        'トップページだけに使う画像を設定できます。',
        '空欄の場合は、デフォルトOGP画像が使われます。',

        '次に、og:typeについて。',
        'ページの種類を指定します。',
        'ウェブサイトはトップページ向け、アーティクルはブログ記事向けです。',
        '迷ったらウェブサイトのままでOKです。',

        '次に、X、旧ツイッターの設定について。',
        'サマリーラージイメージは大きな画像付きカードで、おすすめです。',
        'サイト公式のアカウント名を@マーク付きで入力してください。',

        '最後に、フェイスブックの設定について。',
        'フェイスブックページを持っていない場合は、空欄のままでOKです。',

        '以上がOGP基本設定の説明です。',
    ];
    return implode( '|', $parts );
}

/**
 * Analysis setting guide text
 *
 * 【音声読み上げテキスト作成時の注意】
 * - 各パーツは50文字程度に収める（長すぎるとWeb Speech APIが失敗する）
 * - パーツは配列で管理し、implode('|', $parts) で連結する
 * - JSが | で分割して1つずつ順番に読み上げる
 */
function lw_get_analysis_guide_text() {
    $parts = [
        'アクセス解析設定ページについてご説明します。',
        'アクセス解析とは、サイトへの訪問者数や行動を記録・分析するツールです。',

        'まず、Googleアナリティクスについて。',
        'Googleが提供する無料のアクセス解析ツールで、世界で最も使われています。',
        '訪問者数、ページビュー、滞在時間、流入元などを把握できます。',
        'IDは、Gハイフンで始まる形式です。例えば、Gハイフン、エックスエックス、といった形です。',

        '次に、Googleタグマネージャーについて。',
        '複数のタグを一括管理できるツールです。',
        '初心者の方は、まずアナリティクスだけ設定すれば十分です。',
        'タグマネージャーを使う場合は、GTMハイフンで始まるIDを入力します。',

        '次に、管理者除外の設定について。',
        '自分のアクセスをカウントしたくない場合は、無効にするを選択してください。',
        'これにより、正確な訪問者数を把握できます。',

        '注意点として、アナリティクスとタグマネージャーの両方でタグを設定すると、二重計測になります。',
        'どちらか一方だけ設定するようにしてください。',

        '以上がアクセス解析設定の説明です。',
    ];
    return implode( '|', $parts );
}

/**
 * SEO Base setting - Front page guide text
 */
function lw_get_base_front_guide_text() {
    $parts = [
        'フロントページのタイトルタグ設定について説明します。',
        'タイトルタグとは、ブラウザのタブに表示される文字のことです。',
        '検索結果にも表示されるので、SEOにとても重要です。',
        '3つのセレクトボックスで、メイン、区切り文字、サブの順に設定できます。',
        '例えば、サイトタイトル、ハイフン、キャッチフレーズ、のような形式になります。',
        'サイトタイトルとキャッチフレーズは、設定ボタンから変更できます。',

        'メタディスクリプションについて説明します。',
        'メタディスクリプションは、検索結果でタイトルの下に表示される説明文です。',
        '80文字から120文字程度で、サイトの内容を簡潔に説明してください。',

        '例えば、ホームページ制作会社なら、',
        '「東京都渋谷区のホームページ制作会社です。集客に強いウェブサイトを、初期費用0円、月額9800円から制作いたします。」',
        'のように、業種、地域、強み、価格などを含めると効果的です。',

        'また、飲食店なら、',
        '「新宿駅徒歩3分の本格イタリアン。自家製パスタとワインが自慢です。ランチ営業あり、貸切も可能。ご予約はお電話で。」',
        'のように、場所、特徴、サービス内容を含めると良いでしょう。',
    ];
    return implode( '|', $parts );
}

/**
 * SEO Base setting - Post/Page guide text
 */
function lw_get_base_post_guide_text() {
    $parts = [
        '投稿ページと固定ページのタイトルタグ設定について説明します。',
        '投稿ページは、ブログ記事のタイトルタグ形式を設定します。',
        '通常は、記事タイトル、ハイフン、サイトタイトル、の形式がおすすめです。',
        '固定ページも同様に、ページタイトル、ハイフン、サイトタイトル、が一般的です。',
        '区切り文字は、ハイフンやパイプなど、お好みで選べます。',
    ];
    return implode( '|', $parts );
}

/**
 * SEO Base setting - Archive guide text
 */
function lw_get_base_archive_guide_text() {
    $parts = [
        'アーカイブ系ページのタイトルタグ設定について説明します。',
        'カテゴリーアーカイブは、記事をカテゴリ別に一覧表示するページです。',
        'タグアーカイブは、記事をタグ別に一覧表示するページです。',
        'その他のアーカイブは、投稿タイプ別などの一覧ページです。',
        '通常は、カテゴリ名やタグ名をメインに、サイトタイトルをサブに設定します。',
    ];
    return implode( '|', $parts );
}

/**
 * SEO Base setting - Special pages guide text
 */
function lw_get_base_special_guide_text() {
    $parts = [
        '特殊ページのタイトルタグ設定について説明します。',
        '検索結果ページは、サイト内検索の結果を表示するページです。',
        '404ページは、存在しないURLにアクセスした時に表示されるエラーページです。',
        'これらのページも適切なタイトルを設定しておくと、ユーザー体験が向上します。',
    ];
    return implode( '|', $parts );
}

/**
 * SEO Base setting - Other archives guide text
 */
function lw_get_base_other_guide_text() {
    $parts = [
        'その他のアーカイブページのタイトルタグ設定について説明します。',
        '著者アーカイブは、特定の著者が書いた記事の一覧ページです。',
        '日付アーカイブは、年月日ごとの記事一覧ページです。',
        'カスタム投稿タイプアーカイブは、カスタム投稿の一覧ページです。',
        '使用しないアーカイブは、デフォルトのままでも問題ありません。',
    ];
    return implode( '|', $parts );
}

/**
 * Site settings popup button and modal
 * サイトタイトルとキャッチフレーズを編集するポップアップ
 */
function lw_site_settings_popup_button() {
    ?>
    <button type="button" class="lw-site-settings-btn" onclick="document.getElementById('lw-site-settings-modal').style.display='flex';">
        <span class="dashicons dashicons-admin-settings"></span>
        <span>サイトタイトルとキャッチフレーズの変更</span>
    </button>
    <style>
    .lw-site-settings-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        margin-left: 16px;
        background: linear-gradient(135deg, #00aa80ff 0%, #08a9a9ff 100%);
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .lw-site-settings-btn:hover {
        background: linear-gradient(135deg, #008f6aff 0%, #108787ff 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,115,170,0.3);
    }
    .lw-site-settings-btn .dashicons {
        font-size: 16px;
        width: 16px;
        height: 16px;
    }
    </style>
    <?php
}

/**
 * Site settings popup modal
 * フロントページセクションに表示するモーダル
 */
function lw_site_settings_modal() {
    $site_title  = get_option( 'blogname' );
    $catchphrase = get_option( 'blogdescription' );
    $nonce       = wp_create_nonce( 'lw_site_settings_nonce' );
    ?>
    <div id="lw-site-settings-modal" class="lw-modal-overlay" style="display:none;">
        <div class="lw-modal-content">
            <div class="lw-modal-header">
                <h3><span class="dashicons dashicons-admin-settings"></span> サイト基本設定</h3>
                <button type="button" class="lw-modal-close" onclick="document.getElementById('lw-site-settings-modal').style.display='none';">&times;</button>
            </div>
            <div class="lw-modal-body">
                <div class="lw-modal-field">
                    <label for="lw-site-title">サイトタイトル</label>
                    <input type="text" id="lw-site-title" value="<?php echo esc_attr( $site_title ); ?>" class="lw-modal-input">
                    <p class="description">ブラウザのタブや検索結果に表示されるサイト名です。</p>
                </div>
                <div class="lw-modal-field">
                    <label for="lw-catchphrase">キャッチフレーズ</label>
                    <input type="text" id="lw-catchphrase" value="<?php echo esc_attr( $catchphrase ); ?>" class="lw-modal-input">
                    <p class="description">サイトの簡単な説明です。タイトルタグのサブに使用されます。</p>
                </div>
                <input type="hidden" id="lw-site-settings-nonce" value="<?php echo esc_attr( $nonce ); ?>">
            </div>
            <div class="lw-modal-footer">
                <button type="button" class="button" onclick="document.getElementById('lw-site-settings-modal').style.display='none';">キャンセル</button>
                <button type="button" class="button button-primary" onclick="lwSaveSiteSettings();">保存する</button>
            </div>
            <div id="lw-modal-message" class="lw-modal-message" style="display:none;"></div>
        </div>
    </div>
    <style>
    .lw-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
    }
    .lw-modal-content {
        background: #fff;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
    }
    .lw-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid #e0e0e0;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
    }
    .lw-modal-header h3 {
        margin: 0;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .lw-modal-header .dashicons {
        color: #0073aa;
    }
    .lw-modal-close {
        background: none;
        border: none;
        font-size: 28px;
        color: #666;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    .lw-modal-close:hover {
        color: #dc2626;
    }
    .lw-modal-body {
        padding: 24px;
    }
    .lw-modal-field {
        margin-bottom: 20px;
    }
    .lw-modal-field:last-child {
        margin-bottom: 0;
    }
    .lw-modal-field label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #1e1e1e;
    }
    .lw-modal-input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lw-modal-input:focus {
        outline: none;
        border-color: #0073aa;
        box-shadow: 0 0 0 3px rgba(0,115,170,0.15);
    }
    .lw-modal-field .description {
        margin-top: 6px;
        color: #666;
        font-size: 12px;
    }
    .lw-modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        background: #f8f9fa;
        border-radius: 0 0 12px 12px;
    }
    .lw-modal-message {
        padding: 12px 24px;
        text-align: center;
        font-weight: 500;
    }
    .lw-modal-message.success {
        background: #d4edda;
        color: #155724;
    }
    .lw-modal-message.error {
        background: #f8d7da;
        color: #721c24;
    }
    </style>
    <script>
    function lwSaveSiteSettings() {
        var title = document.getElementById('lw-site-title').value;
        var catchphrase = document.getElementById('lw-catchphrase').value;
        var nonce = document.getElementById('lw-site-settings-nonce').value;
        var messageEl = document.getElementById('lw-modal-message');

        var formData = new FormData();
        formData.append('action', 'lw_save_site_settings');
        formData.append('site_title', title);
        formData.append('catchphrase', catchphrase);
        formData.append('nonce', nonce);

        fetch(ajaxurl, {
            method: 'POST',
            body: formData
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            messageEl.style.display = 'block';
            if (data.success) {
                messageEl.className = 'lw-modal-message success';
                messageEl.textContent = '保存しました。ページを再読み込みします...';
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                messageEl.className = 'lw-modal-message error';
                messageEl.textContent = data.data || '保存に失敗しました。';
            }
        })
        .catch(function(error) {
            messageEl.style.display = 'block';
            messageEl.className = 'lw-modal-message error';
            messageEl.textContent = 'エラーが発生しました。';
        });
    }
    </script>
    <?php
}

/**
 * AJAX handler for saving site settings
 */
function lw_ajax_save_site_settings() {
    // Nonce check
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lw_site_settings_nonce' ) ) {
        wp_send_json_error( '不正なリクエストです。' );
    }

    // Permission check
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( '権限がありません。' );
    }

    $site_title  = isset( $_POST['site_title'] ) ? sanitize_text_field( $_POST['site_title'] ) : '';
    $catchphrase = isset( $_POST['catchphrase'] ) ? sanitize_text_field( $_POST['catchphrase'] ) : '';

    update_option( 'blogname', $site_title );
    update_option( 'blogdescription', $catchphrase );

    wp_send_json_success();
}
add_action( 'wp_ajax_lw_save_site_settings', 'lw_ajax_save_site_settings' );

/**
 * Guide section header with speed control
 *
 * @param string $title Guide title
 * @param string $icon  dashicons icon name (without dashicons-)
 */
function lw_guide_header( $title, $icon = 'book-alt' ) {
    lw_enqueue_voice_guide();
    ?>
    <div class="lw-guide-header">
        <div class="lw-guide-header-left">
            <span class="dashicons dashicons-<?php echo esc_attr( $icon ); ?>"></span>
            <h3><?php echo esc_html( $title ); ?></h3>
        </div>
        <div class="lw-guide-header-right">
            <div class="lw-voice-speed-control">
                <label class="lw-voice-speed-label">&#x1F39A; Speed</label>
                <select class="lw-voice-speed-select">
                    <option value="0.5">0.5x</option>
                    <option value="0.7">0.7x</option>
                    <option value="0.8">0.8x</option>
                    <option value="1" selected>1.0x</option>
                    <option value="1.2">1.2x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                </select>
            </div>
        </div>
    </div>
    <?php
}

/**
 * Voice read button
 *
 * @param string $target_id HTML element ID to read
 */
function lw_voice_button( $target_id ) {
    lw_enqueue_voice_guide();
    ?>
    <button type="button" class="lw-voice-btn" data-voice-target="<?php echo esc_attr( $target_id ); ?>">
        <span class="lw-voice-icon">&#x1F50A;</span>
        <span class="lw-voice-label">Read</span>
    </button>
    <?php
}

/**
 * Guide item with voice button
 *
 * @param string   $title   Item title
 * @param string   $id      Content ID (voice target)
 * @param callable $content Content callback function
 * @param string   $icon    dashicons icon name (without dashicons-)
 */
function lw_guide_item( $title, $id, $content, $icon = 'info-outline' ) {
    lw_enqueue_voice_guide();
    ?>
    <div class="lw-guide-item">
        <div class="lw-guide-item-header">
            <div class="lw-guide-item-title">
                <span class="dashicons dashicons-<?php echo esc_attr( $icon ); ?>"></span>
                <h4><?php echo esc_html( $title ); ?></h4>
            </div>
            <?php lw_voice_button( $id ); ?>
        </div>
        <div class="lw-guide-item-content" id="<?php echo esc_attr( $id ); ?>">
            <?php $content(); ?>
        </div>
    </div>
    <?php
}
