<?php
if (!defined('ABSPATH')) exit;

/**
 * LW AI Chat — チャットプロキシ（メイン処理）
 */

/**
 * チャット送信 — 自前キーモードならローカル処理、それ以外はlite-word.comに中継
 */
function lw_ai_chat_proxy($request) {
    $user_id = get_current_user_id();

    // 同意チェック
    if (get_user_meta($user_id, 'lw_ai_chat_consent', true) !== '1') {
        return new WP_Error('no_consent', '利用規約への同意が必要です', ['status' => 403]);
    }

    $question      = sanitize_text_field($request->get_param('question') ?: '');
    $history       = $request->get_param('history') ?: [];
    $honeypot      = $request->get_param('website') ?: '';
    $site_settings = $request->get_param('site_settings') ?: null;
    $category      = sanitize_text_field($request->get_param('category') ?: 'liteword');

    if (empty($question)) {
        return new WP_Error('empty_question', '質問を入力してください', ['status' => 400]);
    }

    // ★ Phase 2: ページ生成意図の検出
    $page_action = lw_ai_chat_detect_page_generation( $question );

    /* 🔒 ページ生成はプレミアム（14日試用を含む）限定。
          チャットは無料でも使えるが、ここで契約状態を見ないと
          「作るにゃ！」と案内してから REST 側で 403 になり、
          利用者には「約束したのに失敗した」ようにしか見えない。
          UIの他の導線（admin-ui.js・block-ai-sidebar.js・text-selection-ai.js）は
          すべて isPremium でボタンを塞いでいるので、ここだけが素通りだった。 */
    if ( $page_action && function_exists( 'lw_ai_system_has_subscription' ) && ! lw_ai_system_has_subscription() ) {
        $answer  = "ページの自動生成はプレミアムプラン限定の機能だにゃ。\n\n";
        $answer .= "14日間は無料でお試しできるにゃ！詳しくはこちらを見てにゃ。\n\n";
        $answer .= "📖 **マニュアル**: [AIページ自動生成](https://lite-word.com/manual/ai-system/) / [無料・有料プランの違い](https://lite-word.com/manual/plans/)";

        lw_ai_chat_save_local( $user_id, $question, $answer );

        return array(
            'answer'     => $answer,
            'is_premium' => lw_ai_chat_is_premium(),
        );
    }

    if ( $page_action ) {
        // セッション進捗の確認
        $status = class_exists( 'LW_AI_Session_Manager' )
            ? LW_AI_Session_Manager::get_status_summary()
            : null;

        // 進行中セッションがある場合は進捗を報告
        if ( $status && ! empty( $status['hasActive'] ) ) {
            $active = $status['activeSessions'][0];
            $answer = "今、**" . $active['businessType'] . "**のページを生成中だにゃ！\n\n";
            $answer .= "📊 進捗: **{$active['completed']}/{$active['total']}** セクション完了\n";
            if ( $active['nextSection'] ) {
                $next_title = $active['nextSection']['section_title'] ?: $active['nextSection']['section_type'];
                $answer .= "👉 次: {$next_title}\n";
            }
            $answer .= "\n先にこちらを完了してから、新しいページを作るにゃ！";

            lw_ai_chat_save_local( $user_id, $question, $answer );
            return [
                'answer'     => $answer,
                'is_premium' => lw_ai_chat_is_premium(),
            ];
        }

        // レート制限チェック
        if ( class_exists( 'LW_AI_Session_Manager' ) ) {
            $rate_limit = LW_AI_Session_Manager::check_daily_limit();
            if ( ! $rate_limit['allowed'] ) {
                $answer = "申し訳ないにゃ！本日のページ生成上限（**{$rate_limit['limit']}回/日**）に達しているにゃ。\n";
                $answer .= "明日になったらまた使えるにゃ！";
                lw_ai_chat_save_local( $user_id, $question, $answer );
                return [
                    'answer'     => $answer,
                    'is_premium' => lw_ai_chat_is_premium(),
                ];
            }
        }

        // ページ生成アクションを返す
        $remaining_text = '';
        if ( isset( $rate_limit ) && $rate_limit['limit'] > 0 ) {
            $remaining_text = "\n📊 残り: **{$rate_limit['remaining']}/{$rate_limit['limit']}回**（本日）";
        }

        $answer = "**{$page_action['businessType']}**の{$page_action['pageTypeLabel']}を作るにゃ！🐱\n\n";
        $answer .= "AIが自動で構成案を作って、セクションごとにブロックを生成するにゃ。\n";
        $answer .= "少し時間がかかるけど（1〜3分）、完了したら下書きページに保存するにゃ！{$remaining_text}\n\n";
        $answer .= "📖 **マニュアル**: [AIページ自動生成](https://lite-word.com/manual/ai-system/)";

        lw_ai_chat_save_local( $user_id, $question, $answer );

        return [
            'answer'     => $answer,
            'is_premium' => lw_ai_chat_is_premium(),
            'action'     => $page_action,
        ];
    }

    // ★ 進捗確認の意図を検出
    if ( lw_ai_chat_is_progress_query( $question ) && class_exists( 'LW_AI_Session_Manager' ) ) {
        $status = LW_AI_Session_Manager::get_status_summary();
        if ( ! empty( $status['hasActive'] ) ) {
            $active = $status['activeSessions'][0];
            $answer = "📊 **{$active['businessType']}**のページ生成状況だにゃ！\n\n";
            $answer .= "- 完了: **{$active['completed']}/{$active['total']}** セクション\n";
            if ( $active['nextSection'] ) {
                $next_title = $active['nextSection']['section_title'] ?: $active['nextSection']['section_type'];
                $answer .= "- 次のセクション: {$next_title}\n";
            }

            // 完了済みセクションの一覧
            $completed_list = array();
            foreach ( $active['sections'] as $s ) {
                if ( $s['status'] === 'completed' ) {
                    $completed_list[] = "✅ {$s['section_title']}";
                } elseif ( $s['status'] === 'failed' ) {
                    $completed_list[] = "❌ {$s['section_title']}";
                } else {
                    $completed_list[] = "⏳ {$s['section_title']}";
                }
            }
            $answer .= "\n" . implode( "\n", $completed_list );

            if ( (int) $active['completed'] >= (int) $active['total'] ) {
                $answer .= "\n\n🎉 全セクション完了！下書きページを確認してにゃ！";
            }

            lw_ai_chat_save_local( $user_id, $question, $answer );
            return [
                'answer'     => $answer,
                'is_premium' => lw_ai_chat_is_premium(),
            ];
        } else {
            // 最近のセッション
            if ( ! empty( $status['recentSessions'] ) ) {
                $recent = $status['recentSessions'][0];
                $answer = "最近のページ生成は**{$recent['business_type']}**（{$recent['completed_sections']}/{$recent['total_sections']}セクション、{$recent['status']}）だにゃ！\n";
                $answer .= "\n新しいページを作りたい場合は「○○のLP作って」と言ってにゃ！";
            } else {
                $answer = "まだページ生成の履歴がないにゃ！\n「接骨院のLP作って」みたいに言ってくれれば、AIが自動でページを作るにゃ！";
            }

            lw_ai_chat_save_local( $user_id, $question, $answer );
            return [
                'answer'     => $answer,
                'is_premium' => lw_ai_chat_is_premium(),
            ];
        }
    }

    // 自前キーモード判定
    $use_own = lw_ai_chat_use_own_key();
    $own_api_key = $use_own ? LW_AI_Generator_Admin_Settings::get_api_key() : '';

    // キー設定がONなのにキーが空 → 自動で公式モードにフォールバック
    if ($use_own && empty($own_api_key)) {
        update_option('lw_ai_chat_use_own_key', '0', false);
        $own_api_key = '';
    }

    if (!empty($own_api_key)) {
        $answer = lw_ai_chat_call_gemini_local($own_api_key, $question, $history, $site_settings, $category);

        // Gemini APIエラー時は公式サーバーにフォールバック
        if (is_wp_error($answer)) {
            $answer = lw_ai_chat_call_remote($question, $history, $honeypot);
        }
    } else {
        $answer = lw_ai_chat_call_remote($question, $history, $honeypot);
    }

    if (is_wp_error($answer)) {
        return $answer;
    }

    // ローカルDBに保存
    if (!empty($answer)) {
        lw_ai_chat_save_local($user_id, $question, $answer);
    }

    return [
        'answer'     => $answer,
        'is_premium' => lw_ai_chat_is_premium(),
    ];
}

/**
 * ページ生成意図の検出
 * 「○○のLP作って」「接骨院のページ生成して」等のパターンを検出
 *
 * @param string $question ユーザーの質問
 * @return array|null アクション情報（検出された場合）
 */
function lw_ai_chat_detect_page_generation( $question ) {
    // ページ生成を示すキーワード
    $generation_keywords = array(
        'LP作って', 'LP作りたい', 'LPを作', 'LP生成', 'ランディングページ作',
        'ページ作って', 'ページ作りたい', 'ページを作', 'ページ生成',
        'トップページ作', 'サイト作',
        '自動生成', 'AIで作', 'AIに作',
    );

    $matched = false;
    foreach ( $generation_keywords as $kw ) {
        if ( mb_strpos( $question, $kw ) !== false ) {
            $matched = true;
            break;
        }
    }

    if ( ! $matched ) {
        return null;
    }

    // ページタイプ判定
    $page_type = 'lp';
    $page_type_label = 'LP（ランディングページ）';
    if ( mb_strpos( $question, 'トップページ' ) !== false || mb_strpos( $question, 'トップ' ) !== false ) {
        $page_type = 'top';
        $page_type_label = 'トップページ';
    }

    // 業種検出（質問テキストから抽出）
    $industry_map = array(
        '接骨院' => '整体・接骨院', '整骨院' => '整体・接骨院', '整体' => '整体・接骨院',
        'クリニック' => '医療・クリニック', '病院' => '医療・クリニック', '歯科' => '医療・クリニック', '歯医者' => '医療・クリニック',
        '美容' => '美容・サロン', 'サロン' => '美容・サロン', 'エステ' => '美容・サロン', '美容室' => '美容・サロン', 'ネイル' => '美容・サロン',
        '飲食' => '飲食店', 'レストラン' => '飲食店', 'カフェ' => '飲食店', '居酒屋' => '飲食店', 'ラーメン' => '飲食店',
        'スクール' => '教育・スクール', '教室' => '教育・スクール', '塾' => '教育・スクール',
        'IT' => 'IT・Web', 'Web' => 'IT・Web', 'SaaS' => 'IT・Web', 'アプリ' => 'IT・Web',
        '士業' => '士業・コンサル', '弁護士' => '士業・コンサル', '税理士' => '士業・コンサル', 'コンサル' => '士業・コンサル',
        '不動産' => '不動産', '賃貸' => '不動産',
        'EC' => 'ECサイト', '通販' => 'ECサイト', 'ネットショップ' => 'ECサイト',
    );

    $business_type = '';
    foreach ( $industry_map as $keyword => $industry ) {
        if ( mb_strpos( $question, $keyword ) !== false ) {
            $business_type = $industry;
            break;
        }
    }

    // 業種が見つからない場合はプロンプトから抽出
    if ( empty( $business_type ) ) {
        // 「○○の」パターンを抽出
        if ( preg_match( '/(.{2,20}?)の(?:LP|ページ|トップ|サイト|ランディング)/u', $question, $m ) ) {
            $business_type = $m[1];
        } else {
            $business_type = $question; // フルテキストをプロンプトに
        }
    }

    return array(
        'type'          => 'generate_page',
        'prompt'        => $question,
        'pageType'      => $page_type,
        'pageTypeLabel' => $page_type_label,
        'businessType'  => $business_type,
        'imageSource'   => 'none',
    );
}

/**
 * 進捗確認の意図を検出
 */
function lw_ai_chat_is_progress_query( $question ) {
    $keywords = array( '進捗', '状況', 'どうなった', 'できた', '完了', '終わった', '生成中', 'ステータス' );
    foreach ( $keywords as $kw ) {
        if ( mb_strpos( $question, $kw ) !== false ) {
            return true;
        }
    }
    return false;
}
