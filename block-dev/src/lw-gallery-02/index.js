/**
 * ギャラリー 02
 * ★ apiVersion 3 対応（2025-12-07）
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const { images } = attributes;
        const blockProps = useBlockProps();

        // 画像の更新
        const updateImage = (index, newUrl) => {
            const newImages = [...images];
            newImages[index] = newUrl;
            setAttributes({ images: newImages });
        };

        // 画像の削除
        const removeImage = (index) => {
            const newImages = [...images];
            newImages[index] = ""; // 画像を削除（空にする）
            setAttributes({ images: newImages });
        };

        // 設定された画像だけを取得（空の値を除外）
        const validImages = images.filter(src => src && src.trim() !== "");

        // 画像数が4つ未満の場合は4つに調整
        const displayImages = validImages.length < 4 ? images.slice(0, 4).filter(src => src && src.trim() !== "") : validImages;
        const imageCount = displayImages.length;
        const imgClass = `img_${imageCount}`;

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="ギャラリー画像設定" initialOpen={true}>
                        {images.map((src, index) => (
                            <PanelBody title={`画像 ${index + 1}`} key={index}>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(media) => updateImage(index, media.url)}
                                        allowedTypes={['image']}
                                        render={({ open }) => (
                                            <div style={{ textAlign: 'center' }}>
                                                {src ? (
                                                    <>
                                                        <img
                                                            src={src}
                                                            alt={`画像 ${index + 1}`}
                                                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                                        />
                                                        <Button onClick={open} isSecondary style={{ marginRight: '10px' }}>
                                                            画像を変更
                                                        </Button>
                                                        <Button onClick={() => removeImage(index)} isDestructive>
                                                            削除
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button onClick={open} isSecondary>
                                                        画像を選択
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    />
                                </MediaUploadCheck>
                            </PanelBody>
                        ))}
                    </PanelBody>
                </InspectorControls>

                <div className="lw-gallery-02">
                    {imageCount > 0 && (
                        <ul className={imgClass}>
                            {displayImages.map((src, index) => (
                                <li key={index}>
                                    <img src={src} alt={`ギャラリー画像 ${index + 1}`} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    },
    save: ({ attributes }) => {
        const { images } = attributes;
        const blockProps = useBlockProps.save();

        // 設定された画像のみを取得（空の値を除外）
        const validImages = images.filter(src => src && src.trim() !== "");

        // 画像数が4つ未満の場合は4つに調整
        const displayImages = validImages.length < 4 ? images.slice(0, 4).filter(src => src && src.trim() !== "") : validImages;
        const imageCount = displayImages.length;
        const imgClass = `img_${imageCount}`;

        return (
            <div {...blockProps}>
                <div className="lw-gallery-02">
                    {imageCount > 0 && (
                        <ul className={imgClass}>
                            {displayImages.map((src, index) => (
                                <li key={index}>
                                    <img src={src} alt={`ギャラリー画像 ${index + 1}`} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    }
});