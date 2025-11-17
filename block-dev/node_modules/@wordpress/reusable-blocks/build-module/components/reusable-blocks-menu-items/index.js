/**
 * WordPress dependencies
 */
import { BlockSettingsMenuControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import ReusableBlockConvertButton from './reusable-block-convert-button';
import ReusableBlocksManageButton from './reusable-blocks-manage-button';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export default function ReusableBlocksMenuItems({
  rootClientId
}) {
  return /*#__PURE__*/_jsx(BlockSettingsMenuControls, {
    children: ({
      onClose,
      selectedClientIds
    }) => /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(ReusableBlockConvertButton, {
        clientIds: selectedClientIds,
        rootClientId: rootClientId,
        onClose: onClose
      }), selectedClientIds.length === 1 && /*#__PURE__*/_jsx(ReusableBlocksManageButton, {
        clientId: selectedClientIds[0]
      })]
    })
  });
}
//# sourceMappingURL=index.js.map