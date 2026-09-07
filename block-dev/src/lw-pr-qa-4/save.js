/**
 * lw-pr-qa-4 — 保存HTML
 * ⚠️ ここを変えると保存済みのブロックが検証エラーになる。構造を直すときは edit.js も一緒に直すこと。
 *
 * 🚨 JS が動かないときに壊れない作りにしてある。
 *    ・タブ（.qa-4__tabs）は既定で display:none。view.js が .is-js を付けて初めて出る
 *    ・分類名（.qa-4__panel-title）は既定で表示。.is-js が付くと消える
 *    ・パネルは既定で全部表示。.is-js が付いたときだけ .is-active の1つだけになる
 *    つまり JS 無し＝ぜんぶ縦に並んだ普通のFAQ。読めなくなる状態を作らない。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import {
    blockStyle,
    rootClass,
    labelText,
    fontAttr,
    weightStyle,
    safeGroups,
    safeItems,
} from './helpers.js';

export default function Save( { attributes } ) {
    const { showCount, labelStyle, labelFont, labelFontWeight, textFont, groups } = attributes;
    const list = safeGroups( groups );

    const blockProps = useBlockProps.save( {
        className: rootClass( attributes ),
        style: blockStyle( attributes ),
    } );

    return (
        <div { ...blockProps }>
            {/* 🚨 aria-selected / data- の値は必ず**文字列**で渡すこと。
                真偽値や数値のまま渡すと、WordPress の save() と、テンプレートを作る描画ハーネスとで
                書き出し方が食い違うことがある（aria-selected が値なしの裸の属性になる等）。
                食い違うと編集画面で「ブロックが壊れています」になる。 */}
            <div className="qa-4__tabs" role="tablist">
                { list.map( ( g, i ) => (
                    <button
                        type="button"
                        key={ i }
                        className={ i === 0 ? 'qa-4__tab is-active' : 'qa-4__tab' }
                        role="tab"
                        aria-selected={ i === 0 ? 'true' : 'false' }
                        data-qa4-tab={ String( i ) }
                    >
                        <span className="qa-4__tab-label">{ g.label }</span>
                        { showCount && (
                            <span className="qa-4__tab-count">{ safeItems( g ).length }</span>
                        ) }
                    </button>
                ) ) }
            </div>

            <div className="qa-4__panels">
                { list.map( ( g, i ) => (
                    <div
                        key={ i }
                        className={ i === 0 ? 'qa-4__panel is-active' : 'qa-4__panel' }
                        role="tabpanel"
                        data-qa4-panel={ String( i ) }
                    >
                        <p className="qa-4__panel-title">{ g.label }</p>

                        { safeItems( g ).map( ( c, j ) => (
                            <dl className="qa-4__item" key={ j }>
                                <dt>
                                    <span
                                        className="qa-4__mark qa-4__mark--q"
                                        data-lw_font_set={ fontAttr( labelFont ) }
                                        style={ weightStyle( labelFontWeight ) }
                                    >
                                        { labelText( 'Q', j, labelStyle ) }
                                    </span>
                                    <RichText.Content
                                        tagName="p"
                                        className="qa-4__q"
                                        value={ c.text_q }
                                        data-lw_font_set={ fontAttr( textFont ) }
                                    />
                                </dt>
                                <dd>
                                    <span
                                        className="qa-4__mark qa-4__mark--a"
                                        data-lw_font_set={ fontAttr( labelFont ) }
                                        style={ weightStyle( labelFontWeight ) }
                                    >
                                        { labelText( 'A', j, labelStyle ) }
                                    </span>
                                    <RichText.Content
                                        tagName="p"
                                        className="qa-4__a"
                                        value={ c.text_a }
                                        data-lw_font_set={ fontAttr( textFont ) }
                                    />
                                </dd>
                            </dl>
                        ) ) }
                    </div>
                ) ) }
            </div>
        </div>
    );
}
