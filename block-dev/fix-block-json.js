const fs = require('fs');
const path = require('path');

const blocks = [
    'lw-content-1',
    'lw-content-2',
    'lw-content-8',
    'paid-block-content-3',
    'paid-block-content-4',
    'paid-block-content-5',
    'paid-block-content-6',
    'paid-block-content-7',
];

const srcDir = path.join(__dirname, 'src');

blocks.forEach(blockDir => {
    const jsonPath = path.join(srcDir, blockDir, 'block.json');

    if (!fs.existsSync(jsonPath)) {
        console.log(`Skip (not found): ${jsonPath}`);
        return;
    }

    const blockJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 正しいファイルパスに修正
    blockJson.editorScript = `file:./${blockDir}.js`;
    blockJson.editorStyle = "file:./editor.css";
    blockJson.style = "file:./style.css";

    fs.writeFileSync(jsonPath, JSON.stringify(blockJson, null, '\t'));
    console.log(`Fixed: ${blockDir}/block.json`);
});

console.log('\nAll block.json files fixed!');
