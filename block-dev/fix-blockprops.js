#!/usr/bin/env node
/**
 * カスタムブロックのuseBlockProps修正スクリプト
 * edit関数内の<div className="...">を<div {...blockProps}>に置き換える
 */

const fs = require('fs');
const path = require('path');

// 対象ブロックのリスト
const TARGET_BLOCKS = [
    'shin-gas-station-01-shop-list-1',
    'lw-content-8',
    'paid-block-content-3',
    'paid-block-content-4',
    'paid-block-content-5',
    'paid-block-content-6',
    'paid-block-content-7',
    'shin-gas-station-01-message-01',
    'shin-gas-station-01-cta',
    'shin-gas-station-01-cta2',
    'shin-gas-station-01-fv-lower-01',
    'shin-gas-station-01-fv-top',
    'shin-gas-station-01-custom-title-2',
    'shin-gas-station-01-list-1',
    'shin-gas-station-01-list-2',
    'shin-gas-station-01-list-3',
    'shin-gas-station-01-list-4',
    'lw-pr-step-7',
    'lw-step-1',
    'paid-block-lw-step-3',
    'paid-block-lw-step-4',
    'paid-block-lw-step-6',
    'shin-gas-station-01-step-1',
    'shin-gas-station-01-company-01',
    'paid-block-voice-2',
    'paid-block-voice-3',
];

const BASE_DIR = path.join(__dirname, 'src');

function fixBlock(blockName) {
    const filePath = path.join(BASE_DIR, blockName, 'index.js');

    if (!fs.existsSync(filePath)) {
        return `❌ ${blockName}: ファイルが見つかりません`;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // useBlockPropsがインポートされているか確認
    if (!content.includes('useBlockProps')) {
        return `⚠️ ${blockName}: useBlockPropsがインポートされていません（スキップ）`;
    }

    // 既にuseBlockPropsが使われているか確認
    if (content.includes('const blockProps = useBlockProps')) {
        if (/<div\s+\{\.\.\.blockProps\}/.test(content)) {
            return `✅ ${blockName}: 既に修正済み`;
        }
    }

    // edit関数の位置を探す
    const editMatch = content.match(/edit\s*[:(\s]/);
    if (!editMatch) {
        return `⚠️ ${blockName}: edit関数が見つかりません`;
    }

    // return文の位置を探す
    const afterEdit = content.slice(editMatch.index);
    const returnMatch = afterEdit.match(/return\s*\(/);
    if (!returnMatch) {
        return `⚠️ ${blockName}: return文が見つかりません`;
    }

    const returnPos = editMatch.index + returnMatch.index;

    // return直前にblockPropsを挿入（まだない場合）
    if (!content.slice(0, returnPos).includes('const blockProps = useBlockProps')) {
        const insertCode = `\n        const blockProps = useBlockProps({\n            className: '${blockName}'\n        });\n\n        `;
        content = content.slice(0, returnPos) + insertCode + content.slice(returnPos);
    }

    // edit関数内の最初の<div className="block-name">を<div {...blockProps}>に置き換え
    // パターン: </InspectorControls> の後の最初の <div className="block-name"
    const pattern = new RegExp(
        `(<InspectorControls>[\\s\\S]*?<\\/InspectorControls>\\s*)` +
        `<div\\s+className=["\']${blockName.replace(/[-]/g, '\\-')}["\']` +
        `(\\s+style=\\{[^}]+\\})?>`,
        ''
    );

    const match = content.match(pattern);
    if (match) {
        const styleAttr = match[2] || '';
        if (styleAttr) {
            console.log(`  ⚠️ ${blockName}: style属性があります。手動で確認してください`);
        }

        content = content.replace(pattern, match[1] + '\n                <div {...blockProps}>');
    }

    // 変更があった場合のみ保存
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        return `✅ ${blockName}: 修正完了`;
    } else {
        return `ℹ️ ${blockName}: 変更なし`;
    }
}

function main() {
    console.log('='.repeat(60));
    console.log('カスタムブロック useBlockProps 一括修正');
    console.log('='.repeat(60));
    console.log(`\n対象: ${TARGET_BLOCKS.length} ブロック\n`);

    const results = {
        success: [],
        alreadyFixed: [],
        warning: [],
        error: []
    };

    for (const blockName of TARGET_BLOCKS) {
        const result = fixBlock(blockName);
        console.log(result);

        if (result.startsWith('✅') && result.includes('修正完了')) {
            results.success.push(blockName);
        } else if (result.startsWith('✅') && result.includes('既に修正済み')) {
            results.alreadyFixed.push(blockName);
        } else if (result.startsWith('⚠️')) {
            results.warning.push(blockName);
        } else {
            results.error.push(blockName);
        }
    }

    // サマリー
    console.log('\n' + '='.repeat(60));
    console.log('修正結果サマリー');
    console.log('='.repeat(60));
    console.log(`✅ 修正完了: ${results.success.length} 件`);
    console.log(`✅ 既に修正済み: ${results.alreadyFixed.length} 件`);
    console.log(`⚠️ 警告: ${results.warning.length} 件`);
    console.log(`❌ エラー: ${results.error.length} 件`);
    console.log();

    if (results.warning.length > 0) {
        console.log('⚠️ 警告が出たブロック:');
        results.warning.forEach(block => console.log(`  - ${block}`));
        console.log();
    }

    if (results.error.length > 0) {
        console.log('❌ エラーが出たブロック:');
        results.error.forEach(block => console.log(`  - ${block}`));
        console.log();
    }

    console.log('完了しました！');
    console.log('\n次のステップ:');
    console.log('1. npm run build を実行');
    console.log('2. WordPressエディターで動作確認');
}

main();
