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
    const indexPath = path.join(srcDir, blockDir, 'index.js');
    let content = fs.readFileSync(indexPath, 'utf8');

    // 壊れた import を修正: },\n\tuseBlockProps,\n} → \tuseBlockProps,\n}
    content = content.replace(/},\s*\n\s*useBlockProps,\s*\n\}\s*from\s*['"]@wordpress\/block-editor['"];/g,
        '\tuseBlockProps,\n} from \'@wordpress/block-editor\';');

    fs.writeFileSync(indexPath, content);
    console.log(`Fixed: ${indexPath}`);
});

console.log('\nAll content block imports fixed!');
