/**
 * lw-pr-qa-6 — 保存HTML
 * ⚠️ ここを変えると保存済みのブロックが検証エラーになる。構造を直すときは edit.js も一緒に直すこと。
 *
 * 🚨 JS が動かないときに壊れない作りにしてある。
 *    ・左の分類一覧（.qa-6__nav）は既定で display:none
 *    ・中身は1カラムで、分類ごとの見出し（h3）つきで全部出る
 *    view.js が .is-js を付けたときだけ2カラムになり、一覧が追従する。
 *
 * 🚨 見出しに id を書かない。同じテンプレを2ページに貼ったときに id が重複するため。
 *    飛び先は data-qa6-group の番号で view.js が探す。
 *
 * 🚨 aria-* / data-* の値は必ず文字列で渡すこと（真偽値・数値のままだと
 *    WordPress の save() と描画ハーネスで書き出し方が食い違う）。
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
    const { showCount, navTitle, labelStyle, labelFont, labelFontWeight, textFont, groups } =
        attributes;
    const list = safeGroups( groups );

    const blockProps = useBlockProps.save( {
        className: rootClass( attributes ),
        style: blockStyle( attributes ),
    } );

    return (
        <div { ...blockProps }>
            <nav className="qa-6__nav" aria-label="よくある質問の分類">
                <div className="qa-6__nav-inner">
                    { navTitle && <p className="qa-6__nav-title">{ navTitle }</p> }
                    <ul className="qa-6__nav-list">
                        { list.map( ( g, i ) => (
                            <li className="qa-6__nav-li" key={ i }>
                                <button
                                    type="button"
                                    className={
                                        i === 0 ? 'qa-6__nav-link is-active' : 'qa-6__nav-link'
                                    }
                                    data-qa6-nav={ String( i ) }
                                >
                                    <span className="qa-6__nav-text">{ g.label }</span>
                                    { showCount && (
                                        <span className="qa-6__nav-count">
                                            { safeItems( g ).length }
                                        </span>
                                    ) }
                                </button>
                            </li>
                        ) ) }
                    </ul>
                </div>
            </nav>

            <div className="qa-6__main">
                { list.map( ( g, i ) => (
                    <section className="qa-6__group" key={ i } data-qa6-group={ String( i ) }>
                        <h3 className="qa-6__group-title">{ g.label }</h3>

                        { safeItems( g ).map( ( c, j ) => (
                            <dl className="qa-6__item" key={ j }>
                                <dt>
                                    <span
                                        className="qa-6__mark qa-6__mark--q"
                                        data-lw_font_set={ fontAttr( labelFont ) }
                                        style={ weightStyle( labelFontWeight ) }
                                    >
                                        { labelText( 'Q', j, labelStyle ) }
                                    </span>
                                    <RichText.Content
                                        tagName="p"
                                        className="qa-6__q"
                                        value={ c.text_q }
                                        data-lw_font_set={ fontAttr( textFont ) }
                                    />
                                </dt>
                                <dd>
                                    <span
                                        className="qa-6__mark qa-6__mark--a"
                                        data-lw_font_set={ fontAttr( labelFont ) }
                                        style={ weightStyle( labelFontWeight ) }
                                    >
                                        { labelText( 'A', j, labelStyle ) }
                                    </span>
                                    <RichText.Content
                                        tagName="p"
                                        className="qa-6__a"
                                        value={ c.text_a }
                                        data-lw_font_set={ fontAttr( textFont ) }
                                    />
                                </dd>
                            </dl>
                        ) ) }
                    </section>
                ) ) }
            </div>
        </div>
    );
}
