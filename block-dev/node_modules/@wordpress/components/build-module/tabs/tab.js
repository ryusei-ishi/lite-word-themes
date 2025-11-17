/**
 * WordPress dependencies
 */

import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */

import warning from '@wordpress/warning';
import { useTabsContext } from './context';
import { Tab as StyledTab } from './styles';
import { jsx as _jsx } from "react/jsx-runtime";
export const Tab = forwardRef(function Tab({
  children,
  tabId,
  disabled,
  render,
  ...otherProps
}, ref) {
  const context = useTabsContext();
  if (!context) {
    globalThis.SCRIPT_DEBUG === true ? warning('`Tabs.Tab` must be wrapped in a `Tabs` component.') : void 0;
    return null;
  }
  const {
    store,
    instanceId
  } = context;
  const instancedTabId = `${instanceId}-${tabId}`;
  return /*#__PURE__*/_jsx(StyledTab, {
    ref: ref,
    store: store,
    id: instancedTabId,
    disabled: disabled,
    render: render,
    ...otherProps,
    children: children
  });
});
//# sourceMappingURL=tab.js.map