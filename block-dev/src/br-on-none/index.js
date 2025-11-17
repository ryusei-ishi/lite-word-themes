/**
 * responsive-br.jsx  –  SelectControl に専用クラスを追加
 * 追加クラス
 *   · Popover   : lw-responsive-br-popover
 *   · SelectBox : lw-responsive-br-select
 */
import {
	registerFormatType,
	insert,
	create,
} from '@wordpress/rich-text';
import { BlockControls } from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	SelectControl,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

/* ---------- ブレークポイント定義 ---------- */
const BREAKPOINT_ON   = [1050,1000,950,900,850,800,750,700,650,600,550,500,450,400,370,350];
const BREAKPOINT_NONE = [1200,1150,1100,1050,1000,950,900,850,800,750,700,650,600,550,500,450,400,350];

const BREAK_OPTIONS = [
	{ label:'選択してください', value:'' },
	...BREAKPOINT_ON  .map(bp=>({ label:`${bp}px以下で改行 ON`,  value:`on_${bp}px`})),
	...BREAKPOINT_NONE.map(bp=>({ label:`${bp}px以下で改行 OFF`, value:`none_${bp}px`})),
];

/* ---------- 編集 UI ---------- */
const Edit = ( { value, onChange } ) => {
	const [open,setOpen] = useState(false);

	const insertBreak = cls => {
		if(!cls) return;
		const frag = create({ html:`<span class="lw-br ${cls}"></span>` });
		onChange( insert(value, frag) );
		setOpen(false);
	};

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="editor-insertmore"
						label="レスポンシブ改行"
						onClick={()=>setOpen(!open)}
						isPressed={open}
					/>
				</ToolbarGroup>
			</BlockControls>

			{open && (
				<Popover
					position="bottom center"
					onClose={()=>setOpen(false)}
					className="lw-responsive-br-popover"
				>
					<SelectControl
						label="改行動作を選択"
						value=""
						options={BREAK_OPTIONS}
						onChange={insertBreak}
						className="lw-responsive-br-select"
					/>
				</Popover>
			)}
		</Fragment>
	);
};

/* ---------- フォーマット登録 ---------- */
registerFormatType('liteword/responsive-br',{
	title    :'レスポンシブ改行',
	tagName  :'span',
	className:'lw-br',
	edit     : Edit,
});
