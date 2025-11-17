import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    SelectControl,
    ColorPicker,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/paid-block-solution-2', {
    title: 'ソリューション 02',
    icon: 'lightbulb',
    category: 'liteword-other',
    supports: { anchor: true },

    /* ========== 1) 属性定義 ========== */
    attributes: {
        /* ユニーククラス用 ID（8 桁）*/
        blockId: {
            type: 'string',
        },
        /* h2 タイトル */
        title: {
            type: 'string',
            default: 'このな事が解決できます',
            source: 'html',
            selector: '.paid-block-solution-2_inner > .ttl',
        },
        /* メインカラー */
        colorMain: {
            type: 'string',
            default: 'var(--color-main)',
        },
        /* 繰り返しリスト */
        items: {
            type: 'array',
            source: 'query',
            selector: '.paid-block-solution-2_inner .list li',
            query: {
                imgSrc: {
                    type: 'string',
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'src',
                },
                text: {
                    type: 'string',
                    source: 'html',
                    selector: 'p',
                },
                imageSize: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.img_wrap',
                    attribute: 'data-imagesize',
                },
            },
            default: [
                {
                    imgSrc: 'https://lite-word.com/sample_img/icon/people_1.svg',
                    text: 'テキストテキストテキストテキストテキス',
                    imageSize: 'icon',
                },
                {
                    imgSrc: 'https://lite-word.com/sample_img/icon/en_5.svg',
                    text: 'テキストテキストテキストテキストテキスト',
                    imageSize: 'icon',
                },
                {
                    imgSrc: 'https://lite-word.com/sample_img/icon/ambulance_1.svg',
                    text: 'テキストテキストテキストテキストテキスト',
                    imageSize: 'icon',
                },
            ],
        },
    },

    /* ========== 2) 編集画面 ========== */
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
            <Fragment>
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

                <div className={`paid-block-solution-2 ${blockId}`}>
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
            </Fragment>
        );
    },

    /* ========== 3) 保存処理 ========== */
    save: (props) => {
        const { attributes } = props;
        const { blockId, title, colorMain, items } = attributes;

        return (
            <div className={`paid-block-solution-2 ${blockId}`}>
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
