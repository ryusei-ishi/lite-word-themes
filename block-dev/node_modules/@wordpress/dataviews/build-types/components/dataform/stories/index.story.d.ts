/**
 * Internal dependencies
 */
import DataForm from '../index';
declare const meta: {
    title: string;
    component: typeof DataForm;
    argTypes: {
        type: {
            control: {
                type: string;
            };
            description: string;
            options: string[];
        };
    };
};
export default meta;
export declare const Default: ({ type }: {
    type: "panel" | "regular";
}) => import("react").JSX.Element;
//# sourceMappingURL=index.story.d.ts.map