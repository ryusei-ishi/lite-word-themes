/*************************************************************************
 * LiteWord – Custom Block: Voice Slider with Modal (paid-block-voice-3)     *
 * お客様の声スライダー + モーダル表示機能                                    *
 ************************************************************************/
import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    Button,
    TextControl,
    TextareaControl,
    SelectControl,
    ColorPalette,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { 
    fontOptionsArr, 
    fontWeightOptionsArr 
} from '../utils.js';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

// オプション配列を取得
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    title   : 'お客様の声 03 (スライダー・モーダル付き)',
    icon    : 'format-quote',
    category: 'lw-voice',

    // ------------------------------------------------------------------
    // ▶ Edit
    // ------------------------------------------------------------------
    edit: ( { attributes, setAttributes, clientId } ) => {
        const {
            blockId, voices,
            autoplayDelay, loop, disableOnInteraction,
            showPagination, paginationClickable,
            showNavigation, sliderSpeed,
            slidesPerView600, slidesPerView900,
            spaceBetween600, spaceBetween900,
            maxWidthContainer,
            // デザイン設定
            cardBgColor, cardShadowColor,
            nameColor, excerptColor, metaColor,
            btnBgColor, btnTextColor,
            nameFontSet, nameFontWeight,
            excerptFontSet, excerptFontWeight,
        } = attributes;

        /* ID を確定させる（clientIdを使用して一意性を保証）---------*/
        useEffect( () => {
            const newId = `paid-block-voice-3-${ clientId }`;
            if ( !blockId || !blockId.includes( clientId ) ) {
                setAttributes( { blockId: newId } );
            }
        }, [ clientId ] );

        /* お客様の声編集ヘルパー --------------------------------------*/
        const updateVoice = ( index, key, value ) => {
            const newVoices = voices.map( ( voice, i ) =>
                i === index ? { ...voice, [key]: value } : voice
            );
            setAttributes( { voices: newVoices } );
        };

        const addVoice = () => {
            if ( voices.length < 20 ) {
                setAttributes( {
                    voices: [
                        ...voices,
                        {
                            name   : '新しいお客様',
                            age    : '30代',
                            job    : '会社員',
                            photo  : 'https://picsum.photos/200/200?random=' + Date.now(),
                            alt    : '',
                            excerpt: '抜粋テキストをここに入力...',
                            text   : '全文テキストをここに入力...'
                        }
                    ]
                } );
            }
        };

        const removeVoice = ( index ) => {
            if ( voices.length > 1 ) {
                setAttributes( {
                    voices: voices.filter( ( _, i ) => i !== index )
                } );
            }
        };

        /* 順番変更ヘルパー ------------------------------------------*/
        const moveVoiceUp = ( index ) => {
            if ( index === 0 ) return;
            const newVoices = [ ...voices ];
            [ newVoices[ index - 1 ], newVoices[ index ] ] = 
            [ newVoices[ index ], newVoices[ index - 1 ] ];
            setAttributes( { voices: newVoices } );
        };

        const moveVoiceDown = ( index ) => {
            if ( index === voices.length - 1 ) return;
            const newVoices = [ ...voices ];
            [ newVoices[ index ], newVoices[ index + 1 ] ] = 
            [ newVoices[ index + 1 ], newVoices[ index ] ];
            setAttributes( { voices: newVoices } );
        };

        /* ----------------------------------------------------------*/
        /* Gutenberg サイドバー                                       */
        /* ----------------------------------------------------------*/
        
        const blockProps = useBlockProps({
            id: blockId,
            className: 'paid-block-voice-3',
            style: {
                border: '2px dashed #ccc',
                padding: '20px',
                borderRadius: '8px',
                background: '#f9f9f9'
            }
        });

        return (
            <>
                <InspectorControls>

                    {/* --- 1. お客様の声管理（常に開く） --------------- */}
                    <PanelBody title="お客様の声管理" initialOpen={ true }>
                        <p style={{ marginBottom: '16px' }}>
                            現在 { voices.length } 件のお客様の声が登録されています
                        </p>
                        <Button
                            isPrimary
                            onClick={ addVoice }
                            disabled={ voices.length >= 20 }
                        >
                            + お客様の声を追加
                        </Button>
                        { voices.length >= 20 && (
                            <p style={{ color: '#d63638', marginTop: '8px' }}>
                                ※ 最大20件まで登録できます
                            </p>
                        ) }
                    </PanelBody>

                    {/* --- 2. 各お客様の声の編集 ----------------------- */}
                    { voices.map( ( voice, index ) => (
                        <PanelBody
                            key={ index }
                            title={ `お客様の声 ${ index + 1 }: ${ voice.name }` }
                            initialOpen={ false }
                        >
                            {/* 順番変更ボタン */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '8px', 
                                marginBottom: '16px',
                                paddingBottom: '12px',
                                borderBottom: '1px solid #ddd'
                            }}>
                                <Button
                                    isSecondary
                                    onClick={ () => moveVoiceUp( index ) }
                                    disabled={ index === 0 }
                                    style={{ flex: 1 }}
                                >
                                    ↑ 上に移動
                                </Button>
                                <Button
                                    isSecondary
                                    onClick={ () => moveVoiceDown( index ) }
                                    disabled={ index === voices.length - 1 }
                                    style={{ flex: 1 }}
                                >
                                    ↓ 下に移動
                                </Button>
                            </div>

                            <TextControl
                                label="お名前"
                                value={ voice.name }
                                onChange={ ( v ) => updateVoice( index, 'name', v ) }
                            />
                            <TextControl
                                label="年代"
                                value={ voice.age }
                                onChange={ ( v ) => updateVoice( index, 'age', v ) }
                                placeholder="例: 30代"
                            />
                            <TextControl
                                label="職業"
                                value={ voice.job }
                                onChange={ ( v ) => updateVoice( index, 'job', v ) }
                                placeholder="例: 会社員"
                            />

                            <p style={{ marginTop: '16px', marginBottom: '8px' }}>
                                <strong>写真</strong>
                            </p>
                            <MediaUpload
                                onSelect={ ( media ) => updateVoice( index, 'photo', media.url ) }
                                allowedTypes={ ['image'] }
                                value={ voice.photo }
                                render={ ( { open } ) => (
                                    <div>
                                        { voice.photo && (
                                            <img
                                                src={ voice.photo }
                                                alt={ voice.alt || voice.name }
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    marginBottom: '8px'
                                                }}
                                            />
                                        ) }
                                        <Button isSecondary onClick={ open }>
                                            { voice.photo ? '画像を変更' : '画像を選択' }
                                        </Button>
                                    </div>
                                ) }
                            />

                            <TextControl
                                label="画像のAlt属性"
                                value={ voice.alt }
                                onChange={ ( v ) => updateVoice( index, 'alt', v ) }
                                placeholder={ voice.name }
                                help="空欄の場合はお名前が使用されます"
                            />

                            <TextareaControl
                                label="抜粋テキスト（カードに表示）"
                                value={ voice.excerpt }
                                onChange={ ( v ) => updateVoice( index, 'excerpt', v ) }
                                rows={ 3 }
                                help="カード上に表示される短い抜粋文"
                            />

                            <TextareaControl
                                label="全文テキスト（モーダルに表示）"
                                value={ voice.text }
                                onChange={ ( v ) => updateVoice( index, 'text', v ) }
                                rows={ 6 }
                                help="「続きを読む」クリック時に表示される全文。\n\n で改行できます。"
                            />

                            <Button
                                isDestructive
                                onClick={ () => removeVoice( index ) }
                                disabled={ voices.length <= 1 }
                                style={{ marginTop: '16px' }}
                            >
                                🗑️ このお客様の声を削除
                            </Button>
                            { voices.length <= 1 && (
                                <p style={{ color: '#d63638', marginTop: '8px', fontSize: '12px' }}>
                                    ※ 最低1件は必要です
                                </p>
                            ) }
                        </PanelBody>
                    ) ) }

                    {/* --- 3. レイアウト設定 ------------------------- */}
                    <PanelBody title="📐 レイアウト設定" initialOpen={ false }>
                        <RangeControl
                            label="コンテナの最大横幅（px）"
                            value={ maxWidthContainer }
                            onChange={ ( v ) => setAttributes( { maxWidthContainer: v } ) }
                            min={ 600 }
                            max={ 2000 }
                            step={ 10 }
                            help="スライダー全体の最大横幅を設定します"
                        />
                    </PanelBody>

                    {/* --- 4. デザイン設定 --------------------------- */}
                    <PanelBody title="🎨 デザイン設定" initialOpen={ false }>
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            カードの背景色
                        </p>
                        <ColorPalette
                            value={ cardBgColor }
                            onChange={ ( v ) => setAttributes( { cardBgColor: v || '#ffffff' } ) }
                        />
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            お名前のテキスト色
                        </p>
                        <ColorPalette
                            value={ nameColor }
                            onChange={ ( v ) => setAttributes( { nameColor: v || '#333333' } ) }
                        />
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            抜粋文のテキスト色
                        </p>
                        <ColorPalette
                            value={ excerptColor }
                            onChange={ ( v ) => setAttributes( { excerptColor: v || '#666666' } ) }
                        />
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            年代・職業のテキスト色
                        </p>
                        <ColorPalette
                            value={ metaColor }
                            onChange={ ( v ) => setAttributes( { metaColor: v || '#999999' } ) }
                        />
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            ボタンの背景色
                        </p>
                        <ColorPalette
                            value={ btnBgColor }
                            onChange={ ( v ) => setAttributes( { btnBgColor: v } ) }
                        />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                            ※ 空欄の場合はテーマのデフォルト色が使用されます
                        </p>
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            ボタンのテキスト色
                        </p>
                        <ColorPalette
                            value={ btnTextColor }
                            onChange={ ( v ) => setAttributes( { btnTextColor: v } ) }
                        />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                            ※ 空欄の場合はテーマのデフォルト色が使用されます
                        </p>
                    </PanelBody>

                    {/* --- 5. フォント設定 --------------------------- */}
                    <PanelBody title="✍️ フォント設定" initialOpen={ false }>
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            お名前のフォント
                        </p>
                        <SelectControl
                            label="フォントファミリー"
                            value={ nameFontSet }
                            options={ fontOptions }
                            onChange={ ( v ) => setAttributes( { nameFontSet: v } ) }
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={ nameFontWeight }
                            options={ fontWeightOptions }
                            onChange={ ( v ) => setAttributes( { nameFontWeight: v } ) }
                        />
                        
                        <hr style={{ margin: '20px 0' }} />
                        
                        <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                            抜粋文のフォント
                        </p>
                        <SelectControl
                            label="フォントファミリー"
                            value={ excerptFontSet }
                            options={ fontOptions }
                            onChange={ ( v ) => setAttributes( { excerptFontSet: v } ) }
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={ excerptFontWeight }
                            options={ fontWeightOptions }
                            onChange={ ( v ) => setAttributes( { excerptFontWeight: v } ) }
                        />
                    </PanelBody>

                    {/* --- 6. スライダーの表示枚数など ----------------------- */}
                    <PanelBody title="スライダーの表示枚数など" initialOpen={ false }>
                        <p><strong>600px以上</strong></p>
                        <RangeControl
                            label="表示枚数"
                            value={ slidesPerView600 }
                            onChange={ ( v ) => setAttributes( { slidesPerView600: v } ) }
                            min={ 1 }
                            max={ 5 }
                            step={ 1 }
                        />
                        <RangeControl
                            label="スライド間隔（px）"
                            value={ spaceBetween600 }
                            onChange={ ( v ) => setAttributes( { spaceBetween600: v } ) }
                            min={ 10 }
                            max={ 50 }
                            step={ 2 }
                        />
                        <hr />
                        <p><strong>900px以上</strong></p>
                        <RangeControl
                            label="表示枚数"
                            value={ slidesPerView900 }
                            onChange={ ( v ) => setAttributes( { slidesPerView900: v } ) }
                            min={ 1 }
                            max={ 6 }
                            step={ 1 }
                        />
                        <RangeControl
                            label="スライド間隔（px）"
                            value={ spaceBetween900 }
                            onChange={ ( v ) => setAttributes( { spaceBetween900: v } ) }
                            min={ 10 }
                            max={ 60 }
                            step={ 2 }
                        />
                    </PanelBody>

                    {/* --- 7. ページネーション/ナビゲーション -------- */}
                    <PanelBody title="ページネーション/ナビゲーション" initialOpen={ false }>
                        <ToggleControl
                            label="ページネーション表示"
                            checked={ showPagination }
                            onChange={ ( v ) => setAttributes( { showPagination: v } ) }
                        />
                        { showPagination && (
                            <ToggleControl
                                label="ページネーションクリック可能"
                                checked={ paginationClickable }
                                onChange={ ( v ) => setAttributes( { paginationClickable: v } ) }
                            />
                        ) }
                        <ToggleControl
                            label="前後ボタン表示"
                            checked={ showNavigation }
                            onChange={ ( v ) => setAttributes( { showNavigation: v } ) }
                        />
                    </PanelBody>

                    {/* --- 8. スライドスピードなど --------------------- */}
                    <PanelBody title="スライドスピードなど" initialOpen={ false }>
                        <RangeControl
                            label="オートプレイ間隔（ミリ秒）"
                            value={ autoplayDelay }
                            onChange={ ( v ) => setAttributes( { autoplayDelay: v } ) }
                            min={ 1000 }
                            max={ 10000 }
                            step={ 500 }
                        />
                        <RangeControl
                            label="スライド速度（ミリ秒）"
                            value={ sliderSpeed }
                            onChange={ ( v ) => setAttributes( { sliderSpeed: v } ) }
                            min={ 300 }
                            max={ 2000 }
                            step={ 100 }
                        />
                        <ToggleControl
                            label="ループ再生"
                            checked={ loop }
                            onChange={ ( v ) => setAttributes( { loop: v } ) }
                        />
                        <ToggleControl
                            label="操作時にオートプレイ停止"
                            checked={ disableOnInteraction }
                            onChange={ ( v ) => setAttributes( { disableOnInteraction: v } ) }
                        />
                    </PanelBody>

                </InspectorControls>

                {/* ----------------------------------------------------------*/}
                {/* エディター画面のプレビュー                                   */}
                {/* ----------------------------------------------------------*/}
                <div {...blockProps}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>
                            📣 お客様の声スライダー
                        </h3>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            { voices.length } 件のお客様の声が登録されています
                        </p>
                        <p style={{ margin: '8px 0 0', color: '#999', fontSize: '12px' }}>
                            ※ 実際のスライダーはフロントエンドで表示されます
                        </p>
                    </div>

                    {/* お客様の声の一覧表示（エディター用） */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '12px',
                        marginTop: '16px'
                    }}>
                        { voices.map( ( voice, index ) => (
                            <div
                                key={ index }
                                style={{
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}
                            >
                                {/* 順番表示 */}
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: '#2271b1',
                                    color: '#fff',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    { index + 1 }
                                </div>
                                { voice.photo && (
                                    <img
                                        src={ voice.photo }
                                        alt={ voice.alt || voice.name }
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            margin: '0 auto 8px'
                                        }}
                                    />
                                ) }
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                                    { voice.name }
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    { voice.age } / { voice.job }
                                </div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </>
        );
    },

    // ------------------------------------------------------------------
    // ▶ Save
    // ------------------------------------------------------------------
    save: ( { attributes } ) => {
        const {
            blockId, voices,
            autoplayDelay, loop, disableOnInteraction,
            showPagination, paginationClickable,
            showNavigation, sliderSpeed,
            slidesPerView600, slidesPerView900,
            spaceBetween600, spaceBetween900,
            maxWidthContainer,
            // デザイン設定
            cardBgColor, cardShadowColor,
            nameColor, excerptColor, metaColor,
            btnBgColor, btnTextColor,
            nameFontSet, nameFontWeight,
            excerptFontSet, excerptFontWeight,
        } = attributes;

        /* ---------- データをJSONとして埋め込み ---------------------*/
        const voiceDataJson = JSON.stringify( voices );

        /* ---------- フォント設定をdata属性として埋め込み -----------*/
        const fontSettingsJson = JSON.stringify({
            nameFontSet,
            nameFontWeight,
            excerptFontSet,
            excerptFontWeight,
        });

        /* ---------- スタイル変数を作成 ---------------------------*/
        const innerStyle = {
            '--paid-block-voice-3-max-width': `${ maxWidthContainer }px`,
            '--lw-voice-card-bg': cardBgColor,
            '--lw-voice-name-color': nameColor,
            '--lw-voice-excerpt-color': excerptColor,
            '--lw-voice-meta-color': metaColor,
            ...(btnBgColor && { '--color-btn-bg': btnBgColor }),
            ...(btnTextColor && { '--color-btn-text': btnTextColor }),
        };

        /* ---------- Swiper + モーダル初期化スクリプト --------------*/
        const initScript = `
(function(){
    const selector = "#${ blockId }";
    const section = document.querySelector(selector);
    if (!section) return;

    // データを取得
    const voiceData = JSON.parse(section.getAttribute('data-voices'));
    const fontSettings = JSON.parse(section.getAttribute('data-font-settings'));

    // ========== HTML生成 ==========
    function generateHTML() {
        const swiperWrapper = section.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        const slidesHTML = voiceData.map((voice, index) => \`
            <div class="swiper-slide">
                <div class="voice-card" data-voice-id="\${index}">
                    <div class="photo">
                        <img loading="lazy" src="\${voice.photo}" alt="\${voice.alt || voice.name}">
                    </div>
                    <h3 
                        class="name" 
                        data-lw_font_set="\${fontSettings.nameFontSet}"
                        style="font-weight: \${fontSettings.nameFontWeight}"
                    >\${voice.name}</h3>
                    \${voice.age || voice.job ? '<p class="meta">' + (voice.age || '') + ' / ' + (voice.job || '') + '</p>' : ''}
                    <p 
                        class="excerpt"
                        data-lw_font_set="\${fontSettings.excerptFontSet}"
                        style="font-weight: \${fontSettings.excerptFontWeight}"
                    >\${voice.excerpt}</p>
                    <div class="more-btn">続きを読む</div>
                </div>
            </div>
        \`).join('');

        swiperWrapper.innerHTML = slidesHTML;
    }

    // ========== Swiper初期化 ==========
    const MAX_RETRY = 30;
    let retry = 0;

    const initSwiper = () => {
        if (typeof Swiper === "undefined") return false;
        const swiperEl = section.querySelector('.voice-swiper');
        if (!swiperEl) return false;
        const already = swiperEl.swiper;
        if (already) return true;

        new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: ${ loop },
            speed: ${ sliderSpeed },
            autoplay: {
                delay: ${ autoplayDelay },
                disableOnInteraction: ${ disableOnInteraction }
            },
            observer: true,
            observeParents: true,
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
            breakpoints: {
                600: {
                    slidesPerView: ${ slidesPerView600 },
                    spaceBetween: ${ spaceBetween600 },
                },
                900: {
                    slidesPerView: ${ slidesPerView900 },
                    spaceBetween: ${ spaceBetween900 },
                },
            },
        });

        section.classList.remove("init-hide");
        return true;
    };

    // ========== モーダル処理 ==========
    function initModal() {
        const modal = section.querySelector('.paid-block-voice-3-modal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        // カードクリックでモーダル表示
        section.addEventListener('click', function(e) {
            const card = e.target.closest('.voice-card');
            if (!card) return;

            const voiceId = parseInt(card.getAttribute('data-voice-id'));
            const data = voiceData[voiceId];
            
            if (data) {
                modal.querySelector('.modal-photo img').src = data.photo;
                modal.querySelector('.modal-photo img').alt = data.alt || data.name;
                modal.querySelector('.modal-name').textContent = data.name;
                const modalMeta = modal.querySelector('.modal-meta');
                if (data.age || data.job) {
                    modalMeta.textContent = \`\${data.age || ''} / \${data.job || ''}\`;
                    modalMeta.style.display = '';
                } else {
                    modalMeta.style.display = 'none';
                }
                modal.querySelector('.modal-text').textContent = data.text;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // モーダルを閉じる
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESCキーで閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ========== 初期化実行 ==========
    // 1. HTML生成
    generateHTML();

    // 2. Swiper初期化（複数トリガー）
    document.addEventListener("DOMContentLoaded", initSwiper, { once: true });
    window.addEventListener("lw:swiperReady", initSwiper, { once: true });

    const timer = setInterval(() => {
        if (initSwiper() || ++retry >= MAX_RETRY) clearInterval(timer);
    }, 150);

    setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.classList.remove("init-hide");
    }, 5000);

    // 3. モーダル初期化
    initModal();
})();
        `;

        /* ---------- JSX 出力 -------------------------------------*/
        return (
            <div
                id={ blockId }
                className="paid-block-voice-3 init-hide"
                data-voices={ voiceDataJson }
                data-font-settings={ fontSettingsJson }
            >
                <div className="inner" style={ innerStyle }>
                    <div className="swiper voice-swiper">
                        <div className="swiper-wrapper">
                            {/* JavaScriptで動的生成 */}
                        </div>
                        {/* Pagination */}
                        { showPagination && <div className="swiper-pagination"></div> }
                    </div>
                </div>

                {/* Navigation */}
                { showNavigation && <div className="swiper-button-prev"></div> }
                { showNavigation && <div className="swiper-button-next"></div> }

                {/* Modal */}
                <div className="voice-modal paid-block-voice-3-modal">
                    <div className="modal-overlay"></div>
                    <div className="modal-content">
                        <button className="modal-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="modal-body">
                            <div className="modal-photo">
                                <img src="" alt="" />
                            </div>
                            <h3 
                                className="modal-name"
                                data-lw_font_set={ nameFontSet }
                                style={{ fontWeight: nameFontWeight }}
                            ></h3>
                            <p className="modal-meta"></p>
                            <div 
                                className="modal-text"
                                data-lw_font_set={ excerptFontSet }
                                style={{ fontWeight: excerptFontWeight }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 初期化スクリプト */}
                <script type="text/javascript" dangerouslySetInnerHTML={ { __html: initScript } } />

                {/* JS完全オフ環境向けフォールバック */}
                <noscript>
                    <style>{`#${ blockId }{opacity:1!important}`}</style>
                </noscript>
            </div>
        );
    },
});