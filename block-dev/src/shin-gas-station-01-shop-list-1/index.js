import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/shin-gas-station-01-shop-list-1', {
    title: '店舗一覧用 1 shin shop pattern 01',
    icon: 'store',
    category: 'liteword-other',
    attributes: {
        shopName: { type: 'string', default: 'ガソリンスタンドセルフ 〇〇店' },
        details: {
            type: 'array',
            default: [
                { dt: '住所', dd: '福島県〇〇市〇〇〇〇町1-2-345' },
                { dt: '電話番号', dd: '012-345-6789' },
                { dt: '営業時間', dd: '平日8:00~20:00 / 日祝9:00~20:00' },
                { dt: '定休日', dd: '水曜日' }
            ],
        },
        tags: {
            type: 'string',
            default: 'セルフ, 軽油, 車検, 洗車, タイヤ交換・販売, マイカーリース, クレジットカードOK'
        },
        imgUrl: { type: 'string', default: 'https://placehold.jp/420x320.png' },
        imgAlt: { type: 'string', default: '' }
    },

    // ▼▼▼ edit 側 ▼▼▼
    edit: ({ attributes, setAttributes }) => {
        const { shopName, details, tags, imgUrl, imgAlt } = attributes;

        const handleChangeDt = (value, index) => {
            const newDetails = [ ...details ];
            newDetails[index] = { ...newDetails[index], dt: value };
            setAttributes({ details: newDetails });
        };

        const handleChangeDd = (value, index) => {
            const newDetails = [ ...details ];
            newDetails[index] = { ...newDetails[index], dd: value };
            setAttributes({ details: newDetails });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title="画像設定">
                        <MediaUpload
                            onSelect={(media) => setAttributes({ imgUrl: media.url })}
                            allowedTypes={['image']}
                            render={({ open }) => (
                                <>
                                    {imgUrl ? (
                                        <div>
                                            <img
                                                src={imgUrl}
                                                alt={imgAlt}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                            <Button onClick={open} variant="secondary" style={{ marginTop: '10px' }}>
                                                画像を変更
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="secondary">
                                            画像を選択
                                        </Button>
                                    )}
                                </>
                            )}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="shin-gas-station-01-shop-list-1">
                    <div className="shin-gas-station-01-shop-list-1_inner">
                        <div className="image">
                            <img src={imgUrl} alt={imgAlt} />
                        </div>
                        <div className="text_in">
                            <h3 className="ttl">
                                <RichText
                                    value={shopName}
                                    onChange={(value) => setAttributes({ shopName: value })}
                                    placeholder="店舗名を入力"
                                />
                            </h3>

                            <dl>
                                {details.map((item, index) => (
                                    <div key={index}>
                                        <dt>
                                            <RichText
                                                tagName="p"
                                                value={item.dt}
                                                onChange={(value) => handleChangeDt(value, index)}
                                                placeholder="項目名を入力"
                                            />
                                        </dt>
                                        <dd>
                                            <RichText
                                                tagName="p"
                                                value={item.dd}
                                                onChange={(value) => handleChangeDd(value, index)}
                                                placeholder="内容を入力"
                                            />
                                        </dd>

                                        <Button
                                            onClick={() => {
                                                const newDetails = details.filter((_, i) => i !== index);
                                                setAttributes({ details: newDetails });
                                            }}
                                            variant="secondary"
                                            style={{ marginLeft: '10px' }}
                                        >
                                            削除
                                        </Button>
                                    </div>
                                ))}
                            </dl>

                            <Button
                                onClick={() => setAttributes({ details: [ ...details, { dt: '', dd: '' } ] })}
                                variant="primary"
                                style={{ marginTop: '10px' }}
                            >
                                項目を追加
                            </Button>

                            <RichText
                                tagName="ul"
                                className="tag_list"
                                value={tags}
                                onChange={(value) => setAttributes({ tags: value })}
                                placeholder="タグを入力 (カンマまたはスペースで区切る)"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    },

    // ▼▼▼ save 側 ▼▼▼
    save: ({ attributes }) => {
        const { shopName, details, tags, imgUrl, imgAlt } = attributes;
        const tagList = tags.split(/[,\s]+/).filter(Boolean);

        return (
            <div className="shin-gas-station-01-shop-list-1">
                <div className="shin-gas-station-01-shop-list-1_inner">
                    <div className="image">
                        <img src={imgUrl} alt={imgAlt} />
                    </div>
                    <div className="text_in">
                        <h3 className="ttl">{shopName}</h3>
                        <dl>
                            {details.map((item, index) => (
                                <div key={index}>
                                    <dt>
                                        {/* 保存時は RichText.Content を使って出力 */}
                                        <RichText.Content tagName="p" value={item.dt} />
                                    </dt>
                                    <dd>
                                        {/* 改行や段落が正しいHTMLとして出るようになる */}
                                        <RichText.Content tagName="p" value={item.dd} />
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <ul className="tag_list">
                            {tagList.map((tag, index) => (
                                <li key={index}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
