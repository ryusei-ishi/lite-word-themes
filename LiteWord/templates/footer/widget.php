<?php if ( is_active_sidebar( 'footer_widget_area_all' ) ) : ?>
    <aside class="footer_widget_area_all" style="background-color: #fff;">
        <?php dynamic_sidebar( 'footer_widget_area_all' ); ?>
    </aside>
<?php endif; ?>
<?php if (is_active_sidebar('footer_1') || is_active_sidebar('footer_2') || is_active_sidebar('footer_3')): ?>
    <div class="widget_area_footer">
        <div class="item">
            <?php dynamic_sidebar( 'footer_1' ); ?>
        </div>
        <div class="item">
            <?php dynamic_sidebar( 'footer_2' ); ?>   
        </div>
        <div class="item">
            <?php dynamic_sidebar( 'footer_3' ); ?>
        </div>
    </div>
<?php endif; ?>