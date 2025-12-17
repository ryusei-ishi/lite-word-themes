/*************************************************************************
 * LiteWord – Paid Block  FV 11 : full-width / fixed-width Swiper slider *
 * 2025-04-17 ＋ min-height ＆ リッチテキスト/CTA 対応版（2025-06-08）       *
 * ★ 2025-06-08 update : CTAボタン表示／非表示トグルを追加                 *
 * ★ 2025-06-08 update : image_filter の色・透明度をサイドバーで変更可に  *
 ************************************************************************/
import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    RichText,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    SelectControl,
    TextControl,
    Button,
    ColorPicker,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import {
    minHeightPcClassOptionArr,
    minHeightTbClassOptionArr,
    minHeightSpClassOptionArr,
} from '../utils.js';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
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
            paginationColor, nextButtonColor,
            /* ★ 追加属性 */
            minHeightPc, minHeightTb, minHeightSp,
            subTitle, mainTitle, descriptionText,
            buttonLabel, ctaLinkUrl, ctaOpenNewTab,
            showCtaButton,
            filterColor, filterOpacity,
        } = attributes;

        /* ID を確定させる --------------------------------------------*/
        useEffect( () => {
            if ( !blockId ) {
                const uniqueId =
                    `paid-block-fv-11-${ Date.now() }-${ Math.floor( Math.random() * 10000 ) }`;
                setAttributes( { blockId: uniqueId } );
            }
        }, [] );

        /* スライド編集ヘルパー --------------------------------------*/
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
            className: `${layoutType === 'full'
                ? 'swiper paid-block-fv-11 max-w'
                : 'swiper paid-block-fv-11'} ${minHeightPc} ${minHeightTb} ${minHeightSp}`,
            style: layoutType === 'fixed' ? { maxWidth } : {}
        });

        /* ----------------------------------------------------------*/
        /* Gutenberg サイドバー                                       */
        /* ----------------------------------------------------------*/
        return (
            <>
                <InspectorControls>

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

                    {/* --- 高さ設定（★追加） ---------------------------- */}
                    <PanelBody title="高さ設定" initialOpen={ false }>
                        <p>PC用高さ</p>
                        <SelectControl
                            value={ minHeightPc }
                            options={ minHeightPcClassOptionArr() }
                            onChange={ (v)=>setAttributes({ minHeightPc:v }) }
                        />
                        <p>タブレット用高さ</p>
                        <SelectControl
                            value={ minHeightTb }
                            options={ minHeightTbClassOptionArr() }
                            onChange={ (v)=>setAttributes({ minHeightTb:v }) }
                        />
                        <p>スマートフォン用高さ</p>
                        <SelectControl
                            value={ minHeightSp }
                            options={ minHeightSpClassOptionArr() }
                            onChange={ (v)=>setAttributes({ minHeightSp:v }) }
                        />
                    </PanelBody>
                    {/* --- フィルター設定（★追加） ----------------------- */}
                    <PanelBody title="画像フィルター設定" initialOpen={ false }>
                        <p>フィルターカラー</p>
                        <ColorPicker
                            color={ filterColor }
                            onChangeComplete={ (c)=>setAttributes({ filterColor:c.hex }) }
                            disableAlpha
                        />
                        <RangeControl
                            label="フィルター透明度 (0–100%)"
                            value={ filterOpacity * 100 }
                            onChange={ (v)=>setAttributes({ filterOpacity:v/100 }) }
                            min={ 0 } max={ 100 } step={ 1 }
                        />
                    </PanelBody>
                    {/* --- CTA 設定（★追加） --------------------------- */}
                    <PanelBody title="CTA 設定">
                        <ToggleControl
                            label="CTAボタンを表示する"
                            checked={ showCtaButton }
                            onChange={ (v)=>setAttributes({ showCtaButton:v }) }
                        />
                        { showCtaButton && (
                            <>
                                <TextControl
                                    label="CTAリンク先 URL"
                                    value={ ctaLinkUrl }
                                    onChange={ (v)=>setAttributes({ ctaLinkUrl:v }) }
                                />
                                <ToggleControl
                                    label="新規タブで開く"
                                    checked={ ctaOpenNewTab }
                                    onChange={ (v)=>setAttributes({ ctaOpenNewTab:v }) }
                                />
                            </>
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

                                {/* PC画像 */}
                                <MediaUpload
                                    onSelect={ (media)=>updateSlide(index,'pcImgUrl',media.url) }
                                    allowedTypes={ ['image'] }
                                    render={ ( { open } ) => (
                                        <>
                                            <p>PC用画像</p>
                                            { slide.pcImgUrl ? (
                                                <div>
                                                    <img src={ slide.pcImgUrl } alt="" style={ { maxWidth:'100%' } } />
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
                                    onSelect={ (m)=>updateSlide(index,'spImgUrl',m.url) }
                                    allowedTypes={ ['image'] }
                                    render={ ( { open } ) => (
                                        <>
                                            <br /><p>スマホ用画像(任意)</p>
                                            { slide.spImgUrl ? (
                                                <div>
                                                    <img src={ slide.spImgUrl } alt="" style={ { maxWidth:'100%' } } />
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
                {/* エディター内プレビュー                            */}
                {/* -------------------------------------------------- */}
                <div {...blockProps}>
                    <div className="text_in center">
                        <div className="in">
                            <h1 className="ttl">
                                <RichText
                                    tagName="span"
                                    className="sub"
                                    value={ subTitle }
                                    placeholder="サブタイトル"
                                    onChange={ (v)=>setAttributes({ subTitle:v }) }
                                    multiline={ false }
                                />
                                {' '}
                                <RichText
                                    tagName="span"
                                    className="main"
                                    value={ mainTitle }
                                    placeholder="メインタイトル"
                                    onChange={ (v)=>setAttributes({ mainTitle:v }) }
                                    multiline={ false }
                                />
                            </h1>
                            <RichText
                                tagName="p"
                                className="description"
                                value={ descriptionText }
                                placeholder="説明テキストを入力"
                                onChange={ (v)=>setAttributes({ descriptionText:v }) }
                            />
                            { showCtaButton && (
                                <span className="cta_btn">
                                    <RichText
                                        tagName="a"
                                        className="btn_link"
                                        href={ ctaLinkUrl || '#' }
                                        target={ ctaOpenNewTab ? '_blank' : undefined }
                                        rel={ ctaOpenNewTab ? 'noopener noreferrer' : undefined }
                                        value={ buttonLabel }
                                        placeholder="ボタンテキスト"
                                        onChange={ (v)=>setAttributes({ buttonLabel:v }) }
                                        multiline={ false }
                                    />
                                </span>
                            ) }
                        </div>
                    </div>
                    {/* エディターでは1枚目のみ表示（JSが動かないため） */}
                    <div className="swiper-wrapper">
                        { slides[0] && slides[0].pcImgUrl && (
                            <div className="swiper-slide">
                                <picture className="bg_img">
                                    <source srcSet={ slides[0].spImgUrl || slides[0].pcImgUrl } media="(max-width:800px)" />
                                    <source srcSet={ slides[0].pcImgUrl } media="(min-width:801px)" />
                                    <img src={ slides[0].pcImgUrl } alt={ slides[0].altText } />
                                </picture>
                            </div>
                        ) }
                        {/* ★ フィルター要素 */}
                        <div
                            className="image_filter"
                            style={ {
                                backgroundColor: filterColor,
                                opacity        : filterOpacity,
                            } }
                        ></div>
                    </div>

                    {/* ページネーション / ナビ */}
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
            </>
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
            paginationColor, nextButtonColor,
            /* ★ 追加属性 */
            minHeightPc, minHeightTb, minHeightSp,
            subTitle, mainTitle, descriptionText,
            buttonLabel, ctaLinkUrl, ctaOpenNewTab,
            showCtaButton,
            filterColor, filterOpacity,
        } = attributes;

        const blockProps = useBlockProps.save({
            id: blockId,
            className: `${layoutType === 'full'
                ? 'swiper paid-block-fv-11 max-w init-hide'
                : 'swiper paid-block-fv-11 init-hide'} ${minHeightPc} ${minHeightTb} ${minHeightSp}`,
            style: layoutType === 'fixed' ? { maxWidth } : { maxWidth: '100vw' }
        });

        /* ---------- Swiper 設定文字列（observer 追加） -------------*/
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

        /* ---------- JSX 出力 -------------------------------------*/
        return (
            <div {...blockProps}>
                <div className="text_in center">
                    <div className="in">
                        <h1 className="ttl">
                            { subTitle && (
                                <>
                                    <RichText.Content
                                        tagName="span"
                                        className="sub"
                                        value={ subTitle }
                                    />
                                    {' '} {/* subTitle がある場合だけ半角スペース */}
                                </>
                            )}
                            <RichText.Content tagName="span" className="main" value={ mainTitle } />
                        </h1>
                        <RichText.Content tagName="p" className="description" value={ descriptionText } />
                        { showCtaButton && (
                            <span className="cta_btn">
                                <a
                                    href={ ctaLinkUrl || '#' }
                                    className="btn_link"
                                    target={ ctaOpenNewTab ? '_blank' : undefined }
                                    rel={ ctaOpenNewTab ? 'noopener noreferrer' : undefined }
                                >
                                    <RichText.Content tagName="span" value={ buttonLabel } />
                                </a>
                            </span>
                        ) }
                    </div>
                </div>
                <div className="swiper-wrapper">
                    { slides.map( ( slide, i ) => {
                        const spImgSrc = slide.spImgUrl || slide.pcImgUrl;
                        const picture = (
                            <picture className="bg_img">
                                <source srcSet={ spImgSrc } media="(max-width:800px)" />
                                <source srcSet={ slide.pcImgUrl } media="(min-width:801px)" />
                                <img src={ slide.pcImgUrl } alt={ slide.altText } />
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
                    {/* ★ フィルター要素 */}
                    <div
                        className="image_filter"
                        style={ {
                            backgroundColor: filterColor,
                            opacity        : filterOpacity,
                        } }
                    ></div>
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
    },
});
