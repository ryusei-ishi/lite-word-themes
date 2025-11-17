import { registerBlockType } from '@wordpress/blocks';
import { MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import './style.scss';
import './editor.scss';

// ブロックの登録
registerBlockType('wdl/fv-3', {
    title: '固定ページタイトル 03(画像のみの場合)',
    icon: 'format-image',
    category: 'liteword-firstview',
    attributes: {
        imagePc: { type: 'string', default: '' },
        imageSp: { type: 'string', default: '' },
        altText: { type: 'string', default: '' },
        headingTag: { type: 'string', default: 'h1' },
        widthSetting: { type: 'string', default: 'full' },
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { imagePc, imageSp, altText, headingTag, widthSetting } = attributes;

        const onChangeImagePc = (media) => setAttributes({ imagePc: media.url });
        const onChangeImageSp = (media) => setAttributes({ imageSp: media.url });
        const removeImagePc = () => setAttributes({ imagePc: '' });
        const removeImageSp = () => setAttributes({ imageSp: '' });
        const onChangeAltText = (value) => setAttributes({ altText: value });

        const HeadingTag = headingTag;

        // 横幅設定に応じたクラス名を取得
        const getWidthClass = () => {
            if (widthSetting === 'inner_fit') return 'w_100_inner_fit';
            if (widthSetting === 'outer_fit') return 'w_100_outer_fit';
            return '';
        };

        const widthClass = getWidthClass();

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="見出しタグ設定">
                        <SelectControl
                            label="見出しタグ"
                            value={headingTag}
                            options={[
                                { label: 'H1', value: 'h1' },
                                { label: 'H2', value: 'h2' },
                                { label: 'H3', value: 'h3' },
                                { label: 'DIV', value: 'div' },
                            ]}
                            onChange={(value) => setAttributes({ headingTag: value })}
                        />
                    </PanelBody>

                    <PanelBody title="横幅設定">
                        <SelectControl
                            label="横幅"
                            value={widthSetting}
                            options={[
                                { label: '画面いっぱい', value: 'full' },
                                { label: 'コンテンツ inner fit', value: 'inner_fit' },
                                { label: 'コンテンツ outer fit', value: 'outer_fit' },
                            ]}
                            onChange={(value) => setAttributes({ widthSetting: value })}
                        />
                    </PanelBody>

                    <PanelBody title="PC用画像設定">
                        {imagePc && <img src={imagePc} alt="PC用画像" style={{ width: '100%', height: 'auto' }} />}
                        <MediaUpload
                            onSelect={onChangeImagePc}
                            allowedTypes={['image']}
                            value={imagePc}
                            render={({ open }) => (
                                <Button onClick={open} isSecondary>
                                    {imagePc ? '画像を変更' : 'PC用画像を選択'}
                                </Button>
                            )}
                        />
                        {imagePc && (
                            <Button onClick={removeImagePc} isDestructive style={{ marginTop: '10px' }}>
                                画像を削除
                            </Button>
                        )}
                    </PanelBody>

                    <PanelBody title="スマホ用画像設定">
                        {imageSp && <img src={imageSp} alt="スマホ用画像" style={{ width: '100%', height: 'auto' }} />}
                        <MediaUpload
                            onSelect={onChangeImageSp}
                            allowedTypes={['image']}
                            value={imageSp}
                            render={({ open }) => (
                                <Button onClick={open} isSecondary>
                                    {imageSp ? '画像を変更' : 'スマホ用画像を選択'}
                                </Button>
                            )}
                        />
                        {imageSp && (
                            <Button onClick={removeImageSp} isDestructive style={{ marginTop: '10px' }}>
                                画像を削除
                            </Button>
                        )}
                    </PanelBody>

                    <PanelBody title="画像のAltテキスト">
                        <TextControl
                            label="Altテキスト"
                            value={altText}
                            onChange={onChangeAltText}
                            placeholder="Altテキストを入力"
                        />
                    </PanelBody>
                </InspectorControls>

                <div className={`fv-3 ${widthClass}`.trim()}>
                    <HeadingTag className="ttl">
                        <picture className="image">
                            <source srcSet={imageSp} media="(max-width: 800px)" />
                            <source srcSet={imagePc} media="(min-width: 801px)" />
                            {imagePc || imageSp ? (
                                <img src={imagePc || imageSp} alt={altText} />
                            ) : (
                                <div className="no_image">No Image</div>
                            )}
                        </picture>
                    </HeadingTag>
                </div>
            </Fragment>
        );
    },
    save: function (props) {
        const { attributes } = props;
        const { imagePc, imageSp, altText, headingTag, widthSetting } = attributes;

        const HeadingTag = headingTag;

        // 横幅設定に応じたクラス名を取得
        const getWidthClass = () => {
            if (widthSetting === 'inner_fit') return 'w_100_inner_fit';
            if (widthSetting === 'outer_fit') return 'w_100_outer_fit';
            return '';
        };

        const widthClass = getWidthClass();

        return (
            <div className={`fv-3 ${widthClass}`.trim()}>
                <HeadingTag>
                    <picture className="image">
                        <source srcSet={imageSp} media="(max-width: 800px)" />
                        <source srcSet={imagePc} media="(min-width: 801px)" />
                        {imagePc || imageSp ? (
                            <img src={imagePc || imageSp} alt={altText} loading="eager" fetchpriority="high" />
                        ) : (
                            <div className="no_image">No Image</div>
                        )}
                    </picture>
                </HeadingTag>
            </div>
        );
    }
});