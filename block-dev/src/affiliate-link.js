/**
 * LiteWord – アフィリエイトリンク（共通部品）
 * ------------------------------------------------------------
 *  Amazon・楽天などの広告リンクに、検索エンジン向けの印
 *  rel="sponsored nofollow" を付けるための共通部品。
 *
 *  なぜ要るか
 *  ・Google は「報酬が発生するリンクには rel="sponsored"（または nofollow）を付ける」
 *    ことを求めている。付けずに広告リンクを大量に置くと、リンクを売っているサイトと
 *    区別が付かず、検索順位を落とされることがある。
 *  ・ステマ規制（景品表示法・2023年10月〜）で必要なのは「広告である」という
 *    画面上の表示。rel はそれとは別（検索エンジン向け）なので、両方いる。
 *
 *  🚨 設計の前提（ここを崩すと既存ページが壊れる）
 *  ・約1000サイトに配るテーマなので、**既定値（オフ）のときの save の出力は
 *    1バイトも変えない**。lwRel() はオフのとき undefined を返し、React は
 *    属性ごと出力しない ＝ 今まで保存された HTML と完全に一致する。
 *    ＝ deprecated を書かなくてよい（reference/block-change-safety.md §0）。
 *  ・別タブの rel="noopener noreferrer" を今まで出していたブロックは、
 *    lwRel({ newTab, affiliate }) の形で呼ぶ。オフなら従来と同じ文字列になる。
 *  ・別タブでも rel を出していなかったブロック（lw-button-2 / 3）は
 *    lwRel({ affiliate }) だけを渡す。newTab を混ぜると出力が変わってしまう。
 */

import { ToggleControl } from '@wordpress/components';

/** 広告リンクに付ける rel の中身 */
export const LW_AFFILIATE_REL = 'sponsored nofollow';

/**
 * a タグの rel を組み立てる。
 * 付けるものが何も無ければ undefined（＝属性そのものを出さない）。
 *
 * @param {Object}  opt
 * @param {boolean} opt.newTab    別タブで開く（従来どおり noopener noreferrer）
 * @param {boolean} opt.affiliate 広告リンク（sponsored nofollow）
 * @return {string|undefined} rel の値
 */
export function lwRel( { newTab = false, affiliate = false } = {} ) {
	const parts = [];
	if ( newTab ) {
		parts.push( 'noopener noreferrer' );
	}
	if ( affiliate ) {
		parts.push( LW_AFFILIATE_REL );
	}
	return parts.length ? parts.join( ' ' ) : undefined;
}

/**
 * 編集画面のトグル。
 * 「新しいタブで開く」のすぐ下に置く。
 *
 * @param {Object}   props
 * @param {boolean}  props.checked
 * @param {Function} props.onChange
 */
export function AffiliateToggle( { checked, onChange } ) {
	return (
		<ToggleControl
			label="広告リンク（アフィリエイト）"
			checked={ !! checked }
			onChange={ onChange }
			help="Amazon・楽天などの、成果報酬が発生するリンクのときにオンにします。検索エンジンに広告だと伝える印が付きます（rel=&quot;sponsored nofollow&quot;）。オンにすると新しいタブで開く設定も一緒に入ります。"
		/>
	);
}
