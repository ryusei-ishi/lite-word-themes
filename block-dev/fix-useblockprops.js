/**
 * apiVersion 3 対応ブロックの useBlockProps 修正スクリプト
 *
 * block.json が存在するブロックで、save関数に useBlockProps.save() が
 * 正しく適用されていないものを修正する
 *
 * 使用方法: node fix-useblockprops.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// block.json が存在するブロックを取得
function getBlocksWithBlockJson() {
    const blocks = [];
    const dirs = fs.readdirSync(SRC_DIR);

    for (const dir of dirs) {
        const blockDir = path.join(SRC_DIR, dir);
        const stat = fs.statSync(blockDir);

        if (stat.isDirectory()) {
            const blockJson = path.join(blockDir, 'block.json');
            const indexJs = path.join(blockDir, 'index.js');

            if (fs.existsSync(blockJson) && fs.existsSync(indexJs)) {
                blocks.push({ name: dir, path: blockDir });
            }
        }
    }
    return blocks;
}

// save関数で useBlockProps.save() が使われているかチェック
function checkUseBlockPropsInSave(content) {
    // save: が含まれているか
    if (!content.includes('save:')) {
        return null;
    }

    // useBlockProps.save( が含まれているか
    if (content.includes('useBlockProps.save(')) {
        return true;
    }

    return false;
}

// save関数内のclassNameを抽出
function extractClassNameFromSave(content) {
    // save関数の位置を特定
    const saveMatch = content.match(/save:\s*\(\s*\{[^}]*\}\s*\)\s*=>\s*\{/);
    if (!saveMatch) {
        return null;
    }

    const saveStart = saveMatch.index;
    const saveContent = content.slice(saveStart, saveStart + 4000);

    // <div className="xxx" のパターンを探す
    const patterns = [
        /<div\s+className=["']([^"']+)["']/,
        /<section\s+className=["']([^"']+)["']/,
        /<article\s+className=["']([^"']+)["']/,
    ];

    for (const pattern of patterns) {
        const match = saveContent.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

// style変数名を抽出
function extractStyleVarName(content) {
    // save関数の位置を特定
    const saveMatch = content.match(/save:\s*\(\s*\{[^}]*\}\s*\)\s*=>\s*\{/);
    if (!saveMatch) {
        return null;
    }

    const saveStart = saveMatch.index;
    const saveContent = content.slice(saveStart, saveStart + 3000);

    // const inlineStyle = { または const style = { などを探す
    const styleVarMatch = saveContent.match(/const\s+(inlineStyle|style|styleObj|blockStyle)\s*=\s*\{/);
    if (styleVarMatch) {
        return styleVarMatch[1];
    }

    return null;
}

// save関数を修正
function fixSaveFunction(content, className) {
    // 既に修正済みならスキップ
    if (content.includes('useBlockProps.save(')) {
        return { content, modified: false };
    }

    // save関数の位置を特定
    const saveMatch = content.match(/save:\s*\(\s*\{[^}]*\}\s*\)\s*=>\s*\{/);
    if (!saveMatch) {
        return { content, modified: false };
    }

    const saveStart = saveMatch.index + saveMatch[0].length;

    // style変数名を取得
    const styleVar = extractStyleVarName(content);

    // className をエスケープ
    const escapedClassName = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // パターン1: <div className="xxx" style={inlineStyle}>
    // パターン2: <div className="xxx">
    const patterns = [
        new RegExp(`(<div\\s+className=["']${escapedClassName}["'])(\\s+style=\\{[^}]+\\})?\\s*>`),
    ];

    let modified = false;
    let newContent = content;

    for (const pattern of patterns) {
        const match = content.slice(saveStart).match(pattern);
        if (match) {
            // blockProps定義を作成
            let blockPropsDef;
            if (styleVar) {
                blockPropsDef = `const blockProps = useBlockProps.save({
            className: '${className}',
            style: ${styleVar},
        });

        `;
            } else {
                blockPropsDef = `const blockProps = useBlockProps.save({
            className: '${className}',
        });

        `;
            }

            // return文の前にblockProps定義を挿入
            const returnMatch = content.slice(saveStart).match(/(\n\s*)return\s*\(/);
            if (returnMatch) {
                const insertPos = saveStart + returnMatch.index;
                const indent = returnMatch[1];

                // blockPropsの定義を挿入
                newContent = newContent.slice(0, insertPos) + indent + blockPropsDef + newContent.slice(insertPos);

                // <div className="xxx" ... > を <div {...blockProps}> に変更
                // style属性も削除（blockPropsに含まれるため）
                newContent = newContent.replace(
                    new RegExp(`<div\\s+className=["']${escapedClassName}["'](\\s+style=\\{[^}]+\\})?\\s*>`),
                    '<div {...blockProps}>'
                );

                modified = true;
                break;
            }
        }
    }

    return { content: newContent, modified };
}

// ブロックを修正
function fixBlock(block) {
    const indexJsPath = path.join(block.path, 'index.js');
    let content = fs.readFileSync(indexJsPath, 'utf-8');

    // useBlockProps.save() が使われているかチェック
    const hasUseBlockPropsSave = checkUseBlockPropsInSave(content);

    if (hasUseBlockPropsSave === true) {
        return 'already_fixed';
    }

    if (hasUseBlockPropsSave === null) {
        return 'no_save_function';
    }

    // クラス名を抽出
    const className = extractClassNameFromSave(content);
    if (!className) {
        return 'no_classname';
    }

    // 修正
    const result = fixSaveFunction(content, className);

    if (result.modified) {
        fs.writeFileSync(indexJsPath, result.content, 'utf-8');
        return 'fixed';
    }

    return 'could_not_fix';
}

// メイン処理
function main() {
    console.log('='.repeat(60));
    console.log('useBlockProps.save() 修正スクリプト');
    console.log('='.repeat(60));

    const blocks = getBlocksWithBlockJson();
    console.log(`\nblock.json が存在するブロック: ${blocks.length}個\n`);

    const results = {
        already_fixed: [],
        fixed: [],
        no_save_function: [],
        no_classname: [],
        could_not_fix: [],
    };

    const statusEmoji = {
        already_fixed: '✓',
        fixed: '🔧',
        no_save_function: '⚠',
        no_classname: '⚠',
        could_not_fix: '❌',
    };

    for (const block of blocks.sort((a, b) => a.name.localeCompare(b.name))) {
        const result = fixBlock(block);
        results[result].push(block.name);
        console.log(`  ${statusEmoji[result]} ${block.name}: ${result}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('結果サマリー');
    console.log('='.repeat(60));
    console.log(`  修正済み（変更なし）: ${results.already_fixed.length}個`);
    console.log(`  今回修正: ${results.fixed.length}個`);
    console.log(`  save関数なし: ${results.no_save_function.length}個`);
    console.log(`  className未検出: ${results.no_classname.length}個`);
    console.log(`  修正失敗: ${results.could_not_fix.length}個`);

    if (results.fixed.length > 0) {
        console.log('\n修正されたブロック:');
        for (const name of results.fixed) {
            console.log(`  - ${name}`);
        }
    }

    if (results.could_not_fix.length > 0) {
        console.log('\n手動修正が必要なブロック:');
        for (const name of results.could_not_fix) {
            console.log(`  - ${name}`);
        }
    }

    console.log('\n完了！npm run build を実行してください。');
}

main();
