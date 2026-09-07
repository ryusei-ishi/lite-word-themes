/**
 * lw-pr-qa-5 — エディタと保存HTMLで共通の見た目を作るヘルパー
 * ここを1本にしておかないと、エディタとフロントで表示がズレる。
 * save() は必ず同じ結果を返す必要があるので、引数だけで結果が決まるように書くこと。
 */

// ブロック本体に流す CSS 変数。値は style.scss 側が読む
export function blockStyle( a ) {
    return {
        '--qa5-max-w': a.maxWidth === 0 ? '100%' : `${ a.maxWidth }px`,
        '--qa5-gap': `${ a.itemGap }px`,
        '--qa5-label-w': `${ a.labelWidth }px`,
        '--qa5-main': a.mainColor,
        '--qa5-search-bg': a.searchBg,
        '--qa5-q-color': a.qLabelColor,
        '--qa5-a-color': a.aLabelColor,
        '--qa5-line': a.lineColor,
        '--qa5-label-size-pc': `${ a.labelFontSizePc }px`,
        '--qa5-label-size-sp': `${ a.labelFontSizeSp }px`,
        '--qa5-q-size-pc': `${ a.qFontSizePc }px`,
        '--qa5-q-size-sp': `${ a.qFontSizeSp }px`,
        '--qa5-a-size-pc': `${ a.aFontSizePc }px`,
        '--qa5-a-size-sp': `${ a.aFontSizeSp }px`,
    };
}

// ブロックに付けるクラス。回答の出し方を CSS 側へ渡す
export function rootClass( a, extra ) {
    return [ 'lw-pr-qa-5', `qa-5--${ a.openMode }`, extra ].filter( Boolean ).join( ' ' );
}

export function fontAttr( font ) {
    return font || undefined;
}

export function weightStyle( weight ) {
    return weight ? { fontWeight: weight } : undefined;
}

export function safeItems( items ) {
    return Array.isArray( items ) ? items : [];
}

export function safeHints( hints ) {
    return Array.isArray( hints ) ? hints.filter( ( h ) => h && h.trim() ) : [];
}

/* 虫めがねの絵。save() と edit.js の両方から同じものを出す
   （SVG を2か所に書くと、片方だけ直したときに検証エラーになる） */
export const SEARCH_ICON_PATH =
    'M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z';
