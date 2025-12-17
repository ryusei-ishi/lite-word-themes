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
    rightButtonIconSvgArr,
    ButtonBackgroundOptionsArr
} from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

// オプション配列を定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconMainOptions = leftButtonIconSvgArr();
const iconRightOptions = rightButtonIconSvgArr();
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType(metadata.name, {
    /* ---------- 編集 ---------- */
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            textSub, textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgColor, bgColorHover, bgColorSub,
            textColorMain, textColorSub,
            borderWidth, borderColor, borderRadius,
            iconMain, iconRight, iconMainColor, iconRightColor,
            iconMainSize, iconRightSize, iconMainMarginRight,
            FontSet, fontWeight, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-pr-button-1'
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
                                value={fontWeight}
                                options={fontWeightOptions}
                                onChange={(newWeight) => setAttributes({ fontWeight: newWeight })}
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

                        <div style={{ marginBottom: '20px' }}>
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

                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                🏷️ サブテキストの背景
                            </p>
                            <SelectControl
                                value={bgColorSub}
                                options={bgOptions}
                                onChange={(newBg) => setAttributes({ bgColorSub: newBg })}
                                help="プリセットから選択（グラデーション対応）"
                            />
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                                    カスタムカラー:
                                </p>
                                <ColorPalette
                                    value={bgColorSub && !bgColorSub.includes('gradient') && !bgColorSub.includes('linear') ? bgColorSub : ''}
                                    onChange={(newColor) => setAttributes({ bgColorSub: newColor })}
                                />
                            </div>
                        </div>
                    </PanelBody>

                    {/* ── 5. アイコン設定 ── */}
                    <PanelBody title="✨ アイコン設定" initialOpen={false}>
                        <div style={{ marginBottom: '30px' }}>
                            <SelectControl
                                label="🎯 メインアイコンの種類"
                                value={iconMain}
                                options={iconMainOptions}
                                onChange={(newIcon) => setAttributes({ iconMain: newIcon })}
                                help="メインテキストの左側に表示するアイコン"
                            />
                            {iconMain && (
                                <>
                                    <RangeControl
                                        label="📏 メインアイコンのサイズ (px)"
                                        value={iconMainSize}
                                        onChange={(value) => setAttributes({ iconMainSize: value })}
                                        min={6}
                                        max={32}
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
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            🎨 メインアイコンの色
                                        </p>
                                        <ColorPalette
                                            value={iconMainColor}
                                            onChange={(newColor) => setAttributes({ iconMainColor: newColor })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <SelectControl
                                label="➡️ 右側アイコンの種類"
                                value={iconRight}
                                options={iconRightOptions}
                                onChange={(newIcon) => setAttributes({ iconRight: newIcon })}
                                help="ボタン右側に表示するアイコン"
                            />
                            {iconRight && (
                                <>
                                    <RangeControl
                                        label="📏 右側アイコンのサイズ (px)"
                                        value={iconRightSize}
                                        onChange={(value) => setAttributes({ iconRightSize: value })}
                                        min={12}
                                        max={40}
                                        help="アイコンの大きさを設定します"
                                    />
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            🎨 右側アイコンの色
                                        </p>
                                        <ColorPalette
                                            value={iconRightColor}
                                            onChange={(newColor) => setAttributes({ iconRightColor: newColor })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </PanelBody>

                    {/* ── 6. ボタンの形状 ── */}
                    <PanelBody title="📏 ボタンの形状" initialOpen={false}>
                        <RangeControl
                            label="📐 最大横幅 PC (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={200}
                            max={500}
                            help="PC表示時のボタンの最大横幅"
                        />

                        <RangeControl
                            label="📱 最大横幅 SP (px)"
                            value={maxWidthSp}
                            onChange={(value) => setAttributes({ maxWidthSp: value })}
                            min={200}
                            max={400}
                            help="スマホ表示時のボタンの最大横幅"
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
                                background: bgColor,
                                border: `${borderWidth}px solid ${borderColor}`,
                                borderRadius: `${borderRadius}px`,
                                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                            }}
                        >
                            <span className="text_sub">
                                <span 
                                    className="in"
                                    style={{
                                        background: bgColorSub,
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
                                <span 
                                    className="down"
                                    style={{
                                        background: bgColorSub,
                                    }}
                                ></span>
                            </span>
                            <span 
                                className="text_main"
                                style={{
                                    color: textColorMain,
                                    fontWeight: fontWeight,
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
                                            marginRight: `${iconMainMarginRight}px`
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
                            {iconRight && (
                                <span 
                                    className="icon_right"
                                    dangerouslySetInnerHTML={{ __html: iconRight }}
                                    style={{ 
                                        fill: iconRightColor,
                                        width: `${iconRightSize}px`
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
            bgColor, bgColorHover, bgColorSub,
            textColorMain, textColorSub,
            borderWidth, borderColor, borderRadius,
            iconMain, iconRight, iconMainColor, iconRightColor,
            iconMainSize, iconRightSize, iconMainMarginRight,
            FontSet, fontWeight, fontWeightSub,
            fontSizeMain, fontSizeMainSp, fontSizeSub,
            maxWidth, maxWidthSp,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-button-1'
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
                            background: bgColor,
                            border: `${borderWidth}px solid ${borderColor}`,
                            borderRadius: `${borderRadius}px`,
                            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                        }}
                    >
                        <span className="text_sub">
                            <span 
                                className="in"
                                style={{
                                    background: bgColorSub,
                                    color: textColorSub,
                                    fontWeight: fontWeightSub,
                                    fontSize: `${fontSizeSub}px`
                                }}
                                data-lw_font_set={FontSet}
                            >
                                <RichText.Content value={textSub} />
                            </span>
                            <span 
                                className="down"
                                style={{
                                    background: bgColorSub,
                                }}
                            ></span>
                        </span>
                        <span 
                            className="text_main"
                            style={{
                                color: textColorMain,
                                fontWeight: fontWeight,
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
                                        marginRight: `${iconMainMarginRight}px`
                                    }}
                                />
                            )}
                            <RichText.Content value={textMain} />
                        </span>
                        {iconRight && (
                            <span 
                                className="icon_right"
                                dangerouslySetInnerHTML={{ __html: iconRight }}
                                style={{ 
                                    fill: iconRightColor,
                                    width: `${iconRightSize}px`
                                }}
                            />
                        )}
                    </a>
                </div>
            </div>
        );
    }
});