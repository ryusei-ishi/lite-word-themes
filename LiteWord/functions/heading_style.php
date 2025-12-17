<?php
if ( !defined( 'ABSPATH' ) ) exit;
//見出しデザイン ------------------------------------------------
function Lw_heading_design_style($h_ptn="h_ptn_1",$class_set=".post_style.single",$heading="h2"){
    $class = " 
        $class_set $heading.wp-block-heading,
        $class_set > $heading:not([class*='custom-title'])
    ";
    $class_before = " 
        $class_set $heading.wp-block-heading::before,
        $class_set > $heading:not([class*='custom-title'])::before
    ";
    $class_after = " 
        $class_set $heading.wp-block-heading::after,
        $class_set > $heading:not([class*='custom-title'])::after
    ";
    switch ($h_ptn) {
        case 'normal':
            break;
        case 'bold':
            echo "
                <style>
                    $class{
                        font-weight: 800;
                    }
                </style>
            ";
            break;
        case 'underline':
            echo "
                <style>
                    $class{
                        padding-bottom: 0.4em;
                        color: #111;
                        border-bottom: 2px solid var(--color-main);
                    }
                </style>
            ";
            break;
        case 'underline_dotted':
            echo "
                <style>
                    $class{
                        padding-bottom: 0.4em;
                        color: #111;
                        border-bottom: 0.13em dotted var(--color-main);
                    }
                </style>
            ";
            break;
        case 'underline_dashed':
            echo "
                <style>
                    $class{
                        padding-bottom: 0.4em;
                        color: #111;
                        border-bottom: 0.12em dashed var(--color-main);
                    }
                </style>
            ";
            break;
        case 'underline_double':
            echo "
                <style>
                    $class{
                        padding-bottom: 0.4em;
                        color: #111;
                        border-bottom: 0.25em double var(--color-main);
                    }
                </style>
            ";
            break;
        case 'left_line_thick':
            echo "
                <style>
                    $class{
                        padding-left: 0.6em;
                        padding-top: 0.05em;
                        border-left: 0.4em solid var(--color-main);
                    }
                </style>
            ";
            break;
        case 'left_line_thin':
            echo "
                <style>
                    $class{
                        padding-left: 0.6em;
                        padding-top: 0.05em;
                        border-left: 0.2em solid var(--color-main);
                    }
                </style>
            ";
            break;
        case 'border':
                echo "
                    <style>
                        $class{
                            padding: 0.6em;
                            border: 0.1em solid var(--color-main);
                        }
                    </style>
                ";
                break;
        case 'border_round':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border: 0.1em solid var(--color-main);
                        border-radius: 0.5em;
                    }
                </style>
            ";
            break;
        case 'border_dashed':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border: 0.1em dashed var(--color-main);
                    }
                </style>
            ";
            break;
        case 'border_dashed_round':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border: 0.1em dashed var(--color-main);
                        border-radius: 0.5em;
                    }
                </style>
            ";
            break;
        case 'border_double':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border: 0.2em double var(--color-main);
                    }
                </style>
            ";
            break;
        case 'border_double_round':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border: 0.2em double var(--color-main);
                        border-radius: 0.5em;
                    }
                </style>
            ";
            break;
        case 'top_bottom_line':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border-top: 0.1em solid var(--color-main);
                        border-bottom: 0.1em solid var(--color-main);
                    }
                </style>
            ";
            break;
        case 'top_bottom_line_dotted':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border-top: 0.1em dotted var(--color-main);
                        border-bottom: 0.1em dotted var(--color-main);
                    }
                </style>
            ";
            break;
        case 'top_bottom_line_dashed':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border-top: 0.1em dashed var(--color-main);
                        border-bottom: 0.1em dashed var(--color-main);
                    }
                </style>
            ";
            break;
        case 'top_bottom_line_double':
            echo "
                <style>
                    $class{
                        padding: 0.6em;
                        border-top: 0.2em double var(--color-main);
                        border-bottom: 0.2em double var(--color-main);
                    }
                </style>
            ";
            break;
        case 'bg_color':
            echo "
                <style>
                    $class{
                        padding: 0.8em;
                        background: var(--color-main);
                        color: #fff;
                    }
                </style>
            ";
            break;
        case 'bg_color_transparency':
            echo "
                <style>
                    $class{
                        position: relative;
                        z-index: 1;
                        padding: 0.8em;
                        color:  #000;
                    }
                    $class_before{
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                        content: '';
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: var(--color-main);
                        opacity: 0.05;
                    }
                </style>
            ";
            break;
        case 'bg_color_transparency_left_line_thick':
            echo "
                <style>
                    $class{
                        position: relative;
                        z-index: 1;
                        padding: 0.6em;
                        color:  #000;
                        padding: 0.6em 0.3em;
                        padding-left: 0.6em;
                        border-left: 0.4em solid var(--color-main);
                    }
                    $class_before{
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                        content: '';
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: var(--color-main);
                        opacity: 0.05;
                    }
                </style>
            ";
            break;
        case 'left_square_s':
            echo "
                <style>
                    $class{
                        position: relative;
                        padding-left: 1.4em;
                        line-height: 1.5em;
                        font-weight: 600;
                    }
                    $class_before{
                        position: absolute;
                        top: 0.4em;
                        left: 0;
                        z-index: 1;
                        margin-right: 0.5em;
                        padding-right: 0.3em;
                        content: '';
                        display: block;
                        width: 0.6em;
                        height: 0.6em;
                        background: var(--color-main);
                    }
                </style>
            ";
            break;
        case 'left_square_l':
            echo "
                <style>
                    $class{
                        position: relative;
                        padding-left: 1.4em;
                        line-height: 1.5em;
                        font-weight: 600;
                    }
                    $class_before{
                        position: absolute;
                        top: 0.28em;
                        left: 0;
                        z-index: 1;
                        margin-right: 0.5em;
                        padding-right: 0.3em;
                        content: '';
                        display: block;
                        width: 0.9em;
                        height: 0.9em;
                        background: var(--color-main);
                    }
                </style>
            ";
            break;
        
        default:
            # code...
            break;
    }
}
function Lw_heading_design(){
    //single
    if(is_single()){
        $single_heading_2 = Lw_theme_mod_set("single_post_layout_heading_2", "underline");
        Lw_heading_design_style($single_heading_2,".post_style.single","h2");
        $single_heading_3 = Lw_theme_mod_set("single_post_layout_heading_3", "left_line_thick");
        Lw_heading_design_style($single_heading_3,".post_style.single","h3");
        $single_heading_4 = Lw_theme_mod_set("single_post_layout_heading_4", "underline_dashed");
        Lw_heading_design_style($single_heading_4,".post_style.single","h4");
    }
    //page
    if(is_page()){
        $page_heading_2 = Lw_theme_mod_set("page_post_layout_heading_2", "");
        Lw_heading_design_style($page_heading_2,".post_style.page","h2");
        $page_heading_3 = Lw_theme_mod_set("page_post_layout_heading_3", "");
        Lw_heading_design_style($page_heading_3,".post_style.page","h3");
        $page_heading_4 = Lw_theme_mod_set("page_post_layout_heading_4", "");
        Lw_heading_design_style($page_heading_4,".post_style.page","h4");
    }
}
add_action('wp_footer', 'Lw_heading_design');