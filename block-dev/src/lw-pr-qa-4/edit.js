/**
 * lw-pr-qa-4 — エディタ表示
 * 保存HTML（save.js）と同じ構造で描く。違うのは操作用のボタンと、
 * タブを実際に押して切り替えられるようにしている点だけ。
 * ⚠️ dl / dt / dd / クラス名を変えるときは save.js も必ず同じに直すこと（ズレると検証エラーになる）。
 *
 * 🚨 エディタでは view.js が動かないので、自分で is-js を付けてフロントと同じ見た目にしている。
 *    is-js はエディタ側の className にしか入れないので、保存HTMLには出ない。
 */
import { useState } from '@wordpress/element';
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
    const { showCount, labelStyle, labelFont, labelFontWeight, textFont, groups } = attributes;
    const list = safeGroups( groups );

    // エディタで「いまどの分類を編集しているか」。保存はされない
    const [ active, setActive ] = useState( 0 );
    const current = Math.min( active, Math.max( list.length - 1, 0 ) );

    const blockProps = useBlockProps( {
        className: rootClass( attributes, 'is-js' ),
        style: blockStyle( attributes ),
    } );

    /* ---------- 分類の操作 ---------- */
    const setGroups = ( next ) => setAttributes( { groups: next } );

    const addGroup = () => {
        setGroups( [
            ...list,
            { label: '新しい分類', items: [ { text_q: '新しい質問', text_a: '新しい回答' } ] },
        ] );
        setActive( list.length );
    };

    const removeGroup = ( i ) => {
        setGroups( list.filter( ( _, idx ) => idx !== i ) );
        setActive( 0 );
    };

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
        setActive( to );
    };

    /* ---------- 質問の操作（いま開いている分類の中） ---------- */
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
                <div className="qa-4__tabs" role="tablist">
                    { list.map( ( g, i ) => (
                        <button
                            type="button"
                            key={ i }
                            className={ i === current ? 'qa-4__tab is-active' : 'qa-4__tab' }
                            role="tab"
                            aria-selected={ i === current }
                            data-qa4-tab={ i }
                            onClick={ () => setActive( i ) }
                        >
                            <span className="qa-4__tab-label">{ g.label }</span>
                            { showCount && (
                                <span className="qa-4__tab-count">{ safeItems( g ).length }</span>
                            ) }
                        </button>
                    ) ) }
                </div>

                {/* ↓ ここから下の操作パネルはエディタ専用。save() には出力しない */}
                { list[ current ] && (
                    <div className="qa-4__group-tools">
                        <TextControl
                            label="この分類の名前（タブの文字）"
                            value={ list[ current ].label || '' }
                            onChange={ ( v ) => updateGroupLabel( current, v ) }
                            help="全角6字までにすると、スマホでもタブが折れません"
                            __nextHasNoMarginBottom
                        />
                        <div className="qa-4__group-buttons">
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={ current === 0 }
                                onClick={ () => moveGroup( current, current - 1 ) }
                            >
                                分類を前へ
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                disabled={ current === list.length - 1 }
                                onClick={ () => moveGroup( current, current + 1 ) }
                            >
                                分類を後ろへ
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                isDestructive
                                disabled={ list.length <= 1 }
                                onClick={ () => removeGroup( current ) }
                            >
                                この分類を削除
                            </Button>
                            <Button size="small" variant="primary" onClick={ addGroup }>
                                ＋ 分類を追加
                            </Button>
                        </div>
                    </div>
                ) }

                <div className="qa-4__panels">
                    { list.map( ( g, i ) => (
                        <div
                            key={ i }
                            className={ i === current ? 'qa-4__panel is-active' : 'qa-4__panel' }
                            role="tabpanel"
                            data-qa4-panel={ i }
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
                                        <RichText
                                            tagName="p"
                                            className="qa-4__q"
                                            value={ c.text_q }
                                            data-lw_font_set={ fontAttr( textFont ) }
                                            onChange={ ( v ) => updateItem( i, j, 'text_q', v ) }
                                            placeholder="質問を入力..."
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
                                        <RichText
                                            tagName="p"
                                            className="qa-4__a"
                                            value={ c.text_a }
                                            data-lw_font_set={ fontAttr( textFont ) }
                                            onChange={ ( v ) => updateItem( i, j, 'text_a', v ) }
                                            placeholder="回答を入力..."
                                        />
                                    </dd>

                                    <div className="qa-4__tools">
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

                            <div className="qa-4__add">
                                <Button variant="secondary" onClick={ () => addItem( i ) }>
                                    この分類に質問を追加する
                                </Button>
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>
        </>
    );
}
