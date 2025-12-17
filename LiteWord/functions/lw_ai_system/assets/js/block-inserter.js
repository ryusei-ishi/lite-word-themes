/**
 * LiteWord AI Page Generator - Block Inserter
 *
 * JSONからブロックを生成してエディタに挿入するロジック
 */

(function() {
    'use strict';

    const { dispatch, select } = wp.data;
    const { createBlock } = wp.blocks;

    // デバッグモード
    const LW_AI_GENERATOR_DEBUG = true;

    /**
     * デバッグログ出力
     */
    function lw_ai_generator_log(...args) {
        if (LW_AI_GENERATOR_DEBUG) {
            console.log('[LiteWord AI Generator]', ...args);
        }
    }

    /**
     * ブロックが登録されているか確認
     * @param {string} blockName - ブロック名
     * @returns {boolean}
     */
    function lw_ai_generator_isBlockRegistered(blockName) {
        const blockType = wp.blocks.getBlockType(blockName);
        lw_ai_generator_log('Checking block registration:', blockName, blockType ? 'registered' : 'not found');
        return blockType !== undefined;
    }

    /**
     * 属性をバリデーション・サニタイズ
     * @param {string} blockName - ブロック名
     * @param {Object} attributes - 属性オブジェクト
     * @returns {Object} サニタイズ済み属性
     */
    function lw_ai_generator_validateAttributes(blockName, attributes) {
        const blockType = wp.blocks.getBlockType(blockName);
        if (!blockType) {
            lw_ai_generator_log('Block type not found for validation:', blockName);
            return {};
        }

        const validatedAttrs = {};
        const blockAttrs = blockType.attributes || {};

        for (const [key, value] of Object.entries(attributes)) {
            if (blockAttrs[key]) {
                // 型チェックとデフォルト値のフォールバック
                validatedAttrs[key] = value ?? blockAttrs[key].default;
            } else {
                // ブロック定義にない属性も一旦許可（柔軟性のため）
                validatedAttrs[key] = value;
            }
        }

        lw_ai_generator_log('Validated attributes for', blockName, validatedAttrs);
        return validatedAttrs;
    }

    /**
     * 単一ブロックデータからブロックオブジェクトを生成
     * @param {Object} blockData - ブロックデータ
     * @returns {Object|null} WordPressブロックオブジェクト
     */
    function lw_ai_generator_createBlockFromData(blockData) {
        const { blockName, attributes = {}, innerBlocks = [] } = blockData;

        // ブロック登録チェック
        if (!lw_ai_generator_isBlockRegistered(blockName)) {
            lw_ai_generator_log('Skipping unregistered block:', blockName);
            return null;
        }

        // 属性バリデーション
        const validatedAttributes = lw_ai_generator_validateAttributes(blockName, attributes);

        // ネストブロックの再帰処理
        const nestedBlocks = innerBlocks
            .map(inner => lw_ai_generator_createBlockFromData(inner))
            .filter(block => block !== null);

        const block = createBlock(blockName, validatedAttributes, nestedBlocks);
        lw_ai_generator_log('Created block:', blockName, block);

        return block;
    }

    /**
     * JSONからブロックを生成してエディタに挿入
     * @param {Object} layoutJson - レイアウトJSON
     * @returns {Object} 結果オブジェクト { success: boolean, message: string, insertedCount: number }
     */
    function lw_ai_generator_insertBlocksFromJson(layoutJson) {
        lw_ai_generator_log('Starting block insertion from JSON:', layoutJson);

        try {
            // blocksフィールドチェック
            if (!layoutJson.blocks || !Array.isArray(layoutJson.blocks)) {
                throw new Error('JSONに有効なblocksフィールドがありません');
            }

            // ブロック生成
            const blocks = layoutJson.blocks
                .map(blockData => lw_ai_generator_createBlockFromData(blockData))
                .filter(block => block !== null);

            if (blocks.length === 0) {
                throw new Error('生成できるブロックがありませんでした。ブロックが正しく登録されているか確認してください。');
            }

            // エディタにブロックを挿入
            dispatch('core/block-editor').insertBlocks(blocks);

            const result = {
                success: true,
                message: `${blocks.length}個のブロックを挿入しました`,
                insertedCount: blocks.length
            };

            lw_ai_generator_log('Insertion complete:', result);
            lw_ai_generator_showNotice('success', result.message);

            return result;

        } catch (error) {
            const result = {
                success: false,
                message: 'ブロックの生成に失敗しました: ' + error.message,
                insertedCount: 0
            };

            lw_ai_generator_log('Insertion failed:', error);
            lw_ai_generator_showNotice('error', result.message);

            return result;
        }
    }

    /**
     * 通知を表示
     * @param {string} type - 'success' | 'error' | 'warning'
     * @param {string} message - 通知メッセージ
     */
    function lw_ai_generator_showNotice(type, message) {
        const noticeType = type === 'success' ? 'success' : (type === 'error' ? 'error' : 'warning');

        dispatch('core/notices').createNotice(
            noticeType,
            message,
            {
                id: 'lw-ai-generator-notice',
                isDismissible: true,
            }
        );
    }

    /**
     * 登録済みブロック一覧を取得（デバッグ用）
     * @returns {Array} ブロック名の配列
     */
    function lw_ai_generator_getRegisteredBlocks() {
        const allBlocks = wp.blocks.getBlockTypes();
        const wdlBlocks = allBlocks.filter(block => block.name.startsWith('wdl/'));
        lw_ai_generator_log('Registered WDL blocks:', wdlBlocks.map(b => b.name));
        return wdlBlocks;
    }

    // グローバルに公開
    window.lwAiGenerator = {
        insertBlocksFromJson: lw_ai_generator_insertBlocksFromJson,
        createBlockFromData: lw_ai_generator_createBlockFromData,
        isBlockRegistered: lw_ai_generator_isBlockRegistered,
        validateAttributes: lw_ai_generator_validateAttributes,
        getRegisteredBlocks: lw_ai_generator_getRegisteredBlocks,
        showNotice: lw_ai_generator_showNotice,
        log: lw_ai_generator_log
    };

    lw_ai_generator_log('Block Inserter initialized');

})();
