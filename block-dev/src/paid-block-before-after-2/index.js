import { registerBlockType } from '@wordpress/blocks';
import {
    MediaUpload,
    InspectorControls,
    RichText,
    ColorPalette
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    RangeControl
} from '@wordpress/components';

import './style.scss';
import './editor.scss';

/**
 * items のデフォルト値を返す関数
 * - 直接配列を default に指定すると、ブロックインスタンス間で参照が共有される場合がある
 * - 必ず関数で返すことで、ブロックごとに独立した配列を得られる
 */
const getDefaultItems = () => ([
    {
        // Before画像
        imgUrl: 'https://lite-word.com/sample_img/women/6_2.webp',
    },
    {
        // After画像
        imgUrl: 'https://lite-word.com/sample_img/women/6.webp',
    },
]);

registerBlockType('wdl/paid-block-before-after-2', {
    title: 'ビフォーアフター 02',
    icon: 'images-alt2',
    category: 'liteword-other',
    supports: {
        anchor: true,
    },
    attributes: {
        // ラベル文言
        beforeLabel: {
            type: 'string',
            default: 'before',
        },
        afterLabel: {
            type: 'string',
            default: 'after',
        },
        // ラベル色
        labelColorBefore: {
            type: 'string',
            default: 'rgba(209, 77, 77, 0.85)', // 黒色に設定（必要に応じて変更）
        },
        labelColorAfter: {
            type: 'string',
            default: 'rgba(77, 209, 77, 0.85)', // 黒色に設定（必要に応じて変更）
        },
        // 最大横幅(px)
        maxWidth: {
            type: 'number',
            default: "1280",
        },
        // 縦比 
        aspectRatioH: {
            type: 'number',
            default: 800,
        },
        // 画像2枚 (Before/After)
        items: {
            type: 'array',
            default: getDefaultItems,
        },
    },

    edit: (props) => {
        const { attributes, setAttributes } = props;
        let {
            beforeLabel,
            afterLabel,
            labelColorBefore,
            labelColorAfter,
            maxWidth,
            aspectRatioH,
            items
        } = attributes;

        // items が配列でなければ初期化
        if (!Array.isArray(items)) {
            items = getDefaultItems();
            setAttributes({ items });
        }

        // ========== イベントハンドラ ==========
        const onChangeBeforeLabel = (value) => {
            setAttributes({ beforeLabel: value });
        };
        const onChangeAfterLabel = (value) => {
            setAttributes({ afterLabel: value });
        };
        // ラベル色を変更
        const onChangeLabelColorBefore = (color) => {
            setAttributes({ labelColorBefore: color });
        };
        const onChangeLabelColorAfter = (color) => {
            setAttributes({ labelColorAfter: color });
        };

        // 画像更新 (0=Before, 1=After)
        const updateItem = (index, url) => {
            const newItems = [...items];
            newItems[index].imgUrl = url;
            setAttributes({ items: newItems });
        };

        // 横幅/縦比スライダー
        const onChangeMaxWidth = (value) => {
            setAttributes({ maxWidth: value });
        };
        const onChangeAspectRatioH = (value) => {
            setAttributes({ aspectRatioH: value });
        };
        // ========== レンダリング ==========
        return (
            <>
                <InspectorControls>
                    <PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=FRkHB4I6CSs"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>
                    {/* サイズ設定パネル */}
                    <PanelBody title="サイズの設定">
                        <RangeControl
                            label="最大横幅(px)"
                            value={maxWidth}
                            onChange={onChangeMaxWidth}
                            min={400}
                            max={1600}
                            step={8}
                        />
                        <RangeControl
                            label="縦比"
                            value={aspectRatioH}
                            onChange={onChangeAspectRatioH}
                            min={100}
                            max={1600}
                            step={1}
                            allowReset
                            resetFallbackValue={800}
                        />
                    </PanelBody>

                    {/* 画像設定パネル */}
                    <PanelBody title="画像設定">
                        {/* Before画像 */}
                        <PanelBody title="Before画像">
                            <MediaUpload
                                onSelect={(media) => updateItem(0, media.url)}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <>
                                        {items[0]?.imgUrl ? (
                                            <div>
                                                <img
                                                    src={items[0].imgUrl}
                                                    alt="Before画像"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                                <Button
                                                    onClick={open}
                                                    isSecondary
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    画像を変更
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button onClick={open} isSecondary>
                                                画像を選択
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </PanelBody>

                        {/* After画像 */}
                        <PanelBody title="After画像">
                            <MediaUpload
                                onSelect={(media) => updateItem(1, media.url)}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <>
                                        {items[1]?.imgUrl ? (
                                            <div>
                                                <img
                                                    src={items[1].imgUrl}
                                                    alt="After画像"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                                <Button
                                                    onClick={open}
                                                    isSecondary
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    画像を変更
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button onClick={open} isSecondary>
                                                画像を選択
                                            </Button>
                                        )}
                                    </>
                                )}
                            />
                        </PanelBody>
                    </PanelBody>

                    {/* ラベル色設定パネル */}
                    <PanelBody title="ラベル色の設定" initialOpen={true}>
                        <p>Beforeラベルの色</p>
                        <ColorPalette
                            value={labelColorBefore}
                            onChange={onChangeLabelColorBefore}
                            // 必要に応じて色セットを制限したりできます
                        />
                        <p>Afterラベルの色</p>
                        <ColorPalette
                            value={labelColorAfter}
                            onChange={onChangeLabelColorAfter}
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ブロックの編集画面 */}
                <div className="paid-block-before-after-2-editor">
                    <p className="editor_in_ttl">Before/Afterの設定</p>
                    <div
                        className="paid-block-before-after-2-preview-wrap"
                        style={{
                            maxWidth: maxWidth + 'px',
                            aspectRatio: `1280 / ${aspectRatioH}`,
                        }}
                    >
                        <div className="left">
                            {/* Before画像 */}
                            {items[0]?.imgUrl && (
                                <img
                                    src={items[0].imgUrl}
                                    alt="Beforeプレビュー"
                                />
                            )}
                            {/* Beforeラベル (RichText) */}
                            <RichText
                                tagName="p"
                                className="paid-block-before-after-2_label"
                                value={beforeLabel}
                                onChange={onChangeBeforeLabel}
                                placeholder="beforeラベル"
                                // ラベルの文字色
                                style={{ background: labelColorBefore }}
                            />
                        </div>
                        <div className="right">
                            {/* Afterラベル (RichText) */}
                            <RichText
                                tagName="p"
                                className="paid-block-before-after-2_label right"
                                value={afterLabel}
                                onChange={onChangeAfterLabel}
                                placeholder="afterラベル"
                                // ラベルの文字色
                                style={{ background: labelColorAfter }}
                            />
                            {/* After画像 */}
                            {items[1]?.imgUrl && (
                                <img
                                    src={items[1].imgUrl}
                                    alt="Afterプレビュー"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    },

    save: (props) => {
        const { attributes } = props;
        const {
            beforeLabel,
            afterLabel,
            labelColorBefore,
            labelColorAfter,
            maxWidth,
            aspectRatioH,
            items,
        } = attributes;

        // 配列チェック
        const beforeUrl = Array.isArray(items) && items[0]?.imgUrl ? items[0].imgUrl : '';
        const afterUrl = Array.isArray(items) && items[1]?.imgUrl ? items[1].imgUrl : '';

        // スタイル適用
        const wrapStyle = {
            maxWidth: maxWidth ? maxWidth + 'px' : undefined,
        };

        return (
            <div className="paid-block-before-after-2">
                <div
                    className="this_wrap"
                    style={wrapStyle}
                >
                    {/* Beforeラベル */}
                    <RichText.Content
                        tagName="p"
                        className="label"
                        value={beforeLabel}
                        style={{ background: labelColorBefore }}
                    />
                    {/* Afterラベル */}
                    <RichText.Content
                        tagName="p"
                        className="label right"
                        value={afterLabel}
                        style={{ background: labelColorAfter }}
                    />

                    {/* Before画像 */}
                    {afterUrl && (
                        <img
                            src={afterUrl}
                            className="before-image"
                            alt="Before"
                            style={{
                                aspectRatio: `1280 / ${aspectRatioH}`,
                            }}
                        />
                    )}

                    {/* After画像クリップ領域 */}
                    <div className="after-wrapper">
                        <div className="after-inner">
                            {beforeUrl && (
                                <img
                                    src={beforeUrl}
                                    className="after-image"
                                    alt="After"
                                    style={{
                                        aspectRatio: `1280 / ${aspectRatioH}`,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* スライダーライン */}
                    <div className="slider-line">
                        <div className="slider-circle">
                            {/* 左矢印アイコン */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 
                                         12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 
                                         73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 
                                         45.3 0l192 192z"/>
                            </svg>
                            {/* 右矢印アイコン */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 
                                         12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 
                                         73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 
                                         45.3 0l192 192z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* フロントエンド用スクリプト */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        document.addEventListener('DOMContentLoaded', function() {
                            var blocks = document.querySelectorAll('.paid-block-before-after-2');
                            blocks.forEach(function(block) {
                                var container = block.querySelector('.this_wrap');
                                var slider = block.querySelector('.slider-line');
                                var afterWrapper = block.querySelector('.after-wrapper');
                                if (!container || !slider || !afterWrapper) return;

                                function updateSliderPosition(x) {
                                    var rect = container.getBoundingClientRect();
                                    var offsetX = x - rect.left;
                                    if (offsetX < 0) offsetX = 0;
                                    if (offsetX > rect.width) offsetX = rect.width;
                                    afterWrapper.style.width = offsetX + 'px';
                                    slider.style.left = offsetX + 'px';
                                }

                                // 初期位置：中央にスライダーを配置
                                var initialCenter = container.getBoundingClientRect().width / 2;
                                updateSliderPosition(container.getBoundingClientRect().left + initialCenter);

                                // PCマウス対応
                                container.addEventListener('mousemove', function(e) {
                                    updateSliderPosition(e.clientX);
                                });

                                // スマホタッチ対応
                                container.addEventListener('touchmove', function(e) {
                                    if (e.touches.length > 0) {
                                        updateSliderPosition(e.touches[0].clientX);
                                    }
                                }, { passive: false });

                                // スマホでスクロールしないようにする
                                container.addEventListener('touchstart', function(e) {
                                    e.preventDefault();
                                }, { passive: false });
                            });
                        });
                        `,
                    }}
                />
            </div>
        );
    },
});
