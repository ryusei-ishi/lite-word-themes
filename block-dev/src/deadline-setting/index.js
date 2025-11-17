/**
 * deadline-set.jsx  –  期限日時設定フォーマット
 * ------------------------------------------------------------
 *   ・ツールバーボタンを押すとポップオーバーを表示
 *   ・選択したパターンに応じて下記クラス付き <span> を挿入
 *       - lw_deadline_setting set_1
 *       - lw_deadline_setting set_2
 *       - lw_deadline_setting set_3
 *       - lw_deadline_setting set_4
 *       - lw_deadline_setting set_5
 *   ・ポップオーバー : .lw-deadline-popover
 *   ・SelectControl  : .lw-deadline-select
 * ------------------------------------------------------------
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

/* ---------- 期限パターン定義 ---------- */
const DEADLINE_OPTIONS = [
	{ label: '選択してください',      value: ''        },
	{ label: '期限日時パターン 1',   value: 'set_1'  },
	{ label: '期限日時パターン 2',   value: 'set_2'  },
	{ label: '期限日時パターン 3',   value: 'set_3'  },
	{ label: '期限日時パターン 4',   value: 'set_4'  },
	{ label: '期限日時パターン 5',   value: 'set_5'  },
];

/* ---------- 編集 UI ---------- */
const Edit = ( { value, onChange } ) => {
	const [ open, setOpen ] = useState( false );

	const insertDeadline = cls => {
		if ( ! cls ) return;
		const frag = create( {
			html: `<span class="lw_deadline_setting ${ cls }"></span>`,
		} );
		onChange( insert( value, frag ) );
		setOpen( false );
	};

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="clock"          /* ダッシュアイコン 'clock' を使用 */
						label="期限日時設定"
						onClick={ () => setOpen( ! open ) }
						isPressed={ open }
					/>
				</ToolbarGroup>
			</BlockControls>

			{ open && (
				<Popover
					position="bottom center"
					onClose={ () => setOpen( false ) }
					className="lw-deadline-popover"
				>
					<SelectControl
						label="パターンを選択"
						value=""
						options={ DEADLINE_OPTIONS }
						onChange={ insertDeadline }
						className="lw-deadline-select"
					/>
				</Popover>
			) }
		</Fragment>
	);
};

/* ---------- フォーマット登録 ---------- */
registerFormatType( 'liteword/deadline-set', {
	title    : '期限日時設定',
	tagName  : 'span',
	className: 'lw_deadline_setting',
	edit     : Edit,
} );
