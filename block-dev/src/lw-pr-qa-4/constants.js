/**
 * lw-pr-qa-4 — 設定の選択肢
 * ラベルの形式キーは helpers.js の labelText() と対になっている。
 * キーを変えるときは両方直すこと。
 */

// タブの見た目。値は style.scss の .qa-4--<value> と対になっている
export const tabStyleOptions = [
    { label: '丸い札（ピル）', value: 'pill' },
    { label: '下線だけ', value: 'underline' },
    { label: '四角い箱', value: 'box' },
];

// タブの寄せ
export const tabAlignOptions = [
    { label: '中央', value: 'center' },
    { label: '左', value: 'left' },
];

// Q / A ラベルの出し方
export const labelStyleOptions = [
    { label: 'Q / A（番号なし）', value: 'plain' },
    { label: 'Q1 / A1（連番）', value: 'number' },
    { label: 'Q1. / A1.（連番＋ドット）', value: 'number_dot' },
];
