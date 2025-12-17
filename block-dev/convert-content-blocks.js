const fs = require('fs');
const path = require('path');

// コンテンツブロック一覧
const blocks = [
    { dir: 'lw-content-1', name: 'wdl/lw-content-1', title: 'Content 1', icon: 'format-image', category: 'lw-content' },
    { dir: 'lw-content-2', name: 'wdl/lw-content-2', title: 'content 02', icon: 'lightbulb', category: 'lw-content' },
    { dir: 'lw-content-8', name: 'wdl/lw-content-8', title: 'Content 08', icon: 'lightbulb', category: 'lw-content' },
    { dir: 'paid-block-content-3', name: 'wdl/paid-block-content-3', title: 'Content 03', icon: 'format-image', category: 'lw-content' },
    { dir: 'paid-block-content-4', name: 'wdl/paid-block-content-4', title: 'Content 04', icon: 'format-gallery', category: 'lw-content' },
    { dir: 'paid-block-content-5', name: 'wdl/paid-block-content-5', title: 'Content 05', icon: 'format-image', category: 'lw-content' },
    { dir: 'paid-block-content-6', name: 'wdl/paid-block-content-6', title: 'Content 06', icon: 'format-image', category: 'lw-content' },
    { dir: 'paid-block-content-7', name: 'wdl/paid-block-content-7', title: 'Content 07', icon: 'lightbulb', category: 'lw-content' },
];

const srcDir = path.join(__dirname, 'src');

blocks.forEach(block => {
    const blockDir = path.join(srcDir, block.dir);
    const indexPath = path.join(blockDir, 'index.js');
    const jsonPath = path.join(blockDir, 'block.json');

    // 1. block.json を作成
    const blockJson = {
        "$schema": "https://schemas.wp.org/trunk/block.json",
        "apiVersion": 3,
        "name": block.name,
        "version": "1.0.0",
        "title": block.title,
        "category": block.category,
        "icon": block.icon,
        "editorScript": "file:./index.js",
        "editorStyle": "file:./index.css",
        "style": "file:./style-index.css",
        "supports": {
            "anchor": true
        }
    };

    fs.writeFileSync(jsonPath, JSON.stringify(blockJson, null, '\t'));
    console.log(`Created: ${jsonPath}`);

    // 2. index.js を更新
    let content = fs.readFileSync(indexPath, 'utf8');

    // Fragment, createElement のimportを削除
    content = content.replace(/import\s*\{\s*Fragment\s*(?:,\s*createElement)?\s*\}\s*from\s*['"]@wordpress\/element['"];\s*\n?/g, '');
    content = content.replace(/import\s*\{\s*createElement\s*(?:,\s*Fragment)?\s*\}\s*from\s*['"]@wordpress\/element['"];\s*\n?/g, '');
    content = content.replace(/import\s*\{\s*Fragment\s*\}\s*from\s*['"]@wordpress\/element['"];\s*\n?/g, '');

    // metadata importを追加（既に無ければ）
    if (!content.includes("import metadata from './block.json'")) {
        // editor.scss import の後に追加
        content = content.replace(
            /(import\s+['"]\.\/editor\.scss['"];)/,
            "$1\nimport metadata from './block.json';"
        );
    }

    // useBlockProps を追加（まだ無ければ）
    if (!content.includes('useBlockProps')) {
        content = content.replace(
            /from\s*['"]@wordpress\/block-editor['"];/,
            (match) => {
                // 既存のimportに追加
                return match;
            }
        );
        // ColorPalette の後に useBlockProps を追加
        content = content.replace(
            /(\s*ColorPalette,?\s*\n?\s*\})\s*from\s*['"]@wordpress\/block-editor['"];/,
            '$1,\n\tuseBlockProps,\n} from \'@wordpress/block-editor\';'
        );
        // ColorPalette がない場合は RichText の後に追加
        if (!content.includes('useBlockProps')) {
            content = content.replace(
                /(\s*RichText,?\s*\n?\s*(?:MediaUpload,?\s*\n?\s*)?(?:InspectorControls,?\s*\n?\s*)?)\}\s*from\s*['"]@wordpress\/block-editor['"];/,
                '$1\tuseBlockProps,\n} from \'@wordpress/block-editor\';'
            );
        }
    }

    // registerBlockType('wdl/xxx', { を registerBlockType(metadata.name, { に変更
    content = content.replace(
        /registerBlockType\s*\(\s*['"]wdl\/[^'"]+['"]\s*,/g,
        'registerBlockType(metadata.name,'
    );

    // title: 'xxx' をコメントアウト（block.jsonに移動したため）- オプション
    // これは残しておいても動作する

    // <Fragment> を <> に、</Fragment> を </> に変更
    content = content.replace(/<Fragment>/g, '<>');
    content = content.replace(/<\/Fragment>/g, '</>');

    fs.writeFileSync(indexPath, content);
    console.log(`Updated: ${indexPath}`);
});

console.log('\nAll content blocks converted to apiVersion 3!');
