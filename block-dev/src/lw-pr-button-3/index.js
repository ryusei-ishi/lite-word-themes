import { registerBlockType } from '@wordpress/blocks';
import { 
    RichText, 
    InspectorControls, 
    URLInput,
    useBlockProps
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    SelectControl, 
    ColorPalette, 
    RangeControl, 
    ToggleControl 
} from '@wordpress/components';
import { 
    fontOptionsArr, 
    fontWeightOptionsArr, 
    leftButtonIconSvgArr,
    ButtonBackgroundOptionsArr
} from '../utils.js';
import './style.scss';
import './editor.scss';

// オプション配列を定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconMainOptions = leftButtonIconSvgArr();
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType('wdl/lw-pr-button-3', {
    title: 'PRボタン 03',
    icon: 'button',
    category: 'liteword-buttons',
    supports: {
        anchor: true,
        className: true,
    },
    
    /* ---------- 属性 ---------- */
    attributes: {
        textSub: {
            type: 'string',
            default: '＼ テキストテキストテキスト ／'
        },
        textMain: {
            type: 'string',
            default: '資料ダウンロードはこちら'
        },
        btnUrl: {
            type: 'string',
            default: ''
        },
        openNewTab: {
            type: 'boolean',
            default: false
        },
        // 配置設定
        btnAlign: {
            type: 'string',
            default: 'center'
        },
        btnAlignSp: {
            type: 'string',
            default: 'default'
        },
        // 背景設定
        bgColor: {
            type: 'string',
            default: '#e1a20e'
        },
        bgColorHover: {
            type: 'string',
            default:'#c4880b'
        },
        // テキスト色設定
        textColorMain: {
            type: 'string',
            default: '#ffffff'
        },
        textColorSub: {
            type: 'string',
            default: '#ffffff'
        },
        // ボーダー設定
        borderWidth: {
            type: 'number',
            default: 0
        },
        borderColor: {
            type: 'string',
            default: '#000000'
        },
        borderRadius: {
            type: 'number',
            default: 2
        },
        // アイコン設定
        iconMain: {
            type: 'string',
            default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>'
        },
        iconMainColor: {
            type: 'string',
            default: '#ffffff'
        },
        iconMainSize: {
            type: 'number',
            default: 32
        },
        iconMainMarginRight: {
            type: 'number',
            default: 10
        },
        iconMainMarginLeft: {
            type: 'number',
            default: -8
        },
        // フォント設定
        FontSet: {
            type: 'string',
            default: ''
        },
        fontWeightMain: {
            type: 'string',
            default: '500'
        },
        fontWeightSub: {
            type: 'string',
            default: '500'
        },
        fontSizeMain: {
            type: 'number',
            default: 22
        },
        fontSizeMainSp: {
            type: 'number',
            default: 18
        },
        fontSizeSub: {
            type: 'number',
            default: 14
        },
        // サイズ設定
        maxWidth: {
            type: 'number',
            default: 580
        },
        maxWidthSp: {
            type: 'number',
            default: 480
        },
        paddingY: {
            type: 'number',
            default: 1.2
        },
        paddingX: {
            type: 'number',
            default: 1.5
        },
        // エフェクト設定
        transitionDuration: {
            type: 'number',
            default: 0.3
        },
        shakeAnimation: {
            type: 'boolean',
            default: false
        },
        shakeInterval: {
            type: 'number',
            default: 3
        },
        shakeIntensity: {
            type: 'string',
            default: 'normal'
        },
        // 影設定
        shadowX: {
            type: 'number',
            default: 0
        },
        shadowY: {
            type: 'number',
            default: 0
        },
        shadowBlur: {
            type: 'number',
            default: 6
        },
        shadowOpacity: {
            type: 'number',
            default: 0.2
        }
    },

    /* ---------- 編集 ---------- */
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            textSub, textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgColor, bgColorHover,
            textColorMain, textColorSub,
            borderWidth, borderColor, borderRadius,
            iconMain, iconMainColor, iconMainSize, iconMainMarginRight, iconMainMarginLeft,
            FontSet, fontWeightMain, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp, paddingY, paddingX,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-pr-button-3'
        });

        // wrap_btnのクラス名を生成
        let wrapBtnClassName = `wrap_btn ${btnAlign}`;
        if (btnAlignSp !== 'default' && btnAlignSp !== '') {
            wrapBtnClassName += ` sp_${btnAlignSp}`;
        }

        return (
            <>
                <InspectorControls>
                    {/* ── 1. 基本設定 ── */}
                    <PanelBody title="📝 基本設定" initialOpen={true}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                                🔗 リンク先URL
                            </p>
                            <URLInput
                                value={btnUrl}
                                onChange={(newUrl) => setAttributes({ btnUrl: newUrl })}
                                help="ボタンをクリックした時の移動先URLを入力してください"
                            />
                        </div>
                        
                        <ToggleControl
                            label="新しいタブで開く"
                            checked={openNewTab}
                            onChange={(value) => setAttributes({ openNewTab: value })}
                            help="リンク先を新しいタブで開きたい場合はオンにしてください"
                        />
                    </PanelBody>

                    {/* ── 2. ボタンの配置 ── */}
                    <PanelBody title="📍 ボタンの配置" initialOpen={false}>
                        <SelectControl
                            label="💻 PC表示時の配置"
                            value={btnAlign}
                            options={[
                                { label: '左寄せ', value: 'left' },
                                { label: '中央揃え', value: 'center' },
                                { label: '右寄せ', value: 'right' }
                            ]}
                            onChange={(value) => setAttributes({ btnAlign: value })}
                            help="パソコン表示時のボタンの配置を選択"
                        />

                        <SelectControl
                            label="📱 スマホ表示時の配置"
                            value={btnAlignSp}
                            options={[
                                { label: 'PC表示と同じ', value: 'default' },
                                { label: '左寄せ', value: 'left' },
                                { label: '中央揃え', value: 'center' },
                                { label: '右寄せ', value: 'right' }
                            ]}
                            onChange={(value) => setAttributes({ btnAlignSp: value })}
                            help="スマホ表示時のボタンの配置を選択"
                        />
                    </PanelBody>

                    {/* ── 3. テキスト設定 ── */}
                    <PanelBody title="📝 テキスト設定" initialOpen={false}>
                        <SelectControl
                            label="📚 フォントの種類"
                            value={FontSet}
                            options={fontOptions}
                            onChange={(newFont) => setAttributes({ FontSet: newFont })}
                            help="ボタンのフォントを選択してください"
                        />

                        <div style={{ marginBottom: '20px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px', color: '#1e1e1e' }}>
                                ▼ メインテキスト設定
                            </p>
                            
                            <SelectControl
                                label="太さ"
                                value={fontWeightMain}
                                options={fontWeightOptions}
                                onChange={(newWeight) => setAttributes({ fontWeightMain: newWeight })}
                            />

                            <RangeControl
                                label="文字サイズ PC (px)"
                                value={fontSizeMain}
                                onChange={(value) => setAttributes({ fontSizeMain: value })}
                                min={14}
                                max={32}
                            />

                            <RangeControl
                                label="文字サイズ SP (px)"
                                value={fontSizeMainSp}
                                onChange={(value) => setAttributes({ fontSizeMainSp: value })}
                                min={12}
                                max={28}
                            />

                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    文字色
                                </p>
                                <ColorPalette
                                    value={textColorMain}
                                    onChange={(newColor) => setAttributes({ textColorMain: newColor })}
                                />
                            </div>
                        </div>

                        <div style={{ paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px', color: '#1e1e1e' }}>
                                ▼ サブテキスト設定
                            </p>
                            
                            <SelectControl
                                label="太さ"
                                value={fontWeightSub}
                                options={fontWeightOptions}
                                onChange={(newWeight) => setAttributes({ fontWeightSub: newWeight })}
                            />

                            <RangeControl
                                label="文字サイズ (px)"
                                value={fontSizeSub}
                                onChange={(value) => setAttributes({ fontSizeSub: value })}
                                min={10}
                                max={20}
                            />

                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    文字色
                                </p>
                                <ColorPalette
                                    value={textColorSub}
                                    onChange={(newColor) => setAttributes({ textColorSub: newColor })}
                                />
                            </div>
                        </div>
                    </PanelBody>

                    {/* ── 4. 色の設定 ── */}
                    <PanelBody title="🎨 背景色の設定" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🌈 ボタンの背景
                            </p>
                            <SelectControl
                                value={bgColor}
                                options={bgOptions}
                                onChange={(newBg) => setAttributes({ bgColor: newBg })}
                                help="プリセットから選択（グラデーション対応）"
                            />
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                                    カスタムカラー:
                                </p>
                                <ColorPalette
                                    value={bgColor && !bgColor.includes('gradient') && !bgColor.includes('linear') ? bgColor : ''}
                                    onChange={(newColor) => setAttributes({ bgColor: newColor })}
                                />
                            </div>
                        </div>

                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🖱️ ホバー時の背景
                            </p>
                            <SelectControl
                                value={bgColorHover}
                                options={bgOptions}
                                onChange={(newBg) => setAttributes({ bgColorHover: newBg })}
                                help="プリセットから選択（グラデーション対応）"
                            />
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                                    カスタムカラー:
                                </p>
                                <ColorPalette
                                    value={bgColorHover && !bgColorHover.includes('gradient') && !bgColorHover.includes('linear') ? bgColorHover : ''}
                                    onChange={(newColor) => setAttributes({ bgColorHover: newColor })}
                                />
                            </div>
                        </div>
                    </PanelBody>

                    {/* ── 5. アイコン設定 ── */}
                    <PanelBody title="✨ アイコン設定" initialOpen={false}>
                        <SelectControl
                            label="🎯 アイコンの種類"
                            value={iconMain}
                            options={iconMainOptions}
                            onChange={(newIcon) => setAttributes({ iconMain: newIcon })}
                            help="メインテキストの左側に表示するアイコン"
                        />
                        {iconMain && (
                            <>
                                <RangeControl
                                    label="📏 アイコンのサイズ (px)"
                                    value={iconMainSize}
                                    onChange={(value) => setAttributes({ iconMainSize: value })}
                                    min={16}
                                    max={48}
                                    help="アイコンの大きさを設定します"
                                />
                                <RangeControl
                                    label="↔️ アイコンの右余白 (px)"
                                    value={iconMainMarginRight}
                                    onChange={(value) => setAttributes({ iconMainMarginRight: value })}
                                    min={0}
                                    max={20}
                                    help="アイコンとテキストの間隔を設定します"
                                />
                                <RangeControl
                                    label="↔️ アイコンの左余白 (px)"
                                    value={iconMainMarginLeft}
                                    onChange={(value) => setAttributes({ iconMainMarginLeft: value })}
                                    min={-20}
                                    max={20}
                                    help="アイコンの左側の余白を設定します"
                                />
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                        🎨 アイコンの色
                                    </p>
                                    <ColorPalette
                                        value={iconMainColor}
                                        onChange={(newColor) => setAttributes({ iconMainColor: newColor })}
                                    />
                                </div>
                            </>
                        )}
                    </PanelBody>

                    {/* ── 6. ボタンの形状 ── */}
                    <PanelBody title="📏 ボタンの形状" initialOpen={false}>
                        <RangeControl
                            label="📐 最大横幅 PC (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={300}
                            max={800}
                            help="PC表示時のボタンの最大横幅"
                        />

                        <RangeControl
                            label="📱 最大横幅 SP (px)"
                            value={maxWidthSp}
                            onChange={(value) => setAttributes({ maxWidthSp: value })}
                            min={250}
                            max={600}
                            help="スマホ表示時のボタンの最大横幅"
                        />

                        <RangeControl
                            label="📦 上下パディング (em)"
                            value={paddingY}
                            onChange={(value) => setAttributes({ paddingY: value })}
                            min={0.5}
                            max={3}
                            step={0.1}
                            help="ボタン内部の上下の余白"
                        />

                        <RangeControl
                            label="📦 左右パディング (em)"
                            value={paddingX}
                            onChange={(value) => setAttributes({ paddingX: value })}
                            min={0.5}
                            max={3}
                            step={0.1}
                            help="ボタン内部の左右の余白"
                        />

                        <RangeControl
                            label="🎪 角の丸み (px)"
                            value={borderRadius}
                            onChange={(value) => setAttributes({ borderRadius: value })}
                            min={0}
                            max={100}
                            help="数値が大きいほど角が丸くなります"
                        />
                    </PanelBody>

                    {/* ── 7. 枠線の設定 ── */}
                    <PanelBody title="🖍️ 枠線の設定" initialOpen={false}>
                        <RangeControl
                            label="📏 枠線の太さ (px)"
                            value={borderWidth}
                            onChange={(value) => setAttributes({ borderWidth: value })}
                            min={0}
                            max={10}
                            help="0にすると枠線が表示されません"
                        />

                        {borderWidth > 0 && (
                            <div style={{ marginTop: '15px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                    🎨 枠線の色
                                </p>
                                <ColorPalette
                                    value={borderColor}
                                    onChange={(newColor) => setAttributes({ borderColor: newColor })}
                                />
                            </div>
                        )}
                    </PanelBody>

                    {/* ── 8. エフェクト設定 ── */}
                    <PanelBody title="✨ エフェクト設定" initialOpen={false}>
                        <RangeControl
                            label="⏱️ アニメーション速度 (秒)"
                            value={transitionDuration}
                            onChange={(value) => setAttributes({ transitionDuration: value })}
                            min={0.1}
                            max={1}
                            step={0.1}
                            help="ホバー時のアニメーション速度"
                        />

                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
                                🎭 震えるアニメーション
                            </p>

                            <ToggleControl
                                label="震えるアニメーションを有効化"
                                checked={shakeAnimation}
                                onChange={(value) => setAttributes({ shakeAnimation: value })}
                                help="ボタンが定期的に横に震えます"
                            />

                            {shakeAnimation && (
                                <>
                                    <SelectControl
                                        label="震えの強さ"
                                        value={shakeIntensity}
                                        options={[
                                            { label: '弱い', value: 'light' },
                                            { label: '普通', value: 'normal' },
                                            { label: '強い', value: 'strong' }
                                        ]}
                                        onChange={(value) => setAttributes({ shakeIntensity: value })}
                                    />

                                    <RangeControl
                                        label="震える間隔 (秒)"
                                        value={shakeInterval}
                                        onChange={(value) => setAttributes({ shakeInterval: value })}
                                        min={2}
                                        max={10}
                                        step={0.5}
                                        help="何秒ごとに震えるか"
                                    />
                                </>
                            )}
                        </div>
                    </PanelBody>

                    {/* ── 9. 影の設定 ── */}
                    <PanelBody title="🌑 影の設定" initialOpen={false}>
                        <RangeControl
                            label="➡️ 影の横方向 (px)"
                            value={shadowX}
                            onChange={(value) => setAttributes({ shadowX: value })}
                            min={-20}
                            max={20}
                            help="プラスで右、マイナスで左に影が移動します"
                        />

                        <RangeControl
                            label="⬇️ 影の縦方向 (px)"
                            value={shadowY}
                            onChange={(value) => setAttributes({ shadowY: value })}
                            min={-20}
                            max={20}
                            help="プラスで下、マイナスで上に影が移動します"
                        />

                        <RangeControl
                            label="💫 影のぼかし (px)"
                            value={shadowBlur}
                            onChange={(value) => setAttributes({ shadowBlur: value })}
                            min={0}
                            max={50}
                            help="数値が大きいほど影がぼやけます"
                        />

                        <RangeControl
                            label="👻 影の透明度"
                            value={shadowOpacity}
                            onChange={(value) => setAttributes({ shadowOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                            help="0で透明、1で不透明になります"
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ---- エディタープレビュー ---- */}
                <div {...blockProps}>
                    <div className={wrapBtnClassName}>
                        <a 
                            className={`lw_btn_a ${shakeAnimation ? `lw_btn_shake_${shakeIntensity}` : ''}`}
                            style={{
                                '--hover-bg': bgColorHover,
                                '--transition-duration': `${transitionDuration}s`,
                                '--max-width-sp': `${maxWidthSp}px`,
                                '--shake-interval': `${shakeInterval}s`,
                                '--font-size-main': `${fontSizeMain}px`,
                                '--font-size-main-sp': `${fontSizeMainSp}px`,
                                '--font-size-sub': `${fontSizeSub}px`,
                                maxWidth: `${maxWidth}px`,
                                padding: `${paddingY}em ${paddingX}em`,
                                background: bgColor,
                                border: `${borderWidth}px solid ${borderColor}`,
                                borderRadius: `${borderRadius}px`,
                                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                            }}
                        >
                            {textSub && (
                                <span 
                                    className="text_sub"
                                    style={{
                                        color: textColorSub,
                                        fontWeight: fontWeightSub,
                                        fontSize: `${fontSizeSub}px`
                                    }}
                                    data-lw_font_set={FontSet}
                                >
                                    <RichText
                                        value={textSub}
                                        onChange={(newText) => setAttributes({ textSub: newText })}
                                        placeholder="サブテキストを入力"
                                    />
                                </span>
                            )}
                            <span 
                                className="text_main"
                                style={{
                                    color: textColorMain,
                                    fontWeight: fontWeightMain,
                                    fontSize: `${fontSizeMain}px`
                                }}
                                data-lw_font_set={FontSet}
                            >
                                {iconMain && (
                                    <span 
                                        className="icon"
                                        dangerouslySetInnerHTML={{ __html: iconMain }}
                                        style={{ 
                                            fill: iconMainColor,
                                            width: `${iconMainSize}px`,
                                            marginRight: `${iconMainMarginRight}px`,
                                            marginLeft: `${iconMainMarginLeft}px`
                                        }}
                                    />
                                )}
                                <RichText
                                    value={textMain}
                                    onChange={(newText) => setAttributes({ textMain: newText })}
                                    placeholder="メインテキストを入力"
                                    multiline={false}
                                />
                            </span>
                        </a>
                    </div>
                </div>
            </>
        );
    },

    /* ---------- 保存 ---------- */
    save: (props) => {
        const { attributes } = props;
        const {
            textSub, textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgColor, bgColorHover,
            textColorMain, textColorSub,
            borderWidth, borderColor, borderRadius,
            iconMain, iconMainColor, iconMainSize, iconMainMarginRight, iconMainMarginLeft,
            FontSet, fontWeightMain, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp, paddingY, paddingX,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-button-3'
        });

        // wrap_btnのクラス名を生成
        let wrapBtnClassName = `wrap_btn ${btnAlign}`;
        if (btnAlignSp !== 'default' && btnAlignSp !== '') {
            wrapBtnClassName += ` sp_${btnAlignSp}`;
        }

        return (
            <div {...blockProps}>
                <div className={wrapBtnClassName}>
                    <a 
                        href={btnUrl || '#'}
                        target={openNewTab ? '_blank' : undefined}
                        rel={openNewTab ? 'noopener noreferrer' : undefined}
                        className={`lw_btn_a ${shakeAnimation ? `lw_btn_shake_${shakeIntensity}` : ''}`}
                        style={{
                            '--hover-bg': bgColorHover,
                            '--transition-duration': `${transitionDuration}s`,
                            '--max-width-sp': `${maxWidthSp}px`,
                            '--shake-interval': `${shakeInterval}s`,
                            '--font-size-main': `${fontSizeMain}px`,
                            '--font-size-main-sp': `${fontSizeMainSp}px`,
                            '--font-size-sub': `${fontSizeSub}px`,
                            maxWidth: `${maxWidth}px`,
                            padding: `${paddingY}em ${paddingX}em`,
                            background: bgColor,
                            border: `${borderWidth}px solid ${borderColor}`,
                            borderRadius: `${borderRadius}px`,
                            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                        }}
                    >
                        {textSub && (
                            <span 
                                className="text_sub"
                                style={{
                                    color: textColorSub,
                                    fontWeight: fontWeightSub,
                                    fontSize: `${fontSizeSub}px`
                                }}
                                data-lw_font_set={FontSet}
                            >
                                <RichText.Content value={textSub} />
                            </span>
                        )}
                        <span 
                            className="text_main"
                            style={{
                                color: textColorMain,
                                fontWeight: fontWeightMain,
                                fontSize: `${fontSizeMain}px`
                            }}
                            data-lw_font_set={FontSet}
                        >
                            {iconMain && (
                                <span 
                                    className="icon"
                                    dangerouslySetInnerHTML={{ __html: iconMain }}
                                    style={{ 
                                        fill: iconMainColor,
                                        width: `${iconMainSize}px`,
                                        marginRight: `${iconMainMarginRight}px`,
                                        marginLeft: `${iconMainMarginLeft}px`
                                    }}
                                />
                            )}
                            <RichText.Content value={textMain} />
                        </span>
                    </a>
                </div>
            </div>
        );
    }
});