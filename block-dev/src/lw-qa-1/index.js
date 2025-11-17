/* ----------------------------------------------------------
   LiteWord – QA ブロック（lw‑qa‑1）
   2025‑04‑19 改訂2: ID 非依存でクリック開閉
---------------------------------------------------------- */
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* ▼ フォントオプション ------------------------------------ */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ========================================================== */
registerBlockType( 'wdl/lw-qa-1', {
	/* -------- メタ -------- */
	title   : 'よくある質問 01',
	icon    : 'lightbulb',
	category: 'liteword-other',
	supports: { anchor:true },

	/* -------- 属性 -------- */
	attributes: {
		blockId         : { type:'string' },
		FontLabel       : { type:'string', default:'Roboto' },
		fontWeightLabel : { type:'string', default:'' },
		mainColor       : { type:'string', default:'var(--color-main)' },
		fontP           : { type:'string', default:'' },
		fontWeightDt    : { type:'string', default:'' },
		fontWeightDd    : { type:'string', default:'' },
		contents: {
			type    :'array',
			source  :'query',
			selector:'.lw-qa-1__dl',
			query   :{
				text_q:{ type:'string', source:'html', selector:'.lw-qa-1__text_q p' },
				text_a:{ type:'string', source:'html', selector:'.lw-qa-1__text_a p' }
			},
			default:[{
				text_q:'質問テキスト質問テキスト質問テキスト',
				text_a:'回答テキスト回答テキスト回答テキスト回答テキスト'
			}]
		}
	},

	/* -------- Edit -------- */
	edit( { attributes, setAttributes } ) {

		const {
			blockId, mainColor, FontLabel, fontWeightLabel,
			fontP, fontWeightDt, fontWeightDd, contents
		} = attributes;

		/* ID が無ければ生成 -------------------------------- */
		useEffect( () => {
			if ( ! blockId ) {
				setAttributes( { blockId:`lw-qa-${ Date.now() }-${ Math.floor( Math.random()*10000 ) }` } );
			}
		}, [] );

		/* リスト操作ユーティリティ -------------------------- */
		const addContent    = () => setAttributes( { contents:[ ...contents, { text_q:'新しい質問', text_a:'新しい回答' } ] } );
		const removeContent = (i)=> setAttributes( { contents:contents.filter( (_,idx )=>idx!==i ) } );
		const updateContent = (i,k,v)=>{
			const c=[ ...contents ]; c[i][k]=v; setAttributes( { contents:c } );
		};

		/* -------- JSX -------- */
		return (
			<Fragment>
				{/* サイドバー */}
				<InspectorControls>
					<PanelBody title="メインカラー">
						<ColorPalette value={ mainColor } onChange={ (v)=>setAttributes({mainColor:v}) } />
					</PanelBody>
					<PanelBody title="ラベルのフォント">
						<SelectControl label="フォント" value={ FontLabel } options={ fontOptions } onChange={ (v)=>setAttributes({FontLabel:v}) } />
						<SelectControl label="太さ"   value={ fontWeightLabel } options={ fontWeightOptions } onChange={ (v)=>setAttributes({fontWeightLabel:v}) } />
					</PanelBody>
					<PanelBody title="QA テキストのフォント">
						<SelectControl label="フォント" value={ fontP } options={ fontOptions } onChange={ (v)=>setAttributes({fontP:v}) } />
						<SelectControl label="質問の太さ" value={ fontWeightDt } options={ fontWeightOptions } onChange={ (v)=>setAttributes({fontWeightDt:v}) } />
						<SelectControl label="回答の太さ" value={ fontWeightDd } options={ fontWeightOptions } onChange={ (v)=>setAttributes({fontWeightDd:v}) } />
					</PanelBody>
				</InspectorControls>

				{/* 本体 */}
				<div className="lw-qa-1" id={ blockId }>
					{ contents.map( (c,i)=>(				/* -- QA リスト -- */
						<dl className="lw-qa-1__dl active" key={ i }>
							<dt>
								<div className="label" data-lw_font_set={ FontLabel } style={ { fontWeight:fontWeightLabel } }>
									Q<div style={ { background:mainColor } }></div>
								</div>
								<div className="lw-qa-1__text_q">
									<RichText tagName="p" value={ c.text_q } data-lw_font_set={ fontP } onChange={ v=>updateContent(i,'text_q',v) } style={ { fontWeight:fontWeightDt } } />
								</div>
								<div className="open_icon" style={ { background:mainColor } }></div>
							</dt>
							<dd>
								<div className="label" data-lw_font_set={ FontLabel } style={ { fontWeight:fontWeightLabel, color:mainColor } }>
									A<div style={ { background:mainColor } }></div>
								</div>
								<div className="lw-qa-1__text_a">
									<RichText tagName="p" value={ c.text_a } data-lw_font_set={ fontP } onChange={ v=>updateContent(i,'text_a',v) } style={ { fontWeight:fontWeightDd } } />
								</div>
							</dd>
							<button className="lw-qa-1__remove_btn" onClick={ ()=>removeContent(i) }>削除</button>
						</dl>
					) ) }
					<button className="lw-qa-1__add_btn" onClick={ addContent }>リストを追加する</button>
				</div>
			</Fragment>
		);
	},

	/* -------- Save -------- */
	save( { attributes } ) {
		const {
			blockId, FontLabel, mainColor,
			fontWeightLabel, fontP, fontWeightDt, fontWeightDd, contents
		} = attributes;

		/* --- インライン JS (ID 非依存版) ------------------ */
		const qaScript = `
(function(){
	const scriptEl  = document.currentScript;
	if ( !scriptEl ) return;
	const container = scriptEl.parentNode;           // <script> の親 = lw-qa-1 本体
	if ( !container || !container.classList.contains('lw-qa-1') ) return;

	/* クリックイベントをバインド ---------------------- */
	function bind () {
		container.querySelectorAll(".lw-qa-1__dl").forEach( function( dl ){
			if ( dl.dataset.lwQaBound ) return;      // 二重バインド防止
			dl.dataset.lwQaBound = "1";
			dl.addEventListener("click", function(){ dl.classList.toggle("active"); } );
		} );
	}

	bind(); // まず 1 回

	/* MutationObserver – QA が動的に増減しても OK */
	const mo = new MutationObserver(bind);
	mo.observe(container,{ childList:true, subtree:true });
})();
		`;

		/* --- JSX 出力 ------------------------------------ */
		return (
			<div className="lw-qa-1" id={ blockId }>
				{ contents.map( (c,i)=>(				/* -- QA リスト -- */
					<dl className="lw-qa-1__dl" key={ i }>
						<dt>
							<div className="label" data-lw_font_set={ FontLabel } style={ { fontWeight:fontWeightLabel } }>
								Q<div style={ { background:mainColor } }></div>
							</div>
							<div className="lw-qa-1__text_q">
								<RichText.Content tagName="p" value={ c.text_q } data-lw_font_set={ fontP } style={ { fontWeight:fontWeightDt } } />
							</div>
							<div className="open_icon" style={ { background:mainColor } }></div>
						</dt>
						<dd>
							<div className="label" data-lw_font_set={ FontLabel } style={ { fontWeight:fontWeightLabel, color:mainColor } }>
								A<div style={ { background:mainColor } }></div>
							</div>
							<div className="lw-qa-1__text_a">
								<RichText.Content tagName="p" value={ c.text_a } data-lw_font_set={ fontP } style={ { fontWeight:fontWeightDd } } />
							</div>
						</dd>
					</dl>
				) ) }

				{/* インラインスクリプト（ID 非依存） */}
				<script dangerouslySetInnerHTML={ { __html:qaScript } } />
			</div>
		);
	}
} );
