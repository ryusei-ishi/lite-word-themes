// ── ブロックの数を数える ──
// LP に「デザインブロック◯個」と書いている数の裏取り用。
// Ryuichi 決定（2026-08-21）:「一旦146個でいい。増やしたら定期的に更新しましょう」
//
// 使い方:  node count-blocks.mjs        （block-dev ディレクトリで実行）
//
// ⚠️ 数え方が3通りあって食い違っている。LP に内訳を書かないのはそのため。
//   ・このスクリプト  … src/ の block.json があるディレクトリ数
//   ・現行LPの表記    … 146個
//   ・plans.md の記載 … 基本52 + プレミアム57 + 個別購入25+
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'src');

const dirs = fs.readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const withJson = dirs.filter((d) => fs.existsSync(path.join(SRC, d, 'block.json')));

const group = { 基本: [], 'プレミアム(lw-pr-)': [], '個別購入(paid-block-)': [], 'テンプレ専用(shin-)': [] };
for (const d of withJson) {
  if (d.startsWith('shin-')) group['テンプレ専用(shin-)'].push(d);
  else if (d.startsWith('paid-block-')) group['個別購入(paid-block-)'].push(d);
  else if (d.startsWith('lw-pr-')) group['プレミアム(lw-pr-)'].push(d);
  else group['基本'].push(d);
}

console.log('■ ブロックの数（' + new Date().toISOString().slice(0, 10) + ' 時点）');
console.log('  ディレクトリ           ' + dirs.length);
console.log('  block.json があるもの  ' + withJson.length + '   ← これが実数');
console.log('');
for (const [k, v] of Object.entries(group)) console.log('  ' + (k + '                    ').slice(0, 22) + String(v.length).padStart(3));
console.log('');
console.log('  block.json が無いもの: ' + dirs.filter((d) => !withJson.includes(d)).join(', '));
console.log('');
console.log('  LP の表記は 146個。実数と ' + (146 - withJson.length) + ' の差がある。');
console.log('  増やしたら LP の数字も更新すること（lp/copy-draft.md の「使う数字」欄）。');
