import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    InspectorControls,
    MediaUpload,
    ColorPalette, useBlockProps } from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl
} from '@wordpress/components';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: function (props) {
        const { attributes, setAttributes } = props;

        const blockProps = useBlockProps({
            className: 'shin-gas-station-01-list-1'
        });
        const { contents } = attributes;

        // コンテンツ追加
        const addContent = () => {
            const newIndex = contents.length + 1;
            const newContent = {
                text: '新しい事業',
                textColor: '',
                number: String(newIndex).padStart(2, '0'),
                image: '',
                p_text: '新しい説明テキスト',
                url: ''
            };
            setAttributes({ contents: [...contents, newContent] });
        };

        // コンテンツ削除
        const removeContent = (index) => {
            setAttributes({
                contents: contents.filter((_, i) => i !== index)
            });
        };

        // コンテンツ更新
        const updateContent = (index, key, value) => {
            const updatedContents = [...contents];
            updatedContents[index][key] = value;
            setAttributes({ contents: updatedContents });
        };

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title="テキストカラー設定" initialOpen={true}>
                        {contents.map((content, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                                <p>Item {index + 1} のテキストカラー</p>
                                <ColorPalette
                                    value={content.textColor}
                                    onChange={(color) => updateContent(index, 'textColor', color)}
                                />
                            </div>
                        ))}
                    </PanelBody>
                </InspectorControls>

                <ul className="list">
                    {contents.map((content, index) => (
                        <li className={`shin-gas-station-01-list-1_item item_${index}`} key={index}>
                            <div className="link">
                                <div className="text_in">
                                    <h3 className="ttl">
                                        <span
                                            className="no"
                                            style={{
                                                color: content.textColor || 'inherit',
                                                borderColor: content.textColor || 'inherit'
                                            }}
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <RichText
                                            tagName="span"
                                            className="text"
                                            style={{ color: content.textColor || 'inherit' }}
                                            value={content.text}
                                            onChange={(value) => updateContent(index, 'text', value)}
                                            placeholder="タイトルを入力"
                                        />
                                    </h3>
                                    <RichText
                                        tagName="p"
                                        className="p_text"
                                        value={content.p_text}
                                        onChange={(value) => updateContent(index, 'p_text', value)}
                                        placeholder="説明文を入力"
                                    />
                                    <br />
                                    {/* 画像選択ボタン */}
                                    <MediaUpload
                                        onSelect={(media) => updateContent(index, 'image', media.url)}
                                        allowedTypes={["image"]}
                                        render={({ open }) => (
                                            <Button onClick={open} isSecondary>
                                                {content.image ? '画像を変更' : '画像を選択'}
                                            </Button>
                                        )}
                                    />
                                    {content.image && (
                                        <Button
                                            onClick={() => updateContent(index, 'image', '')}
                                            isDestructive
                                            style={{ marginLeft: '8px' }}
                                        >
                                            画像を削除
                                        </Button>
                                    )}
                                    <br /><br />
                                    {/* リンク URL 入力用の TextControl を追加 */}
                                    <TextControl
                                        label="リンクURL"
                                        value={content.url}
                                        onChange={(value) => updateContent(index, 'url', value)}
                                        style={{ marginTop: '12px', maxWidth: '300px' }}
                                    />
                                </div>

                                <div className="bottom_content">
                                    {content.image && <img src={content.image} alt="" />}
                                </div>

                                <Button
                                    isDestructive
                                    onClick={() => removeContent(index)}
                                    style={{ marginTop: '10px' }}
                                >
                                    削除
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
                <br />
                <Button isPrimary onClick={addContent}>
                    コンテンツを追加
                </Button>
            </div>
        );
    },
    save: function (props) {
        const { attributes } = props;

        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-list-1'
        });
        const { contents } = attributes;

        return (
            <div {...blockProps}>
                <ul className="list">
                    {contents.map((content, index) => {
                        // URL が設定されていない場合は div.link、設定されている場合は a.link
                        const LinkTag = content.url ? 'a' : 'div';
                        const linkProps = content.url ? { href: content.url } : {};
                        const nextBtn = (
                            <div className="next_btn">
                                <div>
                                    詳しく見る
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="39.5"
                                        height="4.197"
                                        viewBox="0 0 39.5 4.197"
                                    >
                                        <g
                                            id="グループ_11"
                                            data-name="グループ 11"
                                            transform="translate(-179.5 -2154.803)"
                                        >
                                            <path
                                                id="パス_28"
                                                data-name="パス 28"
                                                d="M0,0,8,4.2H0Z"
                                                transform="translate(211 2154.803)"
                                                fill="#059d47"
                                            />
                                            <path
                                                id="線_1"
                                                data-name="線 1"
                                                d="M32,.5H0v-1H32Z"
                                                transform="translate(179.5 2158.5)"
                                                fill="#059d47"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        );
                        

                        return (
                            <li className={`shin-gas-station-01-list-1_item item_${index}`} key={index}>
                                <LinkTag className="link" {...linkProps}>
                                    <div className="text_in">
                                        <h3 className="ttl">
                                            <span
                                                className="no"
                                                style={{
                                                    color: content.textColor || '#111',
                                                    borderColor: content.textColor || '#111'
                                                }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <RichText.Content
                                                tagName="span"
                                                className="text"
                                                value={content.text}
                                                style={{
                                                    color: content.textColor || '#111'
                                                }}
                                                data-text-color={content.textColor}
                                            />
                                        </h3>
                                        <RichText.Content
                                            tagName="p"
                                            className="p_text"
                                            value={content.p_text}
                                        />
                                    </div>
                                    <div className="bottom_content">
                                        {content.image ? (
                                            <>
                                                <img src={content.image} alt={content.text} />
                                                {/* content.url に URL が設定されていたら nextBtn を表示 */}
                                                {content.url ? nextBtn : null}
                                            </>
                                        ) : (
                                            content.url && nextBtn
                                        )}
                                    </div>


                                </LinkTag>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    },
});
