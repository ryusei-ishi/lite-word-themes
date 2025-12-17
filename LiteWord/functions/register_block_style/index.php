<?php
/* -------------------------------------------
register_block_style
paragraph_style
--------------------------------------------- */
// スマホ左寄せ
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_sp_left',
        'label'        => 'スマホ左寄せ',
        'inline_style' => '',
    )
);
// スマホ中央寄せ
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_sp_center',
        'label'        => 'スマホ中央寄せ',
        'inline_style' => '',
    )
);

register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_sp_right',
        'label'        => 'スマホ右寄せ',
        'inline_style' => '',
    )
);
// p_001
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_01',
        'label'        => '枠あり01',
        'inline_style' => '',
    )
);
// p_002
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_02',
        'label'        => '枠あり02',
        'inline_style' => '',
    )
);
// p_002_2
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_02_2',
        'label'        => '枠あり03',
        'inline_style' => '',
    )
);
// p_002_3
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_02_3',
        'label'        => '枠あり04',
        'inline_style' => '',
    )
);
// p_04
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_04',
        'label'        => '枠あり04',
        'inline_style' => '',
    )
);
// p_05
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_05',
        'label'        => '枠あり05',
        'inline_style' => '',
    )
);
//文字サイズ0.8倍
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_0_8_em',
        'label'        => 'サイズ0.8倍',
        'inline_style' => '',
    )
);
//文字サイズ1.2倍
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_1_2_em',
        'label'        => 'サイズ1.2倍',
        'inline_style' => '',
    )
);
//文字サイズ1.5倍
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_1_5_em',
        'label'        => 'サイズ1.5倍',
        'inline_style' => '',
    )
);
//文字サイズ1.8倍
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_1_8_em',
        'label'        => 'サイズ2倍',
        'inline_style' => '',
    )
);
//文字サイズ2倍
register_block_style(
    'core/paragraph',
    array(
        'name'         => 'p_2_em',
        'label'        => 'サイズ2倍',
        'inline_style' => '',
    )
);
/* -------------------------------------------
heading
--------------------------------------------- */
// h_01
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_01',
        'label'        => '背景塗潰し 1',
        'inline_style' => '',
    )
);
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_01_2',
        'label'        => '背景塗潰し 2',
        'inline_style' => '',
    )
);
// h_01_3
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_01_3',
        'label'        => '背景塗潰し 3',
        'inline_style' => '',
    )
);
// h_02
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_02',
        'label'        => '下線',
        'inline_style' => '',
    )
);
// h_03
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_03',
        'label'        => '横線',
        'inline_style' => '',
    )
);
// h_mt_0
register_block_style(
    'core/heading',
    array(
        'name'         => 'h_mt_0',
        'label'        => '上の余白を無くす',
        'inline_style' => '',
    )
);
/* -------------------------------------------
table
--------------------------------------------- */
register_block_style(
    'core/table',
    array(
        'name'         => 'table_width_auto_t_min_w_100',
        'label'        => '横スライド',
        'inline_style' => '
        .is-style-table_width_auto_t_min_w_100 table{
            width:auto;
            min-width: 100%;
        }
        .is-style-table_width_auto_t_min_w_100 table td,
        .is-style-table_width_auto_t_min_w_100 th{
            white-space: nowrap;
        }
        ',
    )
);


register_block_style(
    'core/embed',
    array(
        'name'         => 'embed_bg_color_1',
        'label'        => '背景色',
        'inline_style' => '
            .block-editor-block-list__block.is-style-embed_bg_color_1{
                margin: 0;
                width: 100%;
                max-width: 100%;
                overflow: hidden;
            }
            .block-editor-block-list__block.is-style-embed_bg_color_1 figure{
                margin: 0 auto;
                max-width: 840px;
            }
            .is-style-embed_bg_color_1{ 
                position: relative;
                z-index: 10;
                margin: 2em 0;
                padding: 2em 0;
            }
            .is-style-embed_bg_color_1 figure{
                position: static;
                margin: 0;
                padding: 0;
            }
            .is-style-embed_bg_color_1 iframe{
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .is-style-embed_bg_color_1:before{
                content: "";
                position: absolute;
                top: 0;
                left: -200%;
                z-index: -1;
                width: 400%;
                height: 100%;
                background: var(--color-main);
                opacity: 0.1;
            }
        ',
    )
);
register_block_style(
    'core/embed',
    array(
        'name'         => 'embed_box_shadow_1',
        'label'        => '影付き',
        'inline_style' => '
            .is-style-embed_box_shadow_1{
                box-shadow: 0 0 10px rgba(0,0,0,0.15);
            }
          
        ',
    )
);
register_block_style(
    'core/image',
    array(
        'name'         => 'image_shadow_1',
        'label'        => '影付き',
        'inline_style' => '
            .is-style-image_shadow_1 img{
                box-shadow: 0 0 10px rgba(0,0,0,0.15);
            }
          
        ',
    )
);
register_block_style(
    'core/image',
    array(
        'name'         => 'image_w_100',
        'label'        => '横幅100%',
        'inline_style' => '
            .is-style-image_w_100 img{
                width: 100% !important;
                height: auto;
                max-width: 100%;
            }
          
        ',
    )
);
register_block_style(
    'core/image',
    array(
        'name'         => 'image_w_100_sp_none',
        'label'        => '余白なし',
        'inline_style' => '
            .is-style-image_w_100_sp_none:not(.block-editor-block-list__block){
              
                    margin: 0  -40px !important;
                    width: calc(100% + 80px);
                    max-width: initial !important;
                    @container (max-width: 800px) {
                        margin: 0  -32px !important;
                        width: calc(100% + 64px);
                    }
                    @media (max-width: 700px) {
                        margin: 0 !important;
                        margin-left: calc((100% - 100vw) / 2) !important;
                        width: 100vw;
                    }
                    + .last_content{
                        display: none;
                    }
                
            }
            .is-style-image_w_100_sp_none..block-editor-block-list__block{
                width: 100% !important;
                max-width: 100% !important;
                .components-resizable-box__container{
                    max-width: 100% !important;
                }
            }
            .is-style-image_w_100_sp_none img{
                margin: 0 auto ;
                width: 100% !important;
                height: auto !important;
                max-width: 100%;
            }
          
        ',
    )
);

register_block_style(
    'core/video',
    array(
        'name'         => 'video_shadow_1',
        'label'        => '影付き',
        'inline_style' => '
            .is-style-video_shadow_1{
                box-shadow: 0 0 10px rgba(0,0,0,0.15);
            }
          
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_24_2',
        'label'        => 'GAP 24px 2%',
        'inline_style' => '
            .is-style-columns_gap_24_2{
                gap: 24px 2%  !important;
            }
          
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_24_3',
        'label'        => 'GAP 24px 3%',
        'inline_style' => '
            .is-style-columns_gap_24_3{
                gap: 24px 3%  !important;
            }
          
        ',
    )
);

register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_32_3',
        'label'        => 'GAP 32px 3%',
        'inline_style' => '
            .is-style-columns_gap_32_3{
                gap: 32px 3%  !important;
            }
            @media (max-width: 500px){
                .is-style-columns_gap_32_4{
                    gap: 16px 3%  !important;
                }
            }
          
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_32_4',
        'label'        => 'GAP 32px 4%',
        'inline_style' => '
            .is-style-columns_gap_32_4{
                gap: 32px 4%  !important;
            }
            @media (max-width: 500px){
                .is-style-columns_gap_32_4{
                    gap: 24px 4%  !important;
                }
            }
          
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_16_16',
        'label'        => 'GAP 16px 16px',
        'inline_style' => '
            .is-style-columns_gap_16_16{
                gap: 16px !important;
            }
          
        ',
    )
);

register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_gap_24_24',
        'label'        => 'GAP 24px 24px',
        'inline_style' => '
            .is-style-columns_gap_24_24{
                gap: 24px !important;
            }
          
        ',
    )
);

register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_bg_color_1',
        'label'        => '背景色 01',
        'inline_style' => '
            .is-style-columns_bg_color_1{
                position: relative;
                z-index: 10;
                margin: 0 auto !important;
                padding: 48px 0 !important;
                gap: 32px 4%  !important;
            }
          .is-style-columns_bg_color_1:after{
                content: "";
                position: absolute;
                top: 0;
                left: -50vw;
                z-index: -1;
                width: 200vw;
                height: 100%;
                background: var(--color-main);
                opacity: 0.1;
            }
            .is-style-columns_bg_color_1.wp-block:after{
                left: 0;
                width: 100%;
            }
            @media (max-width: 800px){
                .is-style-columns_bg_color_1{
                    padding:32px 0 !important;
                    gap: 24px 4%  !important;
                }
            }
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_bg_color_1_min',
        'label'        => '背景色02 Min',
        'inline_style' => '
            .is-style-columns_bg_color_1_min{
                position: relative;
                z-index: 10;
                margin: 0 auto !important;
                padding: 48px 0 !important;
                max-width: 680px;
                margin: 0 auto;
            }
          .is-style-columns_bg_color_1_min:after{
                content: "";
                position: absolute;
                top: 0;
                left: -50vw;
                z-index: -1;
                width: 200vw;
                height: 100%;
                background: var(--color-main);
                opacity: 0.1;
            }
            .is-style-columns_bg_color_1_min.wp-block:after{
                left: 0;
                width: 100%;
            }
            @media (max-width: 800px){
                .is-style-columns_bg_color_1_min{
                    padding:32px 0 !important;
                }
            }
        ',
    )
);

register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_bg_color_2',
        'label'        => '背景色 02',
        'inline_style' => '
            .is-style-columns_bg_color_2{
                position: relative;
                z-index: 10;
                margin: 0 auto !important;
                padding: 48px 0 !important;
                gap: 32px 4%  !important;
            }
          .is-style-columns_bg_color_2:after{
                content: "";
                position: absolute;
                top: 0;
               left: -50vw;
                z-index: -1;
                width: 200vw;
                height: 100%;
                background: var(--color-main);
                opacity: 1;
            }
            .is-style-columns_bg_color_2.wp-block:after{
                left: 0;
                width: 100%;
            }
            @media (max-width: 800px){
                .is-style-columns_bg_color_2{
                    padding:32px 0 !important;
                }
            }
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_bg_color_2_min',
        'label'        => '背景色02 Min',
        'inline_style' => '
            .is-style-columns_bg_color_2_min{
                position: relative;
                z-index: 10;
                margin: 0 auto !important;
                padding: 48px 0 !important;
                max-width: 680px;
                margin: 0 auto;
            }
          .is-style-columns_bg_color_2_min:after{
                content: "";
                position: absolute;
                top: 0;
                left: -200%;
                z-index: -1;
                width: 200vw;
                height: 100%;
                background: var(--color-main);
                opacity: 1;
            }
            .is-style-columns_bg_color_2_min.wp-block:after{
                left: 0;
                width: 100%;
            }
            @media (max-width: 800px){
                .is-style-columns_bg_color_2_min{
                    padding:32px 0 !important;
                    gap: 24px 4%  !important;
                }
            }
        ',
    )
);
register_block_style(
    'core/columns',
    array(
        'name'         => 'columns_bg_color_3',
        'label'        => '背景色 03',
        'inline_style' => '
            .is-style-columns_bg_color_3{
                position: relative;
                z-index: 10;
                margin: 0 auto !important;
                padding: 48px 0 !important;
                gap: 32px 4%  !important;
            }
          .is-style-columns_bg_color_3:after{
                content: "";
                position: absolute;
                top: 0;
               left: -50vw;
                z-index: -1;
                width: 200vw;
                height: 100%;
                background: #FFF8D4;
                opacity: 1;
            }
            .is-style-columns_bg_color_3.wp-block:after{
                left: 0;
                width: 100%;
            }
            @media (max-width: 800px){
                .is-style-columns_bg_color_3{
                    padding:32px 0 !important;
                }
            }
        ',
    )
);
register_block_style(
    'core/column',
    array(
        'name'         => 'column_bd_color_1',
        'label'        => '枠線色 01',
        'inline_style' => '
            .is-style-column_bd_color_1{
                border: 4px solid #ffffff;
                border-radius: 12px;
                box-shadow: 0 0 4px rgba(0,0,0,0.05);
                overflow: hidden;
            }
            @media (max-width: 800px){
                .is-style-column_bd_color_1{
                    border-width: 2px;
                    border-radius: 8px;
                }
            }
        ',
    )
);
//リスト
register_block_style(
    'core/list',
    array(
        'name'         => 'list_ptn_01',
        'label'        => 'パターン01',
        'inline_style' => '
            .is-style-list_ptn_01{
                position: relative;
                font-size: 1.417em;
                 @media (max-width: 600px){
                    font-size: 1.2em;
                }
            }
            .is-style-list_ptn_01 li{
                list-style-type: disc !important;
                + li{
                    margin-top: 0.5em;
                }
                    ul{
                        li{
                            list-style-type: circle !important;
                        }
                    }
            }
            .is-style-list_ptn_01 li::marker {
                color: var(--color-main); 
                 font-size: 0.9em;
            }
       
        ',
    )
);
