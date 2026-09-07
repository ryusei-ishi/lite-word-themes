/**
 * lw-pr-qa-5 — エディタ表示
 * 保存HTML（save.js）と同じ構造で描く。違うのは操作用のボタンだけ。
 * ⚠️ クラス名・タグを変えるときは save.js も必ず同じに直すこと（ズレると検証エラーになる）。
 *
 * 🚨 エディタでは検索は動かさない。動かすと編集中の質問が消えて触れなくなる。
 *    見た目だけフロントに合わせるため is-js は付けるが、回答は全部開いたままにする
 *    （edit 側は qa-5--open 相当の見え方で固定）。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl, TextareaControl } from '@wordpress/components';
import Inspector from './inspector.js';
import {
    blockStyle,
    fontAttr,
    weightStyle,
    safeItems,
    safeHints,
    SEARCH_ICON_PATH,
} from './helpers.js';

export default function Edit( { attributes, setAttributes } ) {
    const {
        placeholder,
        hintLabel,
        hints,
        showCount,
        noResultText,
        labelFont,
        labelFontWeight,
        textFont,
        items,
    } = attributes;

    const list = safeItems( items );
    const hintList = safeHints( hints );

    // 🚨 エディタでは常に「全部開いた」見え方にする（qa-5--open 固定）。
    //    畳んだ状態だと回答を編集できない。
    const blockProps = useBlockProps( {
        className: 'lw-pr-qa-5 qa-5--open is-js',
        style: blockStyle( attributes ),
    } );

    const setItemsAttr = ( next ) => setAttributes( { items: next } );

    const addItem = () =>
        setItemsAttr( [ ...list, { text_q: '新しい質問', text_a: '新しい回答', keywords: '' } ] );

    const removeItem = ( i ) => setItemsAttr( list.filter( ( _, idx ) => idx !== i ) );

    const updateItem = ( i, key, value ) =>
        setItemsAttr(
            list.map( ( item, idx ) => ( idx === i ? { ...item, [ key ]: value } : item ) )
        );

    const moveItem = ( from, to ) => {
        if ( to < 0 || to >= list.length ) {
            return;
        }
        const next = [ ...list ];
        const [ moved ] = next.splice( from, 1 );
        next.splice( to, 0, moved );
        setItemsAttr( next );
    };

    return (
        <>
            <Inspector attributes={ attributes } setAttributes={ setAttributes } />

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
                        <input
                            type="text"
                            className="qa-5__input"
                            placeholder={ placeholder }
                            disabled
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
                    <p className="qa-5__count">
                        <span className="qa-5__count-shown">{ list.length }</span>
                        <span className="qa-5__count-unit">件</span>
                    </p>
                ) }

                <div className="qa-5__list">
                    { list.map( ( c, i ) => (
                        <div className="qa-5__item" key={ i }>
                            <div className="qa-5__q">
                                <span
                                    className="qa-5__mark qa-5__mark--q"
                                    data-lw_font_set={ fontAttr( labelFont ) }
                                    style={ weightStyle( labelFontWeight ) }
                                >
                                    Q
                                </span>
                                <RichText
                                    tagName="span"
                                    className="qa-5__q-text"
                                    value={ c.text_q }
                                    data-lw_font_set={ fontAttr( textFont ) }
                                    onChange={ ( v ) => updateItem( i, 'text_q', v ) }
                                    placeholder="質問を入力..."
                                />
                                <span className="qa-5__toggle" aria-hidden="true"></span>
                            </div>

                            <div className="qa-5__a">
                                <div className="qa-5__a-inner">
                                    <span
                                        className="qa-5__mark qa-5__mark--a"
                                        data-lw_font_set={ fontAttr( labelFont ) }
                                        style={ weightStyle( labelFontWeight ) }
                                    >
                                        A
                                    </span>
                                    <RichText
                                        tagName="p"
                                        className="qa-5__a-text"
                                        value={ c.text_a }
                                        data-lw_font_set={ fontAttr( textFont ) }
                                        onChange={ ( v ) => updateItem( i, 'text_a', v ) }
                                        placeholder="回答を入力..."
                                    />
                                </div>
                            </div>

                            {/* ↓ エディタ専用。save() には出力しない */}
                            <div className="qa-5__tools">
                                <TextControl
                                    label="検索用の言葉（表示されません）"
                                    value={ c.keywords || '' }
                                    onChange={ ( v ) => updateItem( i, 'keywords', v ) }
                                    help="空白で区切ります。例：車 パーキング とめる"
                                    __nextHasNoMarginBottom
                                />
                                <div className="qa-5__tool-buttons">
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        disabled={ i === 0 }
                                        onClick={ () => moveItem( i, i - 1 ) }
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        disabled={ i === list.length - 1 }
                                        onClick={ () => moveItem( i, i + 1 ) }
                                    >
                                        ↓
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        isDestructive
                                        onClick={ () => removeItem( i ) }
                                    >
                                        削除
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) ) }
                </div>

                <div className="qa-5__add">
                    <Button variant="secondary" onClick={ addItem }>
                        質問を追加する
                    </Button>
                </div>

                <div className="qa-5__empty-preview">
                    <TextareaControl
                        label="見つからなかったときに出す文章"
                        value={ noResultText }
                        onChange={ ( v ) => setAttributes( { noResultText: v } ) }
                        rows={ 2 }
                        __nextHasNoMarginBottom
                    />
                </div>
            </div>
        </>
    );
}
