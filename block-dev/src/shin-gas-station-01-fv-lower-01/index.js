import { registerBlockType } from '@wordpress/blocks';
import { RichText, MediaUpload, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl , SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/shin-gas-station-01-fv-lower-01', {
    title: 'FV（下層ページ用）shin shop pattern 01',
    icon: 'cover-image',
    category: 'liteword-firstview',
    attributes: {
        backgroundImage: {
            type: 'string',
            default: ``,
        },
        backgroundImageSp: { type: 'string', default: `` },
        mainTitle: {
            type: 'string',
            default: 'ページタイトル',
        },
        subTitle: {
            type: 'string',
            default: 'Title Sub',
        },
        filterBackgroundColor: {
            type: 'string',
            default: 'var(--color-main)',
        },
        filterOpacity: {
            type: 'number',
            default: 0.05,
        },
        minHeightPc: { type: 'string', default: 'min-h-pc-380px' },
        minHeightTb: { type: 'string', default: 'min-h-tb-300px' },
        minHeightSp: { type: 'string', default: 'min-h-sp-220px' },
        maxWidth: {
            type: 'number',
            default: "100%",
        },
    },
    edit: function (props) {
        const { attributes, setAttributes } = props;
        const {
            backgroundImage,backgroundImageSp, mainTitle, subTitle, filterBackgroundColor, filterOpacity, minHeightPc, minHeightTb, minHeightSp,maxWidth
        } = attributes;

        const currentPostType = useSelect((select) => select('core/editor').getCurrentPostType());

        if (currentPostType !== 'page') {
            return <p>このブロックは固定ページでのみ使用できます。</p>;
        }

        const onChangeBackgroundImage = (media) => {
            setAttributes({ backgroundImage: media.url });
        };
        const onChangeBackgroundImageSp = (media) => {
            setAttributes({ backgroundImageSp: media.url });
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="背景画像設定">
                        <p>PCの時</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImage}
                            allowedTypes={['image']}
                            value={backgroundImage}
                            render={({ open }) => (
                                <>
                                    {backgroundImage ? (
                                        <>
                                            <img src={backgroundImage} alt="選択した背景画像" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                            <Button
                                                onClick={() => setAttributes({ backgroundImage: '' })}
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                画像を削除
                                            </Button>
                                        </>
                                    ) : null}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                        <p style={{ marginTop: '16px' }}>スマホの時</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImageSp}
                            allowedTypes={['image']}
                            value={backgroundImageSp}
                            render={({ open }) => (
                                <>
                                    {backgroundImageSp ? (
                                        <>
                                            <img src={backgroundImageSp} alt="選択した背景画像" style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                            <Button
                                                onClick={() => setAttributes({ backgroundImageSp: '' })}
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                画像を削除
                                            </Button>
                                        </>
                                    ) : null}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                    </PanelBody>
                    <PanelBody title="フィルター設定">
                        <p>フィルターの色</p>
                        <ColorPalette
                            value={filterBackgroundColor}
                            onChange={(color) => setAttributes({ filterBackgroundColor: color })}
                        />
                        <p>透明度</p>
                        <RangeControl
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </PanelBody>
        
                    <PanelBody title="高さ設定">
                        <p>PC用高さ</p>
                        <SelectControl
                            value={minHeightPc}
                            options={minHeightPcClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightPc: value })}
                        />
                        <p>タブレット用高さ</p>
                        <SelectControl
                            value={minHeightTb}
                            options={minHeightTbClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightTb: value })}
                        />
                        <p>スマートフォン用高さ</p>
                        <SelectControl
                            value={minHeightSp}
                            options={minHeightSpClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightSp: value })}
                        />
                    </PanelBody>
                    <PanelBody title="内側の最大横幅">
                        <RangeControl
                            label="最大幅 (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={600}
                            max={2000}
                            step={8}
                        />
                     </PanelBody>
                </InspectorControls>
                <div
                    className={`shin-gas-station-01-fv-lower-01 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
                >
                    <div className="shin-gas-station-01-fv-lower-01_inner" style={{maxWidth:maxWidth}}>
                        <h1>
                            <RichText
                                tagName="span"
                                className="main"
                                value={mainTitle}
                                onChange={(value) => setAttributes({ mainTitle: value })}
                                placeholder="メインタイトルを入力"
                            />
                             <RichText
                                tagName="span"
                                className="sub"
                                value={subTitle}
                                onChange={(value) => setAttributes({ subTitle: value })}
                                placeholder="サブタイトルを入力"
                            />
                        </h1>
                    </div>
                    <div className="filter" style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}></div>
                    <div className="bg_image">
                        {backgroundImage && <img src={backgroundImage} alt="背景画像"/>}
                    </div>
                </div>
            </Fragment>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const {
            backgroundImage,backgroundImageSp, mainTitle, subTitle, filterBackgroundColor, filterOpacity, minHeightPc, minHeightTb, minHeightSp,maxWidth
        } = attributes;

        return (
            <div
                className={`shin-gas-station-01-fv-lower-01 ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
            >
                <div className="shin-gas-station-01-fv-lower-01_inner" style={{maxWidth:maxWidth}}>
                    <h1>
                        <RichText.Content
                            tagName="span"
                            className="main"
                            value={mainTitle}
                        />
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            value={subTitle}
                        />
                    </h1>
                </div>
                <div className="filter" style={{ backgroundColor: filterBackgroundColor, opacity: filterOpacity }}></div>
                {backgroundImage && (
                    <picture className="bg_image">
                        <source srcSet={backgroundImageSp} media="(max-width: 800px)" />
                        <source srcSet={backgroundImage} media="(min-width: 801px)" />
                        <img src={backgroundImage} alt="背景画像" />
                    </picture>
                )}

            </div>
        );
    }
});
