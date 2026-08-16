/**
 * lw-pr-post-list-4 — エディタと保存HTMLで共通の見た目を作るヘルパー
 * ここを1本にしておかないと、エディタとフロントで表示がズレる。
 */

// 色フィルター（.filter）のスタイル。ブロックは全幅なので背景もビューポート幅いっぱいに出る。
// 背景画像の上に重ねるので、透明度を下げると画像が透けて見える。
export function filterStyle( { bgColor, bgOpacity } ) {
    if ( ! bgColor ) {
        return undefined;
    }
    return {
        background: bgColor,
        opacity: bgOpacity / 100,
    };
}

// カードを並べる内側（.lw_pr-post-list-4）のスタイル
// --lw-cols は CSS 側で grid の列数として読む
//
// ⚠️ 必ず String() で文字列にすること。
//    保存HTMLを作る renderToString（@wordpress/element）は数値に px を付けるため、
//    数値のままだと --lw-cols:3px になり repeat(3px,…) が無効値になってグリッドが崩れる。
//    エディタ側は React DOM が px を付けないので、見た目では気づけない。
export function gridStyle( { columns } ) {
    return { '--lw-cols': String( columns ) };
}
