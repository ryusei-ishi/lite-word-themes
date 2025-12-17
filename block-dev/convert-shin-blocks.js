const fs = require('fs');
const path = require('path');

const blocks = [
    { dir: 'shin-gas-station-01-message-01', name: 'wdl/shin-gas-station-01-message-01', title: 'メッセージ 1 shin shop pattern 01', icon: 'admin-comments', category: 'lw-content', needsUseBlockProps: true },
    { dir: 'shin-gas-station-01-news', name: 'wdl/shin-gas-station-01-news', title: 'お知らせ一覧 1 shin shop pattern 01', icon: 'editor-ul', category: 'lw-post', needsUseBlockProps: false },
    { dir: 'shin-gas-station-01-post-list', name: 'wdl/shin-gas-station-01-post-list', title: '投稿一覧 1 shin shop pattern 01', icon: 'editor-ul', category: 'lw-post', needsUseBlockProps: false },
    { dir: 'shin-gas-station-01-shop-list-1', name: 'wdl/shin-gas-station-01-shop-list-1', title: '店舗一覧用 1 shin shop pattern 01', icon: 'store', category: 'lw-shop', needsUseBlockProps: true },
];

const srcDir = path.join(__dirname, 'src');

blocks.forEach(block => {
    const blockDir = path.join(srcDir, block.dir);
    const indexPath = path.join(blockDir, 'index.js');
    const jsonPath = path.join(blockDir, 'block.json');

    // 1. block.json 作成
    const blockJson = {
        "$schema": "https://schemas.wp.org/trunk/block.json",
        "apiVersion": 3,
        "name": block.name,
        "version": "1.0.0",
        "title": block.title,
        "category": block.category,
        "icon": block.icon,
        "editorScript": `file:./${block.dir}.js`,
        "editorStyle": "file:./editor.css",
        "style": "file:./style.css",
        "supports": { "anchor": true }
    };
    fs.writeFileSync(jsonPath, JSON.stringify(blockJson, null, '\t'));
    console.log(`Created: ${block.dir}/block.json`);

    // 2. index.js 更新
    let content = fs.readFileSync(indexPath, 'utf8');

    // metadata import追加
    if (!content.includes("import metadata from './block.json'")) {
        content = content.replace(
            /(import\s+['"]\.\/editor\.scss['"];)/,
            "$1\nimport metadata from './block.json';"
        );
    }

    // useBlockProps追加（必要な場合のみ）
    if (block.needsUseBlockProps && !content.includes('useBlockProps')) {
        // MediaUploadがある場合
        content = content.replace(
            /import\s*\{\s*RichText\s*,\s*InspectorControls\s*,\s*MediaUpload\s*\}\s*from\s*['"]@wordpress\/block-editor['"];/,
            "import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';"
        );
    }

    // registerBlockType更新
    content = content.replace(
        /registerBlockType\s*\(\s*['"]wdl\/[^'"]+['"]\s*,/g,
        'registerBlockType(metadata.name,'
    );

    fs.writeFileSync(indexPath, content);
    console.log(`Updated: ${block.dir}/index.js`);
});

console.log('\nAll shin-gas-station blocks converted!');
