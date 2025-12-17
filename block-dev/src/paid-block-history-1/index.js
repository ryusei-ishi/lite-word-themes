/* ==========================================================
 * paid-block-history-1 – 年表ブロック
 *  ① ポイント背景・枠色対応
 *  ② 年見出し背景色(yearBgColor) 追加
 *  ③ updateEvent で深いコピーを行い、複製ブロック間の干渉を防止
 * ======================================================= */
import { registerBlockType } from '@wordpress/blocks';
import {
    RichText,
    InspectorControls,
    ColorPalette,
    useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType(metadata.name, {
    title   : '沿革 01',
    icon    : 'schedule',
    category: 'lw-table',
    supports: { anchor: true },

    /* ======================================================
     * 1) エディタ
     * ==================================================== */
    edit({ attributes, setAttributes }) {
        const {
            yearText, yearTag, fontYear, fontWeightYear, colorYear, yearBgColor,
            pointColor, pointBorderColor,
            fontDt, fontWeightDt, colorDt,
            fontDd, fontWeightDd, colorDd,
            events,
        } = attributes;

        const blockProps = useBlockProps({
            className: 'paid-block-history-1'
        });

        /* 深いコピー用ユーティリティ */
        const deepCloneEvents = (arr) => arr.map(e => ({ ...e }));

        /* イベント操作関数 */
        const addEvent = () => {
            setAttributes({ events: [ ...deepCloneEvents(events), { month:'', desc:'' } ] });
        };

        const removeEvent = (idx) => {
            const list = deepCloneEvents(events).filter((_, i) => i !== idx);
            setAttributes({ events: list });
        };

        const updateEvent = (idx, key, val) => {
            const list = deepCloneEvents(events);
            list[idx][key] = val;
            setAttributes({ events: list });
        };

        return (
            <>
                <InspectorControls>
                    {/* --- 年見出し書式 --- */}
                    <PanelBody title="年見出し" initialOpen={true}>
                        <SelectControl label="タグ" value={yearTag}
                            options={[{label:'h2',value:'h2'},{label:'h3',value:'h3'},{label:'h4',value:'h4'},{label:'p',value:'p'}]}
                            onChange={(v)=>setAttributes({ yearTag:v })}/>
                        <SelectControl label="フォント" value={fontYear}
                            options={fontOptions}
                            onChange={(v)=>setAttributes({ fontYear:v })}/>
                        <SelectControl label="太さ" value={fontWeightYear}
                            options={fontWeightOptions}
                            onChange={(v)=>setAttributes({ fontWeightYear:v })}/>
                        <p>文字色</p>
                        <ColorPalette value={colorYear} onChange={(c)=>setAttributes({ colorYear:c })}/>
                        <p>背景色</p>
                        <ColorPalette value={yearBgColor} onChange={(c)=>setAttributes({ yearBgColor:c })}/>
                    </PanelBody>

                    {/* --- ポイント色 --- */}
                    <PanelBody title="ポイント設定" initialOpen={false}>
                        <p>背景色</p>
                        <ColorPalette value={pointColor} onChange={(c)=>setAttributes({ pointColor:c })}/>
                        <p>ボーダー色</p>
                        <ColorPalette value={pointBorderColor} onChange={(c)=>setAttributes({ pointBorderColor:c })}/>
                    </PanelBody>

                    {/* --- 月(dt) --- */}
                    <PanelBody title="月 (dt)" initialOpen={false}>
                        <SelectControl label="フォント" value={fontDt}
                            options={fontOptions}
                            onChange={(v)=>setAttributes({ fontDt:v })}/>
                        <SelectControl label="太さ" value={fontWeightDt}
                            options={fontWeightOptions}
                            onChange={(v)=>setAttributes({ fontWeightDt:v })}/>
                        <p>文字色</p>
                        <ColorPalette value={colorDt} onChange={(c)=>setAttributes({ colorDt:c })}/>
                    </PanelBody>

                    {/* --- 説明(dd) --- */}
                    <PanelBody title="説明 (dd)" initialOpen={false}>
                        <SelectControl label="フォント" value={fontDd}
                            options={fontOptions}
                            onChange={(v)=>setAttributes({ fontDd:v })}/>
                        <SelectControl label="太さ" value={fontWeightDd}
                            options={fontWeightOptions}
                            onChange={(v)=>setAttributes({ fontWeightDd:v })}/>
                        <p>文字色</p>
                        <ColorPalette value={colorDd} onChange={(c)=>setAttributes({ colorDd:c })}/>
                    </PanelBody>
                </InspectorControls>

                {/* ---------- 編集画面 ---------- */}
                <div {...blockProps}>
                    <div className="history__year">
                        <div
                            className="history__point"
                            style={{ background:pointColor, borderColor:pointBorderColor }}
                        />
                        <RichText
                            tagName={yearTag}
                            className="history__year-heading"
                            value={yearText}
                            onChange={(v)=>setAttributes({ yearText:v })}
                            data-lw_font_set={fontYear}
                            placeholder="年を入力"
                            style={{
                                fontWeight:fontWeightYear,
                                color:colorYear||undefined,
                                background:yearBgColor||undefined,
                            }}
                        />

                        <dl className="history__events">
                            {events.map((e,i)=>(
                                <div className="history__events_row" key={i}>
                                    <dt className="history__dt">
                                        <RichText
                                            tagName="time"
                                            value={e.month}
                                            onChange={(v)=>updateEvent(i,'month',v)}
                                            data-lw_font_set={fontDt}
                                            placeholder="月"
                                            style={{ fontWeight:fontWeightDt, color:colorDt||undefined }}
                                        />
                                    </dt>
                                    <RichText
                                        tagName="dd"
                                        className="history__dd"
                                        value={e.desc}
                                        onChange={(v)=>updateEvent(i,'desc',v)}
                                        data-lw_font_set={fontDd}
                                        placeholder="説明を入力"
                                        style={{ fontWeight:fontWeightDd, color:colorDd||undefined }}
                                    />
                                    <button type="button" className="history__remove_btn" onClick={()=>removeEvent(i)}>削除</button>
                                </div>
                            ))}
                        </dl>
                        <button type="button" className="history__add_btn" onClick={addEvent}>イベントを追加する</button>
                    </div>
                </div>
            </>
        );
    },

    /* ======================================================
     * 2) フロント出力
     * ==================================================== */
    save({ attributes }) {
        const {
            yearText, yearTag, fontYear, fontWeightYear, colorYear, yearBgColor,
            pointColor, pointBorderColor,
            fontDt, fontWeightDt, colorDt,
            fontDd, fontWeightDd, colorDd,
            events,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'paid-block-history-1'
        });

        const filtered = events.filter(e =>
            String(e.month||'').trim() || String(e.desc||'').trim()
        );

        return (
            <div {...blockProps}>
                <div className="history__year" aria-labelledby={`y${String(yearText).replace(/[^0-9]/g,'')}`}>
                    <div
                        className="history__point"
                        style={{ background:pointColor, borderColor:pointBorderColor }}
                    />
                    <RichText.Content
                        tagName={yearTag}
                        className="history__year-heading"
                        value={yearText}
                        data-lw_font_set={fontYear}
                        style={{
                            fontWeight:fontWeightYear,
                            color:colorYear||undefined,
                            background:yearBgColor||undefined,
                        }}
                    />
                    <dl className="history__events">
                        {filtered.map((e,i)=>(
                            <div className="history__events_row" key={i}>
                                <dt className="history__dt">
                                    <RichText.Content
                                        tagName="time"
                                        datetime={String(e.month||'').replace('月','')}
                                        value={String(e.month||'')}
                                        data-lw_font_set={fontDt}
                                        style={{ fontWeight:fontWeightDt, color:colorDt||undefined }}
                                    />
                                </dt>
                                <RichText.Content
                                    tagName="dd"
                                    className="history__dd"
                                    value={String(e.desc||'')}
                                    data-lw_font_set={fontDd}
                                    style={{ fontWeight:fontWeightDd, color:colorDd||undefined }}
                                />
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        );
    },
});
