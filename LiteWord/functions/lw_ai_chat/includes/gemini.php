<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — Gemini API 呼び出し・プロンプト構築
 */

/**
 * ローカル処理 — ユーザー自前のGemini APIキーで直接呼び出し
 */
function lw_ai_chat_call_gemini_local($api_key, $question, $history, $site_settings = null, $category = 'design') {
    // カテゴリ別プロンプト構築
    $category_config = lw_ai_chat_get_category_config($category);

    if (empty($category_config['slugs'])) {
        // マニュアルなしカテゴリ（general）
        $system_prompt = $category_config['prompt'];
    } else {
        // マニュアル付きカテゴリ — スラッグ指定で取得
        $manual = lw_ai_chat_get_manual_by_category($category_config['slugs']);
        if (empty($manual)) {
            // フォールバック: 全マニュアル取得
            $manual = lw_ai_chat_get_manual_content();
        }
        if (empty($manual)) {
            return new WP_Error('no_manual', 'マニュアルデータを取得できませんでした。', ['status' => 502]);
        }
        $system_prompt = lw_ai_chat_build_category_prompt($category_config, $manual);
    }

    // サイト設定が提供されている場合、プロンプトに追加
    if (!empty($site_settings)) {
        $system_prompt .= lw_ai_chat_build_settings_context($site_settings);
    }

    // AI生成セッションの状況を注入（AIキャラが全体把握できるように）
    if (class_exists('LW_AI_Session_Manager')) {
        $session_status = LW_AI_Session_Manager::get_status_summary();
        if (!empty($session_status['hasActive'])) {
            $system_prompt .= "\n\n## ページ自動生成の進捗状況\n";
            foreach ($session_status['activeSessions'] as $s) {
                $system_prompt .= "- セッションID: {$s['sessionId']}（{$s['businessType']} {$s['pageType']}）\n";
                $system_prompt .= "  進捗: {$s['completed']}/{$s['total']} セクション完了\n";
                if ($s['nextSection']) {
                    $system_prompt .= "  次: {$s['nextSection']['section_title']}（{$s['nextSection']['section_type']}）\n";
                }
            }
            $system_prompt .= "ユーザーが「続きを生成して」と言ったら、REST API `/wp-json/lw-ai-generator/v1/sessions/{sessionId}/generate-next` で次のセクションを生成できます。\n";
        } elseif (!empty($session_status['recentSessions'])) {
            $recent = $session_status['recentSessions'][0];
            if ($recent['status'] === 'completed') {
                $system_prompt .= "\n\n## 最近のページ生成\n";
                $system_prompt .= "- {$recent['business_type']}（{$recent['total_sections']}セクション）が完了しています。\n";
            }
        }
    }

    $contents   = lw_ai_chat_build_gemini_contents($history, $question);
    $model_name = lw_ai_chat_get_model_name();
    $is_pro     = strpos($model_name, 'pro') !== false;
    $url        = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model_name . ':generateContent?key=' . $api_key;

    $response = wp_remote_post($url, [
        'headers'   => ['Content-Type' => 'application/json'],
        'body'      => json_encode([
            'system_instruction' => ['parts' => [['text' => $system_prompt]]],
            'contents'           => $contents,
            'generationConfig'   => [
                'temperature'     => $is_pro ? 0.15 : 0.15,
                'maxOutputTokens' => $is_pro ? 4096 : 2048,
            ],
        ]),
        'timeout'   => $is_pro ? 60 : 60,
        'sslverify' => lw_ai_chat_sslverify(),
    ]);

    if (is_wp_error($response)) {
        return new WP_Error('api_error', '通信エラー: ' . $response->get_error_message(), ['status' => 500]);
    }

    $http_code = wp_remote_retrieve_response_code($response);
    $body      = json_decode(wp_remote_retrieve_body($response), true);

    // Gemini APIのHTTPエラー
    if ($http_code !== 200) {
        $gemini_msg = $body['error']['message'] ?? '';

        if ($http_code === 400 || $http_code === 403) {
            update_option('lw_ai_chat_use_own_key', '0', false);
            return new WP_Error('invalid_api_key',
                'AI Studioのキーが無効です。設定を確認してください。公式サーバーに切り替えました。',
                ['status' => 403, 'fallback' => true]
            );
        }
        if ($http_code === 429) {
            return new WP_Error('gemini_rate_limit',
                'AI Studioのレート制限に達しました。しばらく待ってからお試しください。',
                ['status' => 429]
            );
        }
        return new WP_Error('gemini_error',
            'AI Studioでエラーが発生しました' . ($gemini_msg ? ': ' . $gemini_msg : ''),
            ['status' => $http_code]
        );
    }

    $answer = $body['candidates'][0]['content']['parts'][0]['text'] ?? '';

    // 回答が空の場合のデバッグ
    if (empty($answer) && defined('WP_DEBUG') && WP_DEBUG) {
        $finish_reason = $body['candidates'][0]['finishReason'] ?? 'unknown';
        $block_reason  = $body['promptFeedback']['blockReason'] ?? '';
        error_log('[LW AI Chat] Empty answer. finishReason=' . $finish_reason . ' blockReason=' . $block_reason . ' model=' . $model_name);
    }

    return !empty($answer) ? $answer : '申し訳ございません、うまく回答を生成できませんでした。もう一度質問していただけますか？';
}

/**
 * リモート処理 — lite-word.com の ext-chat API に中継
 */
function lw_ai_chat_call_remote($question, $history, $honeypot) {
    $response = wp_remote_post(lw_ai_chat_api_url(), [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => json_encode([
            'site_key'   => lw_ai_chat_get_site_key(),
            'site_url'   => home_url(),
            'question'   => $question,
            'history'    => array_slice($history, -5),
            'is_premium' => lw_ai_chat_is_premium(),
            'website'    => $honeypot,
        ]),
        'timeout'   => 35,
        'sslverify' => lw_ai_chat_sslverify(),
    ]);

    if (is_wp_error($response)) {
        return new WP_Error('proxy_error', '通信エラーが発生しました', ['status' => 502]);
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body        = json_decode(wp_remote_retrieve_body($response), true);

    if ($status_code !== 200) {
        return new WP_Error('api_error', $body['message'] ?? '回答を取得できませんでした', ['status' => $status_code]);
    }

    return $body['answer'] ?? '';
}

/**
 * Gemini API用の会話履歴を構築
 */
function lw_ai_chat_build_gemini_contents($history, $question) {
    $contents = [];
    foreach (array_slice($history, -5) as $turn) {
        if (!empty($turn['question'])) {
            $contents[] = ['role' => 'user', 'parts' => [['text' => $turn['question']]]];
        }
        if (!empty($turn['answer'])) {
            $contents[] = ['role' => 'model', 'parts' => [['text' => $turn['answer']]]];
        }
    }
    $contents[] = ['role' => 'user', 'parts' => [['text' => $question]]];
    return $contents;
}

/**
 * マニュアルコンテンツをlite-word.comから取得（1時間キャッシュ）
 */
/**
 * カテゴリ別設定（スラッグ・プロンプト）
 */
function lw_ai_chat_get_category_config($category) {
    $categories = [
        'design' => [
            'label' => 'デザイン・見た目',
            'expert' => 'デザイン・レイアウトの専門家',
            'slugs' => [
                'header-overview', 'header-pattern', 'header-logo', 'header-menu',
                'header-cta', 'header-phone-cta', 'header-sticky', 'header-info-bar',
                'header-pickup-menu', 'header-page-override', 'footer-settings',
                'colors-fonts', 'follow-cta', 'responsive-guide',
            ],
        ],
        'blocks' => [
            'label' => 'ブロック・ページ作成',
            'expert' => 'ブロック操作・ページ構築の専門家',
            'slugs' => [
                'getting-started-block', 'blocks-reference', 'firstview',
                'buttons-cta', 'lists', 'posts-news', 'content-media',
                'company-profile', 'other-blocks', 'heading-table-utility',
                'common-sidebar', 'inline-styling', 'use-case-top-page', 'use-case-lp',
            ],
        ],
        'settings' => [
            'label' => '設定・機能',
            'expert' => 'サイト設定・拡張機能の専門家',
            'slugs' => [
                'seo', 'analytics', 'mail-form', 'my-parts', 'toggle-settings',
                'redirect', 'membership', 'countdown', 'code-injection', 'code-page',
                'page-editor', 'post-editor', 'ai-page-generator',
                'category-settings', 'widgets', 'custom-widgets', 'page-templates',
                'page-template-popup', 'archive-settings',
            ],
        ],
        'start' => [
            'label' => 'はじめて・基本',
            'expert' => '初心者ガイドの専門家',
            'slugs' => [
                'getting-started', 'plans', 'activation', 'update-guide',
                'troubleshooting', 'customization', 'user-profile',
            ],
        ],
        'general' => [
            'label' => 'その他・WordPress全般',
            'expert' => '',
            'slugs' => [],
            'prompt' => "あなたはLiteWordテーマのAIアシスタント（猫ロボットキャラクター）です。\n"
                . "語尾の最後の1文だけ「にゃ」で締めてください。全文をにゃにゃ言わないこと。\n"
                . "WordPress、Web制作、SEO、マーケティングなど幅広い質問に答えてください。\n"
                . "LiteWordの操作に関する質問が来た場合は「カテゴリボタンで該当するカテゴリを選んでにゃ！」と案内してください。",
        ],
    ];
    return $categories[$category] ?? $categories['design'];
}

/**
 * カテゴリ別マニュアル取得（スラッグ指定）
 */
function lw_ai_chat_get_manual_by_category($slugs) {
    $slug_str = implode(',', $slugs);
    $cache_key = 'lw_ai_chat_manual_' . md5($slug_str);
    $cached = get_transient($cache_key);
    if ($cached !== false) return $cached;

    $url = 'https://lite-word.com/wp-json/lw-manual/v1/manual-content?slugs=' . urlencode($slug_str);
    if (defined('WP_DEBUG') && WP_DEBUG && strpos(home_url(), 'localhost') !== false) {
        $url = 'http://localhost/SUPPORT_LOUNGE/LiteWord/wp-json/lw-manual/v1/manual-content?slugs=' . urlencode($slug_str);
    }

    $response = wp_remote_get($url, ['timeout' => 15, 'sslverify' => lw_ai_chat_sslverify()]);
    if (is_wp_error($response)) return '';

    $content = json_decode(wp_remote_retrieve_body($response), true)['content'] ?? '';
    if (!empty($content)) {
        set_transient($cache_key, $content, HOUR_IN_SECONDS);
    }
    return $content;
}

/**
 * カテゴリ別システムプロンプト構築
 */
function lw_ai_chat_build_category_prompt($config, $manual_content) {
    $label = $config['label'];
    $expert = $config['expert'];

    return <<<PROMPT
あなたはLiteWord（ライトワード）WordPressテーマの公式サポートAIです。
あなたは「{$label}」カテゴリの{$expert}です。
ユーザーはLiteWordテーマの管理画面（ダッシュボード）から質問しています。

## 絶対ルール（必ず守ること）

1. **マニュアル内容のみに基づいて回答する。推測・創作は絶対禁止。**
2. **マニュアルにない質問** → 「この質問には今お答えできる情報がないので、次回から回答できるようにシステム担当に報告しておきますね！」
3. **他カテゴリの質問** → 回答できる範囲で簡潔に答えつつ「カテゴリボタンで『○○』を選ぶともっと詳しく答えられるにゃ！」と案内する。
4. **「公式サポートにお問い合わせください」等のサポート誘導文は絶対に出力禁止。**
5. 手順は番号付きステップで説明する。
6. 簡潔に回答する（300文字以内目安）。長くなる場合はマニュアルURLへ誘導。
7. 最後の1文だけ「にゃ」「にゃ！」「にゃ〜」で締める。全文をにゃにゃ言わない。

## 【最重要】回答フォーマット（省略禁止・毎回必ず末尾に付けること）

回答の本文を書いた後、必ず末尾に以下を付けること。
📖 **マニュアル**: [ページタイトル](https://lite-word.com/manual/{スラッグ}/)

## マニュアル（{$label}）

{$manual_content}
PROMPT;
}

function lw_ai_chat_get_manual_content() {
    $cached = get_transient('lw_ai_chat_manual_content');
    if ($cached !== false) return $cached;

    $url = 'https://lite-word.com/wp-json/lw-manual/v1/manual-content';
    if (defined('WP_DEBUG') && WP_DEBUG && strpos(home_url(), 'localhost') !== false) {
        $url = 'http://localhost/SUPPORT_LOUNGE/LiteWord/wp-json/lw-manual/v1/manual-content';
    }

    $response = wp_remote_get($url, ['timeout' => 15, 'sslverify' => lw_ai_chat_sslverify()]);
    if (is_wp_error($response)) return '';

    $content = json_decode(wp_remote_retrieve_body($response), true)['content'] ?? '';
    if (!empty($content)) {
        set_transient('lw_ai_chat_manual_content', $content, HOUR_IN_SECONDS);
    }

    return $content;
}

/**
 * ダッシュボードAIチャット用システムプロンプト
 */
function lw_ai_chat_build_system_prompt($manual_content) {
    return <<<PROMPT
あなたはLiteWord（ライトワード）WordPressテーマの公式サポートAIです。
ユーザーはLiteWordテーマの管理画面（ダッシュボード）から質問しています。

## 絶対ルール（必ず守ること）

1. **マニュアル内容のみに基づいて回答する。推測・創作は絶対禁止。**
2. **マニュアルにない質問** → 「この質問には今お答えできる情報がないので、次回から回答できるようにシステム担当に報告しておきますね！他にLiteWordについて聞きたいことがあれば何でもどうぞ！」
3. **機能要望っぽい質問** → 「ご要望ありがとうございます！開発チームに提案として伝えておきますね！」
4. **「公式サポートにお問い合わせください」等のサポート誘導文は絶対に出力禁止。**
5. 手順は番号付きステップで説明する。
6. 簡潔に回答する（300文字以内目安）。長くなる場合はマニュアルURLへ誘導。
7. 最後の1文だけ「にゃ」「にゃ！」「にゃ〜」で締める。全文をにゃにゃ言わない。

## 【最重要】回答フォーマット（省略禁止・毎回必ず末尾に付けること）

回答の本文を書いた後、必ず末尾に以下の2行を付けること。絶対に省略しないこと。

```
📖 **マニュアル**: [ページタイトル](https://lite-word.com/manual/{スラッグ}/)
⚙️ **設定ページ**: [設定名を開く](カスタマイザー直リンクURL)
```

### 回答例（カラーの質問の場合）

メインカラーを変更するには：
1. 「外観 > カスタマイズ > カラー」を開く
2. 「メインカラー」をクリック
3. 好きな色を選択して「公開」

📖 **マニュアル**: [カラー設定・フォント](https://lite-word.com/manual/colors-fonts/)
⚙️ **設定ページ**: [カラー設定を開く](★customizer_linksのcolorsのURL★)

### URL生成ルール
- **マニュアルURL**: `https://lite-word.com/manual/{スラッグ}/` を使う。ドメインは必ず `https://lite-word.com`
- **設定ページURL**: 「このユーザーのサイト設定」セクションの `customizer_links` のURLをそのまま使う。**絶対に `https://lite-word.com/wp-admin/` ではなく、ユーザー自身のサイトのURL。**
- 設定ページに該当がない質問（ブロック操作・プラン比較等）→ ⚙️行は省略してよい

## マニュアルページ → カスタマイザー対応表

質問内容に応じて、以下の対応表からマニュアルURLとcustomizer_linksキーを選ぶこと。

| 質問トピック | マニュアルスラッグ | customizer_linksキー |
|---|---|---|
| 色・カラー | colors-fonts | colors |
| フォント・文字 | colors-fonts | fonts |
| ヘッダー全般 | header-overview | header |
| ヘッダーパターン選択 | header-pattern | header |
| ロゴ設定 | header-logo | header |
| メニュー設定 | header-menu | header |
| ヘッダーCTAボタン | header-cta | header |
| 電話CTA | header-phone-cta | header |
| 追従ヘッダー | header-sticky | header |
| インフォバー | header-info-bar | header |
| ピックアップメニュー | header-pickup-menu | header |
| ページ別ヘッダー上書き | header-page-override | header |
| フッター・ドロワー | footer-settings | footer |
| 投稿ページ設定 | single-post-settings | single_post |
| 見出しデザイン・目次 | single-post-settings | single_post |
| アーカイブ・一覧 | archive-settings | archive |
| 固定ページ編集画面 | page-editor | page_post |
| 投稿編集画面 | post-editor | single_post |
| 追従CTAボタン | follow-cta | follow_cta |
| ローディング | footer-settings | loading |
| 拡張機能ON/OFF | toggle-settings | extensions |
| SEO・OGP | seo | extensions |
| メールフォーム | mail-form | extensions |
| アナリティクス・GTM | analytics | analytics |

## 全マニュアルページ一覧

### はじめに
- /manual/getting-started/ — セットアップガイド
- /manual/plans/ — 無料・有料プランの違い
- /manual/activation/ — プレミアムのアクティベート方法
- /manual/getting-started-block/ — ブロックの基本操作
- /manual/blocks-reference/ — 全ブロックリファレンス（147種）
- /manual/customization/ — カスタマイズ・子テーマ・カスタムCSS
- /manual/update-guide/ — テーマアップデート方法
- /manual/troubleshooting/ — トラブルシューティング
- /manual/membership/ — 閲覧権限（会員限定ページ）
- /manual/redirect/ — 301リダイレクト設定
- /manual/countdown/ — カウントダウンタイマー
- /manual/user-profile/ — ユーザープロフィール管理
- /manual/use-case-top-page/ — トップページの作り方ガイド
- /manual/use-case-lp/ — LPの作り方ガイド
- /manual/permalink-settings/ — パーマリンク設定
- /manual/responsive-guide/ — レスポンシブ表示ガイド

### カスタマイザー
- /manual/colors-fonts/ — カラー・フォント設定
- /manual/header-overview/ — ヘッダー設定（概要・7パターン比較）
- /manual/header-pattern/ — ヘッダーパターン選択
- /manual/header-logo/ — ロゴ設定
- /manual/header-menu/ — メニュー設定
- /manual/header-cta/ — ヘッダーCTAボタン
- /manual/header-phone-cta/ — 電話CTA（パターン1専用）
- /manual/header-sticky/ — 追従ヘッダー
- /manual/header-info-bar/ — インフォメーションバー
- /manual/header-pickup-menu/ — ピックアップメニュー（パターン5専用）
- /manual/header-page-override/ — ページ別ヘッダー上書き
- /manual/footer-settings/ — フッター・ドロワー・ローディング
- /manual/single-post-settings/ — 投稿ページ設定（見出し・目次・シェア）
- /manual/archive-settings/ — アーカイブ・固定ページ設定
- /manual/page-editor/ — 固定ページ編集画面
- /manual/post-editor/ — 投稿編集画面
- /manual/follow-cta/ — 追従CTAボタン
- /manual/code-injection/ — コード追記（head/body）

### ブロック
- /manual/firstview/ — ファーストビュー（FV）19種
- /manual/buttons-cta/ — ボタン・CTA 24種
- /manual/lists/ — リスト 12種
- /manual/posts-news/ — 記事一覧・ニュース 7種
- /manual/content/ — コンテンツ・メディア 22種
- /manual/company-profile/ — 会社概要・プロフィール 7種
- /manual/other-blocks/ — FAQ・ステップ・お客様の声等 24種
- /manual/heading-table-utility/ — 見出し・テーブル・ユーティリティ 35種
- /manual/common-sidebar/ — 全ブロック共通サイドバー設定
- /manual/inline-styling/ — テキストの個別スタイル設定

### 拡張機能
- /manual/seo/ — SEO設定
- /manual/ai-system/ — AIページ自動生成
- /manual/mail-form/ — メールフォーム
- /manual/my-parts/ — マイパーツ
- /manual/toggle-settings/ — 拡張機能ON/OFF

### その他
- /manual/category-settings/ — カテゴリ設定
- /manual/widgets/ — ウィジェットエリア
- /manual/analytics/ — Google Analytics・GTM
- /manual/code-page/ — コード専用ページ
- /manual/page-template-popup/ — ページテンプレート選択
- /manual/custom-widgets/ — カスタムウィジェット
- /manual/page-templates/ — テンプレート一覧

## マニュアル内容
{$manual_content}

## 【再掲・最重要ルール】回答の末尾に必ず以下を付けること。省略禁止。
📖 **マニュアル**: [ページタイトル](https://lite-word.com/manual/{スラッグ}/)
⚙️ **設定ページ**: [設定名を開く](customizer_linksのURL)
回答本文は標準的な日本語で書き、最後の1文のみ「にゃ」で締めること。
PROMPT;
}

/**
 * サイト設定コンテキストをプロンプトに追加する文字列を生成
 */
function lw_ai_chat_build_settings_context($site_settings) {
    $lines = [];
    $lines[] = "\n\n## このユーザーのサイト設定（現在の状態）";
    $lines[] = "**重要な使い方ルール:**";
    $lines[] = "- 質問に関連する設定値がある場合、「現在の設定は〇〇です」と具体的に教えること";
    $lines[] = "- 例: 「メインカラーを変えたい」→「現在のメインカラーは #333333 です。変更するには…」";
    $lines[] = "- ⚙️設定ページのURLは、下記 `customizer_links` のURLをそのまま使うこと（絶対に書き換えない）\n";

    if (!empty($site_settings['site'])) {
        $s = $site_settings['site'];
        $lines[] = "### サイト基本情報";
        $lines[] = "- サイト名: " . ($s['name'] ?? '未設定');
        $lines[] = "- キャッチフレーズ: " . ($s['description'] ?? '未設定');
        $lines[] = "- URL: " . ($s['url'] ?? '');
        $lines[] = "- パーマリンク: " . ($s['permalink'] ?? '基本');
        $lines[] = "- プレミアム: " . (($s['is_premium'] ?? false) ? 'はい' : 'いいえ');
    }

    if (!empty($site_settings['colors'])) {
        $c = $site_settings['colors'];
        $lines[] = "\n### カラー設定（customizer_links: colors）";
        if (!empty($c['main']))   $lines[] = "- メインカラー: " . $c['main'];
        if (!empty($c['accent'])) $lines[] = "- アクセントカラー: " . $c['accent'];
        if (!empty($c['text']))   $lines[] = "- 文字色: " . $c['text'];
        if (!empty($c['link']))   $lines[] = "- リンク色: " . $c['link'];
    }

    if (!empty($site_settings['fonts'])) {
        $f = $site_settings['fonts'];
        $lines[] = "\n### フォント設定（customizer_links: fonts）";
        if (!empty($f['body']))   $lines[] = "- サイト全体: " . $f['body'] . " (太さ: " . ($f['body_weight'] ?: 'デフォルト') . ")";
        if (!empty($f['page']))   $lines[] = "- 固定ページ: " . $f['page'];
        if (!empty($f['single'])) $lines[] = "- 投稿ページ: " . $f['single'];
    }

    if (!empty($site_settings['header'])) {
        $lines[] = "\n### ヘッダー設定（customizer_links: header）";
        $lines[] = "- ヘッダーパターン: " . ($site_settings['header']['pattern_default'] ?: '未設定');
    }

    if (!empty($site_settings['footer'])) {
        $lines[] = "\n### フッター設定（customizer_links: footer）";
        $lines[] = "- フッターパターン: " . ($site_settings['footer']['pattern_default'] ?? '未設定');
    }

    if (!empty($site_settings['single_post'])) {
        $sp = $site_settings['single_post'];
        $lines[] = "\n### 投稿ページ設定（customizer_links: single_post）";
        if (!empty($sp['column']))     $lines[] = "- カラム: " . $sp['column'];
        if (!empty($sp['toc_switch'])) $lines[] = "- 目次: " . $sp['toc_switch'];
    }

    if (!empty($site_settings['extensions'])) {
        $e = $site_settings['extensions'];
        $lines[] = "\n### 拡張機能（customizer_links: extensions）";
        $lines[] = "- メールフォーム: " . $e['mail_form'];
        $lines[] = "- アニメーション: " . $e['animation'];
        $lines[] = "- SEO機能: " . $e['seo'];
        $lines[] = "- コメント機能: " . $e['comment'];
    }

    if (!empty($site_settings['archive'])) {
        $lines[] = "\n### アーカイブ設定（customizer_links: archive）";
        $lines[] = "- FVパターン: " . ($site_settings['archive']['fv_pattern'] ?: '未設定');
        $lines[] = "- 記事一覧パターン: " . ($site_settings['archive']['post_list_pattern'] ?: '未設定');
    }

    if (!empty($site_settings['follow_cta'])) {
        $lines[] = "\n### 追従CTA設定（customizer_links: follow_cta）";
        $lines[] = "- パターン: " . ($site_settings['follow_cta']['pattern_default'] ?: '未設定');
    }

    if (!empty($site_settings['loading'])) {
        $lines[] = "\n### ローディング設定（customizer_links: loading）";
        $lines[] = "- パターン: " . ($site_settings['loading']['pattern_default'] ?: '未設定');
    }

    if (!empty($site_settings['analytics'])) {
        $a = $site_settings['analytics'];
        $lines[] = "\n### アナリティクス設定（customizer_links: analytics）";
        $lines[] = "- Google Analytics ID: " . ($a['ga_id'] ?: '未設定');
        $lines[] = "- Google Tag Manager ID: " . ($a['gtm_id'] ?: '未設定');
    }

    if (!empty($site_settings['customizer_links'])) {
        $links = $site_settings['customizer_links'];
        $lines[] = "\n### customizer_links（⚙️設定ページのURLに使うこと。そのままコピーして使用。書き換え禁止）";
        foreach ($links as $key => $url) {
            $lines[] = "- {$key}: {$url}";
        }
    }

    return implode("\n", $lines);
}
