/**
 * lw-pr-qa-6 — エディタ表示
 * 保存HTML（save.js）と同じ構造で描く。違うのは操作用のボタンだけ。
 * ⚠️ タグ・クラス名を変えるときは save.js も必ず同じに直すこと（ズレると検証エラーになる）。
 *
 * 🚨 エディタでは view.js が動かないので、自分で is-js を付けて2カラムの見た目にしている。
 *    ただし追従（sticky）はエディタ内では効かないことがある。それは仕様。
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import Inspector from './inspector.js';
import {
    blockStyle,
    rootClass,
    labelText,
    fontAttr,
    weightStyle,
    safeGroups,
    safeItems,
} from './helpers.js';

export default function Edit( { attributes, setAttributes } ) {
    const { showCount, navTitle, labelStyle, labelFont, labelFontWeight, textFont, groups } =
        attributes;
    const list = safeGroups( groups );

    const blockProps = useBlockProps( {
        className: rootClass( attributes, 'is-js' ),
        style: blockStyle( attributes ),
    } );

    const setGroups = ( next ) => setAttributes( { groups: next } );

    const addGroup = () =>
        setGroups( [
            ...list,
            { label: '新しい分類', items: [ { text_q: '新しい質問', text_a: '新しい回答' } ] },
        ] );

    const removeGroup = ( i ) => setGroups( list.filter( ( _, idx ) => idx !== i ) );

    const updateGroupLabel = ( i, value ) =>
        setGroups( list.map( ( g, idx ) => ( idx === i ? { ...g, label: value } : g ) ) );

    const moveGroup = ( from, to ) => {
        if ( to < 0 || to >= list.length ) {
            return;
        }
        const next = [ ...list ];
        const [ moved ] = next.splice( from, 1 );
        next.splice( to, 0, moved );
        setGroups( next );
    };

    const setItems = ( gi, items ) =>
        setGroups( list.map( ( g, idx ) => ( idx === gi ? { ...g, items } : g ) ) );

    const addItem = ( gi ) =>
        setItems( gi, [
            ...safeItems( list[ gi ] ),
            { text_q: '新しい質問', text_a: '新しい回答' },
        ] );

    const removeItem = ( gi, i ) =>
        setItems( gi, safeItems( list[ gi ] ).filter( ( _, idx ) => idx !== i ) );

    const updateItem = ( gi, i, key, value ) =>
        setItems(
            gi,
            safeItems( list[ gi ] ).map( ( item, idx ) =>
                idx === i ? { ...item, [ key ]: value } : item
            )
        );

    const moveItem = ( gi, from, to ) => {
        const items = safeItems( list[ gi ] );
        if ( to < 0 || to >= items.length ) {
            return;
        }
        const next = [ ...items ];
        const [ moved ] = next.splice( from, 1 );
        next.splice( to, 0, moved );
        setItems( gi, next );
    };

    return (
        <>
            <Inspector attributes={ attributes } setAttributes={ setAttributes } />

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
                            {/* ↓ 分類名の入力はエディタ専用。save() では h3 の文字になる */}
                            <div className="qa-6__group-tools">
                                <TextControl
                                    label={ `分類 ${ i + 1 } の名前` }
                                    value={ g.label || '' }
                                    onChange={ ( v ) => updateGroupLabel( i, v ) }
                                    __nextHasNoMarginBottom
                                />
                                <div className="qa-6__group-buttons">
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        disabled={ i === 0 }
                                        onClick={ () => moveGroup( i, i - 1 ) }
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        disabled={ i === list.length - 1 }
                                        onClick={ () => moveGroup( i, i + 1 ) }
                                    >
                                        ↓
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        isDestructive
                                        disabled={ list.length <= 1 }
                                        onClick={ () => removeGroup( i ) }
                                    >
                                        分類を削除
                                    </Button>
                                </div>
                            </div>

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
                                        <RichText
                                            tagName="p"
                                            className="qa-6__q"
                                            value={ c.text_q }
                                            data-lw_font_set={ fontAttr( textFont ) }
                                            onChange={ ( v ) => updateItem( i, j, 'text_q', v ) }
                                            placeholder="質問を入力..."
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
                                        <RichText
                                            tagName="p"
                                            className="qa-6__a"
                                            value={ c.text_a }
                                            data-lw_font_set={ fontAttr( textFont ) }
                                            onChange={ ( v ) => updateItem( i, j, 'text_a', v ) }
                                            placeholder="回答を入力..."
                                        />
                                    </dd>

                                    <div className="qa-6__tools">
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            disabled={ j === 0 }
                                            onClick={ () => moveItem( i, j, j - 1 ) }
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            disabled={ j === safeItems( g ).length - 1 }
                                            onClick={ () => moveItem( i, j, j + 1 ) }
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            isDestructive
                                            onClick={ () => removeItem( i, j ) }
                                        >
                                            削除
                                        </Button>
                                    </div>
                                </dl>
                            ) ) }

                            <div className="qa-6__add">
                                <Button variant="secondary" onClick={ () => addItem( i ) }>
                                    この分類に質問を追加する
                                </Button>
                            </div>
                        </section>
                    ) ) }

                    <div className="qa-6__add qa-6__add--group">
                        <Button variant="primary" onClick={ addGroup }>
                            ＋ 分類を追加する
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
