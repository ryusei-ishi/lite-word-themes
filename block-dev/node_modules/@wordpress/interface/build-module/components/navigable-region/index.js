/**
 * External dependencies
 */
import clsx from 'clsx';
import { jsx as _jsx } from "react/jsx-runtime";
export default function NavigableRegion({
  children,
  className,
  ariaLabel,
  as: Tag = 'div',
  ...props
}) {
  return /*#__PURE__*/_jsx(Tag, {
    className: clsx('interface-navigable-region', className),
    "aria-label": ariaLabel,
    role: "region",
    tabIndex: "-1",
    ...props,
    children: children
  });
}
//# sourceMappingURL=index.js.map