import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
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

        
        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-shop-list-1'
        });

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

                
                <div {...blockProps}>
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

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-shop-list-1',
        });

        return (
            <div {...blockProps}>
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
