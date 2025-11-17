/**
 * This component renders a navigation bar at the top of the editor. It displays the title of the current document,
 * a back button (if applicable), and a command center button. It also handles different states of the document,
 * such as "not found" or "unsynced".
 *
 * @example
 * ```jsx
 * <DocumentBar />
 * ```
 * @param {Object}                                   props       The component props.
 * @param {string}                                   props.title A title for the document, defaulting to the document or
 *                                                               template title currently being edited.
 * @param {import("@wordpress/components").IconType} props.icon  An icon for the document, defaulting to an icon for document
 *                                                               or template currently being edited.
 *
 * @return {JSX.Element} The rendered DocumentBar component.
 */
export default function DocumentBar(props: {
    title: string;
    icon: import("@wordpress/components").IconType;
}): JSX.Element;
//# sourceMappingURL=index.d.ts.map