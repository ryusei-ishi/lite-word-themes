/**
 * lw-pr-post-list-4 — 設定の選択肢とエディタ用のサンプル値
 * エディタ側（inspector.js / edit.js）とフロント側（front-script.js）で
 * 同じ日付フォーマットのキーを使う。キーを変えるときは両方直すこと。
 */

// カラム数（PC表示。タブレット2・スマホ1はCSS側で固定）
export const columnOptions = [
    { label: '2カラム', value: '2' },
    { label: '3カラム', value: '3' },
    { label: '4カラム', value: '4' },
];

// 日付フォーマット
export const dateFormatOptions = [
    { label: '3/4 (水)', value: 'md_day' },
    { label: '2026/3/4', value: 'ymd' },
    { label: '2026.03.04', value: 'ymd_dot' },
];

// エディタのプレビューに出すサンプル日付
export function sampleDate( format ) {
    if ( format === 'ymd' ) {
        return '2026/3/4';
    }
    if ( format === 'ymd_dot' ) {
        return '2026.03.04';
    }
    return '3/4 (水)';
}
