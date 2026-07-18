<?php
/**
 * リンク有効性チェッククラス
 *
 * @package LiteWord
 */

if (!defined('ABSPATH')) {
    exit;
}

class LW_Broken_Link_Check_Checker {

    /**
     * タイムアウト秒数
     */
    const TIMEOUT = 10;

    /**
     * User-Agent
     */
    const USER_AGENT = 'Mozilla/5.0 (compatible; LiteWord Link Checker/1.0)';

    /**
     * 単一URLをチェック
     *
     * @param string $url チェックするURL
     * @return array チェック結果
     */
    public static function check_url($url) {
        // 空のURLはスキップ
        if (empty($url)) {
            return array(
                'url' => $url,
                'status' => 'skip',
                'status_code' => null,
                'message' => '空のURL',
            );
        }

        // チェック不要なURLタイプ
        if (self::should_skip($url)) {
            return array(
                'url' => $url,
                'status' => 'skip',
                'status_code' => null,
                'message' => 'チェック対象外',
            );
        }

        // 相対URLを絶対URLに変換
        $absolute_url = self::make_absolute_url($url);

        // HTTPリクエストを送信
        $result = self::send_request($absolute_url);

        return array(
            'url' => $url,
            'absolute_url' => $absolute_url,
            'status' => $result['status'],
            'status_code' => $result['status_code'],
            'message' => $result['message'],
            'redirect_url' => isset($result['redirect_url']) ? $result['redirect_url'] : null,
        );
    }

    /**
     * バッチでURLをチェック
     *
     * @param array $urls チェックするURL配列
     * @return array チェック結果配列
     */
    public static function check_batch($urls) {
        $results = array();

        foreach ($urls as $url) {
            $results[] = self::check_url($url);
        }

        return $results;
    }

    /**
     * チェックをスキップすべきURLか判定
     *
     * @param string $url URL
     * @return bool スキップすべき場合true
     */
    private static function should_skip($url) {
        // アンカーリンク
        if (strpos($url, '#') === 0) {
            return true;
        }

        // メールリンク
        if (stripos($url, 'mailto:') === 0) {
            return true;
        }

        // 電話リンク
        if (stripos($url, 'tel:') === 0) {
            return true;
        }

        // JavaScriptリンク
        if (stripos($url, 'javascript:') === 0) {
            return true;
        }

        // データURL
        if (stripos($url, 'data:') === 0) {
            return true;
        }

        return false;
    }

    /**
     * 相対URLを絶対URLに変換
     *
     * @param string $url URL
     * @return string 絶対URL
     */
    private static function make_absolute_url($url) {
        // すでに絶対URLの場合
        if (preg_match('/^https?:\/\//i', $url)) {
            return $url;
        }

        // プロトコル相対URL
        if (strpos($url, '//') === 0) {
            return 'https:' . $url;
        }

        // ルート相対URL
        if (strpos($url, '/') === 0) {
            return home_url($url);
        }

        // 相対URL
        return home_url('/' . $url);
    }

    /**
     * HTTPリクエストを送信してステータスを取得
     *
     * @param string $url 絶対URL
     * @return array 結果配列
     */
    private static function send_request($url) {
        // まずHEADリクエストを試す
        $response = wp_remote_head($url, array(
            'timeout' => self::TIMEOUT,
            'redirection' => 5,
            'user-agent' => self::USER_AGENT,
            'sslverify' => false, // SSL証明書エラーを無視
        ));

        // HEADが失敗した場合はGETを試す（一部サーバーはHEADを拒否する）
        if (is_wp_error($response)) {
            $response = wp_remote_get($url, array(
                'timeout' => self::TIMEOUT,
                'redirection' => 5,
                'user-agent' => self::USER_AGENT,
                'sslverify' => false,
            ));
        }

        // エラーチェック
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();

            // タイムアウト判定
            if (strpos($error_message, 'timed out') !== false || strpos($error_message, 'timeout') !== false) {
                return array(
                    'status' => 'timeout',
                    'status_code' => null,
                    'message' => 'タイムアウト',
                );
            }

            // 接続エラー
            return array(
                'status' => 'error',
                'status_code' => null,
                'message' => $error_message,
            );
        }

        // ステータスコードを取得
        $status_code = wp_remote_retrieve_response_code($response);
        $headers = wp_remote_retrieve_headers($response);

        // ステータスに応じた結果を返す
        if ($status_code >= 200 && $status_code < 300) {
            return array(
                'status' => 'ok',
                'status_code' => $status_code,
                'message' => 'OK',
            );
        }

        if ($status_code >= 300 && $status_code < 400) {
            $redirect_url = isset($headers['location']) ? $headers['location'] : null;
            return array(
                'status' => 'redirect',
                'status_code' => $status_code,
                'message' => 'リダイレクト',
                'redirect_url' => $redirect_url,
            );
        }

        if ($status_code == 404) {
            return array(
                'status' => 'not_found',
                'status_code' => $status_code,
                'message' => 'ページが見つかりません',
            );
        }

        if ($status_code >= 400 && $status_code < 500) {
            return array(
                'status' => 'client_error',
                'status_code' => $status_code,
                'message' => 'クライアントエラー',
            );
        }

        if ($status_code >= 500) {
            return array(
                'status' => 'server_error',
                'status_code' => $status_code,
                'message' => 'サーバーエラー',
            );
        }

        return array(
            'status' => 'unknown',
            'status_code' => $status_code,
            'message' => '不明なステータス',
        );
    }

    /**
     * ステータスのラベルを取得
     *
     * @param string $status ステータス
     * @return string ラベル
     */
    public static function get_status_label($status) {
        $labels = array(
            'ok' => '有効',
            'redirect' => 'リダイレクト',
            'not_found' => 'リンク切れ',
            'client_error' => 'エラー',
            'server_error' => 'サーバーエラー',
            'timeout' => 'タイムアウト',
            'error' => '接続エラー',
            'skip' => 'スキップ',
            'unknown' => '不明',
        );

        return isset($labels[$status]) ? $labels[$status] : $status;
    }
}
