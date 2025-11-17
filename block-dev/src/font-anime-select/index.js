/**
 * LiteWord – インラインアニメーション設定（RichText Format）
 * 完全版 2025-06-01
 * ------------------------------------------------------------
 *  • ツールバー第1階層（priority: 9）に固定
 *  • 発動条件／種類／時間／距離／遅延をポップオーバーで設定
 *  • useState + useEffect で UI 値を保持（選択直後に戻らない）
 *  • 「リセット」ボタンでアニメ関連クラスをすべて削除
 *    └ wp.components.Button を直接参照し WP バージョン差を解消
 * ----------------------------------------------------------- */

import {
	/* Rich-Text API */
	registerFormatType,
	getActiveFormat,
	removeFormat,
	applyFormat,
}                                 from '@wordpress/rich-text';
import {
	/* ツールバー ボタン */
	RichTextToolbarButton,
}                                 from '@wordpress/block-editor';
import {
	Popover,
	SelectControl,
	Flex,              // レイアウト用
}                                 from '@wordpress/components';
import {
	Fragment,
	useState,
	useEffect,
}                                 from '@wordpress/element';

/* ※ Button は ESM で import せずに wp.components から取得 */
const { Button } = wp.components;

/* ───────────────────────── 1. 選択肢 ───────────────────────── */
const triggerOptions = [
	{ label: 'アニメーション無効', value: '' },
	{ label: 'スクロール時',       value: 'lw_anime lw_inline_block lw_scroll'  },
	{ label: '初回表示時',         value: 'lw_anime lw_inline_block lw_loading' },
];

const animationOptions = [
	{ label: 'なし',         value: '' },
	{ label: '下から現れる', value: 'lw-fade-up'    },
	{ label: '右から現れる', value: 'lw-fade-right' },
	{ label: '左から現れる', value: 'lw-fade-left'  },
	{ label: '上から現れる', value: 'lw-fade-down'  },
];

/* 0.1 – 5.0 s（0.1 刻み） */
const buildDurationOptions = () => {
	const list = [{ label: 'なし', value: '' }];
	for (let i = 0.1; i <= 5.0001; i += 0.1) {
		const s = i.toFixed(1);                     // "0.1"–"5.0"
		list.push({ label: `${s}秒`, value: `dur-${s.replace('.', '-') }s` });
	}
	return list;
};

/* threshold / distance 用 10 – 200 px（10 px 刻み） */
const buildStepOptions = (prefix, step, max, defLabel) => {
	const list = [{ label: defLabel, value: '' }];
	for (let v = step; v <= max; v += step) {
		list.push({ label: `${v}px`, value: `${prefix}-${v}` });
	}
	return list;
};

const animationDurationOptions = buildDurationOptions();
const thresholdOptions        = buildStepOptions('threshold', 10, 200, 'デフォルト (80px)');
const delayOptions            = buildDurationOptions()
	.map(o => ({ ...o, value: o.value.replace('dur-', 'delay-') }));
const distanceOptions         = buildStepOptions('dist', 10, 200, 'デフォルト (40px)');

/* ─────────────────────── 2. フォーマット登録 ─────────────────────── */
registerFormatType('liteword/animation-combo', {
	/* 基本情報 */
	title    : 'アニメーション設定',
	icon     : 'format-image',
	tagName  : 'span',
	className: 'lw_inline_animation',  // 内部管理用
	priority : 9,                      // 第1階層
	__experimentalInsertAfter: 'core/link',
	attributes: { class: 'class' },

	/* 編集 UI */
	edit({ isActive, value, onChange }) {

		/* ポップオーバー開閉 */
		const [open, setOpen] = useState(false);

		/* 現クラス解析 */
		const active   = getActiveFormat(value, 'liteword/animation-combo');
		const cls      = active ? (active.attributes.class || '') : '';

		const parsedTrigger =
			cls.includes('lw_scroll')  ? 'lw_anime lw_inline_block lw_scroll'  :
			cls.includes('lw_loading') ? 'lw_anime lw_inline_block lw_loading' : '';

		const currentAnim     = (cls.match(/lw-fade-(up|right|left|down)/) || [''])[0];
		const currentDur      = (cls.match(/dur-\d-\d?s/)     || [''])[0];
		const currentThresh   = (cls.match(/threshold-\d+/)   || [''])[0];
		const currentDelay    = (cls.match(/delay-\d-\d?s/)   || [''])[0];
		const currentDistance = (cls.match(/dist-\d+/)        || [''])[0];

		/* 発動条件だけ UI state を持つ（戻り抑制） */
		const [uiTrigger, setUiTrigger] = useState(parsedTrigger);
		useEffect(() => { setUiTrigger(parsedTrigger); }, [cls]);

		/* ─── クラス適用 ─── */
		const apply = ({
			trigger  = parsedTrigger,
			anim     = currentAnim,
			dur      = currentDur,
			thresh   = currentThresh,
			delay    = currentDelay,
			distance = currentDistance,
		} = {}) => {

			/* 既存フォーマット削除 */
			let newVal = removeFormat(value, 'liteword/animation-combo');

			/* アニメ関連クラス排除 → ベースクラス生成 */
			const base = cls.split(' ')
				.filter(Boolean)
				.filter(c =>
					!c.startsWith('lw_anime') &&
					c !== 'lw_inline_block'   &&
					!c.startsWith('lw-fade-') &&
					!c.startsWith('dur-')     &&
					!c.startsWith('threshold-') &&
					!c.startsWith('delay-')   &&
					!c.startsWith('dist-')
				);

			const set = new Set(base);

			/* 無効でないときは新クラスを追加 */
			if (trigger)  trigger.split(' ').forEach(t => set.add(t));
			if (anim)     set.add(anim);
			if (dur)      set.add(dur);
			if (thresh)   set.add(thresh);
			if (delay)    set.add(delay);
			if (distance) set.add(distance);

			/* 管理用クラス（不要ならコメントアウト） */
			set.add('lw_inline_animation');

			/* フォーマット再適用 */
			newVal = applyFormat(newVal, {
				type      : 'liteword/animation-combo',
				attributes: { class: Array.from(set).join(' ') },
			});
			onChange(newVal);
		};

		/* ─── リセット ─── */
		const reset = () => {
			/* フォーマット自体を削除 → 全クラス除去 */
			const cleared = removeFormat(value, 'liteword/animation-combo');
			onChange(cleared);
			setUiTrigger('');
			setOpen(false);
		};

		/* ───────── JSX ───────── */
		return (
			<Fragment>
				<RichTextToolbarButton
					icon="format-image"
					title="アニメーション設定"
					isActive={isActive}
					onClick={() => setOpen(!open)}
				/>
{open && (
    <Popover
        onClose={() => setOpen(false)}
        placement="bottom"
        className="lw-animation-settings-popover"
    >
        <div className="lw-animation-panel">
            {/* 発動条件 */}
            <div className="lw-select-group">
                <SelectControl
                    label="発動条件"
                    value={uiTrigger}
                    options={triggerOptions}
                    onChange={(v) => {
                        setUiTrigger(v);
                        apply({ trigger: v });
                    }}
                    className="lw-select-control"
                />
            </div>
            
            {/* 種類 */}
            <div className="lw-select-group">
                <SelectControl
                    label="アニメーション種類"
                    value={currentAnim}
                    options={animationOptions}
                    onChange={(v) => apply({ anim: v })}
                    className="lw-select-control"
                />
            </div>
            
            {/* 時間 */}
            <div className="lw-select-group">
                <SelectControl
                    label="アニメーション時間"
                    value={currentDur}
                    options={animationDurationOptions}
                    onChange={(v) => apply({ dur: v })}
                    className="lw-select-control"
                />
            </div>
            
            {/* 表示開始距離 */}
            <div className="lw-select-group">
                <SelectControl
                    label="表示開始距離 (スクロール時)"
                    value={currentThresh}
                    options={thresholdOptions}
                    onChange={(v) => apply({ thresh: v })}
                    className="lw-select-control"
                />
            </div>
            
            {/* 移動距離 */}
            <div className="lw-select-group">
                <SelectControl
                    label="移動距離"
                    value={currentDistance}
                    options={distanceOptions}
                    onChange={(v) => apply({ distance: v })}
                    className="lw-select-control"
                />
            </div>
            
            {/* 遅延時間 */}
            <div className="lw-select-group">
                <SelectControl
                    label="遅延時間"
                    value={currentDelay}
                    options={delayOptions}
                    onChange={(v) => apply({ delay: v })}
                    className="lw-select-control"
                />
            </div>

            {/* リセットボタン */}
            <Flex justify="flex-end" className="lw-reset-wrapper">
                <Button
                    variant="secondary"
                    onClick={reset}
                    className="lw-reset-button"
                >
                    リセット
                </Button>
            </Flex>
        </div>
    </Popover>
)}
			</Fragment>
		);
	},
});
