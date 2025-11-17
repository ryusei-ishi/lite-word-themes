import { registerBlockType } from '@wordpress/blocks';
import { RichText, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RadioControl, ColorPalette, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import './style.scss';
import './editor.scss';

registerBlockType('wdl/shin-gas-station-01-custom-title-2', {
    title: '見出しタイトル 2 shin shop pattern 01',
    icon: 'editor-textcolor',
    category: 'liteword-title',
    supports: {
        anchor: true,
    },
    attributes: {
        mainTitle: { type: 'string', default: 'Heading Title' },
        subTitle: { type: 'string', default: 'サブタイトル' },
        headingLevel: { type: 'number', default: 2 }, // デフォルトの見出しレベルは h2
        colorMain: { type: 'string', default: 'var(--color-main)' },
        headingSize: { type: 'string', default: 'M' } // L / M / S の見出しサイズ
    },
    edit: ( props ) => {
        const { attributes, setAttributes } = props;
        const { mainTitle, subTitle, headingLevel, colorMain, headingSize } = attributes;

        /** タイトル・サブタイトル変更 */
        const onChangeMainTitle = ( value ) => setAttributes( { mainTitle: value } );
        const onChangeSubTitle  = ( value ) => setAttributes( { subTitle: value } );

        /** 見出しレベル変更 */
        const onChangeHeadingLevel = ( level ) => setAttributes( { headingLevel: level } );

        /** 見出しサイズ変更 (L / M / S) */
        const onChangeHeadingSize = ( size ) => setAttributes( { headingSize: size } );

        const TagName    = `h${ headingLevel }`;
        const sizeClass  = headingSize === 'S' ? ' size_s' : headingSize === 'L' ? ' size_l' : '';

        return (
            <>
                {/* ---------- ツールバー：見出しレベル ---------- */}
                <BlockControls>
                    <ToolbarGroup>
                        {[ 2, 3, 4, 5 ].map( ( level ) => (
                            <ToolbarButton
                                key={ level }
                                isPressed={ headingLevel === level }
                                onClick={ () => onChangeHeadingLevel( level ) }
                            >
                                { `H${ level }` }
                            </ToolbarButton>
                        ) )}
                    </ToolbarGroup>
                </BlockControls>

                {/* ---------- サイドバー ---------- */}
                <InspectorControls>
                    <PanelBody>
                        {/* メインカラー */}
                        <p>メインカラー</p>
                        <ColorPalette
                            value={ colorMain }
                            onChange={ ( color ) => setAttributes( { colorMain: color } ) }
                        />

                        {/* 見出しサイズ */}
                        <RadioControl
                            label="見出しサイズ"
                            selected={ headingSize }
                            options={ [
                                { label: 'L', value: 'L' },
                                { label: 'M', value: 'M' },
                                { label: 'S', value: 'S' },
                            ] }
                            onChange={ onChangeHeadingSize }
                        />
                    </PanelBody>
                </InspectorControls>

                {/* ---------- ブロック本体 ---------- */}
                <TagName className="shin-gas-station-01-custom-title-2">
                    <div className="border" style={ { background: colorMain } }></div>
                    <span className={ `in${ sizeClass }` }>
                        <RichText
                            tagName="span"
                            className="main"
                            data-lw_font_set="Montserrat"
                            value={ mainTitle }
                            onChange={ onChangeMainTitle }
                            placeholder="メインタイトルを入力"
                            style={ { color: colorMain } }
                        />
                        <RichText
                            tagName="span"
                            className="sub"
                            value={ subTitle }
                            onChange={ onChangeSubTitle }
                            placeholder="サブタイトルを入力"
                        />
                    </span>
                </TagName>
            </>
        );
    },
    save: ( props ) => {
        const { mainTitle, subTitle, headingLevel, colorMain, headingSize } = props.attributes;
        const TagName   = `h${ headingLevel }`;
        const sizeClass = headingSize === 'S' ? ' size_s' : headingSize === 'L' ? ' size_l' : '';

        return (
            <TagName className="shin-gas-station-01-custom-title-2">
                <div className="border" style={ { background: colorMain } }></div>
                <span className={ `in${ sizeClass }` }>
                    <RichText.Content
                        tagName="span"
                        className="main"
                        data-lw_font_set="Montserrat"
                        value={ mainTitle }
                        style={ { color: colorMain } }
                    />
                    <RichText.Content
                        tagName="span"
                        className="sub"
                        value={ subTitle }
                    />
                </span>
            </TagName>
        );
    },
});
