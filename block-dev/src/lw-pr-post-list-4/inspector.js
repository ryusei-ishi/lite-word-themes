import { InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, TextControl, SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import { columnOptions, dateFormatOptions } from './constants.js';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

export default function Inspector( { attributes, setAttributes } ) {
    const {
        numberOfPosts, categoryId, postType, columns, bgImage, bgColor, bgOpacity, dateFormat,
        dateFont, dateFontWeight, catFont, catFontWeight, catBgColor, titleFont, titleFontWeight,
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody title="基本設定" initialOpen={true}>
                <RangeControl
                    label="出力数"
                    value={numberOfPosts}
                    onChange={(value) => setAttributes({ numberOfPosts: value })}
                    min={1}
                    max={20}
                />
                <TextControl
                    label="カテゴリID"
                    value={categoryId}
                    onChange={(value) => setAttributes({ categoryId: value })}
                    help="特定のカテゴリを指定（空欄の場合は全カテゴリ）"
                />
                <TextControl
                    label="投稿タイプ"
                    value={postType}
                    onChange={(value) => setAttributes({ postType: value })}
                    help="投稿タイプを指定（例: post, page, custom_post_type）"
                />
                <p style={{ marginTop: '16px' }}>カテゴリの背景色</p>
                <ColorPalette
                    value={catBgColor}
                    onChange={(newColor) => setAttributes({ catBgColor: newColor })}
                />
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#757575' }}>
                    カテゴリー編集画面で「カテゴリーの色」を設定している場合は、そちらが優先されます。
                </p>
            </PanelBody>

            <PanelBody title="レイアウト設定">
                <SelectControl
                    label="カラム数（PC）"
                    value={String(columns)}
                    options={columnOptions}
                    onChange={(value) => setAttributes({ columns: parseInt(value, 10) })}
                    help="タブレットは2カラム、スマホは1カラムになります"
                />
            </PanelBody>

            <PanelBody title="背景設定">
                <p>背景画像</p>
                <MediaUpload
                    onSelect={(media) => setAttributes({ bgImage: media.url })}
                    allowedTypes={['image']}
                    value={bgImage}
                    render={({ open }) => (
                        <>
                            {bgImage ? (
                                <>
                                    <img
                                        src={bgImage}
                                        alt="選択した背景画像"
                                        style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                                    />
                                    <Button
                                        onClick={() => setAttributes({ bgImage: '' })}
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
                <p style={{ marginTop: '16px' }}>背景色</p>
                <ColorPalette
                    value={bgColor}
                    onChange={(newColor) => setAttributes({ bgColor: newColor || '' })}
                />
                <RangeControl
                    label="背景色の透明度"
                    value={bgOpacity}
                    onChange={(value) => setAttributes({ bgOpacity: value })}
                    min={0}
                    max={100}
                    help="背景画像の上に色を重ねるときは下げてください"
                />
            </PanelBody>

            <PanelBody title="日付設定">
                <SelectControl
                    label="日付の表記"
                    value={dateFormat}
                    options={dateFormatOptions}
                    onChange={(value) => setAttributes({ dateFormat: value })}
                />
            </PanelBody>

            <PanelBody title="フォント設定">
                <SelectControl
                    label="日付のフォント"
                    value={dateFont}
                    options={fontOptions}
                    onChange={(newFont) => setAttributes({ dateFont: newFont })}
                />
                <SelectControl
                    label="日付のフォント太さ"
                    value={dateFontWeight}
                    options={fontWeightOptions}
                    onChange={(newWeight) => setAttributes({ dateFontWeight: newWeight })}
                />
                <SelectControl
                    label="カテゴリーのフォント"
                    value={catFont}
                    options={fontOptions}
                    onChange={(newFont) => setAttributes({ catFont: newFont })}
                />
                <SelectControl
                    label="カテゴリーのフォント太さ"
                    value={catFontWeight}
                    options={fontWeightOptions}
                    onChange={(newWeight) => setAttributes({ catFontWeight: newWeight })}
                />
                <SelectControl
                    label="タイトルのフォント"
                    value={titleFont}
                    options={fontOptions}
                    onChange={(newFont) => setAttributes({ titleFont: newFont })}
                />
                <SelectControl
                    label="タイトルのフォント太さ"
                    value={titleFontWeight}
                    options={fontWeightOptions}
                    onChange={(newWeight) => setAttributes({ titleFontWeight: newWeight })}
                />
            </PanelBody>
        </InspectorControls>
    );
}
