<?php
if ( !defined( 'ABSPATH' ) ) exit;
?>
<div class="archive_fv_ptn_1_breadcrumbs">
    <?php get_template_part('templates/breadcrumbs/index'); ?>
</div>
<style>
    .archive_fv_ptn_1_breadcrumbs{
        margin: 0 auto;
        padding: 0;
        max-width: 1080px;
        width: calc(100% - 48px);
        @media (max-width: 700px) {
            width: calc(100% - 32px);
            
        }
        .breadcrumbs_wrap.ptn_2{
            padding-top: 12px;
            padding-bottom: 0;
            &::before{
                display: none;
            }
            .lw_breadcrumb{
                padding-left: 0;
            }
        }
    }
</style>