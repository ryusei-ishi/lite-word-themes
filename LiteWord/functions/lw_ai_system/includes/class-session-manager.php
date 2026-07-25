<?php
/**
 * AI生成セッション管理クラス
 *
 * セクション単位の独立生成 + 前後文脈の保持 + DB永続化
 * ユーザー体験: 1クリックで全自動 / 実際はセクション単位で集中生成
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class LW_AI_Session_Manager {

    /**
     * テーブル名
     */
    private static function sessions_table() {
        global $wpdb;
        return $wpdb->prefix . 'lw_ai_sessions';
    }

    private static function sections_table() {
        global $wpdb;
        return $wpdb->prefix . 'lw_ai_session_sections';
    }

    /**
     * DBテーブルを作成
     */
    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $sessions_table = self::sessions_table();
        $sections_table = self::sections_table();

        // テーブルが既に存在するか確認
        $sessions_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$sessions_table}'" ) === $sessions_table;
        $sections_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$sections_table}'" ) === $sections_table;

        if ( $sessions_exists && $sections_exists ) {
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // セッションテーブル
        $sql_sessions = "CREATE TABLE {$sessions_table} (
            id BIGINT UNSIGNED AUTO_INCREMENT,
            post_id BIGINT UNSIGNED DEFAULT 0,
            user_id BIGINT UNSIGNED NOT NULL,
            status VARCHAR(20) DEFAULT 'draft',
            page_type VARCHAR(50) DEFAULT 'lp',
            business_type VARCHAR(200) DEFAULT '',
            prompt TEXT,
            interview_answers LONGTEXT,
            outline_json LONGTEXT,
            outline_text LONGTEXT,
            image_source VARCHAR(20) DEFAULT 'ai',
            total_sections INT DEFAULT 0,
            completed_sections INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_user (user_id),
            KEY idx_post (post_id),
            KEY idx_status (status)
        ) {$charset_collate};";

        dbDelta( $sql_sessions );

        // セクションテーブル
        $sql_sections = "CREATE TABLE {$sections_table} (
            id BIGINT UNSIGNED AUTO_INCREMENT,
            session_id BIGINT UNSIGNED NOT NULL,
            section_index INT NOT NULL,
            section_type VARCHAR(50) DEFAULT '',
            section_title VARCHAR(200) DEFAULT '',
            section_text TEXT,
            selected_part VARCHAR(100) DEFAULT '',
            selected_part_type VARCHAR(20) DEFAULT '',
            generated_blocks LONGTEXT,
            content_summary VARCHAR(500) DEFAULT '',
            status VARCHAR(20) DEFAULT 'pending',
            error_message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_session (session_id),
            KEY idx_status (status),
            UNIQUE KEY idx_session_section (session_id, section_index)
        ) {$charset_collate};";

        dbDelta( $sql_sections );
    }

    /* =========================================================
     *  セッション CRUD
     * ========================================================= */

    /**
     * セッションを作成（outlineから全セクションを登録）
     *
     * @param array $args {
     *   post_id, page_type, business_type, prompt,
     *   interview_answers, outline_json, outline_text,
     *   image_source, sections[]
     * }
     * @return int|WP_Error セッションID
     */
    public static function create_session( $args ) {
        global $wpdb;

        $outline = isset( $args['outline_json'] ) ? $args['outline_json'] : array();
        $sections = isset( $outline['sections'] ) ? $outline['sections'] : array();

        if ( empty( $sections ) ) {
            return new WP_Error( 'no_sections', '構成案にセクションがありません' );
        }

        // セッション作成
        $result = $wpdb->insert(
            self::sessions_table(),
            array(
                'post_id'           => isset( $args['post_id'] ) ? absint( $args['post_id'] ) : 0,
                'user_id'           => get_current_user_id(),
                'status'            => 'draft',
                'page_type'         => sanitize_text_field( isset( $args['page_type'] ) ? $args['page_type'] : 'lp' ),
                'business_type'     => sanitize_text_field( isset( $args['business_type'] ) ? $args['business_type'] : '' ),
                'prompt'            => isset( $args['prompt'] ) ? $args['prompt'] : '',
                'interview_answers' => isset( $args['interview_answers'] ) ? wp_json_encode( $args['interview_answers'] ) : '',
                'outline_json'      => wp_json_encode( $outline ),
                'outline_text'      => isset( $args['outline_text'] ) ? $args['outline_text'] : '',
                'image_source'      => sanitize_text_field( isset( $args['image_source'] ) ? $args['image_source'] : 'ai' ),
                'total_sections'    => count( $sections ),
                'completed_sections' => 0,
                'created_at'        => current_time( 'mysql' ),
                'updated_at'        => current_time( 'mysql' ),
            ),
            array( '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s' )
        );

        if ( ! $result ) {
            return new WP_Error( 'db_error', 'セッションの作成に失敗しました' );
        }

        $session_id = $wpdb->insert_id;

        // 各セクションを登録
        foreach ( $sections as $index => $section ) {
            $section_type  = isset( $section['type'] ) ? $section['type'] : '';
            $section_title = isset( $section['title'] ) ? $section['title'] : ( isset( $section['catchphrase'] ) ? $section['catchphrase'] : '' );
            $section_text  = wp_json_encode( $section, JSON_UNESCAPED_UNICODE );

            $wpdb->insert(
                self::sections_table(),
                array(
                    'session_id'    => $session_id,
                    'section_index' => $index,
                    'section_type'  => sanitize_text_field( $section_type ),
                    'section_title' => sanitize_text_field( $section_title ),
                    'section_text'  => $section_text,
                    'status'        => 'pending',
                    'created_at'    => current_time( 'mysql' ),
                    'updated_at'    => current_time( 'mysql' ),
                ),
                array( '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
            );
        }

        return $session_id;
    }

    /**
     * セッション情報を取得（セクション一覧付き）
     *
     * @param int $session_id
     * @return array|WP_Error
     */
    public static function get_session( $session_id ) {
        global $wpdb;

        $session = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . self::sessions_table() . " WHERE id = %d AND user_id = %d",
                $session_id,
                get_current_user_id()
            ),
            ARRAY_A
        );

        if ( ! $session ) {
            return new WP_Error( 'not_found', 'セッションが見つかりません' );
        }

        // セクション一覧を取得
        $sections = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM " . self::sections_table() . " WHERE session_id = %d ORDER BY section_index ASC",
                $session_id
            ),
            ARRAY_A
        );

        $session['outline_json'] = json_decode( $session['outline_json'], true );
        $session['sections'] = array_map( function( $s ) {
            $s['section_text']      = json_decode( $s['section_text'], true );
            $s['generated_blocks']  = $s['generated_blocks'] ? json_decode( $s['generated_blocks'], true ) : null;
            return $s;
        }, $sections );

        return $session;
    }

    /* =========================================================
     *  セクション生成コンテキスト構築（★核心部分）
     * ========================================================= */

    /**
     * セクション生成用のコンテキストを構築
     * 前後のセクション情報を含めて、文脈を理解した生成を可能にする
     *
     * @param int $session_id セッションID
     * @param int $section_index 生成するセクションのインデックス
     * @return array|WP_Error コンテキスト情報
     */
    public static function build_section_context( $session_id, $section_index ) {
        global $wpdb;

        $session = self::get_session( $session_id );
        if ( is_wp_error( $session ) ) {
            return $session;
        }

        $sections = $session['sections'];
        $total    = count( $sections );

        if ( $section_index < 0 || $section_index >= $total ) {
            return new WP_Error( 'invalid_index', '不正なセクションインデックスです' );
        }

        $current = $sections[ $section_index ];

        // ── 前のセクションのサマリー（生成済みのもの）
        $previous_summaries = array();
        for ( $i = 0; $i < $section_index; $i++ ) {
            $s = $sections[ $i ];
            if ( $s['status'] === 'completed' && ! empty( $s['content_summary'] ) ) {
                $previous_summaries[] = array(
                    'index' => $i,
                    'type'  => $s['section_type'],
                    'title' => $s['section_title'],
                    'summary' => $s['content_summary'],
                );
            }
        }

        // ── 後のセクションのタイトル一覧（未生成のもの）
        $upcoming_titles = array();
        for ( $i = $section_index + 1; $i < $total; $i++ ) {
            $s = $sections[ $i ];
            $upcoming_titles[] = array(
                'index' => $i,
                'type'  => $s['section_type'],
                'title' => $s['section_title'],
            );
        }

        return array(
            'session_id'         => $session_id,
            'business_type'      => $session['business_type'],
            'page_type'          => $session['page_type'],
            'image_source'       => $session['image_source'],
            'total_sections'     => $total,
            'section_index'      => $section_index,
            'current_section'    => $current,
            'previous_summaries' => $previous_summaries,
            'upcoming_titles'    => $upcoming_titles,
            'outline_summary'    => isset( $session['outline_json']['businessType'] )
                ? $session['outline_json']['businessType']
                : $session['business_type'],
        );
    }

    /**
     * コンテキストからプロンプト補足テキストを生成
     *
     * @param array $context build_section_context() の戻り値
     * @return string プロンプトに追加するテキスト
     */
    public static function context_to_prompt_text( $context ) {
        $text = '';

        // 全体概要
        if ( ! empty( $context['outline_summary'] ) ) {
            $text .= "## ページ全体の業種・テーマ\n{$context['outline_summary']}\n\n";
        }

        // 前のセクションのサマリー
        if ( ! empty( $context['previous_summaries'] ) ) {
            $text .= "## 前のセクションの内容（重複を避けること）\n";
            foreach ( $context['previous_summaries'] as $prev ) {
                $text .= "- セクション{$prev['index']}: 【{$prev['type']}】{$prev['title']} — {$prev['summary']}\n";
            }
            $text .= "\n";
        }

        // 後のセクション一覧
        if ( ! empty( $context['upcoming_titles'] ) ) {
            $text .= "## 後に続くセクション（ここでは扱わないこと）\n";
            foreach ( $context['upcoming_titles'] as $next ) {
                $text .= "- セクション{$next['index']}: 【{$next['type']}】{$next['title']}\n";
            }
            $text .= "\n";
        }

        return $text;
    }

    /* =========================================================
     *  セクション生成結果の保存
     * ========================================================= */

    /**
     * セクション生成結果を保存
     *
     * @param int    $session_id セッションID
     * @param int    $section_index セクションインデックス
     * @param array  $blocks 生成されたブロック配列
     * @param string $summary 内容サマリー（次セクション生成時の文脈用）
     * @return bool|WP_Error
     */
    public static function save_section_result( $session_id, $section_index, $blocks, $summary = '' ) {
        global $wpdb;

        // サマリーが空の場合、ブロックから自動生成
        if ( empty( $summary ) && ! empty( $blocks ) ) {
            $summary = self::auto_generate_summary( $blocks );
        }

        $updated = $wpdb->update(
            self::sections_table(),
            array(
                'generated_blocks' => wp_json_encode( $blocks ),
                'content_summary'  => mb_substr( sanitize_text_field( $summary ), 0, 500 ),
                'status'           => 'completed',
                'updated_at'       => current_time( 'mysql' ),
            ),
            array(
                'session_id'    => $session_id,
                'section_index' => $section_index,
            ),
            array( '%s', '%s', '%s', '%s' ),
            array( '%d', '%d' )
        );

        if ( $updated === false ) {
            return new WP_Error( 'db_error', 'セクション結果の保存に失敗しました' );
        }

        // セッションの完了セクション数を更新
        $completed = $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM " . self::sections_table() . " WHERE session_id = %d AND status = 'completed'",
            $session_id
        ) );

        $total = $wpdb->get_var( $wpdb->prepare(
            "SELECT total_sections FROM " . self::sessions_table() . " WHERE id = %d",
            $session_id
        ) );

        $new_status = ( (int) $completed >= (int) $total ) ? 'completed' : 'generating';

        $wpdb->update(
            self::sessions_table(),
            array(
                'completed_sections' => $completed,
                'status'             => $new_status,
                'updated_at'         => current_time( 'mysql' ),
            ),
            array( 'id' => $session_id ),
            array( '%d', '%s', '%s' ),
            array( '%d' )
        );

        return true;
    }

    /**
     * セクション生成失敗を記録
     */
    public static function mark_section_failed( $session_id, $section_index, $error_message = '' ) {
        global $wpdb;

        $wpdb->update(
            self::sections_table(),
            array(
                'status'        => 'failed',
                'error_message' => sanitize_text_field( $error_message ),
                'updated_at'    => current_time( 'mysql' ),
            ),
            array(
                'session_id'    => $session_id,
                'section_index' => $section_index,
            ),
            array( '%s', '%s', '%s' ),
            array( '%d', '%d' )
        );
    }

    /**
     * パーツ選択情報を保存
     */
    public static function save_part_selection( $session_id, $section_index, $part_name, $part_type ) {
        global $wpdb;

        $wpdb->update(
            self::sections_table(),
            array(
                'selected_part'      => sanitize_text_field( $part_name ),
                'selected_part_type' => sanitize_text_field( $part_type ),
                'updated_at'         => current_time( 'mysql' ),
            ),
            array(
                'session_id'    => $session_id,
                'section_index' => $section_index,
            ),
            array( '%s', '%s', '%s' ),
            array( '%d', '%d' )
        );
    }

    /* =========================================================
     *  全セクションのブロックを結合して取得
     * ========================================================= */

    /**
     * 完了済み全セクションのブロックを結合して返す
     *
     * @param int $session_id
     * @return array ブロック配列
     */
    public static function get_all_completed_blocks( $session_id ) {
        global $wpdb;

        $sections = $wpdb->get_results( $wpdb->prepare(
            "SELECT generated_blocks FROM " . self::sections_table() .
            " WHERE session_id = %d AND status = 'completed' ORDER BY section_index ASC",
            $session_id
        ), ARRAY_A );

        $all_blocks = array();
        foreach ( $sections as $section ) {
            $blocks = json_decode( $section['generated_blocks'], true );
            if ( is_array( $blocks ) ) {
                $all_blocks = array_merge( $all_blocks, $blocks );
            }
        }

        return $all_blocks;
    }

    /* =========================================================
     *  ステータス確認（AIチャット・ダッシュボード用）
     * ========================================================= */

    /**
     * 現在のセッション状況を人間が読める形で返す
     * AIチャットの猫ロボットが「今の進捗は？」と聞かれた時に使う
     *
     * @return array 状況サマリー
     */
    public static function get_status_summary() {
        global $wpdb;
        $user_id = get_current_user_id();

        // 進行中のセッション
        $active = $wpdb->get_row( $wpdb->prepare(
            "SELECT * FROM " . self::sessions_table() .
            " WHERE user_id = %d AND status IN ('draft','generating') ORDER BY updated_at DESC LIMIT 1",
            $user_id
        ), ARRAY_A );

        // 最近完了したセッション
        $recent = $wpdb->get_results( $wpdb->prepare(
            "SELECT id, business_type, page_type, total_sections, completed_sections, status, created_at
             FROM " . self::sessions_table() .
            " WHERE user_id = %d ORDER BY updated_at DESC LIMIT 5",
            $user_id
        ), ARRAY_A );

        $summary = array(
            'hasActive'      => ! empty( $active ),
            'activeSessions' => array(),
            'recentSessions' => $recent,
        );

        if ( $active ) {
            // 進行中セッションの詳細
            $sections = $wpdb->get_results( $wpdb->prepare(
                "SELECT section_index, section_type, section_title, status, content_summary
                 FROM " . self::sections_table() .
                " WHERE session_id = %d ORDER BY section_index ASC",
                $active['id']
            ), ARRAY_A );

            $completed = array_filter( $sections, function( $s ) { return $s['status'] === 'completed'; } );
            $pending   = array_filter( $sections, function( $s ) { return $s['status'] === 'pending'; } );
            $failed    = array_filter( $sections, function( $s ) { return $s['status'] === 'failed'; } );

            $next_section = null;
            foreach ( $sections as $s ) {
                if ( $s['status'] === 'pending' ) {
                    $next_section = $s;
                    break;
                }
            }

            $summary['activeSessions'][] = array(
                'sessionId'     => (int) $active['id'],
                'businessType'  => $active['business_type'],
                'pageType'      => $active['page_type'],
                'total'         => (int) $active['total_sections'],
                'completed'     => count( $completed ),
                'pending'       => count( $pending ),
                'failed'        => count( $failed ),
                'nextSection'   => $next_section,
                'sections'      => $sections,
                'createdAt'     => $active['created_at'],
                'postId'        => (int) $active['post_id'],
            );

            // 人間用テキスト
            $progress_text = count( $completed ) . '/' . $active['total_sections'] . ' セクション完了';
            if ( $next_section ) {
                $progress_text .= '。次: ' . ( $next_section['section_title'] ?: $next_section['section_type'] );
            }
            $summary['progressText'] = $progress_text;
        }

        return $summary;
    }

    /**
     * 次の未完了セクションのインデックスを取得
     *
     * @param int $session_id
     * @return int|null セクションインデックス（全完了時はnull）
     */
    public static function get_next_pending_index( $session_id ) {
        global $wpdb;

        $index = $wpdb->get_var( $wpdb->prepare(
            "SELECT section_index FROM " . self::sections_table() .
            " WHERE session_id = %d AND status = 'pending' ORDER BY section_index ASC LIMIT 1",
            $session_id
        ) );

        return $index !== null ? (int) $index : null;
    }

    /* =========================================================
     *  ユーティリティ
     * ========================================================= */

    /**
     * ブロック配列からサマリーを自動生成
     * 主要テキスト属性（mainTitle, description, content）から抽出
     */
    private static function auto_generate_summary( $blocks ) {
        $texts = array();

        foreach ( $blocks as $block ) {
            if ( ! isset( $block['attributes'] ) ) {
                continue;
            }
            $attrs = $block['attributes'];

            // タイトル系
            foreach ( array( 'mainTitle', 'titleText', 'title' ) as $key ) {
                if ( ! empty( $attrs[ $key ] ) && mb_strlen( $attrs[ $key ] ) > 2 ) {
                    $texts[] = $attrs[ $key ];
                    break;
                }
            }

            // 説明文系
            foreach ( array( 'description', 'content', 'text_1' ) as $key ) {
                if ( ! empty( $attrs[ $key ] ) && mb_strlen( $attrs[ $key ] ) > 5 ) {
                    $texts[] = mb_substr( $attrs[ $key ], 0, 100 );
                    break;
                }
            }

            // items/contents配列のタイトルも拾う（特徴の項目名等）
            foreach ( array( 'items', 'contents', 'voices' ) as $list_key ) {
                if ( ! empty( $attrs[ $list_key ] ) && is_array( $attrs[ $list_key ] ) ) {
                    $item_titles = array();
                    foreach ( array_slice( $attrs[ $list_key ], 0, 3 ) as $item ) {
                        if ( is_array( $item ) ) {
                            $t = isset( $item['title'] ) ? $item['title'] : ( isset( $item['text'] ) ? mb_substr( $item['text'], 0, 30 ) : '' );
                            if ( $t ) $item_titles[] = $t;
                        }
                    }
                    if ( ! empty( $item_titles ) ) {
                        $texts[] = '(' . implode( ', ', $item_titles ) . ')';
                    }
                    break;
                }
            }

            // ボタンテキスト
            if ( ! empty( $attrs['buttonText'] ) ) {
                $texts[] = 'CTA:' . $attrs['buttonText'];
            }
        }

        // 5要素まで、合計500文字まで
        $result = implode( ' / ', array_slice( $texts, 0, 5 ) );
        return mb_substr( $result, 0, 500 );
    }

    /**
     * ユーザーのセッション一覧を取得（最新5件）
     */
    public static function get_user_sessions( $limit = 5 ) {
        global $wpdb;

        return $wpdb->get_results( $wpdb->prepare(
            "SELECT id, post_id, status, page_type, business_type, total_sections, completed_sections, created_at, updated_at
             FROM " . self::sessions_table() .
            " WHERE user_id = %d ORDER BY updated_at DESC LIMIT %d",
            get_current_user_id(),
            $limit
        ), ARRAY_A );
    }

    /**
     * セッションを削除（セクションも連鎖削除）
     */
    public static function delete_session( $session_id ) {
        global $wpdb;

        // 権限チェック
        $session = $wpdb->get_row( $wpdb->prepare(
            "SELECT user_id FROM " . self::sessions_table() . " WHERE id = %d",
            $session_id
        ) );

        if ( ! $session || (int) $session->user_id !== get_current_user_id() ) {
            return new WP_Error( 'forbidden', '権限がありません' );
        }

        $wpdb->delete( self::sections_table(), array( 'session_id' => $session_id ), array( '%d' ) );
        $wpdb->delete( self::sessions_table(), array( 'id' => $session_id ), array( '%d' ) );

        return true;
    }

    /* =========================================================
     *  レート制限（ユーザーあたりの日次セッション数制限）
     * ========================================================= */

    /**
     * ユーザーが本日の生成上限に達しているか確認
     *
     * @param int $user_id ユーザーID（省略時は現在ユーザー）
     * @return array { 'allowed' => bool, 'used' => int, 'limit' => int, 'remaining' => int }
     */
    public static function check_daily_limit( $user_id = 0 ) {
        global $wpdb;

        if ( ! $user_id ) {
            $user_id = get_current_user_id();
        }

        // プレミアム判定
        $is_premium = defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true;
        $daily_limit = $is_premium ? 15 : 3;

        // 管理者は無制限
        if ( user_can( $user_id, 'manage_options' ) ) {
            return array(
                'allowed'   => true,
                'used'      => 0,
                'limit'     => -1, // 無制限
                'remaining' => -1,
            );
        }

        // 本日のセッション数をカウント
        // 🔒 created_at は current_time('mysql')＝サイトのタイムゾーンで入る（:140-141）ので、
        //    比較もサイト時間に揃える。gmdate() だと時間系が混ざり、日本時間では
        //    リセットが朝9時になり最大33時間分を数えてしまう（UTCマイナス圏では逆に上限が効かない）。
        $today_start = current_time( 'Y-m-d 00:00:00' );
        $used = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM " . self::sessions_table() .
            " WHERE user_id = %d AND created_at >= %s",
            $user_id,
            $today_start
        ) );

        $remaining = max( 0, $daily_limit - $used );

        return array(
            'allowed'   => $used < $daily_limit,
            'used'      => $used,
            'limit'     => $daily_limit,
            'remaining' => $remaining,
        );
    }

    /**
     * 古いセッションを自動クリーンアップ（30日以上前）
     */
    public static function cleanup_old_sessions() {
        global $wpdb;

        $cutoff = gmdate( 'Y-m-d H:i:s', strtotime( '-30 days' ) );

        $old_sessions = $wpdb->get_col( $wpdb->prepare(
            "SELECT id FROM " . self::sessions_table() . " WHERE created_at < %s",
            $cutoff
        ) );

        if ( empty( $old_sessions ) ) {
            return 0;
        }

        $ids_placeholder = implode( ',', array_map( 'absint', $old_sessions ) );
        $wpdb->query( "DELETE FROM " . self::sections_table() . " WHERE session_id IN ({$ids_placeholder})" );
        $wpdb->query( "DELETE FROM " . self::sessions_table() . " WHERE id IN ({$ids_placeholder})" );

        return count( $old_sessions );
    }
}
