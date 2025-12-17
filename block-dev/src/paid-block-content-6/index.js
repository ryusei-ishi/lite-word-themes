import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    RichText,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl,
    ToggleControl,
    RangeControl
} from '@wordpress/components';
import './editor.scss';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
    edit: (props) => {
        const {
            attributes: {
                alignRight,
                imageUrl,
                imageAlt,
                textContent,
                buttonText,
                buttonUrl,
                showButton,
                buttonRadius,
            },
            setAttributes
        } = props;

        //
        // 画像左右配置切り替え
        //
        const onToggleAlignRight = (value) => {
            setAttributes({ alignRight: value });
        };

        //
        // 画像設定
        //
        const onSelectImage = (media) => {
            setAttributes({ imageUrl: media.url, imageAlt: media.alt });
        };

        //
        // 画像削除
        //
        const removeImage = () => {
            setAttributes({ imageUrl: '', imageAlt: '' });
        };

        //
        // alt テキスト
        //
        const onChangeAlt = (value) => {
            setAttributes({ imageAlt: value });
        };

        //
        // テキスト (リッチテキスト)
        //
        const onChangeTextContent = (value) => {
            setAttributes({ textContent: value });
        };

        //
        // ボタンテキスト（リッチテキスト）
        //
        const onChangeButtonText = (value) => {
            setAttributes({ buttonText: value });
        };

        //
        // ボタンURL（サイドバー設定）
        //
        const onChangeButtonUrl = (value) => {
            setAttributes({ buttonUrl: value });
        };

        //
        // ボタン表示/非表示
        //
        const onToggleShowButton = (value) => {
            setAttributes({ showButton: value });
        };

        //
        // ボタン角丸設定
        //
        const onChangeButtonRadius = (value) => {
            setAttributes({ buttonRadius: value });
        };

        
        const blockProps = useBlockProps({
            className: 'paid-block-content-6'
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="マニュアル">
                        <div>
                            <Button
                                variant="secondary"
                                href="https://www.youtube.com/watch?v=EOj8pD_-CjI"
                                target="_blank"
                            >
                                このブロックの使い方はこちら
                            </Button>
                        </div>
                    </PanelBody>

                    {/* 画像の左右切り替え設定 */}
                    <PanelBody title="画像配置" initialOpen={ true }>
                        <ToggleControl
                            label="画像を右に配置"
                            checked={ alignRight }
                            onChange={ onToggleAlignRight }
                        />
                    </PanelBody>

                    <PanelBody title="画像設定" initialOpen={ true }>
                        <MediaUpload
                            onSelect={ onSelectImage }
                            allowedTypes={ ['image'] }
                            render={ ({ open }) => (
                                <div style={{ marginBottom: '1em' }}>
                                    {/* 画像があればプレビュー */}
                                    { imageUrl && (
                                        <img
                                            src={ imageUrl }
                                            alt={ imageAlt }
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    ) }
                                    <br /><br />
                                    <Button onClick={ open } variant="secondary">
                                        { imageUrl ? '画像を変更' : '画像を選択' }
                                    </Button>
                                    {/* 削除ボタン (画像があるときだけ表示) */}
                                    { imageUrl && (
                                        <Button
                                            variant="secondary"
                                            onClick={ removeImage }
                                            style={{ marginLeft: '10px' }}
                                        >
                                            削除
                                        </Button>
                                    ) }
                                </div>
                            ) }
                        />
                        {/* altテキスト入力欄 */}
                        { imageUrl && (
                            <TextControl
                                label="画像のalt"
                                value={ imageAlt }
                                onChange={ onChangeAlt }
                                placeholder="画像の説明文"
                            />
                        ) }
                    </PanelBody>

                    <PanelBody title="ボタン設定" initialOpen={ true }>
                        <ToggleControl
                            label="ボタン表示/非表示"
                            checked={ showButton }
                            onChange={ onToggleShowButton }
                        />
                        <TextControl
                            label="ボタンリンクURL"
                            value={ buttonUrl }
                            onChange={ onChangeButtonUrl }
                            placeholder="https://example.com"
                        />
                        <RangeControl
                            label="角丸 (px)"
                            value={ buttonRadius }
                            onChange={ onChangeButtonRadius }
                            min={ 0 }
                            max={ 50 }
                        />
                    </PanelBody>
                </InspectorControls>

                {/* エディター上のプレビュー */}
                <div {...blockProps}>
                    <div className={`this_wrap ${ alignRight ? 'right_img' : 'left_img' }`}>
                        <div className="image">
                            <figure>
                                {/* 画像が設定されていれば表示 */}
                                {imageUrl && (
                                    <img
                                        src={ imageUrl }
                                        alt={ imageAlt }
                                    />
                                )}
                            </figure>
                        </div>
                        <div className="cont">
                            <RichText
                                tagName="p"
                                value={ textContent }
                                onChange={ onChangeTextContent }
                                placeholder="テキストを入力"
                            />
                            {/* ボタンが表示設定の場合かつボタンテキストが空じゃない場合のみ表示 */}
                            { showButton && buttonText && (
                                <RichText
                                    tagName="div"
                                    className="btn"
                                    href={ buttonUrl }
                                    value={ buttonText }
                                    onChange={ onChangeButtonText }
                                    placeholder="ボタンテキスト"
                                    style={{ borderRadius: `${buttonRadius}px` }}
                                />
                            ) }
                        </div>
                    </div>
                </div>
            </>
        );
    },

    save: (props) => {
        const {
            attributes: {
                alignRight,
                imageUrl,
                imageAlt,
                textContent,
                buttonText,
                buttonUrl,
                showButton,
                buttonRadius,
            }
        } = props;

        const blockProps = useBlockProps.save({
            className: 'paid-block-content-6'
        });

        return (
            <div {...blockProps}>
                <div className={`this_wrap ${ alignRight ? 'right_img' : 'left_img' }`}>
                    <div className="image">
                        <figure>
                            {/* 画像が設定されていれば <img> を出力 */}
                            { imageUrl && (
                                <img
                                    src={ imageUrl }
                                    alt={ imageAlt }
                                />
                            )}
                        </figure>
                    </div>
                    <div className="cont">
                        {/* 改行を含むテキストを <RichText.Content> で出力 */}
                        <RichText.Content
                            tagName="p"
                            value={ textContent }
                        />
                        {/* ボタンが表示設定の場合かつボタンテキストが空じゃない場合のみ出力 */}
                        { showButton && buttonText && (
                            <RichText.Content
                                tagName="a"
                                className="btn"
                                href={ buttonUrl }
                                value={ buttonText }
                                style={{ borderRadius: `${buttonRadius}px` }}
                            />
                        ) }
                    </div>
                </div>
            </div>
        );
    },
});
