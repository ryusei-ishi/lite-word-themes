/**
 * lw-pr-qa-4 — エディタと保存HTMLで共通の見た目を作るヘルパー
 * ここを1本にしておかないと、エディタとフロントで表示がズレる。
 * さらに save() は必ず同じ結果を返す必要があるので、
 * ここの関数は引数だけで結果が決まるように書くこと（Date.now() 等を使わない）。
 */

// ブロック本体に流す CSS 変数。値は style.scss 側が読む
export function blockStyle( a ) {
    return {
        '--qa4-max-w': a.maxWidth === 0 ? '100%' : `${ a.maxWidth }px`,
        '--qa4-gap': `${ a.itemGap }px`,
        '--qa4-label-w': `${ a.labelWidth }px`,
        '--qa4-main': a.mainColor,
        '--qa4-tab-bg': a.tabBg,
        '--qa4-tab-color': a.tabTextColor,
        '--qa4-tab-active-color': a.activeTextColor,
        '--qa4-q-color': a.qLabelColor,
        '--qa4-a-color': a.aLabelColor,
        '--qa4-line': a.lineColor,
        '--qa4-label-size-pc': `${ a.labelFontSizePc }px`,
        '--qa4-label-size-sp': `${ a.labelFontSizeSp }px`,
        '--qa4-q-size-pc': `${ a.qFontSizePc }px`,
        '--qa4-q-size-sp': `${ a.qFontSizeSp }px`,
        '--qa4-a-size-pc': `${ a.aFontSizePc }px`,
        '--qa4-a-size-sp': `${ a.aFontSizeSp }px`,
    };
}

// ブロックに付けるクラス。タブの形と寄せを CSS 側へ渡す
export function rootClass( a, extra ) {
    return [ 'lw-pr-qa-4', `qa-4--${ a.tabStyle }`, `qa-4--align-${ a.tabAlign }`, extra ]
        .filter( Boolean )
        .join( ' ' );
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

// data-lw_font_set は未選択なら属性ごと出さない
export function fontAttr( font ) {
    return font || undefined;
}

// フォントの太さ。「未選択」のときは style を付けず、CSS 側の既定に任せる
export function weightStyle( weight ) {
    return weight ? { fontWeight: weight } : undefined;
}

// 空の分類を除いた配列。save() と edit() の両方で同じ結果になるようにここに置く
export function safeGroups( groups ) {
    return Array.isArray( groups ) ? groups : [];
}

// 分類の中の質問。items が無い分類でも落ちないようにする
export function safeItems( group ) {
    return group && Array.isArray( group.items ) ? group.items : [];
}
