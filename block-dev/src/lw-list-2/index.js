import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette
} from '@wordpress/block-editor';
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

// フォント／背景オプション
const fontOptions      = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const bgOptions        = ButtonBackgroundOptionsArr();

registerBlockType('wdl/lw-list-2', {
    title: 'list 02',
    icon: 'lightbulb',
    category: 'liteword-other',
    supports: { anchor: true },

    attributes: {
        backgroundImage: { type: 'string', default: '' },
        bgGradient:      { type: 'string', default: 'var(--color-main)' },
        filterOpacity:   { type: 'number', default: 0.8 },
        titleText:       { type: 'string', default: '機能紹介' },
        fontLi:          { type: 'string', default: '' },
        fontWeightLi:    { type: 'string', default: '' },
        colorLiSvg:      { type: 'string', default: 'var(--color-accent)' },
        contents: {
            type: 'array',
            source: 'query',
            selector: '.lw-list-2__li',
            query: {
                text: {
                    type: 'string',
                    source: 'html',
                    selector: '.lw-list-2__text p',
                },
                borderColor: {
                    type: 'string',
                    source: 'attribute',
                    selector: 'figure',
                    attribute: 'data-border-color',
                },
            },
            default: [
                { text: '何から始めたらいいか\nわからない', borderColor: 'var(--color-main)' },
                { text: '作りたいけど\n時間がない',   borderColor: 'var(--color-main)' },
                { text: '自分で作ると\nダサくなる…',  borderColor: 'var(--color-main)' },
            ],
        },
    },


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

        /* ========== Edit ========== */
        return (
            <Fragment>
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
                <div className="lw-list-2" style={ { backgroundImage: `url(${ backgroundImage })` } }>
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
                                <button className="lw-list-2__remove_btn" onClick={ () => removeContent( i ) }>
                                    削除
                                </button>
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
            </Fragment>
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

        return (
            <div className="lw-list-2" style={ { backgroundImage: `url(${ backgroundImage })` } }>
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
