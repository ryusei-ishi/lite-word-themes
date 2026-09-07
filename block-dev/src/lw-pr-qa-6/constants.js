/**
 * lw-pr-qa-6 — 設定の選択肢
 */

// 分類一覧をどちら側に置くか。値は style.scss の .qa-6--nav-<value> と対になっている
export const navPositionOptions = [
    { label: '左', value: 'left' },
    { label: '右', value: 'right' },
];

// Q / A ラベルの出し方（lw-pr-qa-3 / 04 と同じキー）
export const labelStyleOptions = [
    { label: 'Q / A（番号なし）', value: 'plain' },
    { label: 'Q1 / A1（連番）', value: 'number' },
    { label: 'Q1. / A1.（連番＋ドット）', value: 'number_dot' },
];
