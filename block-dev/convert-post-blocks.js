const fs = require('fs');
const path = require('path');

const blocks = [
    { dir: 'lw-news-list-1', name: 'wdl/lw-news-list-1', title: 'お知らせ一覧 1', icon: 'editor-ul', category: 'lw-post' },
    { dir: 'lw-post-list-1', name: 'wdl/lw-post-list-1', title: '投稿一覧 1', icon: 'editor-ul', category: 'lw-post' },
    { dir: 'lw-post-list-2', name: 'wdl/lw-post-list-2', title: '投稿一覧 2', icon: 'editor-ul', category: 'lw-post' },
    { dir: 'lw-post-list-3', name: 'wdl/lw-post-list-3', title: '投稿一覧 3', icon: 'editor-ul', category: 'lw-post' },
];

const srcDir = path.join(__dirname, 'src');

blocks.forEach(block => {
    const blockDir = path.join(srcDir, block.dir);
    const indexPath = path.join(blockDir, 'index.js');
    const jsonPath = path.join(blockDir, 'block.json');

    // 1. block.json を作成（正しいファイルパスで！）
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
        "supports": {
            "anchor": true
        }
    };

    fs.writeFileSync(jsonPath, JSON.stringify(blockJson, null, '\t'));
    console.log(`Created: ${jsonPath}`);

    // 2. index.js を更新
    let content = fs.readFileSync(indexPath, 'utf8');

    // metadata importを追加（既に無ければ）
    if (!content.includes("import metadata from './block.json'")) {
        content = content.replace(
            /(import\s+['"]\.\/editor\.scss['"];)/,
            "$1\nimport metadata from './block.json';"
        );
    }

    // registerBlockType('wdl/xxx', { を registerBlockType(metadata.name, { に変更
    content = content.replace(
        /registerBlockType\s*\(\s*['"]wdl\/[^'"]+['"]\s*,/g,
        'registerBlockType(metadata.name,'
    );

    fs.writeFileSync(indexPath, content);
    console.log(`Updated: ${indexPath}`);
});

console.log('\nAll post list blocks converted to apiVersion 3!');
