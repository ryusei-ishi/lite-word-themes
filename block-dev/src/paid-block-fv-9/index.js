/*************************************************************************
 * LiteWord – Paid Block  FV 09 : full‑width / fixed‑width Swiper slider *
 * 2025‑04‑17 改訂版                                                     *
 ************************************************************************/
import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    SelectControl,
    TextControl,
    Button,
    ColorPicker
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';

import './style.scss';
import './editor.scss';

// ★ HTTPをHTTPSに変換するヘルパー関数を追加
const ensureHttps = (url) => {
    if (!url) return url;
    
    // 現在のページがHTTPSで、URLがHTTPの場合のみ変換
    if (window.location.protocol === 'https:' && url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    
    // プロトコル相対URLに変換する方法も可能
    // return url.replace(/^https?:/, '');
    
    return url;
};

registerBlockType('wdl/paid-block-fv-9', {
    title: 'FV 09 画像スライダー用ブロック',
    icon: 'images-alt2',
    category: 'liteword-banner',

    // ------------------------------------------------------------------
    // ▶ Attributes
    // ------------------------------------------------------------------
    attributes: {
        // ★唯一無二のID
        blockId: { type: 'string' },

        // スライドの配列（最大20枚）
        slides: {
            type: 'array',
            default: [
                {
                    pcImgUrl: 'https://lite-word.com/sample_img/slide/1.webp',
                    spImgUrl: '',
                    altText: 'スライド1のalt',
                    linkUrl: ''
                },
                {
                    pcImgUrl: 'https://lite-word.com/sample_img/slide/2.webp',
                    spImgUrl: '',
                    altText: 'スライド2のalt',
                    linkUrl: ''
                }
            ]
        },

        // レイアウト
        layoutType: { type: 'string', default: 'full' }, // 'full' | 'fixed'
        maxWidth:   { type: 'number', default: 1200 },

        // Swiper 設定
        autoplayDelay:        { type: 'number',  default: 3000 },
        sliderEffect:         { type: 'string',  default: 'fade' }, // 'fade' | 'slide'
        crossFade:            { type: 'boolean', default: true },
        loop:                 { type: 'boolean', default: true },
        disableOnInteraction: { type: 'boolean', default: false },
        showPagination:       { type: 'boolean', default: true },
        paginationClickable:  { type: 'boolean', default: true },
        showNavigation:       { type: 'boolean', default: true },
        sliderSpeed:          { type: 'number',  default: 1000 },

        // カラー
        paginationColor: { type: 'string', default: '#ffffff' },
        nextButtonColor: { type: 'string', default: '#ffffff' }
    },

    // ------------------------------------------------------------------
    // ▶ Edit
    // ------------------------------------------------------------------
    edit: ( { attributes, setAttributes } ) => {
        const {
            blockId, slides,
            layoutType, maxWidth,
            autoplayDelay, sliderEffect, crossFade,
            loop, disableOnInteraction,
            showPagination, paginationClickable,
            showNavigation, sliderSpeed,
            paginationColor, nextButtonColor
        } = attributes;

        /* ID を確定させる ------------------------------------------------*/
        useEffect( () => {
            if ( !blockId ) {
                const uniqueId =
                    `paid-block-fv-9-${ Date.now() }-${ Math.floor( Math.random() * 10000 ) }`;
                setAttributes( { blockId: uniqueId } );
            }
        }, [] );

        /* スライド編集ヘルパー ----------------------------------------*/
        const updateSlide = ( index, key, value ) => {
            // ★ URL更新時はHTTPS変換を適用
            const processedValue = (key === 'pcImgUrl' || key === 'spImgUrl') 
                ? ensureHttps(value) 
                : value;
                
            const newSlides = slides.map( ( slide, i ) =>
                i === index ? { ...slide, [key]: processedValue } : slide
            );
            setAttributes( { slides: newSlides } );
        };

        const addSlide = () => {
            if ( slides.length < 20 ) {
                setAttributes( {
                    slides: [
                        ...slides,
                        { pcImgUrl: '', spImgUrl: '', altText: '', linkUrl: '' }
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

        /* --------------------------------------------------------------*/
        /* Gutenberg サイドバー                                           */
        /* --------------------------------------------------------------*/
        return (
            <Fragment>
                <InspectorControls>
                    {/* --- マニュアル ------------------------------------ */}
                    <PanelBody title="マニュアル">
                        <Button
                            variant="secondary"
                            href="https://www.youtube.com/watch?v=tCEO9QA-hCI"
                            target="_blank"
                        >
                            このブロックの使い方はこちら
                        </Button>
                    </PanelBody>

                    {/* --- レイアウト設定 -------------------------------- */}
                    <PanelBody title="レイアウト設定">
                        <SelectControl
                            label="幅の設定"
                            value={ layoutType }
                            options={ [
                                { label: '固定幅', value: 'fixed' },
                                { label: '画面いっぱい（固定ページの時のみ）', value: 'full' }
                            ] }
                            onChange={ ( v ) => setAttributes( { layoutType: v } ) }
                        />
                        { layoutType === 'fixed' && (
                            <RangeControl
                                label="最大横幅 (px)"
                                value={ maxWidth }
                                onChange={ ( v ) => setAttributes( { maxWidth: v } ) }
                                min={ 600 }
                                max={ 2000 }
                                step={ 10 }
                            />
                        ) }
                    </PanelBody>

                    {/* --- スライド画像 ---------------------------------- */}
                    <PanelBody title="スライド画像" initialOpen>
                        <Button
                            variant="secondary"
                            onClick={ addSlide }
                            disabled={ slides.length >= 20 }
                        >
                            スライドを追加 (最大20枚)
                        </Button>

                        { slides.map( ( slide, index ) => (
                            <div key={ index } style={ { border:'1px solid #ddd',padding:'10px',marginTop:'10px' } }>
                                <p><strong>スライド { index + 1 }</strong></p>

                                {/* PC画像 */}
                                <MediaUpload
                                    onSelect={ (media) => {
                                        // ★ HTTPS変換を適用
                                        const secureUrl = ensureHttps(media.url);
                                        updateSlide(index, 'pcImgUrl', secureUrl);
                                    }}
                                    allowedTypes={ ['image'] }
                                    render={ ( { open } ) => (
                                        <>
                                            <p>PC用画像</p>
                                            { slide.pcImgUrl ? (
                                                <div>
                                                    <img src={ ensureHttps(slide.pcImgUrl) } alt="" style={ { maxWidth:'100%' } } />
                                                    <Button onClick={ open } variant="secondary" style={ { marginTop:'10px' } }>画像を変更</Button>
                                                    <Button onClick={ ()=>updateSlide(index,'pcImgUrl','') } variant="secondary" style={ { marginLeft:'10px',marginTop:'10px' } }>削除</Button>
                                                </div>
                                            ) : (
                                                <Button onClick={ open } variant="secondary">画像を選択</Button>
                                            ) }
                                        </>
                                    ) }
                                />

                                {/* SP画像 */}
                                <MediaUpload
                                    onSelect={ (m) => {
                                        // ★ HTTPS変換を適用
                                        const secureUrl = ensureHttps(m.url);
                                        updateSlide(index, 'spImgUrl', secureUrl);
                                    }}
                                    allowedTypes={ ['image'] }
                                    render={ ( { open } ) => (
                                        <>
                                            <br /><p>スマホ用画像(任意)</p>
                                            { slide.spImgUrl ? (
                                                <div>
                                                    <img src={ ensureHttps(slide.spImgUrl) } alt="" style={ { maxWidth:'100%' } } />
                                                    <Button onClick={ open } variant="secondary" style={ { marginTop:'10px' } }>画像を変更</Button>
                                                    <Button onClick={ ()=>updateSlide(index,'spImgUrl','') } variant="secondary" style={ { marginLeft:'10px',marginTop:'10px' } }>削除</Button>
                                                </div>
                                            ) : (
                                                <Button onClick={ open } variant="secondary">画像を選択</Button>
                                            ) }
                                        </>
                                    ) }
                                />

                                <br /><br />
                                <TextControl
                                    label="altテキスト"
                                    value={ slide.altText }
                                    onChange={ (v)=>updateSlide(index,'altText',v) }
                                />
                                <TextControl
                                    label="リンク先URL (任意)"
                                    value={ slide.linkUrl }
                                    onChange={ (v)=>updateSlide(index,'linkUrl',v) }
                                />

                                <Button
                                    isDestructive
                                    onClick={ ()=>removeSlide(index) }
                                    disabled={ slides.length<=1 }
                                    style={ { marginTop:'10px' } }
                                >
                                    このスライドを削除
                                </Button>
                            </div>
                        ) ) }
                    </PanelBody>

                    {/* --- スライダー詳細設定 ---------------------------- */}
                    <PanelBody title="スライダーの詳細設定" initialOpen={ false }>
                        <RangeControl
                            label="オートプレイの遅延 (ミリ秒)"
                            value={ autoplayDelay }
                            onChange={ (v)=>setAttributes({ autoplayDelay:v }) }
                            min={ 100 } max={ 10000 } step={ 100 }
                        />
                        <RangeControl
                            label="切り替え速度 (ミリ秒)"
                            value={ sliderSpeed }
                            onChange={ (v)=>setAttributes({ sliderSpeed:v }) }
                            min={ 100 } max={ 5000 } step={ 100 }
                        />
                        <SelectControl
                            label="スライダーのエフェクト"
                            value={ sliderEffect }
                            options={ [
                                { label:'フェード', value:'fade' },
                                { label:'スライド', value:'slide' }
                            ] }
                            onChange={ (v)=>setAttributes({ sliderEffect:v }) }
                        />
                        { sliderEffect==='fade' && (
                            <ToggleControl
                                label="CrossFadeを有効にする"
                                checked={ crossFade }
                                onChange={ (v)=>setAttributes({ crossFade:v }) }
                            />
                        ) }
                        <ToggleControl
                            label="ループ再生"
                            checked={ loop }
                            onChange={ (v)=>setAttributes({ loop:v }) }
                        />
                        <ToggleControl
                            label="ユーザー操作でオートプレイ停止"
                            help="true にするとユーザー操作後に自動再生が止まります"
                            checked={ disableOnInteraction }
                            onChange={ (v)=>setAttributes({ disableOnInteraction:v }) }
                        />
                    </PanelBody>

                    {/* --- ページネーション / ナビ ----------------------- */}
                    <PanelBody title="ページネーション/ナビゲーション">
                        <ToggleControl
                            label="ページネーションを表示"
                            checked={ showPagination }
                            onChange={ (v)=>setAttributes({ showPagination:v }) }
                        />
                        { showPagination && (
                            <>
                                <ToggleControl
                                    label="ページネーションをクリック可能にする"
                                    checked={ paginationClickable }
                                    onChange={ (v)=>setAttributes({ paginationClickable:v }) }
                                />
                                <p>ページネーションの色</p>
                                <ColorPicker
                                    color={ paginationColor }
                                    onChangeComplete={ (c)=>setAttributes({ paginationColor:c.hex }) }
                                    disableAlpha
                                />
                            </>
                        ) }

                        <ToggleControl
                            label="前へ/次へボタンを表示"
                            checked={ showNavigation }
                            onChange={ (v)=>setAttributes({ showNavigation:v }) }
                        />
                        { showNavigation && (
                            <>
                                <p>前へ/次へボタンの色</p>
                                <ColorPicker
                                    color={ nextButtonColor }
                                    onChangeComplete={ (c)=>setAttributes({ nextButtonColor:c.hex }) }
                                    disableAlpha
                                />
                            </>
                        ) }
                    </PanelBody>
                </InspectorControls>

                {/* -------------------------------------------------- */}
                {/* エディター内プレビュー                              */}
                {/* -------------------------------------------------- */}
                <div
                    id={ blockId }
                    className={
                        layoutType==='full'
                            ? 'swiper paid-block-fv-9 max-w'
                            : 'swiper paid-block-fv-9'
                    }
                    style={ layoutType==='fixed' ? { maxWidth } : {} }
                >
                    <div className="swiper-wrapper">
                        { slides.map( ( slide, i ) => {
                            // ★ HTTPS変換を適用
                            const pcImg = ensureHttps(slide.pcImgUrl);
                            const spImg = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
                            
                            return (
                                <div className="swiper-slide" key={ i } style={ { textAlign:'center' } }>
                                    <picture className="bg_img">
                                        <source srcSet={ spImg } media="(max-width:800px)" />
                                        <source srcSet={ pcImg } media="(min-width:801px)" />
                                        <img src={ pcImg } alt={ slide.altText } />
                                    </picture>
                                </div>
                            );
                        } ) }
                    </div>
                    { showPagination && <div className="swiper-pagination"></div> }
                    { showNavigation && <div className="swiper-button-next"></div> }
                </div>

                {/* ページネーション/ナビの色をエディターに反映 */}
                { showPagination && paginationColor && (
                    <style>{`
                        #${ blockId } .swiper-pagination-bullet { background-color:${ paginationColor }; }
                        #${ blockId } .swiper-button-next,
                        #${ blockId } .swiper-button-prev { color:${ nextButtonColor }; }
                    `}</style>
                ) }
            </Fragment>
        );
    },

    // ------------------------------------------------------------------
    // ▶ Save
    // ------------------------------------------------------------------
    save: ( { attributes } ) => {
        const {
            blockId, slides,
            layoutType, maxWidth,
            autoplayDelay, sliderEffect, crossFade,
            loop, disableOnInteraction,
            showPagination, paginationClickable,
            showNavigation, sliderSpeed,
            paginationColor, nextButtonColor
        } = attributes;

        /* ---------- Swiper 設定文字列（observer 追加） ---------------*/
        const swiperConfig = `
(function(){
    const selector = "#${ blockId }";
    const MAX_RETRY = 30; // 30 × 150ms = 4.5s
    let retry = 0;

    const initSwiper = () => {
        if ( typeof Swiper === "undefined" ) return false;
        const already = document.querySelector(selector).swiper;
        if ( already ) return true; // 二重初期化しない

        const config = {
            loop: ${ loop },
            effect: "${ sliderEffect }",
            speed: ${ sliderSpeed },
            autoplay: {
                delay: ${ autoplayDelay },
                disableOnInteraction: ${ disableOnInteraction }
            },
            observer: true,
            observeParents: true,
            ${ sliderEffect === 'fade' ? `fadeEffect: { crossFade: ${ crossFade } },` : '' }
            ${ showPagination ? `
                pagination: {
                    el: selector + " .swiper-pagination",
                    clickable: ${ paginationClickable }
                },` : '' }
            ${ showNavigation ? `
                navigation: {
                    nextEl: selector + " .swiper-button-next",
                    prevEl: selector + " .swiper-button-prev"
                },` : '' }
        };
        new Swiper( selector, config );
        document.querySelector(selector).classList.remove("init-hide");
        return true;
    };

    /* ① DOMContentLoaded 直後 */
    document.addEventListener("DOMContentLoaded", initSwiper, { once:true });

    /* ② lw:swiperReady (既存仕組み維持) */
    window.addEventListener("lw:swiperReady", initSwiper, { once:true });

    /* ③ ポーリング（Swiper読み込み遅延対策） */
    const timer = setInterval(() => {
        if ( initSwiper() || ++retry >= MAX_RETRY ) clearInterval(timer);
    }, 150);

    /* ④ それでも失敗したら 5s で init-hide を解除し static 画像表示 */
    setTimeout(() => {
        const el = document.querySelector(selector);
        if ( el ) el.classList.remove("init-hide");
    }, 5000);
})();
        `;

        /* ---------- JSX 出力 -----------------------------------------*/
        return (
            <div
                id={ blockId }
                className={
                    layoutType==='full'
                        ? 'swiper paid-block-fv-9 max-w init-hide'
                        : 'swiper paid-block-fv-9 init-hide'
                }
                style={ layoutType==='fixed' ? { maxWidth } : { maxWidth:'100vw' } }
            >
                <div className="swiper-wrapper">
                    { slides.map( ( slide, i ) => {
                        // ★ フロントエンドでもHTTPS変換を適用（念のため）
                        const pcImgUrl = ensureHttps(slide.pcImgUrl);
                        const spImgUrl = ensureHttps(slide.spImgUrl || slide.pcImgUrl);
                        
                        const picture = (
                            <picture className="bg_img">
                                <source srcSet={ spImgUrl } media="(max-width:800px)" />
                                <source srcSet={ pcImgUrl } media="(min-width:801px)" />
                                <img src={ pcImgUrl } alt={ slide.altText } />
                            </picture>
                        );
                        return (
                            <div className="swiper-slide" key={ i }>
                                { slide.linkUrl ? (
                                    <a href={ slide.linkUrl } target="_blank" rel="noopener noreferrer">
                                        { picture }
                                    </a>
                                ) : picture }
                            </div>
                        );
                    } ) }
                </div>

                {/* ページネーション / ナビ */}
                { showPagination && <div className="swiper-pagination"></div> }
                { showNavigation && <div className="swiper-button-prev"></div> }
                { showNavigation && <div className="swiper-button-next"></div> }

                {/* Swiper 初期化スクリプト */}
                <script type="text/javascript" dangerouslySetInnerHTML={ { __html: swiperConfig } } />

                {/* 色カスタマイズ */}
                { showPagination && paginationColor && (
                    <style>{`
                        #${ blockId } .swiper-pagination-bullet { background-color:${ paginationColor }; }
                        #${ blockId } .swiper-button-next,
                        #${ blockId } .swiper-button-prev { color:${ nextButtonColor }; }
                    `}</style>
                )}

                {/* JS が完全にオフの環境向けフォールバック */}
                <noscript>
                    <style>{`#${ blockId }{opacity:1!important}`}</style>
                </noscript>
            </div>
        );
    }
});