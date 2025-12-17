const { createElement, Fragment } = wp.element;
const { createHigherOrderComponent } = wp.compose;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { select, dispatch, subscribe } = wp.data;

// メインのツールバー追加処理
const withGlobalPCSPToolbar = createHigherOrderComponent(function (BlockEdit) {
	return function (props) {
		const clientId = props.clientId;
		const block = select('core/block-editor').getBlock(clientId);
		const className = block?.attributes?.className || '';

		function toggleClass(targetClass) {
			let newClassName = className || '';

			if (newClassName.includes(targetClass)) {
				newClassName = newClassName.replace(targetClass, '').trim();
			} else {
				newClassName = newClassName
					.replace('lw_pc_only', '')
					.replace('lw_sp_only', '')
					.trim();
				newClassName += ' ' + targetClass;
			}

			// クラス名を保存
			dispatch('core/block-editor').updateBlockAttributes(clientId, {
				className: newClassName.trim(),
			});
		}

		return createElement(
			Fragment,
			{},
			createElement(BlockEdit, props),
			createElement(
				BlockControls,
				{},
				createElement(
					ToolbarGroup,
					{},
					createElement(ToolbarButton, {
						icon: 'desktop',
						label: 'PCのみ表示',
						isPressed: className.includes('lw_pc_only'),
						onClick: function () {
							toggleClass('lw_pc_only');
						}
					}),
					createElement(ToolbarButton, {
						icon: 'smartphone',
						label: 'SPのみ表示',
						isPressed: className.includes('lw_sp_only'),
						onClick: function () {
							toggleClass('lw_sp_only');
						}
					})
				)
			)
		);
	};
}, 'withGlobalPCSPToolbar');

// フィルター登録
wp.hooks.addFilter(
	'editor.BlockEdit',
	'my-plugin/with-global-pcsp-toolbar',
	withGlobalPCSPToolbar
);

// DOMへクラスを反映する処理
function applyPCSPClassToWrappers() {
	const blocks = select('core/block-editor').getBlocks();

	blocks.forEach((block) => {
		const className = block?.attributes?.className || '';
		const clientId = block.clientId;
		const wrapper = document.querySelector('[data-block="' + clientId + '"]');
		if (wrapper) {
			wrapper.classList.remove('lw_pc_only', 'lw_sp_only');

			if (className.includes('lw_pc_only')) {
				wrapper.classList.add('lw_pc_only');
			} else if (className.includes('lw_sp_only')) {
				wrapper.classList.add('lw_sp_only');
			}
		}
	});
}

// 初回 & ブロック変更のたびに監視して反映
wp.domReady(() => {
	applyPCSPClassToWrappers(); // 初期反映

	subscribe(() => {
		applyPCSPClassToWrappers(); // 状態が変わるたびに再反映
	});
});
