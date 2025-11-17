import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    InspectorControls,
    useBlockProps
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ColorPalette,
    ToggleControl,
    Button
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

// 共通オプション
const fontOptions = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

registerBlockType('wdl/lw-pr-table-1', {
    title: '価格表 01',
    icon: 'editor-table',
    category: 'liteword-other',
    supports: { 
        anchor: true,
        className: true 
    },

    attributes: {
        // カラム数設定
        columnCount: { 
            type: 'number', 
            default: 4 
        },
        hideTableHeader: { 
            type: 'boolean', 
            default: false 
        },
        // 各カラムの幅（PC）
        cellWidth1: { type: 'number', default: 200 },
        cellWidth2: { type: 'number', default: 200 },
        cellWidth3: { type: 'number', default: 200 },
        cellWidth4: { type: 'number', default: 200 },
        cellWidth5: { type: 'number', default: 200 },
        cellWidth6: { type: 'number', default: 200 },
        cellWidth7: { type: 'number', default: 200 },
        cellWidth8: { type: 'number', default: 200 },
        
        // 各カラムの幅（SP）
        cellWidth1Sp: { type: 'number', default: 160 },
        cellWidth2Sp: { type: 'number', default: 160 },
        cellWidth3Sp: { type: 'number', default: 160 },
        cellWidth4Sp: { type: 'number', default: 160 },
        cellWidth5Sp: { type: 'number', default: 160 },
        cellWidth6Sp: { type: 'number', default: 160 },
        cellWidth7Sp: { type: 'number', default: 160 },
        cellWidth8Sp: { type: 'number', default: 160 },
        
        // 角丸サイズ
        radiusSize: { type: 'number', default: 12 },
        
        // 色設定 - ヘッダー共通
        headerBgColor: { type: 'string', default: 'var(--color-main)' },
        headerTextColor: { type: 'string', default: '#ffffff' },
        
        // 列ヘッダー個別背景色の使用フラグ
        useIndividualHeaderBg: { type: 'boolean', default: false },
        
        // 色設定 - その他
        cellBgColor: { type: 'string', default: '#ffffff' },
        cellTextColor: { type: 'string', default: '#333333' },
        shadowColor: { type: 'string', default: 'rgba(37, 37, 37, 0.3)' },
        
        // フォント設定 - 列ヘッダー
        fontFamilyHeader: { type: 'string', default: '' },
        fontWeightHeader: { type: 'string', default: '600' },
        fontSizeHeader: { type: 'number', default: 17 },
        fontSizeHeaderSp: { type: 'number', default: 16 },
        lineHeightHeader: { type: 'number', default: 1.5 },
        
        // フォント設定 - 行ヘッダー
        fontFamilyRowHeader: { type: 'string', default: '' },
        fontWeightRowHeader: { type: 'string', default: '600' },
        fontSizeRowHeader: { type: 'number', default: 17 },
        fontSizeRowHeaderSp: { type: 'number', default: 16 },
        lineHeightRowHeader: { type: 'number', default: 1.6 },
        
        // フォント設定 - 通常セル
        fontFamilyCell: { type: 'string', default: '' },
        fontWeightCell: { type: 'string', default: '400' },
        fontSizeCell: { type: 'number', default: 17 },
        fontSizeCellSp: { type: 'number', default: 16 },
        lineHeightCell: { type: 'number', default: 1.6 },
        
        // ギャップサイズ
        gapSize: { type: 'number', default: 3 },
        
        // コンテンツデータ - ヘッダーをオブジェクト配列に変更
        headers: {
            type: 'array',
            default: [
                { text: 'ベーシック', bgColor: '' },
                { text: 'スタンダード', bgColor: '' },
                { text: 'プレミアム', bgColor: '' }
            ]
        },
        
        rows: {
            type: 'array',
            source: 'query',
            selector: '.lw_table_row',
            query: {
                header: { 
                    type: 'string', 
                    source: 'html', 
                    selector: '.row_head .text' 
                },
                cells: {
                    type: 'array',
                    source: 'query',
                    selector: '.cell:not(.row_head)',
                    query: {
                        content: { 
                            type: 'string', 
                            source: 'html', 
                            selector: '.text' 
                        }
                    }
                }
            },
            default: [
                {
                    header: '月額料金',
                    cells: [
                        { content: '¥3,000' },
                        { content: '¥5,000' },
                        { content: '¥10,000' }
                    ]
                },
                {
                    header: 'ストレージ容量',
                    cells: [
                        { content: '10GB' },
                        { content: '50GB' },
                        { content: '無制限' }
                    ]
                },
                {
                    header: 'メールサポート',
                    cells: [
                        { content: '〇' },
                        { content: '〇' },
                        { content: '〇' }
                    ]
                }
            ]
        }
    },

    /* ========================================
     * エディタ
     * ======================================== */
    edit({ attributes, setAttributes }) {
        const {
            columnCount,
            hideTableHeader, 
            cellWidth1, cellWidth2, cellWidth3, cellWidth4, cellWidth5, cellWidth6, cellWidth7, cellWidth8,
            cellWidth1Sp, cellWidth2Sp, cellWidth3Sp, cellWidth4Sp, cellWidth5Sp, cellWidth6Sp, cellWidth7Sp, cellWidth8Sp,
            radiusSize,
            headerBgColor, headerTextColor,
            useIndividualHeaderBg,
            cellBgColor, cellTextColor,
            shadowColor,
            fontFamilyHeader, fontWeightHeader, fontSizeHeader, fontSizeHeaderSp, lineHeightHeader,
            fontFamilyRowHeader, fontWeightRowHeader, fontSizeRowHeader, fontSizeRowHeaderSp, lineHeightRowHeader,
            fontFamilyCell, fontWeightCell, fontSizeCell, fontSizeCellSp, lineHeightCell,
            gapSize,
            headers, rows
        } = attributes;

        const blockProps = useBlockProps({
            className: 'lw-pr-table-1'
        });

        // ヘッダー更新関数（テキスト）
        const updateHeaderText = (index, value) => {
            const newHeaders = [...headers];
            // 古い形式から新形式への変換
            if (typeof newHeaders[index] === 'string') {
                newHeaders[index] = { text: value, bgColor: '' };
            } else {
                newHeaders[index] = { ...newHeaders[index], text: value };
            }
            setAttributes({ headers: newHeaders });
        };

        // ヘッダー背景色更新関数
        const updateHeaderBgColor = (index, color) => {
            const newHeaders = [...headers];
            if (typeof newHeaders[index] === 'string') {
                newHeaders[index] = { text: newHeaders[index], bgColor: color };
            } else {
                newHeaders[index] = { ...newHeaders[index], bgColor: color };
            }
            setAttributes({ headers: newHeaders });
        };

        // 行追加関数
        const addRow = () => {
            const newCells = Array(columnCount - 1).fill({ content: '新しいセル' });
            setAttributes({ 
                rows: [...rows, { header: '新しい項目', cells: newCells }] 
            });
        };

        // 行削除関数
        const removeRow = (index) => {
            setAttributes({ 
                rows: rows.filter((_, i) => i !== index) 
            });
        };

        // 行移動関数
        const moveRow = (index, direction) => {
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= rows.length) return;
            
            const reordered = [...rows];
            const [moved] = reordered.splice(index, 1);
            reordered.splice(targetIndex, 0, moved);
            
            setAttributes({ rows: reordered });
        };

        // 行データ更新関数
        const updateRow = (rowIndex, key, value) => {
            const updated = [...rows];
            updated[rowIndex][key] = value;
            setAttributes({ rows: updated });
        };

        // セル更新関数
        const updateCell = (rowIndex, cellIndex, value) => {
            const updated = [...rows];
            if (!updated[rowIndex].cells || updated[rowIndex].cells.length !== columnCount - 1) {
                updated[rowIndex].cells = Array(columnCount - 1).fill({ content: '' });
            }
            updated[rowIndex].cells[cellIndex] = { content: value };
            setAttributes({ rows: updated });
        };

        // カラム数変更時の処理
        const handleColumnCountChange = (newCount) => {
            const count = parseInt(newCount);
            
            // ヘッダーの調整
            let newHeaders = [...headers];
            // 古い形式から新形式への変換
            newHeaders = newHeaders.map(header => 
                typeof header === 'string' ? { text: header, bgColor: '' } : header
            );
            
            if (count - 1 > newHeaders.length) {
                const diff = (count - 1) - newHeaders.length;
                for (let i = 0; i < diff; i++) {
                    newHeaders.push({ text: `プラン${newHeaders.length + i + 1}`, bgColor: '' });
                }
            } else if (count - 1 < newHeaders.length) {
                newHeaders = newHeaders.slice(0, count - 1);
            }

            // 行データの調整
            const newRows = rows.map(row => {
                let newCells = row.cells ? [...row.cells] : [];
                
                if (count - 1 > newCells.length) {
                    const diff = (count - 1) - newCells.length;
                    for (let i = 0; i < diff; i++) {
                        newCells.push({ content: '' });
                    }
                } else if (count - 1 < newCells.length) {
                    newCells = newCells.slice(0, count - 1);
                }
                
                return { ...row, cells: newCells };
            });

            setAttributes({ 
                columnCount: count, 
                headers: newHeaders,
                rows: newRows 
            });
        };

        // テーブル幅の計算
        const calculateTableWidth = () => {
            let width = cellWidth1;
            if (columnCount >= 2) width += cellWidth2;
            if (columnCount >= 3) width += cellWidth3;
            if (columnCount >= 4) width += cellWidth4;
            if (columnCount >= 5) width += cellWidth5;
            if (columnCount >= 6) width += cellWidth6;
            if (columnCount >= 7) width += cellWidth7;
            if (columnCount >= 8) width += cellWidth8;
            width += gapSize * (columnCount - 1);
            return width;
        };

        const calculateTableWidthSp = () => {
            let width = cellWidth1Sp;
            if (columnCount >= 2) width += cellWidth2Sp;
            if (columnCount >= 3) width += cellWidth3Sp;
            if (columnCount >= 4) width += cellWidth4Sp;
            if (columnCount >= 5) width += cellWidth5Sp;
            if (columnCount >= 6) width += cellWidth6Sp;
            if (columnCount >= 7) width += cellWidth7Sp;
            if (columnCount >= 8) width += cellWidth8Sp;
            width += gapSize * (columnCount - 1);
            return width;
        };

        // ヘッダーテキストを取得（後方互換性のため）
        const getHeaderText = (header) => {
            return typeof header === 'string' ? header : header.text;
        };

        // ヘッダー背景色を取得
        const getHeaderBgColor = (header) => {
            if (!useIndividualHeaderBg) return headerBgColor;
            if (typeof header === 'string') return headerBgColor;
            return header.bgColor || headerBgColor;
        };

        return (
            <Fragment>
                <InspectorControls>
                    {/* レイアウト設定 */}
                    <PanelBody title="📐 レイアウト設定" initialOpen={true}>
                        <ToggleControl
                            label="ヘッダー行を非表示"
                            checked={hideTableHeader}
                            onChange={(value) => setAttributes({ hideTableHeader: value })}
                            help="プラン名のヘッダー行全体を非表示にします"
                        />
                        <SelectControl
                            label="カラム数"
                            value={columnCount}
                            options={[
                                { label: '1カラム', value: 2 },
                                { label: '2カラム', value: 3 },
                                { label: '3カラム', value: 4 },
                                { label: '4カラム', value: 5 },
                                { label: '5カラム', value: 6 },
                                { label: '6カラム', value: 7 },
                                { label: '7カラム', value: 8 }
                            ]}
                            onChange={handleColumnCountChange}
                            help="項目列を含めた総カラム数"
                        />

                        <RangeControl
                            label="角丸サイズ (px)"
                            value={radiusSize}
                            onChange={(value) => setAttributes({ radiusSize: value })}
                            min={0}
                            max={50}
                        />

                        <RangeControl
                            label="セル間隔 (px)"
                            value={gapSize}
                            onChange={(value) => setAttributes({ gapSize: value })}
                            min={0}
                            max={10}
                        />
                    </PanelBody>

                    {/* カラム幅設定（PC） */}
                    {columnCount >= 2 && (
                        <PanelBody title="💻 カラム幅設定（PC）" initialOpen={false}>
                            <RangeControl
                                label="項目列の幅 (px)"
                                value={cellWidth1}
                                onChange={(value) => setAttributes({ 
                                    cellWidth1: value,
                                    cellWidth1Sp: value  // SPも同時に更新
                                })}
                                min={100}
                                max={800}
                            />
                            
                            {columnCount >= 2 && (
                                <RangeControl
                                    label="カラム2の幅 (px)"
                                    value={cellWidth2}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth2: value,
                                        cellWidth2Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}
                            
                            {columnCount >= 3 && (
                                <RangeControl
                                    label="カラム3の幅 (px)"
                                    value={cellWidth3}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth3: value,
                                        cellWidth3Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}
                            
                            {columnCount >= 4 && (
                                <RangeControl
                                    label="カラム4の幅 (px)"
                                    value={cellWidth4}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth4: value,
                                        cellWidth4Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}
                            
                            {columnCount >= 5 && (
                                <RangeControl
                                    label="カラム5の幅 (px)"
                                    value={cellWidth5}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth5: value,
                                        cellWidth5Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}

                            {columnCount >= 6 && (
                                <RangeControl
                                    label="カラム6の幅 (px)"
                                    value={cellWidth6}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth6: value,
                                        cellWidth6Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}

                            {columnCount >= 7 && (
                                <RangeControl
                                    label="カラム7の幅 (px)"
                                    value={cellWidth7}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth7: value,
                                        cellWidth7Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}

                            {columnCount >= 8 && (
                                <RangeControl
                                    label="カラム8の幅 (px)"
                                    value={cellWidth8}
                                    onChange={(value) => setAttributes({ 
                                        cellWidth8: value,
                                        cellWidth8Sp: value  // SPも同時に更新
                                    })}
                                    min={100}
                                    max={800}
                                />
                            )}
                        </PanelBody>
                    )}

                    {/* カラム幅設定（SP） */}
                    {columnCount >= 2 && (
                        <PanelBody title="📱 カラム幅設定（SP）" initialOpen={false}>
                            <RangeControl
                                label="項目列の幅 (px)"
                                value={cellWidth1Sp}
                                onChange={(value) => setAttributes({ cellWidth1Sp: value })}
                                min={80}
                                max={600}
                            />
                            
                            {columnCount >= 2 && (
                                <RangeControl
                                    label="カラム2の幅 (px)"
                                    value={cellWidth2Sp}
                                    onChange={(value) => setAttributes({ cellWidth2Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}
                            
                            {columnCount >= 3 && (
                                <RangeControl
                                    label="カラム3の幅 (px)"
                                    value={cellWidth3Sp}
                                    onChange={(value) => setAttributes({ cellWidth3Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}
                            
                            {columnCount >= 4 && (
                                <RangeControl
                                    label="カラム4の幅 (px)"
                                    value={cellWidth4Sp}
                                    onChange={(value) => setAttributes({ cellWidth4Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}
                            
                            {columnCount >= 5 && (
                                <RangeControl
                                    label="カラム5の幅 (px)"
                                    value={cellWidth5Sp}
                                    onChange={(value) => setAttributes({ cellWidth5Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}

                            {columnCount >= 6 && (
                                <RangeControl
                                    label="カラム6の幅 (px)"
                                    value={cellWidth6Sp}
                                    onChange={(value) => setAttributes({ cellWidth6Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}

                            {columnCount >= 7 && (
                                <RangeControl
                                    label="カラム7の幅 (px)"
                                    value={cellWidth7Sp}
                                    onChange={(value) => setAttributes({ cellWidth7Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}

                            {columnCount >= 8 && (
                                <RangeControl
                                    label="カラム8の幅 (px)"
                                    value={cellWidth8Sp}
                                    onChange={(value) => setAttributes({ cellWidth8Sp: value })}
                                    min={80}
                                    max={600}
                                />
                            )}
                        </PanelBody>
                    )}

                    {/* 色設定 */}
                    <PanelBody title="🎨 色設定" initialOpen={false}>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                ヘッダー背景色(共通)
                            </p>
                            <ColorPalette
                                value={headerBgColor}
                                onChange={(color) => setAttributes({ headerBgColor: color })}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                ヘッダー文字色
                            </p>
                            <ColorPalette
                                value={headerTextColor}
                                onChange={(color) => setAttributes({ headerTextColor: color })}
                            />
                        </div>

                        <ToggleControl
                            label="列ヘッダーの背景色を個別設定"
                            checked={useIndividualHeaderBg}
                            onChange={(value) => setAttributes({ useIndividualHeaderBg: value })}
                            help="各プランごとに異なる背景色を設定できます"
                        />

                        {useIndividualHeaderBg && (
                            <div style={{ 
                                marginTop: '20px', 
                                padding: '15px', 
                                background: '#f0f0f0',
                                borderRadius: '5px'
                            }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                                    列ヘッダー個別背景色
                                </p>
                                {headers.map((header, i) => (
                                    i < columnCount - 1 && (
                                        <div key={i} style={{ marginBottom: '15px' }}>
                                            <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                                                {getHeaderText(header) || `カラム${i + 2}`}
                                            </p>
                                            <ColorPalette
                                                value={getHeaderBgColor(header)}
                                                onChange={(color) => updateHeaderBgColor(i, color)}
                                            />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                セル背景色
                            </p>
                            <ColorPalette
                                value={cellBgColor}
                                onChange={(color) => setAttributes({ cellBgColor: color })}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                セル文字色
                            </p>
                            <ColorPalette
                                value={cellTextColor}
                                onChange={(color) => setAttributes({ cellTextColor: color })}
                            />
                        </div>
                    </PanelBody>

                    {/* 列ヘッダーフォント設定 */}
                    <PanelBody title="📝 列ヘッダーフォント設定" initialOpen={false}>
                        <SelectControl
                            label="フォントファミリー"
                            value={fontFamilyHeader}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ fontFamilyHeader: value })}
                        />

                        <SelectControl
                            label="太さ"
                            value={fontWeightHeader}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ fontWeightHeader: value })}
                        />

                        <RangeControl
                            label="文字サイズ PC (px)"
                            value={fontSizeHeader}
                            onChange={(value) => setAttributes({ fontSizeHeader: value })}
                            min={12}
                            max={24}
                        />

                        <RangeControl
                            label="文字サイズ SP (px)"
                            value={fontSizeHeaderSp}
                            onChange={(value) => setAttributes({ fontSizeHeaderSp: value })}
                            min={10}
                            max={20}
                        />

                        <RangeControl
                            label="行間"
                            value={lineHeightHeader}
                            onChange={(value) => setAttributes({ lineHeightHeader: value })}
                            min={1}
                            max={2.5}
                            step={0.1}
                        />
                    </PanelBody>

                    {/* 行ヘッダーフォント設定 */}
                    <PanelBody title="📝 行ヘッダーフォント設定" initialOpen={false}>
                        <SelectControl
                            label="フォントファミリー"
                            value={fontFamilyRowHeader}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ fontFamilyRowHeader: value })}
                        />

                        <SelectControl
                            label="太さ"
                            value={fontWeightRowHeader}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ fontWeightRowHeader: value })}
                        />

                        <RangeControl
                            label="文字サイズ PC (px)"
                            value={fontSizeRowHeader}
                            onChange={(value) => setAttributes({ fontSizeRowHeader: value })}
                            min={12}
                            max={24}
                        />

                        <RangeControl
                            label="文字サイズ SP (px)"
                            value={fontSizeRowHeaderSp}
                            onChange={(value) => setAttributes({ fontSizeRowHeaderSp: value })}
                            min={10}
                            max={20}
                        />

                        <RangeControl
                            label="行間"
                            value={lineHeightRowHeader}
                            onChange={(value) => setAttributes({ lineHeightRowHeader: value })}
                            min={1}
                            max={2.5}
                            step={0.1}
                        />
                    </PanelBody>

                    {/* セルフォント設定 */}
                    <PanelBody title="📝 セルフォント設定" initialOpen={false}>
                        <SelectControl
                            label="フォントファミリー"
                            value={fontFamilyCell}
                            options={fontOptions}
                            onChange={(value) => setAttributes({ fontFamilyCell: value })}
                        />

                        <SelectControl
                            label="太さ"
                            value={fontWeightCell}
                            options={fontWeightOptions}
                            onChange={(value) => setAttributes({ fontWeightCell: value })}
                        />

                        <RangeControl
                            label="文字サイズ PC (px)"
                            value={fontSizeCell}
                            onChange={(value) => setAttributes({ fontSizeCell: value })}
                            min={12}
                            max={24}
                        />

                        <RangeControl
                            label="文字サイズ SP (px)"
                            value={fontSizeCellSp}
                            onChange={(value) => setAttributes({ fontSizeCellSp: value })}
                            min={10}
                            max={20}
                        />

                        <RangeControl
                            label="行間"
                            value={lineHeightCell}
                            onChange={(value) => setAttributes({ lineHeightCell: value })}
                            min={1}
                            max={2.5}
                            step={0.1}
                        />
                    </PanelBody>
                </InspectorControls>

                {/* エディタ表示 */}
                <div {...blockProps}>
                    <div 
                        className="wrap_table"
                        style={{
                            '--lw-table-radius-size': `${radiusSize}px`,
                            '--lw-table-cell-width-1': `${cellWidth1}px`,
                            '--lw-table-cell-width-2': `${cellWidth2}px`,
                            '--lw-table-cell-width-3': `${cellWidth3}px`,
                            '--lw-table-cell-width-4': `${cellWidth4}px`,
                            '--lw-table-cell-width-5': `${cellWidth5}px`,
                            '--lw-table-cell-width-6': `${cellWidth6}px`,
                            '--lw-table-cell-width-7': `${cellWidth7}px`,
                            '--lw-table-cell-width-8': `${cellWidth8}px`,
                            '--lw-table-cell-width-1-sp': `${cellWidth1Sp}px`,
                            '--lw-table-cell-width-2-sp': `${cellWidth2Sp}px`,
                            '--lw-table-cell-width-3-sp': `${cellWidth3Sp}px`,
                            '--lw-table-cell-width-4-sp': `${cellWidth4Sp}px`,
                            '--lw-table-cell-width-5-sp': `${cellWidth5Sp}px`,
                            '--lw-table-cell-width-6-sp': `${cellWidth6Sp}px`,
                            '--lw-table-cell-width-7-sp': `${cellWidth7Sp}px`,
                            '--lw-table-cell-width-8-sp': `${cellWidth8Sp}px`,
                            '--lw-table-gap-size': `${gapSize}px`,
                            '--lw-table-column-count': columnCount,
                            '--lw-table-width': `${calculateTableWidth()}px`,
                            '--lw-table-width-sp': `${calculateTableWidthSp()}px`,

                            // フォントサイズのCSS変数を追加
                            '--lw-table-font-size-header': `${fontSizeHeader}px`,
                            '--lw-table-font-size-header-sp': `${fontSizeHeaderSp}px`,
                            '--lw-table-font-size-cell': `${fontSizeCell}px`,
                            '--lw-table-font-size-cell-sp': `${fontSizeCellSp}px`,
                            '--lw-table-font-size-row-header': `${fontSizeRowHeader}px`,
                            '--lw-table-font-size-row-header-sp': `${fontSizeRowHeaderSp}px`,
                            // 行間のCSS変数を追加
                            '--lw-table-line-height-header': lineHeightHeader,
                            '--lw-table-line-height-cell': lineHeightCell,
                            '--lw-table-line-height-row-header': lineHeightRowHeader,

                        }}
                    >
                        {/* ヘッダー行 */}
                        {!hideTableHeader && (
                            <div 
                                className="lw_table_head"
                                data-lw_font_set={fontFamilyHeader}
                            >
                                <div className="cell none"></div>
                                {headers.map((header, i) => (
                                    i < columnCount - 1 && (
                                        <div 
                                            key={i} 
                                            className="cell"
                                            style={{
                                                background: getHeaderBgColor(header),
                                                color: headerTextColor,
                                                fontWeight: fontWeightHeader,
                                            }}
                                        >
                                            <RichText
                                                className="text"
                                                value={getHeaderText(header)}
                                                onChange={(value) => updateHeaderText(i, value)}
                                                placeholder="ヘッダーテキスト"
                                            />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* データ行 */}
                        {rows.map((row, rowIndex) => (
                            <div 
                                key={rowIndex} 
                                className={`lw_table_row ${rowIndex === 0 ? 'first' : ''} ${rowIndex === rows.length - 1 ? 'last' : ''}`}
                                style={{ position: 'relative' }}
                            >
                                <div 
                                    className="cell row_head"
                                    data-lw_font_set={fontFamilyRowHeader}
                                    style={{
                                        background: headerBgColor,
                                        color: headerTextColor,
                                        fontWeight: fontWeightRowHeader,
                                        fontSize: `${fontSizeRowHeader}px`,
                                        lineHeight: lineHeightRowHeader,
                                    }}
                                >
                                    <RichText
                                        className="text"
                                        value={row.header}
                                        onChange={(value) => updateRow(rowIndex, 'header', value)}
                                        placeholder="項目名"
                                    />
                                </div>
                                
                                {Array.from({ length: columnCount - 1 }).map((_, cellIndex) => (
                                    <div 
                                        key={cellIndex} 
                                        className="cell"
                                        data-lw_font_set={fontFamilyCell}
                                        style={{
                                            padding: '0.7em 0.7em',
                                            background: cellBgColor,
                                            color: cellTextColor,
                                            fontWeight: fontWeightCell,
                                            fontSize: `${fontSizeCell}px`,
                                            lineHeight: lineHeightCell,
                                            boxShadow: `0 0 3px ${shadowColor}`
                                        }}
                                    >
                                        <RichText
                                            className="text"
                                            value={row.cells && row.cells[cellIndex] ? row.cells[cellIndex].content : ''}
                                            onChange={(value) => updateCell(rowIndex, cellIndex, value)}
                                            placeholder="内容"
                    
                                        />
                                    </div>
                                ))}

                                {/* 行コントロール */}
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
                                        disabled={rowIndex === rows.length - 1}
                                        className="move-down-button"
                                        aria-label="下へ移動"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeRow(rowIndex)}
                                        className="remove-item-button"
                                        aria-label="削除"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* 行追加ボタン */}
                        <button 
                            type="button" 
                            className="add-item-button" 
                            onClick={addRow}
                            style={{ marginTop: 12 }}
                        >
                            行を追加する
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    },

    save({ attributes }) {
        const {
            columnCount,
            hideTableHeader,
            cellWidth1, cellWidth2, cellWidth3, cellWidth4, cellWidth5, cellWidth6, cellWidth7, cellWidth8,
            cellWidth1Sp, cellWidth2Sp, cellWidth3Sp, cellWidth4Sp, cellWidth5Sp, cellWidth6Sp, cellWidth7Sp, cellWidth8Sp,
            radiusSize,
            headerBgColor, headerTextColor,
            useIndividualHeaderBg,
            cellBgColor, cellTextColor,
            shadowColor,
            fontFamilyHeader, fontWeightHeader, fontSizeHeader, fontSizeHeaderSp, lineHeightHeader,
            fontFamilyRowHeader, fontWeightRowHeader, fontSizeRowHeader, fontSizeRowHeaderSp, lineHeightRowHeader,
            fontFamilyCell, fontWeightCell, fontSizeCell, fontSizeCellSp, lineHeightCell,
            gapSize,
            headers, rows
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'lw-pr-table-1'
        });

        // テーブル幅の計算
        const calculateTableWidth = () => {
            let width = cellWidth1;
            if (columnCount >= 2) width += cellWidth2;
            if (columnCount >= 3) width += cellWidth3;
            if (columnCount >= 4) width += cellWidth4;
            if (columnCount >= 5) width += cellWidth5;
            if (columnCount >= 6) width += cellWidth6;
            if (columnCount >= 7) width += cellWidth7;
            if (columnCount >= 8) width += cellWidth8;
            width += gapSize * (columnCount - 1);
            return width;
        };

        const calculateTableWidthSp = () => {
            let width = cellWidth1Sp;
            if (columnCount >= 2) width += cellWidth2Sp;
            if (columnCount >= 3) width += cellWidth3Sp;
            if (columnCount >= 4) width += cellWidth4Sp;
            if (columnCount >= 5) width += cellWidth5Sp;
            if (columnCount >= 6) width += cellWidth6Sp;
            if (columnCount >= 7) width += cellWidth7Sp;
            if (columnCount >= 8) width += cellWidth8Sp;
            width += gapSize * (columnCount - 1);
            return width;
        };

        // ヘッダーテキストを取得（後方互換性のため）
        const getHeaderText = (header) => {
            return typeof header === 'string' ? header : header.text;
        };

        // ヘッダー背景色を取得
        const getHeaderBgColor = (header) => {
            if (!useIndividualHeaderBg) return headerBgColor;
            if (typeof header === 'string') return headerBgColor;
            return header.bgColor || headerBgColor;
        };

        return (
            <div {...blockProps}>
                <div 
                    className="wrap_table"
                    role="table"
                    aria-label="料金プラン比較表"
                    style={{
                        '--lw-table-radius-size': `${radiusSize}px`,
                        '--lw-table-cell-width-1': `${cellWidth1}px`,
                        '--lw-table-cell-width-2': `${cellWidth2}px`,
                        '--lw-table-cell-width-3': `${cellWidth3}px`,
                        '--lw-table-cell-width-4': `${cellWidth4}px`,
                        '--lw-table-cell-width-5': `${cellWidth5}px`,
                        '--lw-table-cell-width-6': `${cellWidth6}px`,
                        '--lw-table-cell-width-7': `${cellWidth7}px`,
                        '--lw-table-cell-width-8': `${cellWidth8}px`,
                        '--lw-table-cell-width-1-sp': `${cellWidth1Sp}px`,
                        '--lw-table-cell-width-2-sp': `${cellWidth2Sp}px`,
                        '--lw-table-cell-width-3-sp': `${cellWidth3Sp}px`,
                        '--lw-table-cell-width-4-sp': `${cellWidth4Sp}px`,
                        '--lw-table-cell-width-5-sp': `${cellWidth5Sp}px`,
                        '--lw-table-cell-width-6-sp': `${cellWidth6Sp}px`,
                        '--lw-table-cell-width-7-sp': `${cellWidth7Sp}px`,
                        '--lw-table-cell-width-8-sp': `${cellWidth8Sp}px`,
                        '--lw-table-gap-size': `${gapSize}px`,
                        '--lw-table-column-count': columnCount,
                        '--lw-table-width': `${calculateTableWidth()}px`,
                        '--lw-table-width-sp': `${calculateTableWidthSp()}px`,

                        // フォントサイズのCSS変数を追加
                        '--lw-table-font-size-header': `${fontSizeHeader}px`,
                        '--lw-table-font-size-header-sp': `${fontSizeHeaderSp}px`,
                        '--lw-table-font-size-row-header': `${fontSizeRowHeader}px`,
                        '--lw-table-font-size-row-header-sp': `${fontSizeRowHeaderSp}px`,
                        '--lw-table-font-size-cell': `${fontSizeCell}px`,
                        '--lw-table-font-size-cell-sp': `${fontSizeCellSp}px`,
                        // 行間のCSS変数を追加
                        '--lw-table-line-height-header': lineHeightHeader,
                        '--lw-table-line-height-row-header': lineHeightRowHeader,
                        '--lw-table-line-height-cell': lineHeightCell,
                    }}
                >
                     {/* ヘッダー行 */}
                    {!hideTableHeader && (
                        <div 
                            className="lw_table_head" 
                            role="row"
                            data-lw_font_set={fontFamilyHeader}
                        >
                            <div className="cell none" role="columnheader"></div>
                            {headers.map((header, i) => (
                                i < columnCount - 1 && (
                                    <div 
                                        key={i} 
                                        className="cell"
                                        role="columnheader"
                                        style={{
                                            background: getHeaderBgColor(header),
                                            color: headerTextColor,
                                            fontWeight: fontWeightHeader,
                                            lineHeight: lineHeightHeader,
                                        }}
                                    >
                                        <RichText.Content
                                            tagName="span"
                                            className="text"
                                            style = {{ lineHeight: lineHeightHeader,}}
                                            value={getHeaderText(header)}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    )}

                    {/* データ行 */}
                    {rows.map((row, rowIndex) => (
                        <div 
                            key={rowIndex} 
                            className={`lw_table_row ${rowIndex === 0 ? 'first' : ''} ${rowIndex === rows.length - 1 ? 'last' : ''}`}
                            role="row"
                        >
                            <div 
                                className="cell row_head"
                                role="rowheader"
                                data-lw_font_set={fontFamilyRowHeader}
                                style={{
                                    background: headerBgColor,
                                    color: headerTextColor,
                                    fontWeight: fontWeightRowHeader,
                                    lineHeight: lineHeightRowHeader,
                                }}
                            >
                                <RichText.Content
                                    tagName="span"
                                    className="text"
                                    style = {{ lineHeight: lineHeightRowHeader,}}
                                    value={row.header}
                                />
                            </div>
                            
                            {row.cells && row.cells.map((cell, cellIndex) => (
                                cellIndex < columnCount - 1 && (
                                    <div 
                                        key={cellIndex} 
                                        className="cell"
                                        role="cell"
                                        data-lw_font_set={fontFamilyCell}
                                        style={{
                                            background: cellBgColor,
                                            color: cellTextColor,
                                            fontWeight: fontWeightCell,
                                            boxShadow: `0 0 3px ${shadowColor}`,
                                            lineHeight: lineHeightCell
                                        }}
                                    >
                                        <RichText.Content
                                            tagName="span"
                                            className="text"
                                            style={{ lineHeight: lineHeightCell, }}
                                            value={cell.content}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
});