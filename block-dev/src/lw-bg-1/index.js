import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, useSettings, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, RangeControl, SelectControl, GradientPicker, ToggleControl, FocalPointPicker } from '@wordpress/components';
import { minHeightPcClassOptionArr, minHeightTbClassOptionArr, minHeightSpClassOptionArr } from '../utils.js';

import './style.scss';
import './editor.scss';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const {
            backgroundType,
            imagePc,
            imageSp,
            focalPointPc,
            focalPointSp,
            videoUrl,
            videoSpeed,
            focalPointVideoPc,
            focalPointVideoSp,
            isFullWidth,
            maxWidth,
            minHeightPc,
            minHeightTb,
            minHeightSp,
            contentAlignHorizontalPc,
            contentAlignVerticalPc,
            contentAlignHorizontalTb,
            contentAlignVerticalTb,
            contentAlignHorizontalSp,
            contentAlignVerticalSp,
            innerPaddingTopPc,
            innerPaddingBottomPc,
            innerPaddingLeftPc,
            innerPaddingRightPc,
            innerPaddingTopTb,
            innerPaddingBottomTb,
            innerPaddingLeftTb,
            innerPaddingRightTb,
            innerPaddingTopSp,
            innerPaddingBottomSp,
            innerPaddingLeftSp,
            innerPaddingRightSp,
            filterTypePc,
            filterColorPc,
            filterGradientPc,
            opacityPc,
            filterTypeTb,
            filterColorTb,
            filterGradientTb,
            opacityTb,
            filterTypeSp,
            filterColorSp,
            filterGradientSp,
            opacitySp,
        } = attributes;

        const [gradients, colors] = useSettings('color.gradients', 'color.palette');

        // フィルターの色と透明度を分離して返す
        const getFilterStyle = (filterType, filterColor, filterGradient) => {
            if (filterType === 'gradient' && filterGradient) {
                return filterGradient;
            } else if (filterColor) {
                return filterColor;
            }
            return '';
        };

        const filterStyle = {
            '--lw-bg-color-filter-pc': getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-pc': opacityPc,
            '--lw-bg-color-filter-tb': getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-tb': opacityTb,
            '--lw-bg-color-filter-sp': getFilterStyle(filterTypeSp, filterColorSp, filterGradientSp) || getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-sp': opacitySp,
        };

        const paddingStyle = {
            '--lw-bg-padding-top-pc': `${innerPaddingTopPc}px`,
            '--lw-bg-padding-bottom-pc': `${innerPaddingBottomPc}px`,
            '--lw-bg-padding-left-pc': `${innerPaddingLeftPc}px`,
            '--lw-bg-padding-right-pc': `${innerPaddingRightPc}px`,
            '--lw-bg-padding-top-tb': `${innerPaddingTopTb}px`,
            '--lw-bg-padding-bottom-tb': `${innerPaddingBottomTb}px`,
            '--lw-bg-padding-left-tb': `${innerPaddingLeftTb}px`,
            '--lw-bg-padding-right-tb': `${innerPaddingRightTb}px`,
            '--lw-bg-padding-top-sp': `${innerPaddingTopSp}px`,
            '--lw-bg-padding-bottom-sp': `${innerPaddingBottomSp}px`,
            '--lw-bg-padding-left-sp': `${innerPaddingLeftSp}px`,
            '--lw-bg-padding-right-sp': `${innerPaddingRightSp}px`,
            '--lw-bg-max-width': `${maxWidth}px`,
        };

        const backgroundStyle = backgroundType === 'video' ? {
            '--lw-bg-position-pc': `${focalPointVideoPc.x * 100}% ${focalPointVideoPc.y * 100}%`,
            '--lw-bg-position-sp': `${focalPointVideoSp.x * 100}% ${focalPointVideoSp.y * 100}%`,
        } : {
            '--lw-bg-position-pc': `${focalPointPc.x * 100}% ${focalPointPc.y * 100}%`,
            '--lw-bg-position-sp': `${focalPointSp.x * 100}% ${focalPointSp.y * 100}%`,
        };

        const alignmentStyle = {
            '--lw-bg-wrap-centering-pc': contentAlignHorizontalPc,
            '--lw-bg-wrap-align-pc': contentAlignVerticalPc,
            '--lw-bg-wrap-centering-tb': contentAlignHorizontalTb || contentAlignHorizontalPc,
            '--lw-bg-wrap-align-tb': contentAlignVerticalTb || contentAlignVerticalPc,
            '--lw-bg-wrap-centering-sp': contentAlignHorizontalSp || contentAlignHorizontalTb || contentAlignHorizontalPc,
            '--lw-bg-wrap-align-sp': contentAlignVerticalSp || contentAlignVerticalTb || contentAlignVerticalPc,
        };

        const fullWidthClass = isFullWidth ? 'bg_all' : '';

        const blockProps = useBlockProps({
            className: `lw-bg-1 ${minHeightPc} ${minHeightTb} ${minHeightSp} ${fullWidthClass}`.trim(),
            style: { ...filterStyle, ...backgroundStyle, ...alignmentStyle },
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="コンテンツの幅" initialOpen={true}>
                        <ToggleControl
                            label="背景全幅表示"
                            checked={isFullWidth}
                            onChange={(value) => setAttributes({ isFullWidth: value })}
                            help={isFullWidth ? '背景が全幅で表示されます' : '背景が通常幅で表示されます'}
                        />
                        <RangeControl
                            label="内側の最大幅 (px)"
                            value={maxWidth}
                            onChange={(value) => setAttributes({ maxWidth: value })}
                            min={800}
                            max={1920}
                            step={10}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                    </PanelBody>
                    <PanelBody title="コンテンツの高さ" initialOpen={false}>
                        <SelectControl
                            label="最小の高さ（PC）"
                            value={minHeightPc}
                            options={minHeightPcClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightPc: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label="最小の高さ（タブレット）"
                            value={minHeightTb}
                            options={minHeightTbClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightTb: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label="最小の高さ（スマホ）"
                            value={minHeightSp}
                            options={minHeightSpClassOptionArr()}
                            onChange={(value) => setAttributes({ minHeightSp: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                    </PanelBody>
                    <PanelBody title="背景色の設定" initialOpen={false}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>PC</h3>
                        <SelectControl
                            label="タイプ"
                            value={filterTypePc}
                            options={[
                                { label: '単色', value: 'solid' },
                                { label: 'グラデーション', value: 'gradient' },
                            ]}
                            onChange={(value) => setAttributes({ filterTypePc: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        {filterTypePc === 'solid' ? (
                            <>
                                <p style={{ marginBottom: '8px' }}>背景の色</p>
                                <ColorPalette
                                    value={filterColorPc}
                                    onChange={(color) => setAttributes({ filterColorPc: color })}
                                    colors={colors}
                                />
                            </>
                        ) : (
                            <GradientPicker
                                value={filterGradientPc}
                                onChange={(gradient) => setAttributes({ filterGradientPc: gradient })}
                                gradients={gradients}
                            />
                        )}
                        <RangeControl
                            label="透明度"
                            value={opacityPc}
                            onChange={(value) => setAttributes({ opacityPc: value })}
                            min={0}
                            max={1}
                            step={0.1}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>タブレット</h3>
                        <SelectControl
                            label="タイプ"
                            value={filterTypeTb}
                            options={[
                                { label: '単色', value: 'solid' },
                                { label: 'グラデーション', value: 'gradient' },
                            ]}
                            onChange={(value) => setAttributes({ filterTypeTb: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        {filterTypeTb === 'solid' ? (
                            <>
                                <p style={{ marginBottom: '8px' }}>フィルター色（空欄でPC設定を継承）</p>
                                <ColorPalette
                                    value={filterColorTb}
                                    onChange={(color) => setAttributes({ filterColorTb: color })}
                                    colors={colors}
                                />
                            </>
                        ) : (
                            <GradientPicker
                                value={filterGradientTb || filterGradientPc}
                                onChange={(gradient) => setAttributes({ filterGradientTb: gradient })}
                                gradients={gradients}
                            />
                        )}
                        <RangeControl
                            label="透明度"
                            value={opacityTb}
                            onChange={(value) => setAttributes({ opacityTb: value })}
                            min={0}
                            max={1}
                            step={0.1}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>スマホ</h3>
                        <SelectControl
                            label="タイプ"
                            value={filterTypeSp}
                            options={[
                                { label: '単色', value: 'solid' },
                                { label: 'グラデーション', value: 'gradient' },
                            ]}
                            onChange={(value) => setAttributes({ filterTypeSp: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        {filterTypeSp === 'solid' ? (
                            <>
                                <p style={{ marginBottom: '8px' }}>フィルター色（空欄でタブレット設定を継承）</p>
                                <ColorPalette
                                    value={filterColorSp}
                                    onChange={(color) => setAttributes({ filterColorSp: color })}
                                    colors={colors}
                                />
                            </>
                        ) : (
                            <GradientPicker
                                value={filterGradientSp || filterGradientTb || filterGradientPc}
                                onChange={(gradient) => setAttributes({ filterGradientSp: gradient })}
                                gradients={gradients}
                            />
                        )}
                        <RangeControl
                            label="透明度"
                            value={opacitySp}
                            onChange={(value) => setAttributes({ opacitySp: value })}
                            min={0}
                            max={1}
                            step={0.1}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                    </PanelBody>
                    <PanelBody title="背景イメージタイプ" initialOpen={true}>
                        <SelectControl
                            label="タイプを選択"
                            value={backgroundType}
                            options={[
                                { label: '画像', value: 'image' },
                                { label: '動画', value: 'video' },
                            ]}
                            onChange={(value) => setAttributes({ backgroundType: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                    </PanelBody>

                    {backgroundType === 'image' && (
                        <PanelBody title="背景画像設定" initialOpen={false}>
                            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>PC用画像</p>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ imagePc: media.url })}
                                    allowedTypes={['image']}
                                    value={imagePc}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary">
                                            {imagePc ? 'PC用画像を変更' : 'PC用画像を選択'}
                                        </Button>
                                    )}
                                />
                                {imagePc && (
                                    <Button
                                        onClick={() => setAttributes({ imagePc: '' })}
                                        variant="secondary"
                                        isDestructive
                                    >
                                        削除
                                    </Button>
                                )}
                            </div>
                            {imagePc && (
                                <>
                                    <img src={imagePc} alt="" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                                    <FocalPointPicker
                                        label="PC画像の表示位置"
                                        url={imagePc}
                                        value={focalPointPc}
                                        onChange={(value) => setAttributes({ focalPointPc: value })}
                                    />
                                </>
                            )}

                            <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>スマホ用画像</p>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ imageSp: media.url })}
                                    allowedTypes={['image']}
                                    value={imageSp}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary">
                                            {imageSp ? 'スマホ用画像を変更' : 'スマホ用画像を選択'}
                                        </Button>
                                    )}
                                />
                                {imageSp && (
                                    <Button
                                        onClick={() => setAttributes({ imageSp: '' })}
                                        variant="secondary"
                                        isDestructive
                                    >
                                        削除
                                    </Button>
                                )}
                            </div>
                            {imageSp && (
                                <>
                                    <img src={imageSp} alt="" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                                    <FocalPointPicker
                                        label="スマホ画像の表示位置"
                                        url={imageSp}
                                        value={focalPointSp}
                                        onChange={(value) => setAttributes({ focalPointSp: value })}
                                    />
                                </>
                            )}
                        </PanelBody>
                    )}

                    {backgroundType === 'video' && (
                        <PanelBody title="背景動画設定" initialOpen={false}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ videoUrl: media.url })}
                                    allowedTypes={['video']}
                                    value={videoUrl}
                                    render={({ open }) => (
                                        <Button onClick={open} variant="secondary">
                                            {videoUrl ? '動画を変更' : '動画を選択'}
                                        </Button>
                                    )}
                                />
                                {videoUrl && (
                                    <Button
                                        onClick={() => setAttributes({ videoUrl: '' })}
                                        variant="secondary"
                                        isDestructive
                                    >
                                        削除
                                    </Button>
                                )}
                            </div>
                            {videoUrl && (
                                <video src={videoUrl} controls style={{ maxWidth: '100%', marginTop: '10px', marginBottom: '10px' }} />
                            )}
                            <RangeControl
                                label="動画の再生速度"
                                value={videoSpeed}
                                onChange={(value) => setAttributes({ videoSpeed: value })}
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                __next40pxDefaultSize={true}
                                __nextHasNoMarginBottom={true}
                            />

                            <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>動画の表示位置（PC）</h3>
                            <div style={{ marginBottom: '20px' }}>
                                <RangeControl
                                    label="横位置"
                                    value={focalPointVideoPc.x * 100}
                                    onChange={(value) => setAttributes({
                                        focalPointVideoPc: { ...focalPointVideoPc, x: value / 100 }
                                    })}
                                    min={0}
                                    max={100}
                                    step={1}
                                    __next40pxDefaultSize={true}
                                    __nextHasNoMarginBottom={true}
                                />
                                <RangeControl
                                    label="縦位置"
                                    value={focalPointVideoPc.y * 100}
                                    onChange={(value) => setAttributes({
                                        focalPointVideoPc: { ...focalPointVideoPc, y: value / 100 }
                                    })}
                                    min={0}
                                    max={100}
                                    step={1}
                                    __next40pxDefaultSize={true}
                                    __nextHasNoMarginBottom={true}
                                />
                            </div>

                            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>動画の表示位置（スマホ）</h3>
                            <div>
                                <RangeControl
                                    label="横位置"
                                    value={focalPointVideoSp.x * 100}
                                    onChange={(value) => setAttributes({
                                        focalPointVideoSp: { ...focalPointVideoSp, x: value / 100 }
                                    })}
                                    min={0}
                                    max={100}
                                    step={1}
                                    __next40pxDefaultSize={true}
                                    __nextHasNoMarginBottom={true}
                                />
                                <RangeControl
                                    label="縦位置"
                                    value={focalPointVideoSp.y * 100}
                                    onChange={(value) => setAttributes({
                                        focalPointVideoSp: { ...focalPointVideoSp, y: value / 100 }
                                    })}
                                    min={0}
                                    max={100}
                                    step={1}
                                    __next40pxDefaultSize={true}
                                    __nextHasNoMarginBottom={true}
                                />
                            </div>
                        </PanelBody>
                    )}



                    <PanelBody title="コンテンツの配置" initialOpen={false}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>PC</h3>
                        <SelectControl
                            label="水平方向"
                            value={contentAlignHorizontalPc}
                            options={[
                                { label: '左', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '右', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignHorizontalPc: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label="垂直方向"
                            value={contentAlignVerticalPc}
                            options={[
                                { label: '上', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '下', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignVerticalPc: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>タブレット</h3>
                        <SelectControl
                            label="水平方向（空欄でPC設定を継承）"
                            value={contentAlignHorizontalTb}
                            options={[
                                { label: 'PC設定を継承', value: '' },
                                { label: '左', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '右', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignHorizontalTb: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label="垂直方向（空欄でPC設定を継承）"
                            value={contentAlignVerticalTb}
                            options={[
                                { label: 'PC設定を継承', value: '' },
                                { label: '上', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '下', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignVerticalTb: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>スマホ</h3>
                        <SelectControl
                            label="水平方向（空欄でタブレット設定を継承）"
                            value={contentAlignHorizontalSp}
                            options={[
                                { label: 'タブレット設定を継承', value: '' },
                                { label: '左', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '右', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignHorizontalSp: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label="垂直方向（空欄でタブレット設定を継承）"
                            value={contentAlignVerticalSp}
                            options={[
                                { label: 'タブレット設定を継承', value: '' },
                                { label: '上', value: 'flex-start' },
                                { label: '中央', value: 'center' },
                                { label: '下', value: 'flex-end' },
                            ]}
                            onChange={(value) => setAttributes({ contentAlignVerticalSp: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                    </PanelBody>

                    <PanelBody title="内側の余白" initialOpen={true}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>PC</h3>
                        <RangeControl
                            label="上"
                            value={innerPaddingTopPc}
                            onChange={(value) => setAttributes({ innerPaddingTopPc: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="下"
                            value={innerPaddingBottomPc}
                            onChange={(value) => setAttributes({ innerPaddingBottomPc: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="左"
                            value={innerPaddingLeftPc}
                            onChange={(value) => setAttributes({ innerPaddingLeftPc: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="右"
                            value={innerPaddingRightPc}
                            onChange={(value) => setAttributes({ innerPaddingRightPc: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>タブレット</h3>
                        <RangeControl
                            label="上"
                            value={innerPaddingTopTb}
                            onChange={(value) => setAttributes({ innerPaddingTopTb: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="下"
                            value={innerPaddingBottomTb}
                            onChange={(value) => setAttributes({ innerPaddingBottomTb: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="左"
                            value={innerPaddingLeftTb}
                            onChange={(value) => setAttributes({ innerPaddingLeftTb: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="右"
                            value={innerPaddingRightTb}
                            onChange={(value) => setAttributes({ innerPaddingRightTb: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>スマホ</h3>
                        <RangeControl
                            label="上"
                            value={innerPaddingTopSp}
                            onChange={(value) => setAttributes({ innerPaddingTopSp: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="下"
                            value={innerPaddingBottomSp}
                            onChange={(value) => setAttributes({ innerPaddingBottomSp: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="左"
                            value={innerPaddingLeftSp}
                            onChange={(value) => setAttributes({ innerPaddingLeftSp: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <RangeControl
                            label="右"
                            value={innerPaddingRightSp}
                            onChange={(value) => setAttributes({ innerPaddingRightSp: value })}
                            min={0}
                            max={200}
                            step={4}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                    </PanelBody>


                </InspectorControls>
                <div {...blockProps}>
                    <div className="lw-bg-1-wrap" style={paddingStyle}>
                        <InnerBlocks />
                    </div>
                    {backgroundType === 'video' ? (
                        videoUrl && (
                            <div className="bg_img">
                                <video src={videoUrl} muted playsInline loop className="video" data-playback-rate={videoSpeed} />
                            </div>
                        )
                    ) : (
                        (imagePc || imageSp) && (
                            <picture className="bg_img">
                                {imageSp && <source srcSet={imageSp} media="(max-width: 800px)" />}
                                {imagePc && <source srcSet={imagePc} media="(min-width: 801px)" />}
                                <img src={imagePc || imageSp} alt="" />
                            </picture>
                        )
                    )}
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const {
            backgroundType,
            imagePc,
            imageSp,
            focalPointPc,
            focalPointSp,
            videoUrl,
            videoSpeed,
            focalPointVideoPc,
            focalPointVideoSp,
            isFullWidth,
            maxWidth,
            minHeightPc,
            minHeightTb,
            minHeightSp,
            contentAlignHorizontalPc,
            contentAlignVerticalPc,
            contentAlignHorizontalTb,
            contentAlignVerticalTb,
            contentAlignHorizontalSp,
            contentAlignVerticalSp,
            innerPaddingTopPc,
            innerPaddingBottomPc,
            innerPaddingLeftPc,
            innerPaddingRightPc,
            innerPaddingTopTb,
            innerPaddingBottomTb,
            innerPaddingLeftTb,
            innerPaddingRightTb,
            innerPaddingTopSp,
            innerPaddingBottomSp,
            innerPaddingLeftSp,
            innerPaddingRightSp,
            filterTypePc,
            filterColorPc,
            filterGradientPc,
            opacityPc,
            filterTypeTb,
            filterColorTb,
            filterGradientTb,
            opacityTb,
            filterTypeSp,
            filterColorSp,
            filterGradientSp,
            opacitySp,
        } = attributes;

        const getFilterStyle = (filterType, filterColor, filterGradient) => {
            if (filterType === 'gradient' && filterGradient) {
                return filterGradient;
            } else if (filterColor) {
                return filterColor;
            }
            return '';
        };

        const filterStyle = {
            '--lw-bg-color-filter-pc': getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-pc': opacityPc,
            '--lw-bg-color-filter-tb': getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-tb': opacityTb,
            '--lw-bg-color-filter-sp': getFilterStyle(filterTypeSp, filterColorSp, filterGradientSp) || getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
            '--lw-bg-opacity-sp': opacitySp,
        };

        const paddingStyle = {
            '--lw-bg-padding-top-pc': `${innerPaddingTopPc}px`,
            '--lw-bg-padding-bottom-pc': `${innerPaddingBottomPc}px`,
            '--lw-bg-padding-left-pc': `${innerPaddingLeftPc}px`,
            '--lw-bg-padding-right-pc': `${innerPaddingRightPc}px`,
            '--lw-bg-padding-top-tb': `${innerPaddingTopTb}px`,
            '--lw-bg-padding-bottom-tb': `${innerPaddingBottomTb}px`,
            '--lw-bg-padding-left-tb': `${innerPaddingLeftTb}px`,
            '--lw-bg-padding-right-tb': `${innerPaddingRightTb}px`,
            '--lw-bg-padding-top-sp': `${innerPaddingTopSp}px`,
            '--lw-bg-padding-bottom-sp': `${innerPaddingBottomSp}px`,
            '--lw-bg-padding-left-sp': `${innerPaddingLeftSp}px`,
            '--lw-bg-padding-right-sp': `${innerPaddingRightSp}px`,
            '--lw-bg-max-width': `${maxWidth}px`,
        };

        const backgroundStyle = backgroundType === 'video' ? {
            '--lw-bg-position-pc': `${focalPointVideoPc.x * 100}% ${focalPointVideoPc.y * 100}%`,
            '--lw-bg-position-sp': `${focalPointVideoSp.x * 100}% ${focalPointVideoSp.y * 100}%`,
        } : {
            '--lw-bg-position-pc': `${focalPointPc.x * 100}% ${focalPointPc.y * 100}%`,
            '--lw-bg-position-sp': `${focalPointSp.x * 100}% ${focalPointSp.y * 100}%`,
        };

        const alignmentStyle = {
            '--lw-bg-wrap-centering-pc': contentAlignHorizontalPc,
            '--lw-bg-wrap-align-pc': contentAlignVerticalPc,
            '--lw-bg-wrap-centering-tb': contentAlignHorizontalTb || contentAlignHorizontalPc,
            '--lw-bg-wrap-align-tb': contentAlignVerticalTb || contentAlignVerticalPc,
            '--lw-bg-wrap-centering-sp': contentAlignHorizontalSp || contentAlignHorizontalTb || contentAlignHorizontalPc,
            '--lw-bg-wrap-align-sp': contentAlignVerticalSp || contentAlignVerticalTb || contentAlignVerticalPc,
        };

        const fullWidthClass = isFullWidth ? 'bg_all' : '';

        const blockProps = useBlockProps.save({
            className: `lw-bg-1 ${minHeightPc} ${minHeightTb} ${minHeightSp} ${fullWidthClass}`.trim(),
            style: { ...filterStyle, ...backgroundStyle, ...alignmentStyle },
        });

        return (
            <div {...blockProps}>
                <div className="lw-bg-1-wrap" style={paddingStyle}>
                    <InnerBlocks.Content />
                </div>
                {backgroundType === 'video' ? (
                    videoUrl && (
                        <div className="bg_img">
                            <video autoPlay muted loop playsInline className="video lazy-video" data-playback-rate={videoSpeed} style={{ display: 'none' }}>
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                        </div>
                    )
                ) : (
                    (imagePc || imageSp) && (
                        <picture className="bg_img">
                            {imageSp && <source srcSet={imageSp} media="(max-width: 800px)" />}
                            {imagePc && <source srcSet={imagePc} media="(min-width: 801px)" />}
                            <img src={imagePc || imageSp} alt="" />
                        </picture>
                    )
                )}
                {backgroundType === 'video' && videoUrl && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            document.addEventListener('DOMContentLoaded', function() {
                                const videos = document.querySelectorAll('.lw-bg-1 .lazy-video');
                                videos.forEach(function(video) {
                                    video.style.display = 'block';
                                    const playbackRate = video.getAttribute('data-playback-rate');
                                    if (playbackRate) {
                                        video.playbackRate = parseFloat(playbackRate);
                                    }
                                });
                            });
                            `,
                        }}
                    />
                )}
            </div>
        );
    }
});
