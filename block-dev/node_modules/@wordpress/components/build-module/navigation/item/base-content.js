/**
 * Internal dependencies
 */
import { ItemBadgeUI, ItemTitleUI } from '../styles/navigation-styles';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export default function NavigationItemBaseContent(props) {
  const {
    badge,
    title
  } = props;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [title && /*#__PURE__*/_jsx(ItemTitleUI, {
      className: "components-navigation__item-title",
      as: "span",
      children: title
    }), badge && /*#__PURE__*/_jsx(ItemBadgeUI, {
      className: "components-navigation__item-badge",
      children: badge
    })]
  });
}
//# sourceMappingURL=base-content.js.map