/**
 * shin-gas-station-01-fv-top — スマホ用テキスト簡易編集＋余白/行間/フォント/太さ 完全版
 * ==========================================================================================
 *   追加・変更点
 *   1. .main.sp にフォント（種類）と文字太さを Select で設定可能
 *   2. 行間・余白・フォント・太さはすべて style / data 属性に反映
 *   3. サイドバーのラベルを初心者向けに整理
 *   4. 既存機能はそのまま
 */

import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    MediaUpload,
    InspectorControls,
    ColorPalette
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    RangeControl,
    SelectControl,
    TextareaControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
    minHeightPcClassOptionArr,
    minHeightTbClassOptionArr,
    minHeightSpClassOptionArr,
    fontOptionsArr,
    fontWeightOptionsArr
} from '../utils.js';
import './style.scss';
import './editor.scss';

/* フォント関連オプションを取得 */
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/shin-gas-station-01-fv-top', {
    title: 'FV（トップ用）shin shop pattern 01',
    icon: 'cover-image',
    category: 'liteword-firstview',

    /* --------------------------------------------------
     * 属性
     * -------------------------------------------------- */
    attributes: {
        /* 背景画像 */
        backgroundImage: {
            type: 'string',
            default:
                'https://cdn.pixabay.com/photo/2013/10/14/10/37/froet-gas-195389_1280.jpg'
        },
        backgroundImageSp: { type: 'string', default: '' },

        /* PC 共通タイトル */
        subTitle: { type: 'string', default: 'Drive freely live comfortably.' },
        mainTitle: { type: 'string', default: '自由に走り<br>快適に暮らす' },

        /* ★ スマホ用テキスト */
        subTitleSp: { type: 'string', default: '' },
        mainTitleSp: { type: 'string', default: '' },
        mainLineHeightSp: { type: 'string', default: '' },
        mainMarginTopSp: { type: 'string', default: '' },
        mainMarginBottomSp: { type: 'string', default: '' },
        mainFontSetSp: { type: 'string', default: '' },      // ← フォント
        mainFontWeightSp: { type: 'string', default: '' },   // ← 太さ

        /* 説明文 */
        description: {
            type: 'string',
            default:
                '人々の車生活をより豊かにするためのソリューションをご提供'
        },
        descriptionSp: { type: 'string', default: '' },

        /* 色・サイズ */
        filterBackgroundColor: { type: 'string', default: '#000000' },
        filterOpacity: { type: 'number', default: 0.1 },
        textColor: { type: 'string', default: '#fff' },

        /* 高さクラス */
        minHeightPc: { type: 'string', default: 'min-h-pc-100vh-header-100' },
        minHeightTb: { type: 'string', default: 'min-h-tb-600px' },
        minHeightSp: { type: 'string', default: 'min-h-sp-480px' },

        maxWidth: { type: 'number', default: 2000 }
    },


    /* --------------------------------------------------
     * 編集画面
     * -------------------------------------------------- */
    edit(props) {
        const { attributes, setAttributes } = props;
        const {
            /* 画像 */
            backgroundImage,
            backgroundImageSp,

            /* PC/共通タイトル */
            subTitle,
            mainTitle,

            /* スマホ用設定 */
            subTitleSp,
            mainTitleSp,
            mainLineHeightSp,
            mainMarginTopSp,
            mainMarginBottomSp,
            mainFontSetSp,
            mainFontWeightSp,
            description,
            descriptionSp,

            /* カラー等 */
            filterBackgroundColor,
            filterOpacity,
            textColor,

            /* 高さ・幅 */
            minHeightPc,
            minHeightTb,
            minHeightSp,
            maxWidth
        } = attributes;

        /* 固定ページのみ許可 */
        const currentPostType = useSelect((select) =>
            select('core/editor').getCurrentPostType()
        );
        if (currentPostType !== 'page') {
            return <p>このブロックは固定ページでのみ使用できます。</p>;
        }

        /* 画像ハンドラ */
        const onChangeBackgroundImage = (media) =>
            setAttributes({ backgroundImage: media.url });
        const onChangeBackgroundImageSp = (media) =>
            setAttributes({ backgroundImageSp: media.url });

        /* 改行を <br> に変換 */
        const nl2br = (str = '') =>
            str.replace(/\n/g, '<br />').replace(/\r/g, '');

        /* main.sp スタイル */
        const mainSpStyle = {
            color: textColor,
            ...(mainLineHeightSp && { lineHeight: mainLineHeightSp }),
            ...(mainMarginTopSp && { marginTop: mainMarginTopSp }),
            ...(mainMarginBottomSp && { marginBottom: mainMarginBottomSp }),
            ...(mainFontWeightSp && { fontWeight: mainFontWeightSp })
        };

        /* margin セレクト共通オプション */
        const marginOptions = [
            { label: '標準', value: '' },
            { label: '0', value: '0' },
            { label: '0.2em', value: '0.2em' },
            { label: '0.4em', value: '0.4em' },
            { label: '0.6em', value: '0.6em' },
            { label: '0.8em', value: '0.8em' },
            { label: '1em', value: '1em' }
        ];

        return (
            <Fragment>
                {/* ----------------------------------------
                 * サイドバー
                 * -------------------------------------- */}
                <InspectorControls>
                    {/* 背景画像 */}
                    <PanelBody title="背景画像">
                        <p>PC 用</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImage}
                            allowedTypes={['image']}
                            value={backgroundImage}
                            render={({ open }) => (
                                <>
                                    {backgroundImage && (
                                        <>
                                            <img
                                                src={backgroundImage}
                                                alt="背景画像"
                                                style={{ width: '100%', marginBottom: 10 }}
                                            />
                                            <Button
                                                onClick={() =>
                                                    setAttributes({ backgroundImage: '' })
                                                }
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                削除
                                            </Button>
                                        </>
                                    )}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                        <p style={{ marginTop: 16 }}>スマホ用</p>
                        <MediaUpload
                            onSelect={onChangeBackgroundImageSp}
                            allowedTypes={['image']}
                            value={backgroundImageSp}
                            render={({ open }) => (
                                <>
                                    {backgroundImageSp && (
                                        <>
                                            <img
                                                src={backgroundImageSp}
                                                alt="背景画像"
                                                style={{ width: '100%', marginBottom: 10 }}
                                            />
                                            <Button
                                                onClick={() =>
                                                    setAttributes({
                                                        backgroundImageSp: ''
                                                    })
                                                }
                                                variant="secondary"
                                                style={{ margin: '4px 4px 0 0' }}
                                            >
                                                削除
                                            </Button>
                                        </>
                                    )}
                                    <Button onClick={open} variant="secondary">
                                        画像を選択
                                    </Button>
                                </>
                            )}
                        />
                    </PanelBody>

                    {/* フィルター */}
                    <PanelBody title="フィルター">
                        <p>色</p>
                        <ColorPalette
                            value={filterBackgroundColor}
                            onChange={(c) =>
                                setAttributes({ filterBackgroundColor: c })
                            }
                        />
                        <p>透明度</p>
                        <RangeControl
                            value={filterOpacity}
                            onChange={(v) => setAttributes({ filterOpacity: v })}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </PanelBody>

                    {/* 文字色 */}
                    <PanelBody title="文字色">
                        <ColorPalette
                            value={textColor}
                            onChange={(c) => setAttributes({ textColor: c })}
                        />
                    </PanelBody>

                    {/* 高さ */}
                    <PanelBody title="FV ブロック高さ">
                        <p>PC</p>
                        <SelectControl
                            value={minHeightPc}
                            options={minHeightPcClassOptionArr()}
                            onChange={(v) => setAttributes({ minHeightPc: v })}
                        />
                        <p>タブレット</p>
                        <SelectControl
                            value={minHeightTb}
                            options={minHeightTbClassOptionArr()}
                            onChange={(v) => setAttributes({ minHeightTb: v })}
                        />
                        <p>スマホ</p>
                        <SelectControl
                            value={minHeightSp}
                            options={minHeightSpClassOptionArr()}
                            onChange={(v) => setAttributes({ minHeightSp: v })}
                        />
                    </PanelBody>

                    {/* 最大幅 */}
                    <PanelBody title="コンテンツ幅">
                        <RangeControl
                            label="最大幅 (px)"
                            value={maxWidth}
                            onChange={(v) => setAttributes({ maxWidth: v })}
                            min={600}
                            max={2000}
                            step={8}
                        />
                    </PanelBody>

                    {/* ★ スマホテキスト */}
                    <PanelBody title="スマホ版テキスト">
                        <TextareaControl
                            label="■ サブタイトル ---------------"
                            value={subTitleSp}
                            rows={3}
                            onChange={(v) => setAttributes({ subTitleSp: v })}
                        />
                        <TextareaControl
                            label="■ メインタイトル ---------------"
                            value={mainTitleSp}
                            rows={3}
                            onChange={(v) => setAttributes({ mainTitleSp: v })}
                        />
                        <SelectControl
                            label="メインタイトル行間"
                            value={mainLineHeightSp}
                            options={[
                                { label: '標準', value: '' },
                                { label: '1em', value: '1em' },
                                { label: '1.1em', value: '1.1em' },
                                { label: '1.2em', value: '1.2em' },
                                { label: '1.3em', value: '1.3em' },
                                { label: '1.4em', value: '1.4em' },
                                { label: '1.5em', value: '1.5em' },
                                { label: '1.6em', value: '1.6em' },
                                { label: '1.7em', value: '1.7em' },
                                { label: '1.8em', value: '1.8em' },
                                { label: '1.9em', value: '1.9em' },
                                { label: '2em', value: '2em' }
                            ]}
                            onChange={(v) => setAttributes({ mainLineHeightSp: v })}
                        />
                        <SelectControl
                            label="余白・上 (margin-top)"
                            value={mainMarginTopSp}
                            options={marginOptions}
                            onChange={(v) => setAttributes({ mainMarginTopSp: v })}
                        />
                        <SelectControl
                            label="余白・下 (margin-bottom)"
                            value={mainMarginBottomSp}
                            options={marginOptions}
                            onChange={(v) => setAttributes({ mainMarginBottomSp: v })}
                        />
                        <SelectControl
                            label="フォント（スマホ）"
                            value={mainFontSetSp}
                            options={fontOptions}
                            onChange={(v) => setAttributes({ mainFontSetSp: v })}
                        />
                        <SelectControl
                            label="文字の太さ（スマホ）"
                            value={mainFontWeightSp}
                            options={fontWeightOptions}
                            onChange={(v) => setAttributes({ mainFontWeightSp: v })}
                        />
                        <TextareaControl
                            label="■ 説明文 ---------------"
                            value={descriptionSp}
                            rows={4}
                            onChange={(v) => setAttributes({ descriptionSp: v })}
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ----------------------------------------
                 * プレビュー
                 * -------------------------------------- */}
                <div
                    className={`shin_gas_station_01_top ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
                >
                    <div
                        className="shin_gas_station_01_top_inner"
                        style={{ maxWidth }}
                    >
                        {/* タイトル */}
                        <h1 style={{ color: textColor }}>
                            <RichText
                                tagName="span"
                                className="sub"
                                value={subTitle}
                                onChange={(v) => setAttributes({ subTitle: v })}
                                placeholder="サブタイトルを入力"
                                style={{ color: textColor }}
                            />

                            {/* スマホ用サブタイトル */}
                            {subTitleSp && (
                                <span
                                    className="sub sp"
                                    style={{ color: textColor }}
                                    dangerouslySetInnerHTML={{
                                        __html: nl2br(subTitleSp)
                                    }}
                                />
                            )}

                            <RichText
                                tagName="span"
                                className="main"
                                value={mainTitle}
                                onChange={(v) => setAttributes({ mainTitle: v })}
                                placeholder="メインタイトルを入力"
                                style={{ color: textColor }}
                            />

                            {/* スマホ用メインタイトル */}
                            {mainTitleSp && (
                                <span
                                    className="main sp"
                                    style={mainSpStyle}
                                    data-lw_font_set={mainFontSetSp}
                                    dangerouslySetInnerHTML={{
                                        __html: nl2br(mainTitleSp)
                                    }}
                                />
                            )}
                        </h1>

                        {/* 説明文 */}
                        <RichText
                            tagName="p"
                            value={description}
                            onChange={(v) => setAttributes({ description: v })}
                            placeholder="説明文を入力"
                            style={{ color: textColor }}
                        />

                        {/* スマホ用説明文 */}
                        {descriptionSp && (
                            <p
                                className="description sp"
                                style={{ color: textColor }}
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(descriptionSp)
                                }}
                            />
                        )}
                    </div>

                    {/* フィルター & 背景 */}
                    <div
                        className="filter"
                        style={{
                            backgroundColor: filterBackgroundColor,
                            opacity: filterOpacity
                        }}
                    />
                    <div className="bg_image">
                        {backgroundImage && (
                            <img src={backgroundImage} alt="背景画像" />
                        )}
                    </div>
                </div>
            </Fragment>
        );
    },

    /* --------------------------------------------------
     * 保存
     * -------------------------------------------------- */
    save(props) {
        const { attributes } = props;
        const {
            backgroundImage,
            backgroundImageSp,
            subTitle,
            mainTitle,
            subTitleSp,
            mainTitleSp,
            mainLineHeightSp,
            mainMarginTopSp,
            mainMarginBottomSp,
            mainFontSetSp,
            mainFontWeightSp,
            description,
            descriptionSp,
            filterBackgroundColor,
            filterOpacity,
            textColor,
            minHeightPc,
            minHeightTb,
            minHeightSp,
            maxWidth
        } = attributes;

        const nl2br = (str = '') =>
            str.replace(/\n/g, '<br />').replace(/\r/g, '');

        const mainSpStyle = {
            color: textColor,
            ...(mainLineHeightSp && { lineHeight: mainLineHeightSp }),
            ...(mainMarginTopSp && { marginTop: mainMarginTopSp }),
            ...(mainMarginBottomSp && { marginBottom: mainMarginBottomSp }),
            ...(mainFontWeightSp && { fontWeight: mainFontWeightSp })
        };

        return (
            <div
                className={`shin_gas_station_01_top ${minHeightPc} ${minHeightTb} ${minHeightSp}`}
            >
                <div
                    className="shin_gas_station_01_top_inner"
                    style={{ maxWidth }}
                >
                    <h1 style={{ color: textColor }}>
                        <RichText.Content
                            tagName="span"
                            className="sub"
                            value={subTitle}
                            style={{ color: textColor }}
                        />
                        {subTitleSp && (
                            <span
                                className="sub sp"
                                style={{ color: textColor }}
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(subTitleSp)
                                }}
                            />
                        )}
                        <RichText.Content
                            tagName="span"
                            className="main"
                            value={mainTitle}
                            style={{ color: textColor }}
                        />
                        {mainTitleSp && (
                            <span
                                className="main sp"
                                style={mainSpStyle}
                                data-lw_font_set={mainFontSetSp}
                                dangerouslySetInnerHTML={{
                                    __html: nl2br(mainTitleSp)
                                }}
                            />
                        )}
                    </h1>

                    <RichText.Content
                        tagName="p"
                        value={description}
                        style={{ color: textColor }}
                    />
                    {descriptionSp && (
                        <p
                            className="description sp"
                            style={{ color: textColor }}
                            dangerouslySetInnerHTML={{
                                __html: nl2br(descriptionSp)
                            }}
                        />
                    )}
                </div>

                <div
                    className="filter"
                    style={{
                        backgroundColor: filterBackgroundColor,
                        opacity: filterOpacity
                    }}
                />

                {backgroundImage && (
                    <picture className="bg_image">
                        <source
                            srcSet={backgroundImageSp}
                            media="(max-width: 800px)"
                        />
                        <source
                            srcSet={backgroundImage}
                            media="(min-width: 801px)"
                        />
                        <img src={backgroundImage} alt="背景画像" />
                    </picture>
                )}
            </div>
        );
    }
});
