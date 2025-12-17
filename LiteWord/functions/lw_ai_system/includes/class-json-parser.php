<?php
/**
 * JSONパース処理クラス
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_JSON_Parser
 */
class LW_AI_Generator_JSON_Parser {

    /**
     * JSONデータをパースして検証
     *
     * @param string $json_string JSON文字列
     * @return array|WP_Error パース結果または エラー
     */
    public static function parse( $json_string ) {
        $data = json_decode( $json_string, true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            return new WP_Error(
                'json_parse_error',
                'JSONのパースに失敗しました: ' . json_last_error_msg()
            );
        }

        // 必須フィールドチェック
        if ( ! isset( $data['blocks'] ) || ! is_array( $data['blocks'] ) ) {
            return new WP_Error(
                'invalid_json_structure',
                'blocksフィールドが見つかりません'
            );
        }

        return $data;
    }

    /**
     * ブロックデータの検証
     *
     * @param array $block_data ブロックデータ
     * @return array|WP_Error 検証済みデータまたはエラー
     */
    public static function validate_block( $block_data ) {
        if ( ! isset( $block_data['blockName'] ) ) {
            return new WP_Error(
                'missing_block_name',
                'blockNameが指定されていません'
            );
        }

        $validated = array(
            'blockName'   => sanitize_text_field( $block_data['blockName'] ),
            'attributes'  => isset( $block_data['attributes'] ) ? $block_data['attributes'] : array(),
            'innerBlocks' => isset( $block_data['innerBlocks'] ) ? $block_data['innerBlocks'] : array(),
        );

        return $validated;
    }

    /**
     * 属性値のサニタイズ
     *
     * @param mixed  $value 属性値
     * @param string $type  期待する型
     * @return mixed サニタイズ済み値
     */
    public static function sanitize_attribute( $value, $type = 'string' ) {
        switch ( $type ) {
            case 'string':
                return wp_kses_post( $value );
            case 'number':
                return floatval( $value );
            case 'boolean':
                return (bool) $value;
            case 'array':
                return is_array( $value ) ? $value : array();
            default:
                return $value;
        }
    }
}
