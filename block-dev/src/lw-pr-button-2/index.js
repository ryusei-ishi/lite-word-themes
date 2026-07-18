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
    rightButtonIconSvgArr,
    ButtonBackgroundOptionsArr
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// オプション配列を定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconOptions = rightButtonIconSvgArr();
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType(metadata.name, {
    /* ---------- 編集 ---------- */
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            textSub, textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgGradient, bgGradientHover, textColorMain, textColorSub,
            FontSet, fontWeightMain, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp, borderRadius,
            paddingVertical, paddingHorizontal, subMarginBottom,
            iconRight, iconRightColor, iconRightSize, iconRightPosition,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        // ブロックのクラス名を生成
        let blockClassName = `lw-pr-button-2 ${btnAlign}`;
        if (btnAlignSp !== 'default' && btnAlignSp !== '') {
            blockClassName += ` sp_${btnAlignSp}`;
        }

        const blockProps = useBlockProps({
            className: blockClassName
        });

        return (
            <>
                <InspectorControls>
                    {/* ── 1. 基本設定 ── */}
                    <PanelBody title="基本設定" initialOpen={true}>
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
                    <PanelBody title="配置設定" initialOpen={false}>
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
                    <PanelBody title="フォント設定" initialOpen={false}>
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
                                min={12}
                                max={24}
                            />

                            <RangeControl
                                label="下の余白 (px)"
                                value={subMarginBottom}
                                onChange={(value) => setAttributes({ subMarginBottom: value })}
                                min={0}
                                max={20}
                                help="サブテキストとボタンの間隔"
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

                    {/* ── 4. 背景設定 ── */}
                    <PanelBody title="色設定" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🌈 ボタンの背景
                            </p>
                            <SelectControl
                                value={bgGradient}
                                options={bgOptions}
                                onChange={(newBg) => setAttributes({ bgGradient: newBg })}
                                help="プリセットから選択（グラデーション対応）"
                            />
                            {!bgGradient.includes('gradient') && !bgGradient.includes('linear') && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                                        カスタムカラー:
                                    </p>
                                    <ColorPalette
                                        value={bgGradient}
                                        onChange={(newColor) => setAttributes({ bgGradient: newColor })}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🖱️ ホバー時の背景
                            </p>
                            <SelectControl
                                value={bgGradientHover}
                                options={bgOptions}
                                onChange={(newBg) => setAttributes({ bgGradientHover: newBg })}
                                help="プリセットから選択（グラデーション対応）"
                            />
                            {!bgGradientHover.includes('gradient') && !bgGradientHover.includes('linear') && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                                        カスタムカラー:
                                    </p>
                                    <ColorPalette
                                        value={bgGradientHover}
                                        onChange={(newColor) => setAttributes({ bgGradientHover: newColor })}
                                    />
                                </div>
                            )}
                        </div>
                    </PanelBody>

                    {/* ── 5. アイコン設定 ── */}
                    <PanelBody title="アイコン設定" initialOpen={false}>
                        <SelectControl
                            label="➡️ 右側アイコンの種類"
                            value={iconRight}
                            options={iconOptions}
                            onChange={(newIcon) => setAttributes({ iconRight: newIcon })}
                            help="ボタン右側に表示するアイコン（任意）"
                        />
                        
                        {iconRight && (
                            <>
                                <RangeControl
                                    label="📏 アイコンのサイズ (px)"
                                    value={iconRightSize}
                                    onChange={(value) => setAttributes({ iconRightSize: value })}
                                    min={12}
                                    max={40}
                                />

                                <RangeControl
                                    label="↔️ 右端からの距離 (px)"
                                    value={iconRightPosition}
                                    onChange={(value) => setAttributes({ iconRightPosition: value })}
                                    min={10}
                                    max={40}
                                />

                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                        🎨 アイコンの色
                                    </p>
                                    <ColorPalette
                                        value={iconRightColor}
                                        onChange={(newColor) => setAttributes({ iconRightColor: newColor })}
                                    />
                                </div>
                            </>
                        )}
                    </PanelBody>

                    {/* ── 6. サイズ・形状設定 ── */}
                    <PanelBody title="レイアウト設定" initialOpen={false}>
                        <RangeControl
                            label="📐 最大横幅 PC (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={200}
                            max={500}
                        />

                        <RangeControl
                            label="📱 最大横幅 SP (px)"
                            value={maxWidthSp}
                            onChange={(value) => setAttributes({ maxWidthSp: value })}
                            min={200}
                            max={400}
                        />

                        <RangeControl
                            label="🎪 角の丸み (px)"
                            value={borderRadius}
                            onChange={(value) => setAttributes({ borderRadius: value })}
                            min={0}
                            max={100}
                            help="数値が大きいほど角が丸くなります"
                        />

                        <RangeControl
                            label="↕️ 上下の余白 (em)"
                            value={paddingVertical}
                            onChange={(value) => setAttributes({ paddingVertical: value })}
                            min={0.5}
                            max={3}
                            step={0.1}
                        />

                        <RangeControl
                            label="↔️ 左右の余白 (em)"
                            value={paddingHorizontal}
                            onChange={(value) => setAttributes({ paddingHorizontal: value })}
                            min={0.5}
                            max={3}
                            step={0.1}
                        />
                    </PanelBody>

                    {/* ── 7. エフェクト設定 ── */}
                    <PanelBody title="エフェクト設定" initialOpen={false}>
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

                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
                                🌑 影の設定
                            </p>

                            <RangeControl
                                label="横方向 (px)"
                                value={shadowX}
                                onChange={(value) => setAttributes({ shadowX: value })}
                                min={-20}
                                max={20}
                            />

                            <RangeControl
                                label="縦方向 (px)"
                                value={shadowY}
                                onChange={(value) => setAttributes({ shadowY: value })}
                                min={-20}
                                max={20}
                            />

                            <RangeControl
                                label="ぼかし (px)"
                                value={shadowBlur}
                                onChange={(value) => setAttributes({ shadowBlur: value })}
                                min={0}
                                max={50}
                            />

                            <RangeControl
                                label="透明度"
                                value={shadowOpacity}
                                onChange={(value) => setAttributes({ shadowOpacity: value })}
                                min={0}
                                max={1}
                                step={0.1}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>

                {/* ---- エディタープレビュー ---- */}
                <div {...blockProps}>
                    <div className="wrap_btn">
                        <span 
                            className="text_sub"
                            style={{
                                marginBottom: `${subMarginBottom}px`,
                                color: textColorSub,
                                fontSize: `${fontSizeSub}px`,
                                fontWeight: fontWeightSub
                            }}
                            data-lw_font_set={FontSet}
                        >
                            <RichText
                                value={textSub}
                                onChange={(newText) => setAttributes({ textSub: newText })}
                                placeholder="サブテキストを入力"
                            />
                        </span>
                        <a 
                            className={`lw_btn_a ${shakeAnimation ? `lw_btn_shake_${shakeIntensity}` : ''}`}
                            style={{
                                padding: `${paddingVertical}em ${paddingHorizontal}em`,
                                maxWidth: `${maxWidth}px`,
                                background: bgGradient,
                                borderRadius: `${borderRadius}px`,
                                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`,
                                '--hover-bg': bgGradientHover,
                                '--transition-duration': `${transitionDuration}s`,
                                '--shake-interval': `${shakeInterval}s`,
                                '--max-width-sp': `${maxWidthSp}px`,
                                '--font-size-main-sp': `${fontSizeMainSp}px`
                            }}
                        >
                            <span 
                                className="text_main"
                                style={{
                                    fontSize: `${fontSizeMain}px`,
                                    fontWeight: fontWeightMain,
                                    color: textColorMain
                                }}
                                data-lw_font_set={FontSet}
                            >
                                <RichText
                                    value={textMain}
                                    onChange={(newText) => setAttributes({ textMain: newText })}
                                    placeholder="メインテキストを入力"
                                />
                            </span>
                            {iconRight && (
                                <span 
                                    className="icon"
                                    dangerouslySetInnerHTML={{ __html: iconRight }}
                                    style={{
                                        right: `${iconRightPosition}px`,
                                        width: `${iconRightSize}px`,
                                        '--icon-color': iconRightColor
                                    }}
                                />
                            )}
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
            bgGradient, bgGradientHover, textColorMain, textColorSub,
            FontSet, fontWeightMain, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp, borderRadius,
            paddingVertical, paddingHorizontal, subMarginBottom,
            iconRight, iconRightColor, iconRightSize, iconRightPosition,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        // ブロックのクラス名を生成
        let blockClassName = `lw-pr-button-2 ${btnAlign}`;
        if (btnAlignSp !== 'default' && btnAlignSp !== '') {
            blockClassName += ` sp_${btnAlignSp}`;
        }

        const blockProps = useBlockProps.save({
            className: blockClassName
        });

        return (
            <div {...blockProps}>
                <div className="wrap_btn">
                    <span 
                        className="text_sub"
                        style={{
                            marginBottom: `${subMarginBottom}px`,
                            color: textColorSub,
                            fontSize: `${fontSizeSub}px`,
                            fontWeight: fontWeightSub
                        }}
                        data-lw_font_set={FontSet}
                    >
                        <RichText.Content value={textSub} />
                    </span>
                    <a 
                        href={btnUrl || '#'}
                        target={openNewTab ? '_blank' : undefined}
                        rel={openNewTab ? 'noopener noreferrer' : undefined}
                        className={`lw_btn_a ${shakeAnimation ? `lw_btn_shake_${shakeIntensity}` : ''}`}
                        style={{
                            padding: `${paddingVertical}em ${paddingHorizontal}em`,
                            maxWidth: `${maxWidth}px`,
                            background: bgGradient,
                            borderRadius: `${borderRadius}px`,
                            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`,
                            '--hover-bg': bgGradientHover,
                            '--transition-duration': `${transitionDuration}s`,
                            '--shake-interval': `${shakeInterval}s`,
                            '--max-width-sp': `${maxWidthSp}px`,
                            '--font-size-main-sp': `${fontSizeMainSp}px`
                        }}
                    >
                        <span 
                            className="text_main"
                            style={{
                                fontSize: `${fontSizeMain}px`,
                                fontWeight: fontWeightMain,
                                color: textColorMain
                            }}
                            data-lw_font_set={FontSet}
                        >
                            <RichText.Content value={textMain} />
                        </span>
                        {iconRight && (
                            <span 
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: iconRight }}
                                style={{
                                    right: `${iconRightPosition}px`,
                                    width: `${iconRightSize}px`,
                                    '--icon-color': iconRightColor
                                }}
                            />
                        )}
                    </a>
                </div>
            </div>
        );
    }
});