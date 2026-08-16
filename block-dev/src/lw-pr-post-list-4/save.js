import { useBlockProps } from '@wordpress/block-editor';
import Background from './background.js';
import { gridStyle } from './helpers.js';
import frontScript from './front-script.js';

export default function Save( { attributes } ) {
    const blockProps = useBlockProps.save();
    const {
        numberOfPosts, categoryId, postType, dateFormat,
        dateFont, dateFontWeight, catFont, catFontWeight, catBgColor, titleFont, titleFontWeight,
    } = attributes;

    return (
        <div {...blockProps}>
            <Background attributes={attributes} />
            <div
                className="lw_pr-post-list-4"
                style={gridStyle(attributes)}
                data-number={numberOfPosts}
                data-category={categoryId}
                data-type={postType}
                data-date-format={dateFormat}
                data-date-font={dateFont}
                data-date-font-weight={dateFontWeight}
                data-cat-font={catFont}
                data-cat-font-weight={catFontWeight}
                data-cat-bg-color={catBgColor}
                data-title-font={titleFont}
                data-title-font-weight={titleFontWeight}
            >
                <ul className="pr-post-list-4__wrap"></ul>
            </div>
            <script dangerouslySetInnerHTML={{ __html: frontScript }} />
        </div>
    );
}
