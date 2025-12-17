import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, ColorPalette, SelectControl } from '@wordpress/components';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType(metadata.name, {
    edit: function(props) {
        const {
            attributes: {
                colorTableItemBd,
                colorTableHeadItemBg,
                colorTableHeadItemText,
                colorTableBodyItemText,
                colorTableBodyItemFirstText,
                fontSet,
                fontWeight,
                headItems,
                bodyRows
            },
            setAttributes
        } = props;

        const updateHeadItem = (index, value) => {
            const newHeadItems = [...headItems];
            newHeadItems[index] = value;
            setAttributes({ headItems: newHeadItems });
        };

        const updateBodyCell = (rowIndex, cellIndex, value) => {
            const newBodyRows = [...bodyRows];
            newBodyRows[rowIndex][cellIndex] = value;
            setAttributes({ bodyRows: newBodyRows });
        };

        const addRow = () => {
            const newRow = Array(headItems.length).fill('');
            setAttributes({ bodyRows: [...bodyRows, newRow] });
        };

        const removeRow = (index) => {
            const newBodyRows = bodyRows.filter((_, i) => i !== index);
            setAttributes({ bodyRows: newBodyRows });
        };

        const moveRow = (index, direction) => {
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= bodyRows.length) return;
            
            const reordered = [...bodyRows];
            const [moved] = reordered.splice(index, 1);
            reordered.splice(targetIndex, 0, moved);
            
            setAttributes({ bodyRows: reordered });
        };

        const blockProps = useBlockProps({
            className: 'lw-pr-calendar-1',
            style: {
                '--color-table-item-bd': colorTableItemBd,
                '--color-table-head-item-bg': colorTableHeadItemBg,
                '--color-table-head-item-text': colorTableHeadItemText,
                '--color-table-body-item-text': colorTableBodyItemText,
                '--color-table-body-item-first-text': colorTableBodyItemFirstText
            }
        });

        return (
            <>
                <InspectorControls>
                    <PanelBody title="色設定" initialOpen={true}>
                        <p>テーブルアイテムのボーダー色</p>
                        <ColorPalette
                            value={colorTableItemBd}
                            onChange={(color) => setAttributes({ colorTableItemBd: color })}
                        />
                        <p>テーブルヘッドの背景色</p>
                        <ColorPalette
                            value={colorTableHeadItemBg}
                            onChange={(color) => setAttributes({ colorTableHeadItemBg: color })}
                        />
                        <p>テーブルヘッドのテキスト色</p>
                        <ColorPalette
                            value={colorTableHeadItemText}
                            onChange={(color) => setAttributes({ colorTableHeadItemText: color })}
                        />
                        <p>テーブルボディのテキスト色</p>
                        <ColorPalette
                            value={colorTableBodyItemText}
                            onChange={(color) => setAttributes({ colorTableBodyItemText: color })}
                        />
                        <p>テーブルボディの最初の列のテキスト色</p>
                        <ColorPalette
                            value={colorTableBodyItemFirstText}
                            onChange={(color) => setAttributes({ colorTableBodyItemFirstText: color })}
                        />
                    </PanelBody>
                    <PanelBody title="フォント設定" initialOpen={false}>
                        <SelectControl
                            label="フォント種類"
                            value={fontSet}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ fontSet: value })}
                        />
                        <SelectControl
                            label="フォントの太さ"
                            value={fontWeight}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ fontWeight: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className="wrap_table">
                        <div className="table_head">
                            {headItems.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`item ${index === 0 ? 'first' : ''}`}
                                    data-lw_font_set={fontSet}
                                    style={{ fontWeight: fontWeight }}
                                >
                                    <RichText
                                        tagName="span"
                                        className="edit_in"
                                        value={item}
                                        onChange={(value) => updateHeadItem(index, value)}
                                        placeholder="ヘッダー"
                                    />
                                </div>
                            ))}
                        </div>
                        {bodyRows.map((row, rowIndex) => (
                            <div key={rowIndex} style={{ position: 'relative' }}>
                                <div className="table_body">
                                    {row.map((cell, cellIndex) => (
                                        <div 
                                            key={cellIndex} 
                                            className={`item ${cellIndex === 0 ? 'first' : ''}`}
                                            data-lw_font_set={fontSet}
                                            style={{ fontWeight: fontWeight }}
                                        >
                                            <RichText
                                                tagName="span"
                                                className="edit_in"
                                                value={cell}
                                                onChange={(value) => updateBodyCell(rowIndex, cellIndex, value)}
                                                placeholder="内容"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="lw-table-item-controls">
                                    <button
                                        type="button"
                                        onClick={() => moveRow(rowIndex, -1)}
                                        disabled={rowIndex === 0}
                                        className="move-up-button"
                                        aria-label="上へ移動"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveRow(rowIndex, 1)}
                                        disabled={rowIndex === bodyRows.length - 1}
                                        className="move-down-button"
                                        aria-label="下へ移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        className="remove-item-button"
                                        onClick={() => removeRow(rowIndex)}
                                        aria-label="削除"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="add-item-button"
                        onClick={addRow}
                        style={{ marginTop: 12 }}
                    >
                        リストを追加する
                    </button>
                </div>
            </>
        );
    },
    save: function(props) {
        const {
            attributes: {
                colorTableItemBd,
                colorTableHeadItemBg,
                colorTableHeadItemText,
                colorTableBodyItemText,
                colorTableBodyItemFirstText,
                fontSet,
                fontWeight,
                headItems,
                bodyRows
            }
        } = props;

        return (
            <div 
                className="lw-pr-calendar-1"
                style={{
                    '--color-table-item-bd': colorTableItemBd,
                    '--color-table-head-item-bg': colorTableHeadItemBg,
                    '--color-table-head-item-text': colorTableHeadItemText,
                    '--color-table-body-item-text': colorTableBodyItemText,
                    '--color-table-body-item-first-text': colorTableBodyItemFirstText
                }}
            >
                <div className="wrap_table">
                    <div className="table_head">
                        {headItems.map((item, index) => (
                            <div 
                                key={index} 
                                className={`item ${index === 0 ? 'first' : ''}`}
                                data-lw_font_set={fontSet}
                                style={{ fontWeight: fontWeight }}
                            >
                                <RichText.Content
                                    tagName="span"
                                    value={item}
                                />
                            </div>
                        ))}
                    </div>
                    {bodyRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="table_body">
                            {row.map((cell, cellIndex) => (
                                <div 
                                    key={cellIndex} 
                                    className={`item ${cellIndex === 0 ? 'first' : ''}`}
                                    data-lw_font_set={fontSet}
                                    style={{ fontWeight: fontWeight }}
                                >
                                    <RichText.Content
                                        tagName="span"
                                        value={cell}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
});