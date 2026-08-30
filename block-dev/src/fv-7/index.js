import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, BlockControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ColorPalette, RangeControl, SelectControl, ToolbarGroup, ToolbarButton, ToggleControl } from '@wordpress/components';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import { LinkPicker, lwLinkFromAttrs, lwLinkToAttrs, lwLinkDataPropsFromAttrs } from '../link-picker.js';

/* リンク先の指定（共通部品）で使う属性名の対応 */
const LINK_KEYS = { url: 'buttonUrl', type: 'buttonLinkType', page: 'buttonPageId', category: 'buttonCategoryId' };

const blockConfig = {
    edit: ({ attributes, setAttributes }) => {
        const { mainTitle, subTitle, description, buttonText, buttonUrl, showButton, videoType, videoUrl, vimeoId, filterColor, filterOpacity, videoSpeed, minHeightPc, minHeightTb, minHeightSp, headingLevel } = attributes;

        // videoTypeがnullまたは未定義の場合はmediaに設定
        const currentVideoType = videoType || 'media';

        const onChangeHeadingLevel = (newLevel) => {
            setAttributes({ headingLevel: newLevel });
        };

        const HeadingTag = `h${headingLevel}`;

        const blockProps = useBlockProps({
            className: `fv-7 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
        });

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        {[1, 2, 3, 4, 5].map(level => (
                            <ToolbarButton
                                key={level}
                                isPressed={headingLevel === level}
                                onClick={() => onChangeHeadingLevel(level)}
                            >
                                {`H${level}`}
                            </ToolbarButton>
                        ))}
                    </ToolbarGroup>
                </BlockControls>
                <InspectorControls>
                    <PanelBody title="動画設定">
                        <SelectControl
                            label="動画タイプ"
                            value={currentVideoType}
                            options={[
                                { label: 'メディアライブラリ', value: 'media' },
                                { label: 'Vimeo', value: 'vimeo' }
                            ]}
                            onChange={(value) => setAttributes({ videoType: value })}
                        />
                        
                        {currentVideoType === 'media' && (
                            <>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ videoUrl: media.url })}
                                    allowedTypes={['video']}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary" style={{ marginBottom: '10px' }}>
                                            {videoUrl ? '動画を変更' : '動画を選択'}
                                        </Button>
                                    )}
                                />
                                {videoUrl && (
                                    <video src={videoUrl} controls style={{ maxWidth: '100%', marginTop: '10px', marginBottom: '10px' }} />
                                )}
                                <RangeControl
                                    label="動画の再生速度"
                                    value={videoSpeed}
                                    onChange={(value) => setAttributes({ videoSpeed: value })}
                                    min={0.5}
                                    max={2.0}
                                    step={0.1}
                                />
                            </>
                        )}

                        {currentVideoType === 'vimeo' && (
                            <>
                                <TextControl
                                    label="Vimeo ID"
                                    value={vimeoId}
                                    onChange={(value) => setAttributes({ vimeoId: value })}
                                    placeholder="例: 123456789"
                                    help="VimeoのURLからIDのみを入力してください"
                                />
                                {vimeoId && (
                                    <div style={{ marginTop: '10px' }}>
                                        <iframe
                                            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1`}
                                            style={{ width: '100%', height: '200px' }}
                                            frameBorder="0"
                                            allow="autoplay; fullscreen"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title="ボタン設定">
                        <ToggleControl
                            label="ボタンを表示"
                            checked={showButton}
                            onChange={(value) => setAttributes({ showButton: value })}
                        />
                        {showButton && (
                            <>
                                <TextControl
                                    label="リンクボタンURL"
                                    value={buttonUrl}
                                    onChange={(value) => setAttributes({ buttonUrl: value })}
                                    placeholder="リンク先のURLを入力"
                                />
                                <LinkPicker
                                    link={lwLinkFromAttrs(attributes, LINK_KEYS)}
                                    onChange={(patch) => setAttributes(lwLinkToAttrs(patch, LINK_KEYS))}
                                />
                            </>
                        )}
                    </PanelBody>
                    <PanelBody title="フィルター設定">
                        <ColorPalette
                            label="フィルターの色"
                            value={filterColor}
                            onChange={(color) => setAttributes({ filterColor: color })}
                        />
                        <RangeControl
                            label="フィルターの透明度"
                            value={filterOpacity}
                            onChange={(value) => setAttributes({ filterOpacity: value })}
                            min={0}
                            max={1}
                            step={0.1}
                        />
                    </PanelBody>
                    <PanelBody title="レイアウト設定">
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
                </InspectorControls>
                <div {...blockProps}>
                    <div className="fv-7__inner">
                        <HeadingTag className="title">
                            <RichText
                                tagName="div"
                                className="sub"
                                value={subTitle}
                                onChange={(value) => setAttributes({ subTitle: value })}
                                placeholder="サブタイトルを入力"
                            />
                            <RichText
                                tagName="div"
                                className="main"
                                value={mainTitle}
                                onChange={(value) => setAttributes({ mainTitle: value })}
                                placeholder="メインタイトルを入力"
                            />
                        </HeadingTag>
                        <RichText
                            tagName="p"
                            className="description"
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
                            placeholder="テキストを入力"
                        />
                        {showButton && (
                            <div className="btn">
                                <RichText
                                    tagName="a"
                                    className="btn-text"
                                    value={buttonText}
                                    onChange={(value) => setAttributes({ buttonText: value })}
                                    placeholder="ボタンテキストを入力"
                                />
                            </div>
                        )}
                    </div>
                    <div className="bg_image">
                        {currentVideoType === 'media' && videoUrl && (
                            <>
                                <video muted playsInline data-playback-rate={videoSpeed}>
                                    <source src={videoUrl} type="video/mp4" />
                                </video>
                                <div
                                    className="filter"
                                    style={{
                                        backgroundColor: filterColor,
                                        opacity: filterOpacity,
                                    }}
                                ></div>
                            </>
                        )}
                        {currentVideoType === 'vimeo' && vimeoId && (
                            <>
                                <div className="vimeo-wrapper">
                                    <iframe
                                        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1`}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                    />
                                </div>
                                <div
                                    className="filter"
                                    style={{
                                        backgroundColor: filterColor,
                                        opacity: filterOpacity,
                                    }}
                                ></div>
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { mainTitle, subTitle, description, buttonText, buttonUrl, showButton, videoType, videoUrl, vimeoId, filterColor, filterOpacity, videoSpeed, minHeightPc, minHeightTb, minHeightSp, headingLevel } = attributes;

        // videoTypeがnullまたは未定義の場合はmediaに設定
        const currentVideoType = videoType || 'media';

        const HeadingTag = `h${headingLevel}`;

        // ボタンを表示する条件: showButtonがtrueかつbuttonTextが空でない
        const shouldShowButton = showButton && buttonText && buttonText.trim() !== '';

        const blockProps = useBlockProps.save({
            className: `fv-7 ${minHeightPc} ${minHeightTb} ${minHeightSp}`
        });

        return (
            <div {...blockProps}>
                <div className="fv-7__inner">
                    <HeadingTag className="title">
                        <RichText.Content tagName="div" className="sub" value={subTitle} />
                        <RichText.Content tagName="div" className="main" value={mainTitle} />
                    </HeadingTag>
                    <RichText.Content tagName="p" className="description" value={description} />
                    {shouldShowButton && (
                        <div className="btn">
                            <a href={buttonUrl} data-lw-link-type={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkType} data-lw-link-id={lwLinkDataPropsFromAttrs(attributes, LINK_KEYS).linkId} className="btn-text">
                                <RichText.Content value={buttonText} />
                            </a>
                        </div>
                    )}
                </div>
                <div className="bg_image">
                    {currentVideoType === 'media' && videoUrl && (
                        <>
                            <video autoPlay muted loop playsInline data-playback-rate={videoSpeed} className="lazy-video" style={{ display: 'none' }}>
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                            <div
                                className="filter"
                                style={{
                                    backgroundColor: filterColor,
                                    opacity: filterOpacity,
                                }}
                            ></div>
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                    document.addEventListener('DOMContentLoaded', function() {
                                        const video = document.querySelector('.fv-7 .lazy-video');
                                        if (video) {
                                            video.style.display = 'block';
                                            video.playbackRate = video.getAttribute('data-playback-rate');
                                        }
                                    });
                                    `,
                                }}
                            />
                        </>
                    )}
                    {currentVideoType === 'vimeo' && vimeoId && (
                        <>
                            <div className="vimeo-wrapper">
                                <iframe
                                    src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1`}
                                    frameBorder="0"
                                    allow="autoplay; fullscreen"
                                    className="vimeo-video"
                                />
                            </div>
                            <div
                                className="filter"
                                style={{
                                    backgroundColor: filterColor,
                                    opacity: filterOpacity,
                                }}
                            ></div>
                        </>
                    )}
                </div>
            </div>
        );
    }
};

/* 旧既定の背景動画（Pixabay の外部CDN・71.9MB）で保存されたページを拾うための deprecated。
   既定値と同じ属性はブロックコメントに書かれない（@wordpress/blocks の getCommentAttributes）ため、
   block.json の既定を差し替えると「動画を差し替えずに使っていたページ」の保存HTMLと食い違い、
   検証エラー（予期しない、または無効なコンテンツ）になる。旧既定を持たせた版で受け止める。
   ⚠️ lw-banner-info-01〜05 と違い、ここは save のマークアップが変わっていない（既定値だけの差）ので、
      当時のコードを写さず現行の save をそのまま使い回す。写すと差が生まれて逆に危ない。 */
const OLD_DEFAULT_VIDEO = 'https://cdn.pixabay.com/video/2023/11/19/189813-887078786_large.mp4';

registerBlockType(metadata.name, {
    ...blockConfig,
    deprecated: [
        {
            attributes: {
                ...metadata.attributes,
                videoUrl: { ...metadata.attributes.videoUrl, default: OLD_DEFAULT_VIDEO },
            },
            save: blockConfig.save,
        },
    ],
});