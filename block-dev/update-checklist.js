const fs = require('fs');
const path = require('path');

const checklistPath = 'C:/MAMP/htdocs/SUPPORT_LOUNGE/LiteWord/wp-content/themes/apiVersion3-checklist.html';

let content = fs.readFileSync(checklistPath, 'utf8');

// 1. lw-content-1, lw-content-2, lw-content-8 を完了に更新
content = content.replace(
    "['lw-content-1', 0, 0, '', '']",
    "['lw-content-1', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['lw-content-2', 0, 0, '', '']",
    "['lw-content-2', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['lw-content-8', 0, 0, '', '']",
    "['lw-content-8', 1, 1, '2025-12-07', '']"
);

// 2. paid-block-content-3~7 を完了に更新
content = content.replace(
    "['paid-block-content-3', 0, 0, '', '']",
    "['paid-block-content-3', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['paid-block-content-4', 0, 0, '', '']",
    "['paid-block-content-4', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['paid-block-content-5', 0, 0, '', '']",
    "['paid-block-content-5', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['paid-block-content-6', 0, 0, '', '']",
    "['paid-block-content-6', 1, 1, '2025-12-07', '']"
);
content = content.replace(
    "['paid-block-content-7', 0, 0, '', '']",
    "['paid-block-content-7', 1, 1, '2025-12-07', '']"
);

// 3. エラー履歴を追加
const errorDoc = `            <hr>
            <h3>2025-12-07: lw-contentカテゴリ対応完了</h3>
            <p><strong>完了ブロック（8個）:</strong> lw-content-1, lw-content-2, lw-content-8, paid-block-content-3~7</p>
            <p style="color:#dc3545;"><strong>★ 発生したエラーと対処（重要）:</strong></p>
            <ul>
                <li><strong>block.json のファイルパス間違い:</strong> ブロックが「プレミアムプラン必要」と表示され利用不可に
                    <br>・原因: block.json に間違ったファイルパスを指定
                    <br>・<span style="color:red;">間違い:</span> <code>"editorScript": "file:./index.js"</code>, <code>"editorStyle": "file:./index.css"</code>, <code>"style": "file:./style-index.css"</code>
                    <br>・<span style="color:green;">正解:</span> <code>"editorScript": "file:./{ブロック名}.js"</code>, <code>"editorStyle": "file:./editor.css"</code>, <code>"style": "file:./style.css"</code>
                    <br>・ビルド後のファイル名を確認すること！</li>
                <li><strong>useBlockProps import文破損:</strong> <code>RichText</code>の後にカンマがない場合、<code>useBlockProps</code>追加で構文エラー
                    <br>・修正: 手動でカンマを追加</li>
            </ul>
            <hr>
            <h3>FVブロックのapiVersion 3対応について</h3>`;

content = content.replace(
    `            <hr>
            <h3>FVブロックのapiVersion 3対応について</h3>`,
    errorDoc
);

fs.writeFileSync(checklistPath, content);
console.log('Checklist updated successfully!');
