/* ------------------------------------------------------------
 * LiteWord – RichText Format: Font & Decoration Combo (改善版)
 * ─ フォント種 / サイズ(PC／SP) / 太さ / 行間(PC／SP) / 字間(PC／SP) / 余白上下左右 / 下線
 * ─ 縁取り(PC)・縁取り(SP)・縁取り色
 * ─ 位置そろえ(PC／SP)
 * ─ <span data-lw_font_set="◯◯" class="custom-font-settings …">…</span>
 * ---------------------------------------------------------- */

const { registerFormatType } = wp.richText;
const { Fragment, useState } = wp.element;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton, Popover, SelectControl, Button, TabPanel } = wp.components;

/* ===== オプション配列（既存のものを維持） ============================================= */
/* 1) フォントウェイト ------------------------------------------------ */
const fontWeightOptions = [
	{ label:'未選択', value:'' },
	{ label:'Thin (100)', value:'fw-100' },
	{ label:'Extra Light (200)', value:'fw-200' },
	{ label:'Light (300)', value:'fw-300' },
	{ label:'Normal (400)', value:'fw-400' },
	{ label:'Medium (500)', value:'fw-500' },
	{ label:'Semi Bold (600)', value:'fw-600' },
	{ label:'Bold (700)', value:'fw-700' },
	{ label:'Extra Bold (800)', value:'fw-800' },
	{ label:'Black (900)', value:'fw-900' },
];

/* 2) フォントサイズ -------------------------------------------------- */
const fontSizeOptions = [
	{ label:'未選択', value:'' },
	{ label:'0.1倍', value:'fs-0-1' }, { label:'0.2倍', value:'fs-0-2' },
	{ label:'0.3倍', value:'fs-0-3' }, { label:'0.4倍', value:'fs-0-4' },
	{ label:'0.5倍', value:'fs-0-5' }, { label:'0.6倍', value:'fs-0-6' },
	{ label:'0.7倍', value:'fs-0-7' }, { label:'0.8倍', value:'fs-0-8' },
	{ label:'0.9倍', value:'fs-0-9' }, { label:'1倍',   value:'fs-1'   },
	{ label:'1.1倍', value:'fs-1-1' }, { label:'1.2倍', value:'fs-1-2' },
	{ label:'1.3倍', value:'fs-1-3' }, { label:'1.4倍', value:'fs-1-4' },
	{ label:'1.5倍', value:'fs-1-5' }, { label:'1.6倍', value:'fs-1-6' },
	{ label:'1.7倍', value:'fs-1-7' }, { label:'1.8倍', value:'fs-1-8' },
	{ label:'1.9倍', value:'fs-1-9' }, { label:'2倍',   value:'fs-2'   },
	{ label:'2.1倍', value:'fs-2-1' }, { label:'2.2倍', value:'fs-2-2' },
	{ label:'2.3倍', value:'fs-2-3' }, { label:'2.4倍', value:'fs-2-4' },
	{ label:'2.5倍', value:'fs-2-5' }, { label:'2.6倍', value:'fs-2-6' },
	{ label:'2.7倍', value:'fs-2-7' }, { label:'2.8倍', value:'fs-2-8' },
	{ label:'2.9倍', value:'fs-2-9' }, { label:'3倍',   value:'fs-3'   },
	{ label:'3.1倍', value:'fs-3-1' }, { label:'3.2倍', value:'fs-3-2' },
	{ label:'3.3倍', value:'fs-3-3' }, { label:'3.4倍', value:'fs-3-4' },
	{ label:'3.5倍', value:'fs-3-5' }, { label:'3.6倍', value:'fs-3-6' },
	{ label:'3.7倍', value:'fs-3-7' }, { label:'3.8倍', value:'fs-3-8' },
	{ label:'3.9倍', value:'fs-3-9' }, { label:'4倍',   value:'fs-4'   },
];

/* 2) フォントサイズ sp -------------------------------------------------- */
const fontSizeOptionsSp = [
	{ label:'未選択', value:'' },
	{ label:'0.1倍', value:'fs-sp-0-1' }, { label:'0.2倍', value:'fs-sp-0-2' },
	{ label:'0.3倍', value:'fs-sp-0-3' }, { label:'0.4倍', value:'fs-sp-0-4' },
	{ label:'0.5倍', value:'fs-sp-0-5' }, { label:'0.6倍', value:'fs-sp-0-6' },
	{ label:'0.7倍', value:'fs-sp-0-7' }, { label:'0.8倍', value:'fs-sp-0-8' },
	{ label:'0.9倍', value:'fs-sp-0-9' }, { label:'1倍',   value:'fs-sp-1'   },
	{ label:'1.1倍', value:'fs-sp-1-1' }, { label:'1.2倍', value:'fs-sp-1-2' },
	{ label:'1.3倍', value:'fs-sp-1-3' }, { label:'1.4倍', value:'fs-sp-1-4' },
	{ label:'1.5倍', value:'fs-sp-1-5' }, { label:'1.6倍', value:'fs-sp-1-6' },
	{ label:'1.7倍', value:'fs-sp-1-7' }, { label:'1.8倍', value:'fs-sp-1-8' },
	{ label:'1.9倍', value:'fs-sp-1-9' }, { label:'2倍',   value:'fs-sp-2'   },
	{ label:'2.1倍', value:'fs-sp-2-1' }, { label:'2.2倍', value:'fs-sp-2-2' },
	{ label:'2.3倍', value:'fs-sp-2-3' }, { label:'2.4倍', value:'fs-sp-2-4' },
	{ label:'2.5倍', value:'fs-sp-2-5' }, { label:'2.6倍', value:'fs-sp-2-6' },
	{ label:'2.7倍', value:'fs-sp-2-7' }, { label:'2.8倍', value:'fs-sp-2-8' },
	{ label:'2.9倍', value:'fs-sp-2-9' }, { label:'3倍',   value:'fs-sp-3'   },
	{ label:'3.1倍', value:'fs-sp-3-1' }, { label:'3.2倍', value:'fs-sp-3-2' },
	{ label:'3.3倍', value:'fs-sp-3-3' }, { label:'3.4倍', value:'fs-sp-3-4' },
	{ label:'3.5倍', value:'fs-sp-3-5' }, { label:'3.6倍', value:'fs-sp-3-6' },
	{ label:'3.7倍', value:'fs-sp-3-7' }, { label:'3.8倍', value:'fs-sp-3-8' },
	{ label:'3.9倍', value:'fs-sp-3-9' }, { label:'4倍',   value:'fs-sp-4'   },
];

/* 3) テキストの位置調整 PC ------------------------------------------------- */
const centerOptions = [
	{ label:'未選択', value:'' },
	{ label:'中央寄せ', value:'text-center' },
	{ label:'左寄せ',   value:'text-left'   },
	{ label:'右寄せ',   value:'text-right'  },
	{ label:'両端揃え', value:'text-justify' },
];
/* 3) テキストの位置調整 SP ------------------------------------------------- */
const centerOptionsSp = [
	{ label:'未選択', value:'' },
	{ label:'中央寄せ', value:'text-center-sp' },
	{ label:'左寄せ',   value:'text-left-sp'   },
	{ label:'右寄せ',   value:'text-right-sp'  },
	{ label:'両端揃え', value:'text-justify-sp' },
];

/* 4) 行間 ----------------------------------------------------------- */
const lineHeightOptions = [
	{ label:'未選択', value:'' },
	{ label:'0.8', value:'lh-0-8' }, { label:'0.9', value:'lh-0-9' },
	{ label:'1',   value:'lh-1'   }, { label:'1.1', value:'lh-1-1' },
	{ label:'1.2', value:'lh-1-2' }, { label:'1.3', value:'lh-1-3' },
	{ label:'1.4', value:'lh-1-4' }, { label:'1.5', value:'lh-1-5' },
	{ label:'1.6', value:'lh-1-6' }, { label:'1.7', value:'lh-1-7' },
	{ label:'1.8', value:'lh-1-8' }, { label:'1.9', value:'lh-1-9' },
	{ label:'2',   value:'lh-2'   }, { label:'2.1', value:'lh-2-1' },
	{ label:'2.2', value:'lh-2-2' }, { label:'2.3', value:'lh-2-3' },
	{ label:'2.4', value:'lh-2-4' }, { label:'2.5', value:'lh-2-5' },
	{ label:'2.6', value:'lh-2-6' }, { label:'2.7', value:'lh-2-7' },
	{ label:'2.8', value:'lh-2-8' }, { label:'2.9', value:'lh-2-9' },
	{ label:'3',   value:'lh-3'   },
];

/* 4) 行間 sp ----------------------------------------------------------- */
const lineHeightOptionsSp = [
	{ label:'未選択', value:'' },
	{ label:'0.8', value:'lh-sp-0-8' }, { label:'0.9', value:'lh-sp-0-9' },
	{ label:'1',   value:'lh-sp-1'   }, { label:'1.1', value:'lh-sp-1-1' },
	{ label:'1.2', value:'lh-sp-1-2' }, { label:'1.3', value:'lh-sp-1-3' },
	{ label:'1.4', value:'lh-sp-1-4' }, { label:'1.5', value:'lh-sp-1-5' },
	{ label:'1.6', value:'lh-sp-1-6' }, { label:'1.7', value:'lh-sp-1-7' },
	{ label:'1.8', value:'lh-sp-1-8' }, { label:'1.9', value:'lh-sp-1-9' },
	{ label:'2',   value:'lh-sp-2'   }, { label:'2.1', value:'lh-sp-2-1' },
	{ label:'2.2', value:'lh-sp-2-2' }, { label:'2.3', value:'lh-sp-2-3' },
	{ label:'2.4', value:'lh-sp-2-4' }, { label:'2.5', value:'lh-sp-2-5' },
	{ label:'2.6', value:'lh-sp-2-6' }, { label:'2.7', value:'lh-sp-2-7' },
	{ label:'2.8', value:'lh-sp-2-8' }, { label:'2.9', value:'lh-sp-2-9' },
	{ label:'3',   value:'lh-sp-3'   },
];

/* 5) 文字間 --------------------------------------------------------- */
const letterSpacingOptions = [
	{ label:'未選択', value:'' },
	{ label:'0',    value:'ls-0' },
	{ label:'0.05', value:'ls-0-05' },
	{ label:'0.06', value:'ls-0-06' },
	{ label:'0.07', value:'ls-0-07' },
	{ label:'0.08', value:'ls-0-08' },
	{ label:'0.09', value:'ls-0-09' },
	{ label:'0.1',  value:'ls-0-1'  },
	{ label:'0.2',  value:'ls-0-2'  },
	{ label:'0.3',  value:'ls-0-3'  },
];

/* 5) 文字間 sp --------------------------------------------------------- */
const letterSpacingOptionsSp = [
	{ label:'未選択', value:'' },
	{ label:'0',    value:'ls-sp-0' },
	{ label:'0.05', value:'ls-sp-0-05' },
	{ label:'0.06', value:'ls-sp-0-06' },
	{ label:'0.07', value:'ls-sp-0-07' },
	{ label:'0.08', value:'ls-sp-0-08' },
	{ label:'0.09', value:'ls-sp-0-09' },
	{ label:'0.1',  value:'ls-sp-0-1'  },
	{ label:'0.2',  value:'ls-sp-0-2'  },
	{ label:'0.3',  value:'ls-sp-0-3'  },
];

/* 5-a) 余白（上） ---------------------------------------------------- */
const marginTopOptions = [
	{ label:'未選択', value:'' },
	{ label:'-0.5em', value:'mt--0-5' }, { label:'-0.4em', value:'mt--0-4' },
	{ label:'-0.3em', value:'mt--0-3' }, { label:'-0.2em', value:'mt--0-2' },
	{ label:'-0.1em', value:'mt--0-1' }, { label:'0',      value:'mt-0'    },
	{ label:'0.1em',  value:'mt-0-1' },  { label:'0.2em',  value:'mt-0-2'  },
	{ label:'0.3em',  value:'mt-0-3' },  { label:'0.4em',  value:'mt-0-4'  },
	{ label:'0.5em',  value:'mt-0-5' },  { label:'0.6em',  value:'mt-0-6'  },
	{ label:'0.7em',  value:'mt-0-7' },  { label:'0.8em',  value:'mt-0-8'  },
	{ label:'0.9em',  value:'mt-0-9' },  { label:'1em',    value:'mt-1'    },
	{ label:'1.1em',  value:'mt-1-1' },  { label:'1.2em',  value:'mt-1-2'  },
	{ label:'1.3em',  value:'mt-1-3' },  { label:'1.4em',  value:'mt-1-4'  },
	{ label:'1.5em',  value:'mt-1-5' },  { label:'1.6em',  value:'mt-1-6'  },
	{ label:'1.7em',  value:'mt-1-7' },  { label:'1.8em',  value:'mt-1-8'  },
	{ label:'1.9em',  value:'mt-1-9' },  { label:'2em',    value:'mt-2'    },
];

/* 5-b) 余白（下） ---------------------------------------------------- */
const marginBottomOptions = [
	{ label:'未選択', value:'' },
	{ label:'-0.5em', value:'mb--0-5' }, { label:'-0.4em', value:'mb--0-4' },
	{ label:'-0.3em', value:'mb--0-3' }, { label:'-0.2em', value:'mb--0-2' },
	{ label:'-0.1em', value:'mb--0-1' }, { label:'0',      value:'mb-0'    },
	{ label:'0.1em',  value:'mb-0-1' },  { label:'0.2em',  value:'mb-0-2'  },
	{ label:'0.3em',  value:'mb-0-3' },  { label:'0.4em',  value:'mb-0-4'  },
	{ label:'0.5em',  value:'mb-0-5' },  { label:'0.6em',  value:'mb-0-6'  },
	{ label:'0.7em',  value:'mb-0-7' },  { label:'0.8em',  value:'mb-0-8'  },
	{ label:'0.9em',  value:'mb-0-9' },  { label:'1em',    value:'mb-1'    },
	{ label:'1.1em',  value:'mb-1-1' },  { label:'1.2em',  value:'mb-1-2'  },
	{ label:'1.3em',  value:'mb-1-3' },  { label:'1.4em',  value:'mb-1-4'  },
	{ label:'1.5em',  value:'mb-1-5' },  { label:'1.6em',  value:'mb-1-6'  },
	{ label:'1.7em',  value:'mb-1-7' },  { label:'1.8em',  value:'mb-1-8'  },
	{ label:'1.9em',  value:'mb-1-9' },  { label:'2em',    value:'mb-2'    },
];

/* 5-c) 余白（左） ---------------------------------------------------- */
const marginLeftOptions = [
	{ label:'未選択', value:'' },
	{ label:'-0.6em', value:'ml--0-6' }, { label:'-0.5em', value:'ml--0-5' },
	{ label:'-0.4em', value:'ml--0-4' }, { label:'-0.3em', value:'ml--0-3' },
	{ label:'-0.2em', value:'ml--0-2' }, { label:'-0.1em', value:'ml--0-1' },
	{ label:'0',      value:'ml-0' },
	{ label:'0.1em',  value:'ml-0-1' },  { label:'0.2em',  value:'ml-0-2' },
	{ label:'0.3em',  value:'ml-0-3' },  { label:'0.4em',  value:'ml-0-4' },
	{ label:'0.5em',  value:'ml-0-5' },  { label:'0.6em',  value:'ml-0-6' },
	{ label:'0.7em',  value:'ml-0-7' },  { label:'0.8em',  value:'ml-0-8' },
	{ label:'0.9em',  value:'ml-0-9' },  { label:'1em',    value:'ml-1'   },
];

/* 5-d) 余白（右） ---------------------------------------------------- */
const marginRightOptions = [
	{ label:'未選択', value:'' },
	{ label:'-0.6em', value:'mr--0-6' }, { label:'-0.5em', value:'mr--0-5' },
	{ label:'-0.4em', value:'mr--0-4' }, { label:'-0.3em', value:'mr--0-3' },
	{ label:'-0.2em', value:'mr--0-2' }, { label:'-0.1em', value:'mr--0-1' },
	{ label:'0',      value:'mr-0' },
	{ label:'0.1em',  value:'mr-0-1' },  { label:'0.2em',  value:'mr-0-2' },
	{ label:'0.3em',  value:'mr-0-3' },  { label:'0.4em',  value:'mr-0-4' },
	{ label:'0.5em',  value:'mr-0-5' },  { label:'0.6em',  value:'mr-0-6' },
	{ label:'0.7em',  value:'mr-0-7' },  { label:'0.8em',  value:'mr-0-8' },
	{ label:'0.9em',  value:'mr-0-9' },  { label:'1em',    value:'mr-1'   },
];

/* 6) フォントファミリー --------------------------------------------- */
// PHPから渡されたフォントファミリーオプションを使用
const fontFamilyOptions = (window.lwFontSettings && window.lwFontSettings.fontFamilyOptions) 
    ? window.lwFontSettings.fontFamilyOptions 
    : [
        { label:'未選択', value:'' },
        { label:'明朝体（システムフォント）', value:'mincho' },
        { label:'ゴシック（システムフォント）', value:'gothic' },
    ];

/* 7) 下線スタイル ---------------------------------------------------- */
const underlineOptions = [
	{ label:'未選択', value:'' },
	{ label:'下線 1 / Red', value:'u-line-1-red' },
	{ label:'下線 1 / pink', value:'u-line-1-pink' },
	{ label:'下線 1 / pink 2', value:'u-line-1-pink-2' },
	{ label:'下線 1 / Blue', value:'u-line-1-blue' },
	{ label:'下線 1 / Green', value:'u-line-1-green' },
	{ label:'下線 1 / Yellow', value:'u-line-1-yellow' },
	{ label:'下線 1 / Orange', value:'u-line-1-orange' },
	{ label:'下線 1 / Main', value:'u-line-1-main' },
	{ label:'下線 1 / Accent', value:'u-line-1-accent' },
	{ label:'下線 1 / color_1', value:'u-line-1-color_1' },
	{ label:'下線 1 / color_2', value:'u-line-1-color_2' },
	{ label:'下線 1 / color_3', value:'u-line-1-color_3' },
	{ label:'下線 2 / Red', value:'u-line-2-red' },
	{ label:'下線 2 / pink', value:'u-line-2-pink' },
	{ label:'下線 2 / pink 2', value:'u-line-2-pink-2' },
	{ label:'下線 2 / Blue', value:'u-line-2-blue' },
	{ label:'下線 2 / Green', value:'u-line-2-green' },
	{ label:'下線 2 / Yellow', value:'u-line-2-yellow' },
	{ label:'下線 2 / Orange', value:'u-line-2-orange' },
	{ label:'下線 2 / Main', value:'u-line-2-main' },
	{ label:'下線 2 / Accent', value:'u-line-2-accent' },
	{ label:'下線 2 / color_1', value:'u-line-2-color_1' },
	{ label:'下線 2 / color_2', value:'u-line-2-color_2' },
	{ label:'下線 2 / color_3', value:'u-line-2-color_3' },
	{ label:'背景 3 / Red', value:'u-line-3-red' },
	{ label:'背景 3 / pink', value:'u-line-3-pink' },
	{ label:'背景 3 / pink 2', value:'u-line-3-pink-2' },
	{ label:'背景 3 / Blue', value:'u-line-3-blue' },
	{ label:'背景 3 / Green', value:'u-line-3-green' },
	{ label:'背景 3 / Yellow', value:'u-line-3-yellow' },
	{ label:'背景 3 / Orange', value:'u-line-3-orange' },
	{ label:'背景 3 / Main', value:'u-line-3-main' },
	{ label:'背景 3 / Accent', value:'u-line-3-accent' },
	{ label:'背景 3 / color_1', value:'u-line-3-color_1' },
	{ label:'背景 3 / color_2', value:'u-line-3-color_2' },
	{ label:'背景 3 / color_3', value:'u-line-3-color_3' },
];

/* 8-a) 縁取り PC ----------------------------------------------------- */
const outlineOptionsPc = [
	{ label:'未選択', value:'' },
	{ label:'1px', value:'lw-outline-1' },
	{ label:'2px', value:'lw-outline-2' },
	{ label:'3px', value:'lw-outline-3' },
	{ label:'4px', value:'lw-outline-4' },
	{ label:'5px', value:'lw-outline-5' },
	{ label:'6px', value:'lw-outline-6' },
	{ label:'7px', value:'lw-outline-7' },
	{ label:'8px', value:'lw-outline-8' },
	{ label:'9px', value:'lw-outline-9' },
	{ label:'10px', value:'lw-outline-10' },
];

/* 8-b) 縁取り SP ----------------------------------------------------- */
const outlineOptionsSp = [
	{ label:'未選択', value:'' },
	{ label:'1px', value:'lw-outline-1-sp' },
	{ label:'2px', value:'lw-outline-2-sp' },
	{ label:'3px', value:'lw-outline-3-sp' },
	{ label:'4px', value:'lw-outline-4-sp' },
	{ label:'5px', value:'lw-outline-5-sp' },
	{ label:'6px', value:'lw-outline-6-sp' },
	{ label:'7px', value:'lw-outline-7-sp' },
	{ label:'8px', value:'lw-outline-8-sp' },
	{ label:'9px', value:'lw-outline-9-sp' },
	{ label:'10px', value:'lw-outline-10-sp' },
];

/* 8-c) 縁取り色 ------------------------------------------------------ */
const outlineOptionsColor = [
	{ label:'未選択', value:'' },
	{ label:'White', value:'lw-outline-color-white' },
	{ label:'Red', value:'lw-outline-color-red' },
	{ label:'Main', value:'lw-outline-color-main' },
	{ label:'Accent', value:'lw-outline-color-accent' },
	{ label:'color_1', value:'lw-outline-color-color_1' },
	{ label:'color_2', value:'lw-outline-color-color_2' },
	{ label:'color_3', value:'lw-outline-color-color_3' },
];

/* ===== カスタムコンポーネント ============================================ */

// セクションヘッダーコンポーネント
const SectionHeader = ({ title, icon }) => (
	<div className="lw-font-section-header">
		{icon && <span className="dashicons dashicons-{icon}"></span>}
		<span>{title}</span>
	</div>
);

// カスタムセレクトコンポーネント（コンパクト版）
const CompactSelect = ({ label, value, options, onChange }) => (
	<div className="lw-font-control-compact">
		<label>{label}</label>
		<SelectControl
			value={value}
			options={options}
			onChange={onChange}
		/>
	</div>
);

// グリッドレイアウトコンポーネント
const ControlGrid = ({ children }) => (
	<div className="lw-font-control-grid">
		{children}
	</div>
);

/* ===== フォーマット登録 ============================================ */
registerFormatType( 'custom/font-combo', {
	title    : 'フォント設定',
	tagName  : 'span',
	className: 'custom-font-settings',
	attributes: {
		class             : 'class',
		'data-lw_font_set': 'data-lw_font_set',
	},

	edit( { value, onChange } ) {
		const [isOpen, setIsOpen] = useState(false);

		/* --- 現行クラス取得 ------------------------------------ */
		const fmt         = wp.richText.getActiveFormat( value, 'custom/font-combo' );
		const currentFont = fmt ? fmt.attributes['data-lw_font_set'] : '';
		const classes     = fmt ? fmt.attributes.class || '' : '';

		const findClass = (prefix, cond = () => true) =>
			classes.split(' ').find(c => c.startsWith(prefix) && cond(c)) || '';

		/* センタリング取得用ユーティリティ */
		const getClassFromList = list =>
			classes.split(' ').find(c => list.includes(c)) || '';

		const curSize      = findClass('fs-', c => !c.startsWith('fs-sp-'));
		const curSizeSp    = findClass('fs-sp-');
		const curWeight    = findClass('fw-');
		const curLine      = findClass('lh-', c => !c.startsWith('lh-sp-'));
		const curLineSp    = findClass('lh-sp-');
		const curLetter    = findClass('ls-', c => !c.startsWith('ls-sp-'));
		const curLetterSp  = findClass('ls-sp-');
		const curMt        = findClass('mt-');
		const curMb        = findClass('mb-');
		const curMl        = findClass('ml-');
		const curMr        = findClass('mr-');
		const curUnderline = findClass('u-line-');
		const curOutPc     = findClass('lw-outline-', c => !c.includes('-sp') && !c.includes('-color-'));
		const curOutSp     = findClass('lw-outline-', c =>  c.includes('-sp'));
		const curOutCol    = findClass('lw-outline-color-');
		const curCenterPc  = getClassFromList(['text-center','text-left','text-right','text-justify']);
		const curCenterSp  = getClassFromList(['text-center-sp','text-left-sp','text-right-sp','text-justify-sp']);

		/* --- 更新ハンドラ -------------------------------------- */
		const apply = (
			fFamily   = currentFont,
			fSize     = curSize,
			fSizeSp   = curSizeSp,
			fWeight   = curWeight,
			lHeight   = curLine,
			lHeightSp = curLineSp,
			lSpace    = curLetter,
			lSpaceSp  = curLetterSp,
			mTop      = curMt,
			mBottom   = curMb,
			mLeft     = curMl,
			mRight    = curMr,
			uLine     = curUnderline,
			oPc       = curOutPc,
			oSp       = curOutSp,
			oColor    = curOutCol,
			cPc       = curCenterPc,
			cSp       = curCenterSp,
		) => {
			let nv = wp.richText.removeFormat( value, 'custom/font-combo' );

			/* 残すクラス判定 ----------------------------------- */
			const alignmentClasses = [
				'text-center','text-left','text-right','text-justify',
				'text-center-sp','text-left-sp','text-right-sp','text-justify-sp'
			];

			const keep = classes.split(' ')
				.filter(Boolean)
				.filter(c =>
					!c.startsWith('fs-')   &&
					!c.startsWith('fw-')   &&
					!c.startsWith('lh-')   &&
					!c.startsWith('ls-')   &&
					!c.startsWith('mt-')   &&
					!c.startsWith('mb-')   &&
					!c.startsWith('ml-')   &&
					!c.startsWith('mr-')   &&
					!c.startsWith('u-line-') &&
					!c.startsWith('lw-outline-') &&
					!c.startsWith('lw-outline-color-') &&
					!alignmentClasses.includes(c)
				);

			const set = new Set(['custom-font-settings', ...keep]);
			if (fSize)     set.add(fSize);
			if (fSizeSp)   set.add(fSizeSp);
			if (fWeight)   set.add(fWeight);
			if (lHeight)   set.add(lHeight);
			if (lHeightSp) set.add(lHeightSp);
			if (lSpace)    set.add(lSpace);
			if (lSpaceSp)  set.add(lSpaceSp);
			if (mTop)      set.add(mTop);
			if (mBottom)   set.add(mBottom);
			if (mLeft)     set.add(mLeft);
			if (mRight)    set.add(mRight);
			if (uLine)     set.add(uLine);
			if (oPc)       set.add(oPc);
			if (oSp)       set.add(oSp);
			if (oColor)    set.add(oColor);
			if (cPc)       set.add(cPc);
			if (cSp)       set.add(cSp);

			nv = wp.richText.applyFormat(nv, {
				type: 'custom/font-combo',
				attributes: {
					'data-lw_font_set': fFamily,
					class: Array.from(set).join(' '),
				},
			});

			onChange(nv);
		};

		/* --- リセット機能 -------------------------------------- */
		const resetAllSettings = () => {
			let nv = wp.richText.removeFormat( value, 'custom/font-combo' );
			onChange(nv);
		};

		/* --- UI ---------------------------------------------- */
		return (
			<Fragment>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="admin-customizer"
							label="Lw フォント設定"
							isPressed={isOpen}
							onClick={() => setIsOpen(!isOpen)}
						/>
					</ToolbarGroup>
				</BlockControls>

				{isOpen && (
					<Popover
						position="bottom center"
						onClose={() => setIsOpen(false)}
						className="lw-custom-font-settings-popover"
					>
						<div className="lw-font-settings-header">
							<h3>
								<span className="dashicons dashicons-edit"></span>
								フォント設定
							</h3>
							<Button
								className="lw-font-reset-button"
								onClick={resetAllSettings}
								isDestructive
								isSmall
							>
								すべてリセット
							</Button>
						</div>

						<TabPanel
							className="lw-font-settings-tabs"
							activeClass="is-active"
							tabs={[
								{
									name: 'basic',
									title: '基本設定',
									className: 'lw-tab-basic',
								},
								{
									name: 'spacing',
									title: '余白・配置',
									className: 'lw-tab-spacing',
								},
								{
									name: 'decoration',
									title: '装飾',
									className: 'lw-tab-decoration',
								},
							]}
						>
							{(tab) => {
								if (tab.name === 'basic') {
									return (
										<div className="lw-font-tab-content">
											{/* フォントファミリー */}
											<div className="lw-font-control-section">
												<SectionHeader title="フォントファミリー" />
												<SelectControl
													value={currentFont}
													options={fontFamilyOptions}
													onChange={v => apply(v)}
												/>
											</div>

											{/* フォントサイズ */}
											<div className="lw-font-control-section">
												<SectionHeader title="フォントサイズ" />
												<ControlGrid>
													<CompactSelect
														label="PC"
														value={curSize}
														options={fontSizeOptions}
														onChange={v => apply(undefined, v)}
													/>
													<CompactSelect
														label="スマホ"
														value={curSizeSp}
														options={fontSizeOptionsSp}
														onChange={v => apply(undefined, undefined, v)}
													/>
												</ControlGrid>
											</div>

											{/* フォントウェイト */}
											<div className="lw-font-control-section">
												<SectionHeader title="フォントの太さ" />
												<SelectControl
													value={curWeight}
													options={fontWeightOptions}
													onChange={v => apply(undefined, undefined, undefined, v)}
												/>
											</div>

											{/* 行間 */}
											<div className="lw-font-control-section">
												<SectionHeader title="行間" />
												<ControlGrid>
													<CompactSelect
														label="PC"
														value={curLine}
														options={lineHeightOptions}
														onChange={v => apply(undefined, undefined, undefined, undefined, v)}
													/>
													<CompactSelect
														label="スマホ"
														value={curLineSp}
														options={lineHeightOptionsSp}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, v)}
													/>
												</ControlGrid>
											</div>

											{/* 文字間 */}
											<div className="lw-font-control-section">
												<SectionHeader title="文字間" />
												<ControlGrid>
													<CompactSelect
														label="PC"
														value={curLetter}
														options={letterSpacingOptions}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
													<CompactSelect
														label="スマホ"
														value={curLetterSp}
														options={letterSpacingOptionsSp}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
												</ControlGrid>
											</div>
										</div>
									);
								} else if (tab.name === 'spacing') {
									return (
										<div className="lw-font-tab-content">
											{/* 余白設定 */}
											<div className="lw-font-control-section">
												<SectionHeader title="余白設定" />
												<div className="lw-font-margin-controls">
													<div className="lw-font-margin-row">
														<CompactSelect
															label="上"
															value={curMt}
															options={marginTopOptions}
															onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
														/>
													</div>
													<div className="lw-font-margin-row">
														<CompactSelect
															label="左"
															value={curMl}
															options={marginLeftOptions}
															onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
														/>
														<CompactSelect
															label="右"
															value={curMr}
															options={marginRightOptions}
															onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
														/>
													</div>
													<div className="lw-font-margin-row">
														<CompactSelect
															label="下"
															value={curMb}
															options={marginBottomOptions}
															onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
														/>
													</div>
												</div>
											</div>

											{/* テキスト配置 */}
											<div className="lw-font-control-section">
												<SectionHeader title="テキスト配置" />
												<ControlGrid>
													<CompactSelect
														label="PC"
														value={curCenterPc}
														options={centerOptions}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
													<CompactSelect
														label="スマホ"
														value={curCenterSp}
														options={centerOptionsSp}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
												</ControlGrid>
											</div>
										</div>
									);
								} else if (tab.name === 'decoration') {
									return (
										<div className="lw-font-tab-content">
											{/* 下線スタイル */}
											<div className="lw-font-control-section">
												<SectionHeader title="下線スタイル" />
												<SelectControl
													value={curUnderline}
													options={underlineOptions}
													onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
												/>
											</div>

											{/* 縁取り */}
											<div className="lw-font-control-section">
												<SectionHeader title="テキスト縁取り" />
												<ControlGrid>
													<CompactSelect
														label="PC"
														value={curOutPc}
														options={outlineOptionsPc}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
													<CompactSelect
														label="スマホ"
														value={curOutSp}
														options={outlineOptionsSp}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
												</ControlGrid>
												<div style={{ marginTop: '10px' }}>
													<SelectControl
														label="縁取り色"
														value={curOutCol}
														options={outlineOptionsColor}
														onChange={v => apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v)}
													/>
												</div>
											</div>
										</div>
									);
								}
							}}
						</TabPanel>

						<div className="lw-font-settings-footer">
							<Button
								className="lw-font-close-button"
								onClick={() => setIsOpen(false)}
								isPrimary
							>
								閉じる
							</Button>
						</div>
					</Popover>
				)}
			</Fragment>
		);
	},
});