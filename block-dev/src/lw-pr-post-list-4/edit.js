import { useBlockProps } from '@wordpress/block-editor';
import Inspector from './inspector.js';
import Background from './background.js';
import { sampleDate } from './constants.js';
import { gridStyle } from './helpers.js';

export default function Edit( { attributes, setAttributes } ) {
    const blockProps = useBlockProps();
    const {
        numberOfPosts, dateFormat,
        dateFont, dateFontWeight, catFont, catFontWeight, catBgColor, titleFont, titleFontWeight,
    } = attributes;

    return (
        <div {...blockProps}>
            <Inspector attributes={attributes} setAttributes={setAttributes} />

            <Background attributes={attributes} />
            <div className="lw_pr-post-list-4" style={gridStyle(attributes)}>
                <ul className="pr-post-list-4__wrap">
                    {Array.from({ length: numberOfPosts }).map((_, index) => (
                        <li key={index}>
                            <a href="#">
                                <figure>
                                    <img loading="lazy" src={`https://picsum.photos/800/550?random=${index}`} alt="" />
                                </figure>
                                <div className="in">
                                    <div className="data">
                                        <div
                                            className="date"
                                            style={{ fontWeight: dateFontWeight }}
                                            data-lw_font_set={dateFont}
                                        >
                                            <span>{sampleDate(dateFormat)}</span>
                                        </div>
                                        <div
                                            className="cat"
                                            style={{ backgroundColor: catBgColor, fontWeight: catFontWeight }}
                                            data-lw_font_set={catFont}
                                        >
                                            <span>お知らせ</span>
                                        </div>
                                    </div>
                                    <h3
                                        style={{ fontWeight: titleFontWeight }}
                                        data-lw_font_set={titleFont}
                                    >
                                        サンプル投稿タイトルです。
                                    </h3>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
