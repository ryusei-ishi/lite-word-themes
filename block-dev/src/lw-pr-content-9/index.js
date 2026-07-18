/*************************************************************************
 * LiteWord – lw-pr-content-9 : カードスライダー（Swiper）              *
 ************************************************************************/
import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    TextareaControl,
    ToggleControl,
    Button,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    // ------------------------------------------------------------------
    // ▶ Edit
    // ------------------------------------------------------------------
    edit: ( { attributes, setAttributes } ) => {
        const { blockId, slides, autoplay } = attributes;

        /* ID を確定させる -----------------------------------------------*/
        useEffect( () => {
            if ( !blockId ) {
                const uniqueId =
                    `lw-pr-content-9-${ Date.now() }-${ Math.floor( Math.random() * 10000 ) }`;
                setAttributes( { blockId: uniqueId } );
            }
        }, [] );

        /* スライド編集ヘルパー -----------------------------------------*/
        const updateSlide = ( index, key, value ) => {
            const newSlides = slides.map( ( slide, i ) =>
                i === index ? { ...slide, [key]: value } : slide
            );
            setAttributes( { slides: newSlides } );
        };

        const addSlide = () => {
            if ( slides.length < 20 ) {
                setAttributes( {
                    slides: [
                        ...slides,
                        { imgUrl: '', altText: '', title: 'タイトルテキスト', description: '説明テキストが入ります。', linkUrl: '', openNewTab: false }
                    ]
                } );
            }
        };

        const removeSlide = ( index ) => {
            if ( slides.length > 1 ) {
                setAttributes( {
                    slides: slides.filter( ( _, i ) => i !== index )
                } );
            }
        };

        const moveSlideUp = ( index ) => {
            if ( index === 0 ) return;
            const newSlides = [ ...slides ];
            [ newSlides[ index - 1 ], newSlides[ index ] ] = [ newSlides[ index ], newSlides[ index - 1 ] ];
            setAttributes( { slides: newSlides } );
        };

        const moveSlideDown = ( index ) => {
            if ( index === slides.length - 1 ) return;
            const newSlides = [ ...slides ];
            [ newSlides[ index ], newSlides[ index + 1 ] ] = [ newSlides[ index + 1 ], newSlides[ index ] ];
            setAttributes( { slides: newSlides } );
        };

        const blockProps = useBlockProps({
            id: blockId,
            className: 'lw-pr-content-9',
        });

        /* ----------------------------------------------------------*/
        /* Gutenberg サイドバー                                       */
        /* ----------------------------------------------------------*/
        return (
            <>
                <InspectorControls>

                    {/* --- スライダー設定 -------------------------------- */}
                    <PanelBody title="スライダー設定" initialOpen>
                        <ToggleControl
                            label="自動再生"
                            checked={ autoplay }
                            onChange={ (v)=>setAttributes({ autoplay:v }) }
                        />
                    </PanelBody>

                    {/* --- スライド管理 ---------------------------------- */}
                    <PanelBody title="スライド管理" initialOpen>
                        <Button
                            variant="secondary"
                            onClick={ addSlide }
                            disabled={ slides.length >= 20 }
                        >
                            スライドを追加 (最大20枚)
                        </Button>

                        { slides.map( ( slide, index ) => (
                            <div key={ index } style={ { border:'1px solid #ddd', padding:'10px', marginTop:'10px' } }>
                                <div style={ { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' } }>
                                    <strong>スライド { index + 1 }</strong>
                                    <div style={ { display:'flex', gap:'4px' } }>
                                        <Button
                                            variant="secondary"
                                            onClick={ ()=>moveSlideUp(index) }
                                            disabled={ index === 0 }
                                            style={ { width:'32px', height:'32px', padding:'0', display:'flex', alignItems:'center', justifyContent:'center' } }
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={ ()=>moveSlideDown(index) }
                                            disabled={ index === slides.length - 1 }
                                            style={ { width:'32px', height:'32px', padding:'0', display:'flex', alignItems:'center', justifyContent:'center' } }
                                        >
                                            ↓
                                        </Button>
                                    </div>
                                </div>

                                {/* 画像 */}
                                <MediaUpload
                                    onSelect={ (media)=>updateSlide(index,'imgUrl',media.url) }
                                    allowedTypes={ ['image'] }
                                    render={ ( { open } ) => (
                                        <>
                                            <p>画像</p>
                                            { slide.imgUrl ? (
                                                <div>
                                                    <img src={ slide.imgUrl } alt="" style={ { maxWidth:'100%' } } />
                                                    <Button onClick={ open } variant="secondary" style={ { marginTop:'10px' } }>画像を変更</Button>
                                                    <Button onClick={ ()=>updateSlide(index,'imgUrl','') } variant="secondary" style={ { marginLeft:'10px', marginTop:'10px' } }>削除</Button>
                                                </div>
                                            ) : (
                                                <Button onClick={ open } variant="secondary">画像を選択</Button>
                                            ) }
                                        </>
                                    ) }
                                />

                                <br />
                                <TextControl
                                    label="altテキスト"
                                    value={ slide.altText }
                                    onChange={ (v)=>updateSlide(index,'altText',v) }
                                />
                                <TextareaControl
                                    label="タイトル (h3)"
                                    value={ slide.title }
                                    onChange={ (v)=>updateSlide(index,'title',v) }
                                />
                                <TextareaControl
                                    label="説明文"
                                    value={ slide.description }
                                    onChange={ (v)=>updateSlide(index,'description',v) }
                                />
                                <TextControl
                                    label="リンク先URL (任意)"
                                    value={ slide.linkUrl }
                                    onChange={ (v)=>updateSlide(index,'linkUrl',v) }
                                />
                                { slide.linkUrl && (
                                    <ToggleControl
                                        label="新規タブで開く"
                                        checked={ slide.openNewTab }
                                        onChange={ (v)=>updateSlide(index,'openNewTab',v) }
                                    />
                                ) }

                                <Button
                                    isDestructive
                                    onClick={ ()=>removeSlide(index) }
                                    disabled={ slides.length <= 1 }
                                    style={ { marginTop:'10px' } }
                                >
                                    このスライドを削除
                                </Button>
                            </div>
                        ) ) }
                    </PanelBody>

                </InspectorControls>

                {/* -------------------------------------------------- */}
                {/* エディター内プレビュー                            */}
                {/* -------------------------------------------------- */}
                <div {...blockProps}>
                    <div className="lw-pr-content-9__wrap">
                        <div className="lw-pr-content-9-swiper" style={ { display:'flex', gap:'24px', overflow:'hidden' } }>
                            { slides.map( ( slide, i ) => (
                                <div key={ i } style={ { flex:'0 0 calc(25% - 18px)', minWidth:'0' } }>
                                    <div className="item">
                                        <div className="image">
                                            { slide.imgUrl
                                                ? <img src={ slide.imgUrl } alt={ slide.altText } />
                                                : <div style={ { background:'#eee', width:'100%', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'14px' } }>画像未設定</div>
                                            }
                                        </div>
                                        <h3>{ slide.title }</h3>
                                        <p>{ slide.description }</p>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </div>
            </>
        );
    },

    // ------------------------------------------------------------------
    // ▶ Save
    // ------------------------------------------------------------------
    save: ( { attributes } ) => {
        const { blockId, slides, autoplay } = attributes;

        /* 改行を <br> に変換するヘルパー */
        const nl2br = ( text ) => {
            if ( !text ) return null;
            return text.split( '\n' ).reduce( ( acc, line, i ) => {
                if ( i > 0 ) acc.push( <br key={ `br-${ i }` } /> );
                acc.push( line );
                return acc;
            }, [] );
        };

        const blockProps = useBlockProps.save({
            id: blockId,
            className: 'lw-pr-content-9 init-hide',
        });

        /* ---------- Swiper 設定文字列 --------------------------------*/
        const swiperConfig = `
(function(){
    var selector = "#${ blockId } .lw-pr-content-9-swiper";
    var MAX_RETRY = 30;
    var retry = 0;

    function initSwiper(){
        if ( typeof Swiper === "undefined" ) return false;
        var el = document.querySelector(selector);
        if ( !el ) return false;
        if ( el.swiper ) return true;

        new Swiper( selector, {
            slidesPerView: 4,
            spaceBetween: 24,
            loop: true,
            ${ autoplay ? 'autoplay: { delay: 3000, disableOnInteraction: true },' : '' }
            pagination: {
                el: selector + " .swiper-pagination",
                clickable: true
            },
            observer: true,
            observeParents: true,
            breakpoints: {
                0:    { slidesPerView: 1, spaceBetween: 24 },
                576:  { slidesPerView: 2, spaceBetween: 20 },
                992:  { slidesPerView: 3, spaceBetween: 24 },
                1200: { slidesPerView: 4, spaceBetween: 24 }
            }
        });
        document.querySelector("#${ blockId }").classList.remove("init-hide");
        return true;
    }

    document.addEventListener("DOMContentLoaded", initSwiper, { once:true });
    window.addEventListener("lw:swiperReady", initSwiper, { once:true });

    var timer = setInterval(function(){
        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);
    }, 150);

    setTimeout(function(){
        var el = document.querySelector("#${ blockId }");
        if ( el ) el.classList.remove("init-hide");
    }, 5000);
})();
        `;

        /* ---------- JSX 出力 ----------------------------------------*/
        return (
            <div {...blockProps}>
                <div className="lw-pr-content-9__wrap">
                    <div className="swiper lw-pr-content-9-swiper">
                        <div className="swiper-wrapper">
                            { slides.map( ( slide, i ) => {
                                const innerContent = (
                                    <>
                                        <div className="image">
                                            { slide.imgUrl && (
                                                <img src={ slide.imgUrl } alt={ slide.altText } />
                                            ) }
                                        </div>
                                        <h3>{ nl2br( slide.title ) }</h3>
                                        <p>{ nl2br( slide.description ) }</p>
                                    </>
                                );
                                return (
                                    <div className="swiper-slide" key={ i }>
                                        { slide.linkUrl ? (
                                            <a
                                                className="item"
                                                href={ slide.linkUrl }
                                                target={ slide.openNewTab ? '_blank' : undefined }
                                                rel={ slide.openNewTab ? 'noopener noreferrer' : undefined }
                                            >
                                                { innerContent }
                                            </a>
                                        ) : (
                                            <div className="item">
                                                { innerContent }
                                            </div>
                                        ) }
                                    </div>
                                );
                            } ) }
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </div>

                {/* Swiper 初期化スクリプト */}
                <script type="text/javascript" dangerouslySetInnerHTML={ { __html: swiperConfig } } />

                {/* JS が完全にオフの環境向けフォールバック */}
                <noscript>
                    <style>{`#${ blockId }{opacity:1!important}`}</style>
                </noscript>
            </div>
        );
    },
});
