/**
 * ランキング 01 の共通部品（編集画面と保存の両方から使う）
 * ---------------------------------------------------------
 * ここに置く理由は、**編集画面と保存で計算がずれないようにするため**。
 * 片方だけ直すと save の出力が変わり、既存ページが「ブロックが壊れています」になる。
 */

/** 順位の札の色（1位=金・2位=銀・3位=銅・4位以下=灰） */
export function rankColor( a, index ) {
	if ( index === 0 ) { return a.rank1Color; }
	if ( index === 1 ) { return a.rank2Color; }
	if ( index === 2 ) { return a.rank3Color; }
	return a.rankOtherColor;
}

/** 順位の札に出す文字（メダル／数字／出さない） */
export function rankLabel( a, index ) {
	if ( a.rankStyle === 'none' ) { return ''; }
	/* メダルだけだと色つきの札の上で潰れて読めない（2026-09-02・実際にそう見えた）。
	   メダルは添えるだけにして、順位は数字で読ませる。 */
	if ( a.rankStyle === 'medal' && index < 3 ) {
		const medal = [ '\u{1F947}', '\u{1F948}', '\u{1F949}' ][ index ];
		return `${ medal }${ index + 1 }${ a.rankUnit || '' }`;
	}
	return `${ index + 1 }${ a.rankUnit || '' }`;
}

/**
 * 星の塗り幅（％）。0〜5 の評価を長さに直す。
 * 文字の星を重ねて、上の色つきの星をこの幅で切る（半分の星も出せる）。
 * ⚠️ 単位（%）が付くので、ここは数値で渡しても React が px を付ける心配はない。
 *    それでも文字列で返して、扱いを他の変数とそろえておく。
 *
 * 🚨 小数第1位で丸める。丸めないと 4.4 が 88.00000000000001% になる
 *    （2進小数の誤差。0〜5 を 0.1 刻みで見ると 50 通り中 11 通りで出る）。
 *    見た目は同じでも、この値は保存される HTML に入る。
 *    **公開したあとに丸め方を変えると、それまでに保存された全ページが
 *    「ブロックが壊れています」になる。** ここは公開前にしか直せない。
 *    2026-09-02、公開前に直した。
 */
export function starPercent( score ) {
	const n = parseFloat( score );
	if ( ! isFinite( n ) || n <= 0 ) { return null; }
	const pct = Math.max( 0, Math.min( 100, ( n / 5 ) * 100 ) );
	return `${ Math.round( pct * 10 ) / 10 }%`;
}

/**
 * RichText の値に、目に見える中身があるか。
 *
 * 🚨 空文字だけでなく、`<br>` や `&nbsp;` だけの状態も「無い」と見る。
 *    RichText は消しきったつもりでも空タグが残ることがあり、
 *    素の `if ( item.good )` では拾えない。
 * 🚨 編集画面と保存の両方から必ずこの関数を使うこと。
 *    判定がずれると save の出力が変わり、既存ページが「壊れています」になる。
 */
export function hasText( value ) {
	if ( value === undefined || value === null ) { return false; }
	return String( value )
		.replace( /<[^>]*>/g, '' )
		.replace( /&nbsp;| /g, ' ' )
		.trim() !== '';
}

/** アドレスの入っているお店だけ返す（空の店はボタンごと出さない） */
export function visibleShops( item ) {
	return ( ( item && item.shops ) || [] ).filter( ( s ) => s && s.url );
}

/**
 * ブロック全体に渡す CSS 変数。
 *
 * 🚨🚨 **単位のない値は必ず文字列で渡すこと。**
 *    React は style に数値を渡されると px を付ける（カスタムプロパティも例外ではない）。
 *    `3` を渡すと `--rk1-btn-col:3px` になり `repeat(3px, 1fr)` ＝ 丸ごと無効で1列に潰れる。
 *    2026-09-02 に商品リンク 01 で実際に踏んだ。**プレビューでは気づけない。**
 *    検査 → scripts/fv-samples/check-cssvar-px.js
 */
export function blockVars( a ) {
	return {
		marginTop: `${ a.marginTop }px`,
		marginBottom: `${ a.marginBottom }px`,
		'--rk1-max-width': `${ a.maxWidth }px`,
		'--rk1-gap': `${ a.itemGap }px`,
		'--rk1-img-w': `${ a.imageWidth }px`,
		'--rk1-img-w-sp': `${ a.imageWidthSp }px`,
		'--rk1-name-size': `${ a.nameFontSize }px`,
		'--rk1-name-size-sp': `${ a.nameFontSizeSp }px`,
		'--rk1-btn-size': `${ a.buttonFontSize }px`,
		'--rk1-score-color': a.scoreColor,
	};
}

/** 1件ごとの箱の見た目 */
export function boxStyle( a ) {
	return {
		backgroundColor: a.boxBgColor,
		borderColor: a.boxBorderColor,
		borderWidth: `${ a.boxBorderWidth }px`,
		borderRadius: `${ a.borderRadius }px`,
	};
}

/**
 * お店のボタンの列数。**出るボタンの数で頭打ちにする。**
 * 3列のまま1本だけ出すと、箱の3分の1幅でぽつんと残って貧相に見える。
 * 🚨 ここも String() を外さないこと（上の px の話）。
 */
export function shopsStyle( a, count ) {
	const n = Math.max( count || 0, 1 );
	return {
		'--rk1-btn-col': String( Math.min( a.buttonColumnsPc, n ) ),
		'--rk1-btn-col-sp': String( Math.min( a.buttonColumnsSp, n ) ),
	};
}
