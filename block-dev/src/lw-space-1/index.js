import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ResizableBox } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/lw-space-1', {
    title: 'Lw スペーサー（PC・TB・SP）',
    icon: 'align-wide',
    category: 'layout',
    supports: {
        anchor: true, 
    },
    attributes: {
        pcHeight: { type: 'number', default: 80 },
        tbHeight: { type: 'number', default: 64 },
        spHeight: { type: 'number', default: 40 },
    },
    edit: ({ attributes, setAttributes, toggleSelection }) => {
        const { pcHeight, tbHeight, spHeight } = attributes;

        return (
            <>
                <InspectorControls>
                    <PanelBody title="スペース設定">
                        <RangeControl
                            label="PCのスペース"
                            value={pcHeight}
                            onChange={(value) => setAttributes({ pcHeight: value })}
                            min={0}
                            max={500}
                        />
                        <RangeControl
                            label="タブレットのスペース"
                            value={tbHeight}
                            onChange={(value) => setAttributes({ tbHeight: value })}
                            min={0}
                            max={500}
                        />
                        <RangeControl
                            label="スマートフォンのスペース"
                            value={spHeight}
                            onChange={(value) => setAttributes({ spHeight: value })}
                            min={0}
                            max={500}
                        />
                    </PanelBody>
                </InspectorControls>
                <div className="lw_space_1">
                    <ResizableBox
                        size={{
                            height: pcHeight,
                        }}
                        minHeight={0}
                        maxHeight={500}
                        enable={{
                            top: false,
                            right: false,
                            bottom: true,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            setAttributes({
                                pcHeight: parseInt(pcHeight + delta.height, 10),
                            });
                            toggleSelection(true);
                        }}
                        onResizeStart={() => {
                            toggleSelection(false);
                        }}
                        showHandle={true}
                    >
                        <div className="pc" style={{ height: `${pcHeight}px` }}>
                            <span>PC時の余白</span>
                            <span>{pcHeight}px</span>
                        </div>
                    </ResizableBox>
                    
                    <ResizableBox
                        size={{
                            height: tbHeight,
                        }}
                        minHeight={0}
                        maxHeight={500}
                        enable={{
                            top: false,
                            right: false,
                            bottom: true,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            setAttributes({
                                tbHeight: parseInt(tbHeight + delta.height, 10),
                            });
                            toggleSelection(true);
                        }}
                        onResizeStart={() => {
                            toggleSelection(false);
                        }}
                        showHandle={true}
                    >
                        <div className="tb" style={{ height: `${tbHeight}px` }}>
                            <span>タブレット時の余白</span>
                            <span>{tbHeight}px</span>
                        </div>
                    </ResizableBox>
                    
                    <ResizableBox
                        size={{
                            height: spHeight,
                        }}
                        minHeight={0}
                        maxHeight={500}
                        enable={{
                            top: false,
                            right: false,
                            bottom: true,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            setAttributes({
                                spHeight: parseInt(spHeight + delta.height, 10),
                            });
                            toggleSelection(true);
                        }}
                        onResizeStart={() => {
                            toggleSelection(false);
                        }}
                        showHandle={true}
                    >
                        <div className="sp" style={{ height: `${spHeight}px` }}>
                            <span>スマートフォン時の余白</span>
                            <span>{spHeight}px</span>
                        </div>
                    </ResizableBox>
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const { pcHeight, tbHeight, spHeight } = attributes;

        return (
            <div className="lw_space_1">
                <div className="pc" style={{ height: `${pcHeight}px` }}></div>
                <div className="tb" style={{ height: `${tbHeight}px` }}></div>
                <div className="sp" style={{ height: `${spHeight}px` }}></div>
            </div>
        );
    },
});