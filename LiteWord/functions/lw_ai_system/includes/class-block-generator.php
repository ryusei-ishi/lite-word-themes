<?php
/**
 * ブロック生成処理クラス
 *
 * @package LiteWord_AI_Page_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class LW_AI_Generator_Block_Generator
 */
class LW_AI_Generator_Block_Generator {

    /**
     * サポートされているブロックの定義
     *
     * @var array
     */
    private static $supported_blocks = array(
        'wdl/fv-1' => array(
            'category'           => 'firstview',
            'requiredAttributes' => array(),
            'optionalAttributes' => array(
                'backgroundImage',
                'backgroundImageSp',
                'mainTitle',
                'subTitle',
                'description',
                'buttonText',
                'buttonUrl',
                'openInNewTab',
                'buttonBackgroundColor',
                'buttonTextColor',
                'buttonBorderColor',
                'buttonBackgroundColorOpacity',
                'buttonBorderWidth',
                'buttonBorderRadius',
                'filterBackgroundColor',
                'filterOpacity',
                'minHeightPc',
                'minHeightTb',
                'minHeightSp',
            ),
        ),
        'wdl/custom-title-1' => array(
            'category'           => 'title',
            'requiredAttributes' => array(),
            'optionalAttributes' => array(
                'mainTitle',
                'subTitle',
                'headingLevel',
            ),
        ),
        // 他のブロックも必要に応じて追加
    );

    /**
     * サポートブロック定義を取得
     *
     * @return array
     */
    public static function get_supported_blocks() {
        return self::$supported_blocks;
    }

    /**
     * ブロックがサポートされているか確認
     *
     * @param string $block_name ブロック名
     * @return bool
     */
    public static function is_block_supported( $block_name ) {
        return isset( self::$supported_blocks[ $block_name ] );
    }

    /**
     * ブロック定義を追加（拡張用）
     *
     * @param string $block_name ブロック名
     * @param array  $definition ブロック定義
     */
    public static function add_block_definition( $block_name, $definition ) {
        self::$supported_blocks[ $block_name ] = $definition;
    }
}
