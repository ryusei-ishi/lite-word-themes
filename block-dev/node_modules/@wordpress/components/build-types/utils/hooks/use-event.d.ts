/**
 * Any function.
 */
export type AnyFunction = (...args: any) => any;
/**
 * Creates a stable callback function that has access to the latest state and
 * can be used within event handlers and effect callbacks. Throws when used in
 * the render phase.
 *
 * @example
 *
 * ```tsx
 * function Component(props) {
 *   const onClick = useEvent(props.onClick);
 *   React.useEffect(() => {}, [onClick]);
 * }
 * ```
 */
export declare function useEvent<T extends AnyFunction>(callback?: T): T;
//# sourceMappingURL=use-event.d.ts.map