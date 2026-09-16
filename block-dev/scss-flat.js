/**
 * SCSS（入れ子で書いた正本）を、入れ子の無い CSS に書き出す。
 *
 *   node scss-flat.js <入力.scss> [出力.css]     … 出力を省くと同じ場所の .css
 *
 * ■ なぜ要るか（2026-09-16）
 *   CSS の入れ子（CSS Nesting）を読めるのは Chrome 112・Safari 16.5 から。要素名で始まる入れ子は Chrome 120・Safari 17.2 から。
 *   それより古いブラウザでは入れ子の中身が丸ごと効かない（幌北ゆりかごで、古い Mac の Chrome でメニューが崩れた）。
 *   LiteWord は不特定の閲覧環境に配るので、書くのは入れ子のままでよいが、配る .css は入れ子を外したものにする（Ryuichi 判断）。
 *
 * ■ 止まる条件（書き出さない）
 *   ① 宣言が入れ子のルールより後ろにある（mixed-decls）… sass と今のブラウザで並び順の解釈が違い、見た目が変わりうる。
 *      宣言を入れ子より前に移すか、`& { ... }` で包んでから書き出す
 *   ② 書き出した結果にまだ入れ子が残っている
 *
 * ■ 止まらないが気をつけること
 *   親が「詳細度のそろっていないセレクタのリスト」（例 `.body, html:has(#x)`）の入れ子は、ブラウザでは `:is()` 扱いで
 *   いちばん重い詳細度がリスト全体に付くが、書き出すと各セレクタ自身の詳細度に戻る。書き出したあとは見た目を突き合わせる
 *
 * sass は @wordpress/scripts に入っている dart-sass を使う（このフォルダで npm install 済みのもの）。
 */
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const input = process.argv[2];
if (!input) {
    console.error('使い方: node scss-flat.js <入力.scss> [出力.css]');
    process.exit(1);
}
const output = process.argv[3] || input.replace(/\.scss$/, '.css');

const warnings = [];
const result = sass.compile(input, {
    style: 'expanded',
    charset: false,
    logger: { warn: (message) => warnings.push(message) },
});
if (warnings.length) {
    console.error('止めました（sass の警告）:\n' + warnings.join('\n'));
    process.exit(1);
}

// sass は2スペースで出すので、テーマの他の CSS に合わせて4スペースにする
const css = result.css
    .split('\n')
    .map((line) => line.replace(/^( +)/, (sp) => '    '.repeat(sp.length / 2)))
    .join('\n');

if (hasNesting(css)) {
    console.error('止めました: 書き出した CSS にまだ入れ子が残っています');
    process.exit(1);
}

const header = `/* 🚨 このファイルは ${path.basename(input)} から書き出したもの。直すときは ${path.basename(input)} を直す */\n`;
fs.writeFileSync(output, header + css + '\n');
console.log('書き出しました:', output);

/**
 * スタイルルールの中に { が開いていたら入れ子（@media などの中のルールは入れ子ではない）
 */
function hasNesting(text) {
    const stack = [];
    let buf = '';
    let quote = null;
    const src = text.replace(/\/\*[\s\S]*?\*\//g, '');
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (quote) {
            if (c === quote && src[i - 1] !== '\\') quote = null;
            continue;
        }
        if (c === '"' || c === "'") { quote = c; continue; }
        if (c === '{') {
            const selector = buf.trim();
            buf = '';
            const parent = stack[stack.length - 1];
            if (parent === 'rule') return true;
            if (parent === 'at-other') { stack.push('keyframe'); continue; }
            if (/^@(media|supports|layer|container|document|scope|starting-style)/i.test(selector)) stack.push('group');
            else if (/^@/.test(selector)) stack.push('at-other');
            else stack.push('rule');
        } else if (c === '}') { stack.pop(); buf = ''; }
        else if (c === ';') { buf = ''; }
        else buf += c;
    }
    return false;
}
