/**
 * lw-pr-qa-3 — エディタと保存HTMLで共通の見た目を作るヘルパー
 * ここを1本にしておかないと、エディタとフロントで表示がズレる。
 * さらに save() は必ず同じ結果を返す必要があるので、
 * ここの関数は引数だけで結果が決まるように書くこと（Date.now() 等を使わない）。
 */

// ブロック本体に流す CSS 変数。値は style.scss 側が読む
export function blockStyle( a ) {
    return {
        '--qa3-max-w': a.maxWidth === 0 ? '100%' : `${ a.maxWidth }px`,
        '--qa3-gap': `${ a.itemGap }px`,
        '--qa3-label-w': `${ a.labelWidth }px`,
        '--qa3-q-color': a.qLabelColor,
        '--qa3-a-color': a.aLabelColor,
        '--qa3-line': a.lineColor,
        '--qa3-label-size-pc': `${ a.labelFontSizePc }px`,
        '--qa3-label-size-sp': `${ a.labelFontSizeSp }px`,
        '--qa3-q-size-pc': `${ a.qFontSizePc }px`,
        '--qa3-q-size-sp': `${ a.qFontSizeSp }px`,
        '--qa3-a-size-pc': `${ a.aFontSizePc }px`,
        '--qa3-a-size-sp': `${ a.aFontSizeSp }px`,
    };
}

// ラベルの文字。連番のときだけ番号を足す（index は 0 始まり）
export function labelText( prefix, index, labelStyle ) {
    if ( labelStyle === 'number' ) {
        return `${ prefix }${ index + 1 }`;
    }
    if ( labelStyle === 'number_dot' ) {
        return `${ prefix }${ index + 1 }.`;
    }
    return prefix;
}

// フォントの太さ。「未選択」のときは style を付けず、CSS 側の既定に任せる
// （空文字を渡すと style="font-weight:" という無意味な属性が残るため）
export function weightStyle( weight ) {
    return weight ? { fontWeight: weight } : undefined;
}

// data-lw_font_set は未選択なら属性ごと出さない
export function fontAttr( font ) {
    return font || undefined;
}
