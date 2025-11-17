/**
 * `useTrackElementRectUpdates` options.
 */
export type UseTrackElementRectUpdatesOptions = {
    /**
     * Whether to trigger the callback when an element's ResizeObserver is
     * first set up, including when the target element changes.
     *
     * @default true
     */
    fireOnElementInit?: boolean;
};
/**
 * Tracks an element's "rect" (size and position) and fires `onRect` for all
 * of its discrete values. The element can be changed dynamically and **it
 * must not be stored in a ref**. Instead, it should be stored in a React
 * state or equivalent.
 *
 * By default, `onRect` is called initially for the target element (including
 * when the target element changes), not only on size or position updates.
 * This allows consumers of the hook to always be in sync with all rect values
 * of the target element throughout its lifetime. This behavior can be
 * disabled by setting the `fireOnElementInit` option to `false`.
 *
 * Under the hood, it sets up a `ResizeObserver` that tracks the element. The
 * target element can be changed dynamically, and the observer will be
 * updated accordingly.
 *
 * @example
 *
 * ```tsx
 * const [ targetElement, setTargetElement ] = useState< HTMLElement | null >();
 *
 * useTrackElementRectUpdates( targetElement, ( element ) => {
 *   console.log( 'Element resized:', element );
 * } );
 *
 * <div ref={ setTargetElement } />;
 * ```
 */
export declare function useTrackElementRectUpdates(
/**
 * The target element to observe. It can be changed dynamically.
 */
targetElement: HTMLElement | undefined | null, 
/**
 * Callback to fire when the element is resized. It will also be
 * called when the observer is set up, unless `fireOnElementInit` is
 * set to `false`.
 */
onRect: (
/**
 * The element being tracked at the time of this update.
 */
element: HTMLElement, 
/**
 * The list of
 * [`ResizeObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry)
 * objects passed to the `ResizeObserver.observe` callback. This list
 * won't be available when the observer is set up, and only on updates.
 */
resizeObserverEntries?: ResizeObserverEntry[]) => void, { fireOnElementInit }?: UseTrackElementRectUpdatesOptions): void;
/**
 * The position and dimensions of an element, relative to its offset parent.
 */
export type ElementOffsetRect = {
    /**
     * The distance from the left edge of the offset parent to the left edge of
     * the element.
     */
    left: number;
    /**
     * The distance from the top edge of the offset parent to the top edge of
     * the element.
     */
    top: number;
    /**
     * The width of the element.
     */
    width: number;
    /**
     * The height of the element.
     */
    height: number;
};
/**
 * An `ElementOffsetRect` object with all values set to zero.
 */
export declare const NULL_ELEMENT_OFFSET_RECT: {
    left: number;
    top: number;
    width: number;
    height: number;
};
/**
 * Returns the position and dimensions of an element, relative to its offset
 * parent. This is useful in contexts where `getBoundingClientRect` is not
 * suitable, such as when the element is transformed.
 *
 * **Note:** the `left` and `right` values are adjusted due to a limitation
 * in the way the browser calculates the offset position of the element,
 * which can cause unwanted scrollbars to appear. This adjustment makes the
 * values potentially inaccurate within a range of 1 pixel.
 */
export declare function getElementOffsetRect(element: HTMLElement): ElementOffsetRect;
/**
 * Tracks the position and dimensions of an element, relative to its offset
 * parent. The element can be changed dynamically.
 */
export declare function useTrackElementOffsetRect(targetElement: HTMLElement | undefined | null): ElementOffsetRect;
//# sourceMappingURL=element-rect.d.ts.map