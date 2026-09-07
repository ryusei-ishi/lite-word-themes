/**
 * lw-pr-qa-5 — 保存HTML
 * ⚠️ ここを変えると保存済みのブロックが検証エラーになる。構造を直すときは edit.js も一緒に直すこと。
 *
 * 🚨 JS が動かないときに壊れない作りにしてある。
 *    ・検索窓（.qa-5__search）・件数・「見つかりません」は既定で display:none
 *    ・回答は既定で開いた状態
 *    view.js が .is-js を付けたときだけ、検索窓が出て回答が畳まれる。
 *    つまり JS 無し＝全部開いた普通のFAQ。読めなくなる状態を作らない。
 *
 * 🚨 検索用の文字列（data-qa5-key）は**ここでは作らない**。
 *    正規化のしかたを save() と view.js の2か所に書くと、片方を直したときに必ずズレる。
 *    ここでは keywords をそのまま持たせ、view.js が表示テキストと合わせて組み立てる。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import {
    blockStyle,
    rootClass,
    fontAttr,
    weightStyle,
    safeItems,
    safeHints,
    SEARCH_ICON_PATH,
} from './helpers.js';

export default function Save( { attributes } ) {
    const {
        placeholder,
        hintLabel,
        hints,
        showCount,
        noResultText,
        noResultLinkText,
        noResultLinkUrl,
        labelFont,
        labelFontWeight,
        textFont,
        items,
    } = attributes;

    const list = safeItems( items );
    const hintList = safeHints( hints );

    const blockProps = useBlockProps.save( {
        className: rootClass( attributes ),
        style: blockStyle( attributes ),
    } );

    return (
        <div { ...blockProps }>
            <div className="qa-5__search">
                <div className="qa-5__field">
                    <svg
                        className="qa-5__field-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        aria-hidden="true"
                    >
                        <path d={ SEARCH_ICON_PATH } />
                    </svg>
                    {/* 🚨 autoComplete のような camelCase の属性をここに書かないこと。
                        WordPress の save() は autocomplete と小文字で出すのに、
                        テンプレート生成の描画ハーネスは autoComplete のまま出すので、
                        保存HTMLと食い違って編集画面が「ブロックが壊れています」になる。
                        入力補完を切るのは view.js 側で setAttribute している。 */}
                    <input
                        type="text"
                        className="qa-5__input"
                        placeholder={ placeholder }
                        aria-label="よくある質問を探す"
                    />
                    <button type="button" className="qa-5__clear" aria-label="入力を消す">
                        ×
                    </button>
                </div>

                { hintList.length > 0 && (
                    <div className="qa-5__hints">
                        <span className="qa-5__hints-label">{ hintLabel }</span>
                        { hintList.map( ( h, i ) => (
                            <button type="button" className="qa-5__hint" key={ i }>
                                { h }
                            </button>
                        ) ) }
                    </div>
                ) }
            </div>

            { showCount && (
                <p className="qa-5__count" aria-live="polite">
                    <span className="qa-5__count-shown">{ list.length }</span>
                    <span className="qa-5__count-unit">件</span>
                </p>
            ) }

            <div className="qa-5__list">
                { list.map( ( c, i ) => (
                    <div
                        className="qa-5__item"
                        key={ i }
                        data-qa5-keywords={ c.keywords ? c.keywords : undefined }
                    >
                        <button type="button" className="qa-5__q" aria-expanded="false">
                            <span
                                className="qa-5__mark qa-5__mark--q"
                                data-lw_font_set={ fontAttr( labelFont ) }
                                style={ weightStyle( labelFontWeight ) }
                            >
                                Q
                            </span>
                            <RichText.Content
                                tagName="span"
                                className="qa-5__q-text"
                                value={ c.text_q }
                                data-lw_font_set={ fontAttr( textFont ) }
                            />
                            <span className="qa-5__toggle" aria-hidden="true"></span>
                        </button>

                        <div className="qa-5__a">
                            <div className="qa-5__a-inner">
                                <span
                                    className="qa-5__mark qa-5__mark--a"
                                    data-lw_font_set={ fontAttr( labelFont ) }
                                    style={ weightStyle( labelFontWeight ) }
                                >
                                    A
                                </span>
                                <RichText.Content
                                    tagName="p"
                                    className="qa-5__a-text"
                                    value={ c.text_a }
                                    data-lw_font_set={ fontAttr( textFont ) }
                                />
                            </div>
                        </div>
                    </div>
                ) ) }
            </div>

            <div className="qa-5__empty">
                <p className="qa-5__empty-text">{ noResultText }</p>
                { noResultLinkUrl && (
                    <a className="qa-5__empty-link" href={ noResultLinkUrl }>
                        { noResultLinkText }
                    </a>
                ) }
            </div>
        </div>
    );
}
