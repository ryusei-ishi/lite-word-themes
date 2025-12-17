import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette
, useBlockProps } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    Button
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import {
    fontOptionsArr,
    fontWeightOptionsArr,
    ButtonBackgroundOptionsArr
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// フォント／背景オプション
const fontOptions      = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const bgOptions        = ButtonBackgroundOptionsArr();

registerBlockType(metadata.name, {
    edit: ( { attributes, setAttributes } ) => {
        const {
            backgroundImage,
            bgGradient,
            filterOpacity,
            fontLi,
            fontWeightLi,
            titleText,
            contents,
            colorLiSvg
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-list-2',
            style: { backgroundImage: `url(${ backgroundImage })` }
        });

        // 背景画像変更
        const onChangeBackgroundImage = ( media ) =>
            setAttributes( { backgroundImage: media.url } );
        const removeBackgroundImage = () =>
            setAttributes( { backgroundImage: '' } );

        // コンテンツ操作
        const addContent = () =>
            setAttributes( { contents: [ ...contents, { text: '新しいテキスト', borderColor: 'var(--color-main)' } ] } );
        const removeContent = ( i ) =>
            setAttributes( { contents: contents.filter( ( _, index ) => index !== i ) } );
        const updateContent = ( i, key, value ) => {
            const updated = [ ...contents ];
            updated[ i ][ key ] = value;
            setAttributes( { contents: updated } );
        };

        // 順番入れ替え関数
        const moveItem = ( index, direction ) => {
            const targetIndex = index + direction;
            if ( targetIndex < 0 || targetIndex >= contents.length ) return;

            const reordered = [ ...contents ];
            const [ moved ] = reordered.splice( index, 1 );
            reordered.splice( targetIndex, 0, moved );

            setAttributes( { contents: reordered } );
        };

        /* ========== Edit ========== */
        return (
            <>
                <InspectorControls>
                    {/* 背景画像 */}
                    <PanelBody title="背景画像">
                        { backgroundImage && (
                            <img
                                src={ backgroundImage }
                                alt="背景画像"
                                style={ { width: '100%', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,.1)', marginBottom: '10px' } }
                            />
                        ) }
                        <MediaUpload
                            title="背景画像を選択"
                            onSelect={ onChangeBackgroundImage }
                            allowedTypes={ [ 'image' ] }
                            value={ backgroundImage }
                            render={ ( { open } ) => (
                                <Button onClick={ open } isSecondary style={ { marginBottom: '10px' } }>
                                    { backgroundImage ? '背景画像を変更' : '背景画像を選択' }
                                </Button>
                            ) }
                        />
                        { backgroundImage && (
                            <Button onClick={ removeBackgroundImage } isDestructive style={ { marginBottom: '10px' } }>
                                背景画像を削除
                            </Button>
                        ) }
                    </PanelBody>

                    {/* 背景色 */}
                    <PanelBody title="背景">
                        <SelectControl
                            label="フィルターの色"
                            value={ bgGradient }
                            options={ bgOptions }
                            onChange={ ( v ) => setAttributes( { bgGradient: v } ) }
                        />
                        <RangeControl
                            label="透明度"
                            value={ filterOpacity }
                            onChange={ ( v ) => setAttributes( { filterOpacity: v } ) }
                            min={ 0 }
                            max={ 1 }
                            step={ 0.01 }
                        />
                    </PanelBody>

                    {/* リスト設定 */}
                    <PanelBody title="リスト部分の設定">
                        <ColorPalette
                            label="アイコンの色"
                            value={ colorLiSvg }
                            onChange={ ( c ) => setAttributes( { colorLiSvg: c } ) }
                        />
                        <SelectControl
                            label="フォントの種類"
                            value={ fontLi }
                            options={ fontOptions }
                            onChange={ ( v ) => setAttributes( { fontLi: v } ) }
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={ fontWeightLi }
                            options={ fontWeightOptions }
                            onChange={ ( v ) => setAttributes( { fontWeightLi: v } ) }
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ブロック本体 */}
                <div {...blockProps}>
                    <RichText
                        tagName="h2"
                        className="lw-list-2__title"
                        value={ titleText }
                        onChange={ ( v ) => setAttributes( { titleText: v } ) }
                        placeholder="タイトルを入力"
                    />
                    <ul className="lw-list-2__inner">
                        { contents.map( ( c, i ) => (
                            <li className="lw-list-2__li" key={ i }>
                                <span className="icon" style={ { fill: colorLiSvg } }>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                    </svg>
                                </span>
                                <span className="lw-list-2__text">
                                    <RichText
                                        tagName="p"
                                        value={ c.text }
                                        data-lw_font_set={ fontLi }
                                        onChange={ ( v ) => updateContent( i, 'text', v ) }
                                        placeholder="テキストを入力"
                                        style={ { fontWeight: fontWeightLi } }
                                    />
                                </span>
                                {/* 並べ替え & 削除コントロール */}
                                <div className="lw-list-2__item-controls">
                                    <button
                                        type="button"
                                        onClick={ () => moveItem( i, -1 ) }
                                        disabled={ i === 0 }
                                        className="move-up-button"
                                        aria-label="上へ移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={ () => moveItem( i, 1 ) }
                                        disabled={ i === contents.length - 1 }
                                        className="move-down-button"
                                        aria-label="下へ移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        className="remove-item-button"
                                        onClick={ () => removeContent( i ) }
                                        aria-label="削除"
                                    >
                                        削除
                                    </button>
                                </div>
                            </li>
                        ) ) }
                    </ul>
                    <button className="lw-list-2__add_btn" onClick={ addContent }>
                        リストを追加する
                    </button>
                    <div
                        className="lw-list-2__filter"
                        style={ { background: bgGradient, opacity: filterOpacity } }
                    />
                </div>
            </>
        );
    },

    /* ========== Save ========== */
    save: ( { attributes } ) => {
        const {
            backgroundImage,
            titleText,
            fontLi,
            fontWeightLi,
            contents,
            bgGradient,
            filterOpacity,
            colorLiSvg
        } = attributes;

        const hasTitle = titleText && titleText.trim() !== '';

        const blockProps = useBlockProps.save({
            className: 'lw-list-2',
            style: { backgroundImage: `url(${ backgroundImage })` }
        });

        return (
            <div {...blockProps}>
                {/* タイトルが入力されていない場合は出力しない */}
                { hasTitle && (
                    <RichText.Content
                        tagName="h2"
                        className="lw-list-2__title"
                        value={ titleText }
                    />
                ) }

                <ul className="lw-list-2__inner">
                    { contents.map( ( c, i ) => (
                        <li className="lw-list-2__li" key={ i }>
                            <span className="icon" style={ { fill: colorLiSvg } }>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                </svg>
                            </span>
                            <span className="lw-list-2__text">
                                <RichText.Content
                                    tagName="p"
                                    value={ c.text }
                                    data-lw_font_set={ fontLi }
                                    style={ { fontWeight: fontWeightLi } }
                                />
                            </span>
                        </li>
                    ) ) }
                </ul>

                <div
                    className="lw-list-2__filter"
                    style={ { background: bgGradient, opacity: filterOpacity } }
                />
            </div>
        );
    },
});
