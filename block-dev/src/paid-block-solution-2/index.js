import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    ColorPicker,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: (props) => {
        const { attributes, setAttributes, clientId } = props;
        const { blockId, title, colorMain, items } = attributes;

        /* 初回レンダリング時に blockId を設定 */
        useEffect(() => {
            if (!blockId) {
                setAttributes({
                    blockId: `paid-block-solution-2-${clientId.slice(0, 8)}`,
                });
            }
        }, []);

        const blockProps = useBlockProps({
            className: `paid-block-solution-2 ${blockId || ''}`
        });

        const updateItem = (index, field, value) => {
            const newItems = [...items];
            newItems[index][field] = value;
            setAttributes({ items: newItems });
        };

        const removeImage = (index) => {
            updateItem(index, 'imgSrc', '');
        };

        /* blockId がまだ設定されていないタイミングは非表示 */
        if (!blockId) return null;


        /* ====================================================== */
        return (
            <>
                <InspectorControls>
                    <PanelBody title="マニュアル">
                        <Button
                            variant="secondary"
                            href="https://www.youtube.com/watch?v=NvDmXtmsAW8"
                            target="_blank"
                        >
                            このブロックの使い方はこちら
                        </Button>
                    </PanelBody>

                    <PanelBody title="画像サイズの設定" initialOpen={true}>
                        {items.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '1em' }}>
                                <p>リスト {idx + 1} の画像サイズ</p>
                                <SelectControl
                                    label="画像サイズ"
                                    value={item.imageSize}
                                    options={[
                                        { label: '通常サイズ', value: 'normal' },
                                        { label: 'アイコンサイズ', value: 'icon' },
                                    ]}
                                    onChange={(val) =>
                                        updateItem(idx, 'imageSize', val)
                                    }
                                />
                            </div>
                        ))}
                    </PanelBody>

                    <PanelBody title="メインカラー" initialOpen={true}>
                        <ColorPicker
                            color={colorMain}
                            onChange={(val) => setAttributes({ colorMain: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div
                        className="paid-block-solution-2_inner"
                        style={colorMain ? { borderColor: colorMain } : null}
                    >
                        {/* タイトル */}
                        <RichText
                            tagName="h2"
                            className="ttl"
                            value={title}
                            onChange={(val) => setAttributes({ title: val })}
                            placeholder="タイトルを入力"
                            style={colorMain ? { background: colorMain } : null}
                        />

                        {/* リスト */}
                        <ul className="list">
                            {items.map((item, index) => (
                                <li key={index}>
                                    <div
                                        className={
                                            'img_wrap' +
                                            (item.imageSize === 'icon'
                                                ? ' icon_image'
                                                : '')
                                        }
                                        data-imagesize={item.imageSize}
                                    >
                                        {item.imgSrc && (
                                            <img src={item.imgSrc} alt="" />
                                        )}
                                    </div>

                                    <div className="img_upload">
                                        <MediaUpload
                                            onSelect={(media) =>
                                                updateItem(
                                                    index,
                                                    'imgSrc',
                                                    media.url
                                                )
                                            }
                                            allowedTypes={['image']}
                                            render={({ open }) => (
                                                <>
                                                    <Button
                                                        onClick={open}
                                                        variant="secondary"
                                                    >
                                                        {item.imgSrc
                                                            ? '画像を変更'
                                                            : '画像を選択'}
                                                    </Button>
                                                    {item.imgSrc && (
                                                        <Button
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            variant="secondary"
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                            }}
                                                        >
                                                            画像を削除
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>

                                    <RichText
                                        tagName="p"
                                        value={item.text}
                                        onChange={(val) =>
                                            updateItem(index, 'text', val)
                                        }
                                        placeholder="リストのテキスト"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {colorMain && (
                        <style>{`
                            .${blockId} .paid-block-solution-2_inner ul.list li + li:before {
                                background: ${colorMain};
                            }
                        `}</style>
                    )}
                </div>
            </>
        );
    },

    /* ========== 3) 保存処理 ========== */
    save: (props) => {
        const { attributes } = props;
        const { blockId, title, colorMain, items } = attributes;

        const blockProps = useBlockProps.save({
            className: `paid-block-solution-2 ${blockId}`
        });

        return (
            <div {...blockProps}>
                <div
                    className="paid-block-solution-2_inner"
                    style={colorMain ? { borderColor: colorMain } : null}
                >
                    <RichText.Content
                        tagName="h2"
                        className="ttl"
                        value={title}
                        style={colorMain ? { background: colorMain } : null}
                    />

                    <ul className="list">
                        {items.map((item, index) => {
                            const wrapClass =
                                'img_wrap' +
                                (item.imageSize === 'icon'
                                    ? ' icon_image'
                                    : '');
                            return (
                                <li key={index}>
                                    <div
                                        className={wrapClass}
                                        data-imagesize={item.imageSize}
                                    >
                                        {item.imgSrc && (
                                            <img src={item.imgSrc} alt="" />
                                        )}
                                    </div>
                                    <RichText.Content
                                        tagName="p"
                                        value={item.text}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {colorMain && (
                    <style>{`
                        .${blockId} .paid-block-solution-2_inner ul.list li + li:before {
                            background: ${colorMain};
                        }
                    `}</style>
                )}
            </div>
        );
    },
});
