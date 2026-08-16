/**
 * lw-pr-qa-3 — 保存HTML
 * 開閉しないブロックなのでフロント用の JS は無い。CSS だけで完結する。
 * ⚠️ ここを変えると保存済みのブロックが検証エラーになる。
 *    構造を直すときは edit.js と block.json の query セレクタも一緒に直すこと。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { blockStyle, labelText, weightStyle, fontAttr } from './helpers.js';

export default function Save( { attributes } ) {
    const { labelStyle, labelFont, labelFontWeight, textFont, qFontWeight, aFontWeight, contents } =
        attributes;

    const blockProps = useBlockProps.save( {
        className: 'lw-pr-qa-3',
        style: blockStyle( attributes ),
    } );

    return (
        <div { ...blockProps }>
            { contents.map( ( c, i ) => (
                <dl className="qa-3__item" key={ i }>
                    <dt>
                        <span
                            className="label"
                            data-lw_font_set={ fontAttr( labelFont ) }
                            style={ weightStyle( labelFontWeight ) }
                        >
                            { labelText( 'Q', i, labelStyle ) }
                        </span>
                        <RichText.Content
                            tagName="p"
                            className="qa-3__q_text"
                            value={ c.text_q }
                            data-lw_font_set={ fontAttr( textFont ) }
                            style={ weightStyle( qFontWeight ) }
                        />
                    </dt>
                    <dd>
                        <span
                            className="label"
                            data-lw_font_set={ fontAttr( labelFont ) }
                            style={ weightStyle( labelFontWeight ) }
                        >
                            { labelText( 'A', i, labelStyle ) }
                        </span>
                        <RichText.Content
                            tagName="p"
                            className="qa-3__a_text"
                            value={ c.text_a }
                            data-lw_font_set={ fontAttr( textFont ) }
                            style={ weightStyle( aFontWeight ) }
                        />
                    </dd>
                </dl>
            ) ) }
        </div>
    );
}
