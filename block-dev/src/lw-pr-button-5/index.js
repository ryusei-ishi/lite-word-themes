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
import metadata from './block.json';

// オプション配列を定義
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();
const iconMainOptions = leftButtonIconSvgArr();
const bgOptions = ButtonBackgroundOptionsArr();

registerBlockType(metadata.name, {
    /* ---------- 編集 ---------- */
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgColor, bgColorHover,
            textColorMain,
            borderWidth, borderColor, borderRadius,
            iconMain, iconMainColor, iconMainSize, iconMainMarginRight,
            FontSet, fontWeight,
            fontSizeMain, fontSizeMainSp,
            paddingY, paddingX,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-pr-button-5'
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
                            min={12}
                            max={24}
                        />

                        <RangeControl
                            label="文字サイズ SP (px)"
                            value={fontSizeMainSp}
                            onChange={(value) => setAttributes({ fontSizeMainSp: value })}
                            min={10}
                            max={20}
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
                            help="テキストの左側に表示するアイコン"
                        />
                        {iconMain && (
                            <>
                                <RangeControl
                                    label="📏 アイコンのサイズ (px)"
                                    value={iconMainSize}
                                    onChange={(value) => setAttributes({ iconMainSize: value })}
                                    min={16}
                                    max={40}
                                    help="アイコンの大きさを設定します"
                                />
                                <RangeControl
                                    label="↔️ アイコンの右余白 (px)"
                                    value={iconMainMarginRight}
                                    onChange={(value) => setAttributes({ iconMainMarginRight: value })}
                                    min={0}
                                    max={16}
                                    help="アイコンとテキストの間隔を設定します"
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
                            label="📦 上下パディング (em)"
                            value={paddingY}
                            onChange={(value) => setAttributes({ paddingY: value })}
                            min={0.3}
                            max={2}
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
                                '--shake-interval': `${shakeInterval}s`,
                                '--font-size-main': `${fontSizeMain}px`,
                                '--font-size-main-sp': `${fontSizeMainSp}px`,
                                padding: `${paddingY}em ${paddingX}em`,
                                background: bgColor,
                                border: `${borderWidth}px solid ${borderColor}`,
                                borderRadius: `${borderRadius}px`,
                                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                            }}
                        >
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
                                    placeholder="テキストを入力"
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
            textMain, btnUrl, openNewTab,
            btnAlign, btnAlignSp,
            bgColor, bgColorHover,
            textColorMain,
            borderWidth, borderColor, borderRadius,
            iconMain, iconMainColor, iconMainSize, iconMainMarginRight,
            FontSet, fontWeight,
            fontSizeMain, fontSizeMainSp,
            paddingY, paddingX,
            transitionDuration,
            shakeAnimation, shakeInterval, shakeIntensity,
            shadowX, shadowY, shadowBlur, shadowOpacity
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-button-5'
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
                            '--shake-interval': `${shakeInterval}s`,
                            '--font-size-main': `${fontSizeMain}px`,
                            '--font-size-main-sp': `${fontSizeMainSp}px`,
                            padding: `${paddingY}em ${paddingX}em`,
                            background: bgColor,
                            border: `${borderWidth}px solid ${borderColor}`,
                            borderRadius: `${borderRadius}px`,
                            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
                        }}
                    >
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
                    </a>
                </div>
            </div>
        );
    }
});