import { registerBlockType } from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    RichText,
    BlockControls,
    ColorPalette,
	useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextareaControl,
    Button,
    SelectControl,
    ToolbarGroup,
    ToolbarButton,
    ToggleControl,
    RangeControl,
} from '@wordpress/components';
// フォントの選択肢など（環境に合わせて修正してください）
import { fontOptionsArr, fontWeightOptionsArr } from '../utils.js';
const fontOptions       = fontOptionsArr();
const fontWeightOptions = fontWeightOptionsArr();

import './editor.scss';
import metadata from './block.json';
import './style.scss';

/* ================================================================ */
/*  ▶ ブロック登録                                                   */
/* ================================================================ */
registerBlockType(metadata.name, {
    /* -------------------------------------------------------------- */
    /*  ▶ 編集画面 (edit)                                             */
    /* -------------------------------------------------------------- */
    edit: ( { attributes, setAttributes } ) => {
        const {
            pcImage, spImage, imgAlt,
            pcTitle, spTitle, pcBody,
            textColumns, headingLevel, verticalCenter, aspectRatioHeight,
            contsMaxWidth,
            spTitleFont, spTitleFontWeight,
            pcTitleColor, spTitleColor,
            imgLabel, spImageBottom,
        } = attributes;

        /* ========== ハンドラ ========== */
        const setAttr = ( key ) => ( value ) => setAttributes( { [key]: value } );

        /* ========== 代入ロジック ========== */
        const finalSpImage  = spImage || pcImage;
        const finalAlt      = imgAlt  || pcTitle;
        const finalSpTitle  = spTitle || pcTitle;
        const spTitleWithBr = finalSpTitle.replace(/\n/g, '<br>');

        /* 見出しタグ */
        const Tag = `h${ headingLevel }`;
        /* 中央寄せ用 style とmax-width */
        const contsStyle = verticalCenter 
            ? { alignItems: 'center', maxWidth: `${contsMaxWidth}px` } 
            : { maxWidth: `${contsMaxWidth}px` };

        
        const blockProps = useBlockProps({
            className: 'paid-block-content-5'
        });

        return (
            <>
                {/* ==================== BlockControls ==================== */}
                <BlockControls>
                    <ToolbarGroup>
                        {[1,2,3,4,5,6].map( (lvl) => (
                            <ToolbarButton
                                key={lvl}
                                isPressed={ headingLevel === lvl }
                                onClick={ () => setAttributes( { headingLevel: lvl } ) }
                            >
                                {`H${lvl}`}
                            </ToolbarButton>
                        ))}
                    </ToolbarGroup>
                </BlockControls>

                {/* ================= InspectorControls =================== */}
                <InspectorControls>
                    {/* ▶ マニュアル */}
                    <PanelBody title="マニュアル">
                        <Button
                            variant="secondary"
                            href="https://www.youtube.com/watch?v=WvhfcfCSphI"
                            target="_blank"
                        >
                            このブロックの使い方はこちら
                        </Button>
                    </PanelBody>

                    {/* ▶ スマホ用タイトル */}
                    <PanelBody title="スマホの時のテキスト" initialOpen>
                        <TextareaControl
                            label="SP用タイトルテキスト"
                            value={ spTitle }
                            onChange={ setAttr('spTitle') }
                            placeholder="(空ならPCタイトルを流用)"
                            rows={ 2 }
                        />
                        <SelectControl
                            label="SPタイトルのフォント"
                            value={ spTitleFont }
                            options={ fontOptions }
                            onChange={ setAttr('spTitleFont') }
                        />
                        <SelectControl
                            label="SPタイトルの太さ"
                            value={ spTitleFontWeight }
                            options={ fontWeightOptions }
                            onChange={ setAttr('spTitleFontWeight') }
                        />
                        <ColorPalette
                            label="SPタイトルの文字色"
                            value={ spTitleColor }
                            onChange={ setAttr('spTitleColor') }
                        />
                    </PanelBody>

                    {/* ▶ 画像の見せ方（2026-09-01 追加）
                        ・ラベル … 写真の上に名前や肩書きを出す小さな帯
                        ・スマホで画像を下に … 上に別の写真（FVなど）が来るときに、
                          写真が2枚続いて見えるのを避ける */}
                    <PanelBody title="画像の見せ方" initialOpen>
                        <TextControl
                            label="画像の上に出すラベル"
                            help="名前や肩書きなど。空なら出ません。"
                            value={ imgLabel }
                            onChange={ setAttr('imgLabel') }
                            placeholder="例）代表　山田 太郎"
                        />
                        <ToggleControl
                            label="スマホのとき、画像をテキストの下に置く"
                            help="上に別の写真がある場合に、写真が2枚続いて見えるのを避けられます。"
                            checked={ !! spImageBottom }
                            onChange={ (v)=>setAttributes({ spImageBottom: !! v }) }
                        />
                    </PanelBody>

                    {/* ▶ 画像の見せ方（2026-09-01 追加）
                        ・ラベル … 写真の上に名前や肩書きを出す小さな帯
                        ・スマホで画像を下に … 上に別の写真（FVなど）が来るときに、
                          写真が2枚続いて見えるのを避ける */}
                    <PanelBody title="画像の見せ方" initialOpen>
                        <TextControl
                            label="画像の上に出すラベル"
                            help="名前や肩書きなど。空なら出ません。"
                            value={ imgLabel }
                            onChange={ setAttr('imgLabel') }
                            placeholder="例）代表　山田 太郎"
                        />
                        <ToggleControl
                            label="スマホのとき、画像をテキストの下に置く"
                            help="上に別の写真がある場合に、写真が2枚続いて見えるのを避けられます。"
                            checked={ !! spImageBottom }
                            onChange={ (v)=>setAttributes({ spImageBottom: !! v }) }
                        />
                    </PanelBody>

                    {/* ▶ 画像やレイアウト */}
                    <PanelBody title="画像やレイアウト" initialOpen>
                        {/* PC画像 */}
                        <p><strong>PC用画像</strong></p>
                        <MediaUpload
                            onSelect={ (m)=>setAttributes({ pcImage: m.url }) }
                            allowedTypes={ ['image'] }
                            render={ ({ open }) => (
                                <div style={{ marginBottom:'1em' }}>
                                    { pcImage && <img src={ pcImage } alt="" style={{ maxWidth:'100%', marginBottom:'0.5em' }} /> }
                                    <Button variant="secondary" onClick={ open }>
                                        { pcImage ? 'PC画像を変更' : 'PC画像を選択' }
                                    </Button>
                                    { pcImage && (
                                        <Button variant="secondary" onClick={ ()=>setAttributes({ pcImage:'', imgAlt:'' }) } style={{ marginLeft:10 }}>
                                            削除
                                        </Button>
                                    ) }
                                </div>
                            )}
                        />

                        {/* SP画像 */}
                        <p><strong>SP用画像 (空ならPC画像)</strong></p>
                        <MediaUpload
                            onSelect={ (m)=>setAttributes({ spImage: m.url }) }
                            allowedTypes={ ['image'] }
                            render={ ({ open }) => (
                                <div style={{ marginBottom:'1em' }}>
                                    { spImage && <img src={ spImage } alt="" style={{ maxWidth:'100%', marginBottom:'0.5em' }} /> }
                                    <Button variant="secondary" onClick={ open }>
                                        { spImage ? 'SP画像を変更' : 'SP画像を選択' }
                                    </Button>
                                    { spImage && (
                                        <Button variant="secondary" onClick={ ()=>setAttributes({ spImage:'' }) } style={{ marginLeft:10 }}>
                                            削除
                                        </Button>
                                    ) }
                                </div>
                            )}
                        />

                        {/* alt テキスト */}
                        <TextareaControl
                            label="altテキスト (空ならPCタイトル)"
                            value={ imgAlt }
                            onChange={ setAttr('imgAlt') }
                            rows={ 2 }
                        />

                        {/* ★ 追加 - コンテンツ全体の最大横幅 */}
                        <RangeControl
                            label="コンテンツ全体の最大横幅 (px)"
                            value={ contsMaxWidth }
                            onChange={ setAttr('contsMaxWidth') }
                            min={ 400 }
                            max={ 2000 }
                            step={ 10 }
                        />

                        {/* カラム数 */}
                        <SelectControl
                            label="テキストのカラム数"
                            value={ textColumns }
                            options={ [
                                { label:'1カラム', value:'1' },
                                { label:'2カラム', value:'2' },
                            ] }
                            onChange={ setAttr('textColumns') }
                        />

                        {/* 縦中央寄せ */}
                        <ToggleControl
                            label="縦方向を中央寄せにする"
                            checked={ verticalCenter }
                            onChange={ setAttr('verticalCenter') }
                        />

                        {/* アスペクト比 */}
                        <RangeControl
                            label={ `PC画像アスペクト比 (500 / ${ aspectRatioHeight })` }
                            value={ aspectRatioHeight }
                            onChange={ setAttr('aspectRatioHeight') }
                            min={ 200 }
                            max={ 1400 }
                            step={ 10 }
                        />
                    </PanelBody>

                    {/* ▶ PCタイトル設定 */}
                    <PanelBody title="PCタイトル設定" initialOpen={ false }>
                        <ColorPalette
                            label="PCタイトルの文字色"
                            value={ pcTitleColor }
                            onChange={ setAttr('pcTitleColor') }
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ================= エディター プレビュー ================= */}
                <div {...blockProps}>
                    <div className="conts" style={ contsStyle }>
                        {/* 画像部分 */}
                        <figure className="image">
                            { pcImage && (
                                <img
                                    style={{ aspectRatio:`500 / ${ aspectRatioHeight }` }}
                                    src={ pcImage }
                                    alt={ finalAlt }
                                />
                            )}
                            {/* SPタイトル (画像の上に重ねる) */}
                            { (spImage || pcImage) && (
                                <Tag
                                    className="ttl"
                                    style={{ fontWeight: spTitleFontWeight, color: spTitleColor }}
                                    data-lw_font_set={ spTitleFont }
                                    dangerouslySetInnerHTML={{ __html: spTitleWithBr }}
                                />
                            )}
                        </figure>

                        {/* テキスト部分 */}
                        <div className="cont">
                            <Tag className="ttl" style={{ color: pcTitleColor }}>
                                <RichText
                                    value={ pcTitle }
                                    onChange={ setAttr('pcTitle') }
                                    placeholder="PC用タイトルを入力"
                                />
                            </Tag>

                            <div className="in">
                                <RichText
                                    tagName="p"
                                    style={{ columnCount:textColumns, columnGap:'1.5em' }}
                                    value={ pcBody }
                                    onChange={ setAttr('pcBody') }
                                    multiline={ false }
                                    placeholder="本文を入力してください"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    },

    /* -------------------------------------------------------------- */
    /*  ▶ 保存 (save)                                                 */
    /* -------------------------------------------------------------- */
    save: ( { attributes } ) => {
        const {
            pcImage, spImage, imgAlt,
            pcTitle, spTitle, pcBody,
            textColumns, headingLevel, verticalCenter, aspectRatioHeight,
            contsMaxWidth,
            spTitleFont, spTitleFontWeight,
            pcTitleColor, spTitleColor,
            imgLabel, spImageBottom,
        } = attributes;

        /* 代入ロジック */
        const finalSpImage = spImage || pcImage;
        const finalAlt     = imgAlt  || pcTitle;
        const finalSpTitle = ( spTitle || pcTitle ).replace(/\n/g, '<br>');

        const Tag = `h${ headingLevel }`;
        const contsStyle = verticalCenter 
            ? { alignItems:'center', maxWidth: `${contsMaxWidth}px` } 
            : { maxWidth: `${contsMaxWidth}px` };

        const blockProps = useBlockProps.save({
            /* 🚨 既定（false）のときは 'paid-block-content-5' のまま＝**出力は1文字も変わらない**。
               既存ページ（top/ptn_8 ほか）が「ブロックに問題があります」にならないための形。 */
            className: 'paid-block-content-5' + ( spImageBottom ? ' is_sp_img_bottom' : '' ),
        });

        return (
            <div {...blockProps}>
                <div className="conts" style={ contsStyle }>
                    <figure className="image">
                        { pcImage && (
                            <img
                                className="none_800px"
                                style={{ aspectRatio:`500 / ${ aspectRatioHeight }` }}
                                src={ pcImage }
                                alt={ finalAlt }
                            />
                        )}
                        { (spImage || pcImage) && (
                            <img
                                className="on_800px"
                                src={ finalSpImage }
                                alt={ finalAlt }
                            />
                        )}
                        { (spImage || pcImage) && (
                            <Tag
                                className="ttl"
                                style={{ fontWeight: spTitleFontWeight, color: spTitleColor }}
                                data-lw_font_set={ spTitleFont }
                                dangerouslySetInnerHTML={{ __html: finalSpTitle }}
                            />
                        )}
                        { imgLabel && (
                            <span
                                className="img_label"
                                dangerouslySetInnerHTML={{ __html: imgLabel }}
                            />
                        )}
                    </figure>

                    {/* テキスト部分 */}
                    <div className="cont">
                        <Tag className="ttl" style={{ color: pcTitleColor }}>
                            <RichText.Content value={ pcTitle } />
                        </Tag>

                        <div className="in">
                            <RichText.Content
                                tagName="p"
                                style={{ columnCount:textColumns, columnGap:'1.5em' }}
                                value={ pcBody }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});