import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    TextControl,
    Button,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import './style.scss';
import metadata from './block.json';

registerBlockType( metadata.name, {

    /* =============================================================
     *  Edit
     * ============================================================= */
    edit: ( { attributes, setAttributes } ) => {
        const {
            blockId, images,
            gapPc, gapSp,
            columnsPc, columnsSp,
            aspectRatioW, aspectRatioH,
            imgBorderRadius,
            mtPc, mbPc, mtSp, mbSp,
            maxWidth,
        } = attributes;

        /* --- blockId 確定 ---------------------------------------- */
        useEffect( () => {
            if ( ! blockId ) {
                const uid = `lw-pr-image-1-${ Date.now() }-${ Math.floor( Math.random() * 10000 ) }`;
                setAttributes( { blockId: uid } );
            }
        }, [] );

        /* --- 画像ヘルパー ---------------------------------------- */
        const updateImage = ( index, key, value ) => {
            const next = images.map( ( img, i ) =>
                i === index ? { ...img, [ key ]: value } : img
            );
            setAttributes( { images: next } );
        };

        const addImage = () => {
            if ( images.length < 20 ) {
                setAttributes( {
                    images: [ ...images, { imgUrl: '', altText: '', linkUrl: '' } ],
                } );
            }
        };

        const removeImage = ( index ) => {
            if ( images.length > 1 ) {
                setAttributes( {
                    images: images.filter( ( _, i ) => i !== index ),
                } );
            }
        };

        const moveImageUp = ( index ) => {
            if ( index === 0 ) return;
            const next = [ ...images ];
            [ next[ index - 1 ], next[ index ] ] = [ next[ index ], next[ index - 1 ] ];
            setAttributes( { images: next } );
        };

        const moveImageDown = ( index ) => {
            if ( index === images.length - 1 ) return;
            const next = [ ...images ];
            [ next[ index ], next[ index + 1 ] ] = [ next[ index + 1 ], next[ index ] ];
            setAttributes( { images: next } );
        };

        /* --- CSS変数 --------------------------------------------- */
        const cssVars = {
            '--pr-image-1-gap-pc':    `${ gapPc }px`,
            '--pr-image-1-gap-sp':    `${ gapSp }px`,
            '--pr-image-1-clm-pc':    columnsPc,
            '--pr-image-1-clm-sp':    columnsSp,
            '--pr-image-1-aspect-w':  aspectRatioW,
            '--pr-image-1-aspect-h':  aspectRatioH,
            '--pr-image-1-radius':    `${ imgBorderRadius }px`,
            '--pr-image-1-mt-pc':     `${ mtPc }px`,
            '--pr-image-1-mb-pc':     `${ mbPc }px`,
            '--pr-image-1-mt-sp':     `${ mtSp }px`,
            '--pr-image-1-mb-sp':     `${ mbSp }px`,
            '--pr-image-1-max-w':     maxWidth ? `${ maxWidth }px` : '100%',
        };

        const blockProps = useBlockProps( {
            id: blockId,
            className: 'lw-pr-image-1',
            style: cssVars,
        } );

        /* --- JSX ------------------------------------------------- */
        return (
            <>
                <InspectorControls>

                    {/* グリッド設定 */}
                    <PanelBody title="グリッド設定">
                        <RangeControl
                            label="PCカラム数"
                            value={ columnsPc }
                            onChange={ ( v ) => setAttributes( { columnsPc: v } ) }
                            min={ 1 } max={ 10 }
                        />
                        <RangeControl
                            label="SPカラム数"
                            value={ columnsSp }
                            onChange={ ( v ) => setAttributes( { columnsSp: v } ) }
                            min={ 1 } max={ 6 }
                        />
                        <RangeControl
                            label="PC間隔 (px)"
                            value={ gapPc }
                            onChange={ ( v ) => setAttributes( { gapPc: v } ) }
                            min={ 0 } max={ 60 }
                        />
                        <RangeControl
                            label="SP間隔 (px)"
                            value={ gapSp }
                            onChange={ ( v ) => setAttributes( { gapSp: v } ) }
                            min={ 0 } max={ 40 }
                        />
                    </PanelBody>

                    {/* 余白設定 */}
                    <PanelBody title="余白設定" initialOpen={ false }>
                        <RangeControl
                            label="PC 上マージン (px)"
                            value={ mtPc }
                            onChange={ ( v ) => setAttributes( { mtPc: v } ) }
                            min={ 0 } max={ 200 }
                        />
                        <RangeControl
                            label="PC 下マージン (px)"
                            value={ mbPc }
                            onChange={ ( v ) => setAttributes( { mbPc: v } ) }
                            min={ 0 } max={ 200 }
                        />
                        <RangeControl
                            label="SP 上マージン (px)"
                            value={ mtSp }
                            onChange={ ( v ) => setAttributes( { mtSp: v } ) }
                            min={ 0 } max={ 200 }
                        />
                        <RangeControl
                            label="SP 下マージン (px)"
                            value={ mbSp }
                            onChange={ ( v ) => setAttributes( { mbSp: v } ) }
                            min={ 0 } max={ 200 }
                        />
                        <RangeControl
                            label="最大幅 (px)　※0で100%"
                            value={ maxWidth }
                            onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
                            min={ 0 } max={ 1600 }
                        />
                    </PanelBody>

                    {/* アスペクト比 */}
                    <PanelBody title="アスペクト比" initialOpen={ false }>
                        <RangeControl
                            label="横 (W)"
                            value={ aspectRatioW }
                            onChange={ ( v ) => setAttributes( { aspectRatioW: v } ) }
                            min={ 1 } max={ 500 }
                        />
                        <RangeControl
                            label="縦 (H)"
                            value={ aspectRatioH }
                            onChange={ ( v ) => setAttributes( { aspectRatioH: v } ) }
                            min={ 1 } max={ 500 }
                        />
                    </PanelBody>

                    {/* 角丸 */}
                    <PanelBody title="角丸" initialOpen={ false }>
                        <RangeControl
                            label="角丸 (px)"
                            value={ imgBorderRadius }
                            onChange={ ( v ) => setAttributes( { imgBorderRadius: v } ) }
                            min={ 0 } max={ 100 }
                        />
                    </PanelBody>

                    {/* 画像管理 */}
                    <PanelBody title="画像管理" initialOpen>
                        <Button
                            variant="secondary"
                            onClick={ addImage }
                            disabled={ images.length >= 20 }
                        >
                            画像を追加（最大20枚）
                        </Button>

                        { images.map( ( img, index ) => (
                            <div key={ index } style={ { border: '1px solid #ddd', padding: '10px', marginTop: '10px' } }>
                                <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } }>
                                    <strong>画像 { index + 1 }</strong>
                                    <div style={ { display: 'flex', gap: '4px' } }>
                                        <Button
                                            variant="secondary"
                                            onClick={ () => moveImageUp( index ) }
                                            disabled={ index === 0 }
                                            style={ { width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' } }
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={ () => moveImageDown( index ) }
                                            disabled={ index === images.length - 1 }
                                            style={ { width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' } }
                                        >
                                            ↓
                                        </Button>
                                    </div>
                                </div>

                                <MediaUpload
                                    onSelect={ ( media ) => updateImage( index, 'imgUrl', media.url ) }
                                    allowedTypes={ [ 'image' ] }
                                    render={ ( { open } ) => (
                                        <>
                                            { img.imgUrl ? (
                                                <div>
                                                    <img src={ img.imgUrl } alt="" style={ { maxWidth: '100%' } } />
                                                    <Button onClick={ open } variant="secondary" style={ { marginTop: '10px' } }>画像を変更</Button>
                                                    <Button onClick={ () => updateImage( index, 'imgUrl', '' ) } variant="secondary" style={ { marginLeft: '10px', marginTop: '10px' } }>削除</Button>
                                                </div>
                                            ) : (
                                                <Button onClick={ open } variant="secondary">画像を選択</Button>
                                            ) }
                                        </>
                                    ) }
                                />

                                <TextControl
                                    label="altテキスト"
                                    value={ img.altText }
                                    onChange={ ( v ) => updateImage( index, 'altText', v ) }
                                    style={ { marginTop: '8px' } }
                                />
                                <TextControl
                                    label="リンク先URL（任意）"
                                    value={ img.linkUrl }
                                    onChange={ ( v ) => updateImage( index, 'linkUrl', v ) }
                                />

                                <Button
                                    isDestructive
                                    onClick={ () => removeImage( index ) }
                                    disabled={ images.length <= 1 }
                                    style={ { marginTop: '10px' } }
                                >
                                    この画像を削除
                                </Button>
                            </div>
                        ) ) }
                    </PanelBody>

                </InspectorControls>

                {/* エディタープレビュー */}
                <div { ...blockProps }>
                    <div className="lw-pr-image-1__wrap">
                        { images.map( ( img, i ) => (
                            <div className="lw-pr-image-1__item" key={ i }>
                                { img.imgUrl ? (
                                    <img src={ img.imgUrl } alt={ img.altText } />
                                ) : (
                                    <div style={ {
                                        width: '100%',
                                        height: '100%',
                                        background: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: '#999',
                                    } }>
                                        No Image
                                    </div>
                                ) }
                            </div>
                        ) ) }
                    </div>
                </div>
            </>
        );
    },

    /* =============================================================
     *  Save
     * ============================================================= */
    save: ( { attributes } ) => {
        const {
            blockId, images,
            gapPc, gapSp,
            columnsPc, columnsSp,
            aspectRatioW, aspectRatioH,
            imgBorderRadius,
            mtPc, mbPc, mtSp, mbSp,
            maxWidth,
        } = attributes;

        const cssVars = {
            '--pr-image-1-gap-pc':    `${ gapPc }px`,
            '--pr-image-1-gap-sp':    `${ gapSp }px`,
            '--pr-image-1-clm-pc':    columnsPc,
            '--pr-image-1-clm-sp':    columnsSp,
            '--pr-image-1-aspect-w':  aspectRatioW,
            '--pr-image-1-aspect-h':  aspectRatioH,
            '--pr-image-1-radius':    `${ imgBorderRadius }px`,
            '--pr-image-1-mt-pc':     `${ mtPc }px`,
            '--pr-image-1-mb-pc':     `${ mbPc }px`,
            '--pr-image-1-mt-sp':     `${ mtSp }px`,
            '--pr-image-1-mb-sp':     `${ mbSp }px`,
            '--pr-image-1-max-w':     maxWidth ? `${ maxWidth }px` : '100%',
        };

        const blockProps = useBlockProps.save( {
            id: blockId,
            className: 'lw-pr-image-1',
            style: cssVars,
        } );

        /* imgUrl が無いアイテムはスキップ */
        const validImages = images.filter( ( img ) => img.imgUrl );

        return (
            <div { ...blockProps }>
                <div className="lw-pr-image-1__wrap">
                    { validImages.map( ( img, i ) => {
                        const imgTag = <img src={ img.imgUrl } alt={ img.altText } />;
                        return (
                            <div className="lw-pr-image-1__item" key={ i }>
                                { img.linkUrl ? (
                                    <a href={ img.linkUrl } target="_blank" rel="noopener noreferrer">
                                        { imgTag }
                                    </a>
                                ) : imgTag }
                            </div>
                        );
                    } ) }
                </div>
            </div>
        );
    },
} );
