/**
 * WordPress dependencies
 */
import { trash } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, __experimentalText as Text, __experimentalHStack as HStack, __experimentalVStack as VStack } from '@wordpress/components';
// @ts-ignore
import { privateApis as patternsPrivateApis } from '@wordpress/patterns';
/**
 * Internal dependencies
 */
import { isTemplateRemovable, getItemTitle, isTemplateOrTemplatePart } from './utils';
// @ts-ignore
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const {
  PATTERN_TYPES
} = unlock(patternsPrivateApis);

// This action is used for templates, patterns and template parts.
// Every other post type uses the similar `trashPostAction` which
// moves the post to trash.
const deletePostAction = {
  id: 'delete-post',
  label: __('Delete'),
  isPrimary: true,
  icon: trash,
  isEligible(post) {
    if (isTemplateOrTemplatePart(post)) {
      return isTemplateRemovable(post);
    }
    // We can only remove user patterns.
    return post.type === PATTERN_TYPES.user;
  },
  supportsBulk: true,
  hideModalHeader: true,
  RenderModal: ({
    items,
    closeModal,
    onActionPerformed
  }) => {
    const [isBusy, setIsBusy] = useState(false);
    const {
      removeTemplates
    } = unlock(useDispatch(editorStore));
    return /*#__PURE__*/_jsxs(VStack, {
      spacing: "5",
      children: [/*#__PURE__*/_jsx(Text, {
        children: items.length > 1 ? sprintf(
        // translators: %d: number of items to delete.
        _n('Delete %d item?', 'Delete %d items?', items.length), items.length) : sprintf(
        // translators: %s: The template or template part's titles
        __('Delete "%s"?'), getItemTitle(items[0]))
      }), /*#__PURE__*/_jsxs(HStack, {
        justify: "right",
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "tertiary",
          onClick: closeModal,
          disabled: isBusy,
          accessibleWhenDisabled: true,
          __next40pxDefaultSize: true,
          children: __('Cancel')
        }), /*#__PURE__*/_jsx(Button, {
          variant: "primary",
          onClick: async () => {
            setIsBusy(true);
            await removeTemplates(items, {
              allowUndo: false
            });
            onActionPerformed?.(items);
            setIsBusy(false);
            closeModal?.();
          },
          isBusy: isBusy,
          disabled: isBusy,
          accessibleWhenDisabled: true,
          __next40pxDefaultSize: true,
          children: __('Delete')
        })]
      })]
    });
  }
};
export default deletePostAction;
//# sourceMappingURL=delete-post.js.map