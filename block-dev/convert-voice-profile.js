const fs = require('fs');
const path = require('path');

const blocks = [
    { dir: 'lw-voice-1', name: 'wdl/lw-voice-1', title: 'お客様の声 01', icon: 'format-status', category: 'lw-voice' },
    { dir: 'profile-1', name: 'wdl/profile-1', title: 'プロフィール 01', icon: 'id', category: 'lw-profile' },
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

    // metadata importを追加
    if (!content.includes("import metadata from './block.json'")) {
        content = content.replace(
            /(import\s+['"]\.\/editor\.scss['"];)/,
            "$1\nimport metadata from './block.json';"
        );
    }

    // useBlockProps を追加（まだ無ければ）
    if (!content.includes('useBlockProps')) {
        // PanelColorSettings がある場合
        content = content.replace(
            /(\s*PanelColorSettings\s*)\}\s*from\s*['"]@wordpress\/block-editor['"];/,
            '$1, useBlockProps } from \'@wordpress/block-editor\';'
        );
        // ColorPalette がある場合
        content = content.replace(
            /(\s*ColorPalette\s*)\n?\}\s*from\s*['"]@wordpress\/block-editor['"];/,
            '$1,\n    useBlockProps,\n} from \'@wordpress/block-editor\';'
        );
    }

    // Fragment → <> に変更
    content = content.replace(/<Fragment>/g, '<>');
    content = content.replace(/<\/Fragment>/g, '</>');

    // Fragment import を削除
    content = content.replace(/import\s*\{\s*Fragment\s*,\s*useEffect\s*\}\s*from\s*['"]@wordpress\/element['"];/,
        "import { useEffect } from '@wordpress/element';");
    content = content.replace(/import\s*\{\s*Fragment\s*\}\s*from\s*['"]@wordpress\/element['"];(\n)?/g, '');

    // registerBlockType('wdl/xxx', { を registerBlockType(metadata.name, { に変更
    content = content.replace(
        /registerBlockType\s*\(\s*['"]wdl\/[^'"]+['"]\s*,/g,
        'registerBlockType(metadata.name,'
    );

    fs.writeFileSync(indexPath, content);
    console.log(`Updated: ${indexPath}`);
});

console.log('\nAll voice/profile blocks converted to apiVersion 3!');
