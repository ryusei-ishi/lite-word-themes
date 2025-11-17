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
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
import './style.scss';
import './editor.scss';

/* ===== 共通オプション ===== */
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

/* ----------------------------------------------------------
 * ブロック登録
 * -------------------------------------------------------- */
registerBlockType('wdl/paid-block-history-1', {
    title   : '沿革 01',
    icon    : 'schedule',
    category: 'liteword-other',
    supports: { anchor: true },

    attributes: {
        /* --- 年見出し --- */
        yearText      : { type:'string',  default:'2003年' },
        yearTag       : { type:'string',  default:'h3'   },
        fontYear      : { type:'string',  default:''     },
        fontWeightYear: { type:'string',  default:''     },
        colorYear     : { type:'string',  default:''     },
        yearBgColor   : { type:'string',  default:''     }, // ★ 追加

        /* --- タイムラインポイント --- */
        pointColor       : { type:'string',  default:'#ffffff' },
        pointBorderColor : { type:'string',  default:'var(--color-main)' },

        /* --- 月 (dt) --- */
        fontDt        : { type:'string',  default:'' },
        fontWeightDt  : { type:'string',  default:'' },
        colorDt       : { type:'string',  default:'' },

        /* --- 説明 (dd) --- */
        fontDd        : { type:'string',  default:'' },
        fontWeightDd  : { type:'string',  default:'' },
        colorDd       : { type:'string',  default:'' },

        /* --- イベント配列 --- */
        events: {
            type   : 'array',
            source : 'query',
            selector: '.history__events_row',
            query  : {
                month: { type:'string', source:'text', selector:'time' },
                desc : { type:'string', source:'html', selector:'dd'   },
            },
            default: [
                { month:'4月',  desc:'地域の福祉ニーズを把握するための住民説明会を開催。施設構想を共有し、支援者を募集。' },
                { month:'7月',  desc:'特定非営利活動法人として県の認証を取得し、地域福祉ネットワークづくりを本格始動。' },
                { month:'8月',  desc:'賃貸契約を締結し、小規模多機能施設を開設。利用者受け入れ準備を開始。' },
                { month:'12月', desc:'初めての利用者を受け入れ。地域ボランティアによるサポート体制が整い、運営を本格化。' },
            ],
        },
    },

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
            <Fragment>
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
                <div className="paid-block-history-1">
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
            </Fragment>
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

        const filtered = events.filter(e =>
            String(e.month||'').trim() || String(e.desc||'').trim()
        );

        return (
            <div className="paid-block-history-1">
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
