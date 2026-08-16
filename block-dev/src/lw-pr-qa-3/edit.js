/**
 * lw-pr-qa-3 — エディタ表示
 * 保存HTML（save.js）と同じ構造で描く。違うのは操作用のボタンだけ。
 * ⚠️ 構造を変えるときは save.js も必ず同じに直すこと（ズレると検証エラーになる）。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import Inspector from './inspector.js';
import { blockStyle, labelText, weightStyle, fontAttr } from './helpers.js';

export default function Edit( { attributes, setAttributes } ) {
    const { labelStyle, labelFont, labelFontWeight, textFont, qFontWeight, aFontWeight, contents } =
        attributes;

    const blockProps = useBlockProps( {
        className: 'lw-pr-qa-3',
        style: blockStyle( attributes ),
    } );

    /* ---------- リスト操作 ---------- */
    const addContent = () =>
        setAttributes( {
            contents: [ ...contents, { text_q: '新しい質問', text_a: '新しい回答' } ],
        } );

    const removeContent = ( i ) =>
        setAttributes( { contents: contents.filter( ( _, idx ) => idx !== i ) } );

    const updateContent = ( i, key, value ) =>
        setAttributes( {
            contents: contents.map( ( item, idx ) =>
                idx === i ? { ...item, [ key ]: value } : item
            ),
        } );

    // 並び替え。to が範囲外なら何もしない
    const moveContent = ( from, to ) => {
        if ( to < 0 || to >= contents.length ) {
            return;
        }
        const next = [ ...contents ];
        const [ moved ] = next.splice( from, 1 );
        next.splice( to, 0, moved );
        setAttributes( { contents: next } );
    };

    return (
        <>
            <Inspector attributes={ attributes } setAttributes={ setAttributes } />

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
                            <RichText
                                tagName="p"
                                className="qa-3__q_text"
                                value={ c.text_q }
                                data-lw_font_set={ fontAttr( textFont ) }
                                style={ weightStyle( qFontWeight ) }
                                onChange={ ( v ) => updateContent( i, 'text_q', v ) }
                                placeholder="質問を入力..."
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
                            <RichText
                                tagName="p"
                                className="qa-3__a_text"
                                value={ c.text_a }
                                data-lw_font_set={ fontAttr( textFont ) }
                                style={ weightStyle( aFontWeight ) }
                                onChange={ ( v ) => updateContent( i, 'text_a', v ) }
                                placeholder="回答を入力..."
                            />
                        </dd>

                        {/* ↓ エディタ専用。save() には出力しない */}
                        <div className="qa-3__tools">
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={ i === 0 }
                                onClick={ () => moveContent( i, i - 1 ) }
                            >
                                ↑
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={ i === contents.length - 1 }
                                onClick={ () => moveContent( i, i + 1 ) }
                            >
                                ↓
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                isDestructive
                                onClick={ () => removeContent( i ) }
                            >
                                削除
                            </Button>
                        </div>
                    </dl>
                ) ) }

                <div className="qa-3__add">
                    <Button variant="secondary" onClick={ addContent }>
                        リストを追加する
                    </Button>
                </div>
            </div>
        </>
    );
}
