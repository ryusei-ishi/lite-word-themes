/**
 * External dependencies
 */

import * as Ariakit from '@ariakit/react';
import { motion } from 'framer-motion';

/**
 * WordPress dependencies
 */
import { useReducedMotion, useInstanceId } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */

import { contextConnect, useContextSystem } from '../../context';
import { useToggleGroupControlContext } from '../context';
import * as styles from './styles';
import { useCx } from '../../utils/hooks';
import Tooltip from '../../tooltip';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const {
  ButtonContentView,
  LabelView
} = styles;
const REDUCED_MOTION_TRANSITION_CONFIG = {
  duration: 0
};
const LAYOUT_ID = 'toggle-group-backdrop-shared-layout-id';
const WithToolTip = ({
  showTooltip,
  text,
  children
}) => {
  if (showTooltip && text) {
    return /*#__PURE__*/_jsx(Tooltip, {
      text: text,
      placement: "top",
      children: children
    });
  }
  return /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
};
function ToggleGroupControlOptionBase(props, forwardedRef) {
  const shouldReduceMotion = useReducedMotion();
  const toggleGroupControlContext = useToggleGroupControlContext();
  const id = useInstanceId(ToggleGroupControlOptionBase, toggleGroupControlContext.baseId || 'toggle-group-control-option-base');
  const buttonProps = useContextSystem({
    ...props,
    id
  }, 'ToggleGroupControlOptionBase');
  const {
    isBlock = false,
    isDeselectable = false,
    size = 'default'
  } = toggleGroupControlContext;
  const {
    className,
    isIcon = false,
    value,
    children,
    showTooltip = false,
    onFocus: onFocusProp,
    disabled,
    ...otherButtonProps
  } = buttonProps;
  const isPressed = toggleGroupControlContext.value === value;
  const cx = useCx();
  const labelViewClasses = useMemo(() => cx(isBlock && styles.labelBlock), [cx, isBlock]);
  const itemClasses = useMemo(() => cx(styles.buttonView({
    isDeselectable,
    isIcon,
    isPressed,
    size
  }), className), [cx, isDeselectable, isIcon, isPressed, size, className]);
  const backdropClasses = useMemo(() => cx(styles.backdropView), [cx]);
  const buttonOnClick = () => {
    if (isDeselectable && isPressed) {
      toggleGroupControlContext.setValue(undefined);
    } else {
      toggleGroupControlContext.setValue(value);
    }
  };
  const commonProps = {
    ...otherButtonProps,
    className: itemClasses,
    'data-value': value,
    ref: forwardedRef
  };
  return /*#__PURE__*/_jsxs(LabelView, {
    className: labelViewClasses,
    children: [/*#__PURE__*/_jsx(WithToolTip, {
      showTooltip: showTooltip,
      text: otherButtonProps['aria-label'],
      children: isDeselectable ? /*#__PURE__*/_jsx("button", {
        ...commonProps,
        disabled: disabled,
        onFocus: onFocusProp,
        "aria-pressed": isPressed,
        type: "button",
        onClick: buttonOnClick,
        children: /*#__PURE__*/_jsx(ButtonContentView, {
          children: children
        })
      }) : /*#__PURE__*/_jsx(Ariakit.Radio, {
        disabled: disabled,
        render: /*#__PURE__*/_jsx("button", {
          type: "button",
          ...commonProps,
          onFocus: event => {
            onFocusProp?.(event);
            if (event.defaultPrevented) {
              return;
            }
            toggleGroupControlContext.setValue(value);
          }
        }),
        value: value,
        children: /*#__PURE__*/_jsx(ButtonContentView, {
          children: children
        })
      })
    }), isPressed ? /*#__PURE__*/_jsx(motion.div, {
      layout: true,
      layoutRoot: true,
      children: /*#__PURE__*/_jsx(motion.div, {
        className: backdropClasses,
        transition: shouldReduceMotion ? REDUCED_MOTION_TRANSITION_CONFIG : undefined,
        role: "presentation",
        layoutId: LAYOUT_ID
      })
    }) : null]
  });
}

/**
 * `ToggleGroupControlOptionBase` is a form component and is meant to be used as an internal,
 * generic component for any children of `ToggleGroupControl`.
 *
 * @example
 * ```jsx
 * import {
 *   __experimentalToggleGroupControl as ToggleGroupControl,
 *   __experimentalToggleGroupControlOptionBase as ToggleGroupControlOptionBase,
 * } from '@wordpress/components';
 *
 * function Example() {
 *   return (
 *     <ToggleGroupControl label="my label" value="vertical" isBlock>
 *       <ToggleGroupControlOption value="horizontal" label="Horizontal" />
 *       <ToggleGroupControlOption value="vertical" label="Vertical" />
 *     </ToggleGroupControl>
 *   );
 * }
 * ```
 */
const ConnectedToggleGroupControlOptionBase = contextConnect(ToggleGroupControlOptionBase, 'ToggleGroupControlOptionBase');
export default ConnectedToggleGroupControlOptionBase;
//# sourceMappingURL=component.js.map