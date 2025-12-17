<?php 
// ウィジェットエリアが空かどうかをチェック
if (is_active_sidebar('drawer_bottom')): ?>
    <div class="widget_area_drawer_bottom">
        <?php dynamic_sidebar( 'drawer_bottom' ); ?>
    </div>
<?php endif; ?>