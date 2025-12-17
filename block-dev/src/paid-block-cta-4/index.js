/**
 * CTA 04
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    InspectorControls,
    MediaUpload,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ColorPalette,
    RangeControl,
    TextControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import metadata from './block.json';

registerBlockType(metadata.name, {
    /**
     * =========================================
     * エディター(編集)用の表示
     * =========================================
     */
    edit: (props) => {
        const { attributes, setAttributes } = props;

        const {
            // --- CTA1 ---
            linkUrl1,
            mainTitle1,
            subTitle1,
            desc1,
            backgroundImage1,
            filterColor1,
            filterOpacity1,
            btnText1,
            bgColor1,
            textColor1,

            // --- CTA2 ---
            linkUrl2,
            mainTitle2,
            subTitle2,
            desc2,
            backgroundImage2,
            filterColor2,
            filterOpacity2,
            btnText2,
            bgColor2,
            textColor2,

            // --- 最大横幅 ---
            maxWidth,
        } = attributes;

        // === 画像変更ハンドラ ===
        const onChangeBgImage1 = (media) => {
            setAttributes({ backgroundImage1: media.url });
        };
        const onChangeBgImage2 = (media) => {
            setAttributes({ backgroundImage2: media.url });
        };

        // === 最大横幅設定ハンドラ ===
        const onChangeMaxWidth = (value) => setAttributes({ maxWidth: value });
        const onResetMaxWidth = () => setAttributes({ maxWidth: 0 });

        // useBlockProps で apiVersion 3 対応
        const blockProps = useBlockProps({
            className: `paid-block-cta-4 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        // === カラー設定用サンプル ===
        const colors = [
            { name: '青', color: '#268193' },
            { name: '赤', color: '#d00000' },
            { name: '緑', color: '#008000' },
            { name: '白', color: '#ffffff' },
            { name: '黒', color: '#000000' },
        ];

        return (
            <div {...blockProps}>
                <InspectorControls>
                    {/* 横幅の設定 */}
                    <PanelBody title="横幅の設定" initialOpen={false}>
                        <div style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '4px', 
                            padding: '15px', 
                            marginBottom: '15px',
                            backgroundColor: '#fafafa'
                        }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                                📐 最大横幅の設定
                            </p>
                            <RangeControl 
                                label={`最大横幅 ${maxWidth > 0 ? `(${maxWidth}px)` : '(未設定)'}`}
                                value={maxWidth}
                                onChange={onChangeMaxWidth}
                                min={800}
                                max={1600}
                                help="ブロック全体の最大横幅を設定します。0で未設定状態になります。"
                            />
                            {maxWidth > 0 && (
                                <Button 
                                    variant="secondary" 
                                    onClick={onResetMaxWidth}
                                    style={{ marginTop: '10px' }}
                                >
                                    🔄 リセット
                                </Button>
                            )}
                        </div>
                    </PanelBody>

                    <PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=NAqO2JgjzBo"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>
                    {/* ---- CTA1設定 ---- */}
                    <PanelBody title="CTA1設定" initialOpen={true}>
                        <TextControl
                            label="リンク先URL"
                            value={linkUrl1}
                            onChange={(value) => setAttributes({ linkUrl1: value })}
                        />
                        <MediaUpload
                            onSelect={onChangeBgImage1}
                            allowedTypes={['image']}
                            value={backgroundImage1}
                            render={({ open }) => (
                                <Fragment>
                                    {backgroundImage1 && (
                                        <img
                                            src={backgroundImage1}
                                            alt=""
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    )}
                                    <Button
                                        onClick={open}
                                        variant="secondary"
                                        style={{ marginTop: '8px' }}
                                    >
                                        背景画像を選択
                                    </Button>
                                    {backgroundImage1 && (
                                        <Button
                                            onClick={() =>
                                                setAttributes({ backgroundImage1: '' })
                                            }
                                            variant="secondary"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            削除
                                        </Button>
                                    )}
                                </Fragment>
                            )}
                        />
                        <br /><br />
                        <p>フィルター色</p>
                        <ColorPalette
                            colors={colors}
                            value={filterColor1}
                            onChange={(color) => setAttributes({ filterColor1: color })}
                        />
                        <RangeControl
                            label={`フィルター不透明度 (${filterOpacity1}%)`}
                            value={filterOpacity1}
                            onChange={(value) =>
                                setAttributes({ filterOpacity1: value })
                            }
                            min={0}
                            max={100}
                        />

                        <hr />

                        <hr />
                        <p>ボタン背景色</p>
                        <ColorPalette
                            colors={colors}
                            value={bgColor1}
                            onChange={(color) => setAttributes({ bgColor1: color })}
                        />
                        <p>ボタン文字色</p>
                        <ColorPalette
                            colors={colors}
                            value={textColor1}
                            onChange={(color) => setAttributes({ textColor1: color })}
                        />
                    </PanelBody>

                    {/* ---- CTA2設定 ---- */}
                    <PanelBody title="CTA2設定" initialOpen={true}>
                        <TextControl
                            label="リンク先URL"
                            value={linkUrl2}
                            onChange={(value) => setAttributes({ linkUrl2: value })}
                        />
                        <MediaUpload
                            onSelect={onChangeBgImage2}
                            allowedTypes={['image']}
                            value={backgroundImage2}
                            render={({ open }) => (
                                <Fragment>
                                    {backgroundImage2 && (
                                        <img
                                            src={backgroundImage2}
                                            alt=""
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    )}
                                    <Button
                                        onClick={open}
                                        variant="secondary"
                                        style={{ marginTop: '8px' }}
                                    >
                                        背景画像を選択
                                    </Button>
                                    {backgroundImage2 && (
                                        <Button
                                            onClick={() =>
                                                setAttributes({ backgroundImage2: '' })
                                            }
                                            variant="secondary"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            削除
                                        </Button>
                                    )}
                                </Fragment>
                            )}
                        />
                        <br /><br />
                        <p>フィルター色</p>
                        <ColorPalette
                            colors={colors}
                            value={filterColor2}
                            onChange={(color) => setAttributes({ filterColor2: color })}
                        />
                        <RangeControl
                            label={`フィルター不透明度 (${filterOpacity2}%)`}
                            value={filterOpacity2}
                            onChange={(value) =>
                                setAttributes({ filterOpacity2: value })
                            }
                            min={0}
                            max={100}
                        />

                        <hr />
                        <p>ボタン背景色</p>
                        <ColorPalette
                            colors={colors}
                            value={bgColor2}
                            onChange={(color) => setAttributes({ bgColor2: color })}
                        />
                        <p>ボタン文字色</p>
                        <ColorPalette
                            colors={colors}
                            value={textColor2}
                            onChange={(color) => setAttributes({ textColor2: color })}
                        />
                    </PanelBody>
                </InspectorControls>

                {/*
                  =========================
                  エディター上の表示
                  （保存時と同じHTML構造）
                  =========================
                */}
                <div className="paid-block-cta-4__inner">
                    <ul>
                        {/* ==== CTA1 ==== */}
                        <li>
                            <div className="a">
                                <h2 className="ttl parts_page_ttl_main" data-lw_font_set="Lato">
                                    <div className="main">
                                        <RichText
                                            value={mainTitle1}
                                            onChange={(value) =>
                                                setAttributes({ mainTitle1: value })
                                            }
                                            placeholder="Recruit"
                                        />
                                    </div>
                                    <div className="sub">
                                        <RichText
                                            value={subTitle1}
                                            onChange={(value) =>
                                                setAttributes({ subTitle1: value })
                                            }
                                            placeholder="サブテキスト"
                                        />
                                    </div>
                                </h2>
                                <p>
                                    <RichText
                                        value={desc1}
                                        onChange={(value) =>
                                            setAttributes({ desc1: value })
                                        }
                                        placeholder="◯では、一緒に働くスタッフを..."
                                    />
                                </p>
                                <div className="btn">
                                    <RichText
                                        tagName="div"
                                        value={btnText1}
                                        onChange={(value) => setAttributes({ btnText1: value })}
                                        placeholder="詳細はこちら"
                                        style= {{
                                            color: textColor1,
                                        }}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        style ={{fill:textColor1}}
                                    >
                                        <path d="M342.6 233.4c12.5 12.5 
                                            12.5 32.8 0 45.3l-192 192c-12.5 
                                            12.5-32.8 12.5-45.3 0s-12.5-32.8 
                                            0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 
                                            0-45.3s32.8-12.5 45.3 0l192 192z" 
                                        />
                                    </svg>
                                    <div className="btn_bg"
                                        style={{
                                            backgroundColor: bgColor1,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div
                                className="this_filter"
                                style={{
                                    background: filterColor1,
                                    opacity: filterOpacity1 + '%',
                                }}
                            ></div>
                            <div
                                className="bg_img"
                            >
                                {backgroundImage1 && (
                                    <img src={backgroundImage1} alt="CTA1背景" />
                                )}
                            </div>
                        </li>

                        {/* ==== CTA2 ==== */}
                        <li>
                            <div className="a">
                                <h2 className="ttl parts_page_ttl_main" data-lw_font_set="Lato">
                                    <div className="main">
                                        <RichText
                                            value={mainTitle2}
                                            onChange={(value) =>
                                                setAttributes({ mainTitle2: value })
                                            }
                                            placeholder="Contact"
                                        />
                                    </div>
                                    <div className="sub">
                                        <RichText
                                            value={subTitle2}
                                            onChange={(value) =>
                                                setAttributes({ subTitle2: value })
                                            }
                                            placeholder="サブテキスト"
                                        />
                                    </div>
                                </h2>
                                <p>
                                    <RichText
                                        value={desc2}
                                        onChange={(value) =>
                                            setAttributes({ desc2: value })
                                        }
                                        placeholder="◯では、一緒に働くスタッフを..."
                                    />
                                </p>
                                <div className="btn">
                                    <RichText
                                        tagName="div"
                                        value={btnText2}
                                        onChange={(value) => setAttributes({ btnText2: value })}
                                        placeholder="詳細はこちら"
                                        style= {{
                                            color: textColor2,
                                        }}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        style ={{fill:textColor2}}
                                    >
                                        <path d="M342.6 233.4c12.5 12.5 
                                            12.5 32.8 0 45.3l-192 192c-12.5 
                                            12.5-32.8 12.5-45.3 0s-12.5-32.8 
                                            0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 
                                            0-45.3s32.8-12.5 45.3 0l192 192z" 
                                        />
                                    </svg>
                                    <div className="btn_bg"
                                        style={{
                                            backgroundColor: bgColor2,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div
                                className="this_filter"
                                style={{
                                    background: filterColor2,
                                    opacity: filterOpacity2 + '%',
                                }}
                            ></div>
                            <div
                                className="bg_img"
                            >
                                {backgroundImage2 && (
                                    <img src={backgroundImage2} alt="CTA2背景" />
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    },

    /**
     * =========================================
     * 保存時(フロントエンド)用の表示
     * =========================================
     */
    save: (props) => {
        const { attributes } = props;

        const {
            // CTA1
            linkUrl1,
            mainTitle1,
            subTitle1,
            desc1,
            backgroundImage1,
            filterColor1,
            filterOpacity1,
            btnText1,
            bgColor1,
            textColor1,

            // CTA2
            linkUrl2,
            mainTitle2,
            subTitle2,
            desc2,
            backgroundImage2,
            filterColor2,
            filterOpacity2,
            btnText2,
            bgColor2,
            textColor2,

            // 最大横幅
            maxWidth,
        } = attributes;

        // useBlockProps.save() で apiVersion 3 対応
        const blockProps = useBlockProps.save({
            className: `paid-block-cta-4 ${maxWidth > 0 ? 'max_w' : ''}`,
            style: maxWidth > 0 ? { maxWidth: maxWidth + 'px' } : {}
        });

        return (
            <div {...blockProps}>
                <ul>
                    {/* ==== CTA1 ==== */}
                    <li>
                        <a href={linkUrl1 || '#'}>
                            <h2 className="ttl parts_page_ttl_main" data-lw_font_set="Lato">
                                <div className="main">
                                    <RichText.Content value={mainTitle1} />
                                </div>
                                <div className="sub">
                                    <RichText.Content value={subTitle1} />
                                </div>
                            </h2>
                            <p>
                                <RichText.Content value={desc1} />
                            </p>
                            <div className="btn">
                                <RichText.Content tagName="div" value={btnText1}  style= {{color: textColor1,  }} />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    style ={{fill:textColor1}}
                                >
                                    <path d="M342.6 233.4c12.5 12.5 
                                        12.5 32.8 0 45.3l-192 192c-12.5 
                                        12.5-32.8 12.5-45.3 0s-12.5-32.8 
                                        0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 
                                        0-45.3s32.8-12.5 45.3 0l192 192z" 
                                    />
                                </svg>
                                <div className="btn_bg"
                                  style={{
                                    backgroundColor: bgColor1,
                                    color: textColor1,
                                }}
                                ></div>
                            </div>
                        </a>
                        <div
                            className="this_filter"
                            style={{
                                background: filterColor1,
                                opacity: filterOpacity1 + '%',
                            }}
                        ></div>
                        <div
                            className="bg_img">
                            {backgroundImage1 && (
                                <img src={backgroundImage1} alt="CTA1背景" />
                            )}
                        </div>
                    </li>

                    {/* ==== CTA2 ==== */}
                    <li>
                        <a href={linkUrl2 || '#'}>
                            <h2 className="ttl parts_page_ttl_main">
                                <div className="main" data-lw_font_set="Lato">
                                    <RichText.Content value={mainTitle2} />
                                </div>
                                <div className="sub">
                                    <RichText.Content value={subTitle2} />
                                </div>
                            </h2>
                            <p>
                                <RichText.Content value={desc2} />
                            </p>
                            <div className="btn">
                                <RichText.Content tagName="div" value={btnText2}  style= {{color: textColor2, }} />
                                
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    style ={{fill:textColor2}}
                                >
                                    <path d="M342.6 233.4c12.5 12.5 
                                        12.5 32.8 0 45.3l-192 192c-12.5 
                                        12.5-32.8 12.5-45.3 0s-12.5-32.8 
                                        0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 
                                        0-45.3s32.8-12.5 45.3 0l192 192z" 
                                    />
                                </svg>
                                <div className="btn_bg"
                                  style={{
                                    backgroundColor: bgColor2,
                                    color: textColor2,
                                }}
                                ></div>
                            </div>
                        </a>
                        <div
                            className="this_filter"
                            style={{
                                background: filterColor2,
                                opacity: filterOpacity2 + '%',
                            }}
                        ></div>
                        <div
                            className="bg_img">
                            {backgroundImage2 && (
                                <img src={backgroundImage2} alt="CTA2背景" />
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        );
    },
});