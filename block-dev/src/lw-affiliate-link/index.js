/**
 * 文中のリンクに「広告リンク（アフィリエイト）」の印を付ける書式ボタン
 * ==================================================================
 * ボタン系のブロックには「広告リンク」の設定を付けたが（lw-button-* / lw-pr-product-1）、
 * アフィリエイトのリンクの大半は文章の中にある（「詳しくは こちら」の“こちら”）。
 * そこが裸のままだったので、リンクの上にいるときだけツールバーに印を付けるボタンを出す。
 *
 * 付ける印は rel="sponsored nofollow"。ブロック側の LW_AFFILIATE_REL と同じ値にそろえてある
 * （src/affiliate-link.js）。Google は広告・有料リンクに sponsored を求めており、
 * WordPress 7.1 のリンク設定にあるのは nofollow だけで sponsored は無い。
 *
 * 🚨 target（新しいタブで開く）は触らない。
 *    WordPress のリンク設定に「新しいタブで開く」が既にあるので、そちらと役割を分ける。
 *    ブロック側の広告リンク設定も新しいタブとは独立している。挙動をそろえるため。
 *
 * 登録: functions/css_js_set/editor.php（wp_enqueue_script）
 * ビルド: LW_BLOCK=lw-affiliate-link node ./node_modules/webpack/bin/webpack.js --config webpack.one.js
 */
import { registerFormatType, applyFormat, getActiveFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

const LINK_FORMAT   = 'core/link';
const AFFILIATE_REL = [ 'sponsored', 'nofollow' ];

const toList = ( rel ) => String( rel || '' ).split( /\s+/ ).filter( Boolean );

/**
 * そのリンクが本文のどこからどこまでかを返す。
 * 1本のリンクは同じ format オブジェクトを文字ごとに共有しているので、
 * その参照を持つ文字の範囲を探せばよい（本体の getFormatBoundary と同じ考え方。
 * あちらは @wordpress/rich-text から出ていないので自前で持つ）。
 *
 * 離れた場所に同じ URL を2回貼っても混ざらない。normaliseFormats が参照を
 * まとめるのは「1つ前の文字と同じとき」だけなので、あいだにリンクでない文字が
 * 1つでもあれば連なりが切れて別オブジェクトのままになる。
 * 隣り合った同じリンクは1つの参照にまとめられるが、そちらは rich-text 自身が
 * 1本のリンクとして扱うものなので、まとめて印を付けるのが正しい。
 */
function linkRange( value, format ) {
	const { formats } = value;
	let start = -1;
	let end   = -1;
	for ( let i = 0; i < formats.length; i++ ) {
		if ( Array.isArray( formats[ i ] ) && formats[ i ].indexOf( format ) !== -1 ) {
			if ( start === -1 ) { start = i; }
			end = i + 1;
		}
	}
	return start === -1 ? null : { start, end };
}

const Edit = ( { value, onChange } ) => {
	const link = getActiveFormat( value, LINK_FORMAT );
	/* リンクの上にいないときはボタンを出さない（押しても何も起きないボタンを見せない） */
	if ( ! link ) { return null; }

	const rel  = toList( link.attributes && link.attributes.rel );
	const isOn = rel.indexOf( 'sponsored' ) !== -1;

	const toggle = () => {
		const range = linkRange( value, link );
		if ( ! range ) { return; }

		/* 🚨 外すときに消すのは sponsored だけ。
		   nofollow は WordPress のリンク設定にもあり、利用者が自分で付けていることがある。
		   両方消すと、このボタンを一度押して戻しただけで利用者の nofollow が黙って消える。
		   付けるときは sponsored と nofollow を両方入れる（Google が求める形）。
		   戻したときに nofollow が残るのは、外れて困るものではないので許容する。 */
		const next = isOn
			? rel.filter( ( r ) => r !== 'sponsored' )
			: rel.filter( ( r ) => AFFILIATE_REL.indexOf( r ) === -1 ).concat( AFFILIATE_REL );

		const attributes = { ...( link.attributes || {} ) };
		if ( next.length ) { attributes.rel = next.join( ' ' ); }
		else { delete attributes.rel; }

		/* 🚨 { type, attributes } だけの新しい物を渡さないこと。
		   core/link に登録されていない属性（class・title など）は format の
		   unregisteredAttributes に入っていて、作り直すと落ちる。
		   元の format を広げて attributes だけ差し替える。 */
		onChange( applyFormat( value, { ...link, attributes }, range.start, range.end ) );
	};

	return (
		<RichTextToolbarButton
			icon="megaphone"
			title={ isOn ? '広告リンクの印を外す' : '広告リンク（アフィリエイト）' }
			onClick={ toggle }
			isActive={ isOn }
		/>
	);
};

/* 🚨 この書式そのものは本文に付けない（付けるのは core/link の rel）。
   ツールバーにボタンを出すためだけに登録する（br-on-none と同じやり方）。
   tagName と className は他とぶつからない名前にしてある。 */
registerFormatType( 'liteword/affiliate-link', {
	title:     '広告リンク（アフィリエイト）',
	tagName:   'span',
	className: 'lw-affiliate-link-marker',
	edit:      Edit,
} );
