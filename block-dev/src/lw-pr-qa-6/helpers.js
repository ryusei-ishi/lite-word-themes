/**
 * lw-pr-qa-6 — エディタと保存HTMLで共通の見た目を作るヘルパー
 * save() は必ず同じ結果を返す必要があるので、引数だけで結果が決まるように書くこと。
 */

// ブロック本体に流す CSS 変数。値は style.scss 側が読む
export function blockStyle( a ) {
    return {
        '--qa6-max-w': a.maxWidth === 0 ? '100%' : `${ a.maxWidth }px`,
        '--qa6-nav-w': `${ a.navWidth }px`,
        '--qa6-sticky-top': `${ a.stickyTop }px`,
        '--qa6-gap': `${ a.itemGap }px`,
        '--qa6-label-w': `${ a.labelWidth }px`,
        '--qa6-main': a.mainColor,
        '--qa6-nav-bg': a.navBg,
        '--qa6-q-color': a.qLabelColor,
        '--qa6-a-color': a.aLabelColor,
        '--qa6-line': a.lineColor,
        '--qa6-title-size-pc': `${ a.groupTitleSizePc }px`,
        '--qa6-title-size-sp': `${ a.groupTitleSizeSp }px`,
        '--qa6-label-size-pc': `${ a.labelFontSizePc }px`,
        '--qa6-label-size-sp': `${ a.labelFontSizeSp }px`,
        '--qa6-q-size-pc': `${ a.qFontSizePc }px`,
        '--qa6-q-size-sp': `${ a.qFontSizeSp }px`,
        '--qa6-a-size-pc': `${ a.aFontSizePc }px`,
        '--qa6-a-size-sp': `${ a.aFontSizeSp }px`,
    };
}

export function rootClass( a, extra ) {
    return [ 'lw-pr-qa-6', `qa-6--nav-${ a.navPosition }`, extra ].filter( Boolean ).join( ' ' );
}

export function labelText( prefix, index, labelStyle ) {
    if ( labelStyle === 'number' ) {
        return `${ prefix }${ index + 1 }`;
    }
    if ( labelStyle === 'number_dot' ) {
        return `${ prefix }${ index + 1 }.`;
    }
    return prefix;
}

export function fontAttr( font ) {
    return font || undefined;
}

export function weightStyle( weight ) {
    return weight ? { fontWeight: weight } : undefined;
}

export function safeGroups( groups ) {
    return Array.isArray( groups ) ? groups : [];
}

export function safeItems( group ) {
    return group && Array.isArray( group.items ) ? group.items : [];
}
