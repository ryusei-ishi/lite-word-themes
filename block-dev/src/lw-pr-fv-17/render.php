<?php
/**
 * LiteWord – 固定ページタイトル 17（下層用）
 * render.php - 動的ブロックのフロント出力
 */
if ( ! defined( 'ABSPATH' ) ) exit;

// 属性を取得
$background_image       = $attributes['backgroundImage'] ?? '';
$background_image_sp    = $attributes['backgroundImageSp'] ?? '';
$main_title             = $attributes['mainTitle'] ?? '';
$description            = $attributes['description'] ?? '';
$filter_bg_color        = $attributes['filterBackgroundColor'] ?? 'var(--color-main)';
$filter_opacity         = $attributes['filterOpacity'] ?? 0.95;
$text_color             = $attributes['textColor'] ?? '#fff';
$min_height_pc          = $attributes['minHeightPc'] ?? 'min-h-pc-280px';
$min_height_tb          = $attributes['minHeightTb'] ?? 'min-h-tb-220px';
$min_height_sp          = $attributes['minHeightSp'] ?? 'min-h-sp-180px';
$main_title_tag         = $attributes['mainTitleTag'] ?? 'h1';
$bg_image_left_pc       = $attributes['bgImageLeftPc'] ?? '';
$bg_image_left_sp       = $attributes['bgImageLeftSp'] ?? '';
$bg_image_right_pc      = $attributes['bgImageRightPc'] ?? '';
$bg_image_right_sp      = $attributes['bgImageRightSp'] ?? '';
$bg_image_opacity_pc    = $attributes['bgImageOpacityPc'] ?? 1;
$bg_image_opacity_sp    = $attributes['bgImageOpacitySp'] ?? 1;
$bg_image_left_op_pc    = $attributes['bgImageLeftOpacityPc'] ?? 1;
$bg_image_left_op_sp    = $attributes['bgImageLeftOpacitySp'] ?? 1;
$bg_image_right_op_pc   = $attributes['bgImageRightOpacityPc'] ?? 1;
$bg_image_right_op_sp   = $attributes['bgImageRightOpacitySp'] ?? 1;
$margin_bottom_zero     = $attributes['marginBottomZero'] ?? false;

// ブロックのラッパークラス
$wrapper_args = array(
    'class' => "lw-pr-fv-17 {$min_height_pc} {$min_height_tb} {$min_height_sp}"
);
if ( $margin_bottom_zero ) {
    $wrapper_args['style'] = 'margin-bottom: 0;';
}
$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

// タイトルタグのホワイトリスト
$allowed_tags = array( 'h1', 'h2', 'h3', 'p' );
if ( ! in_array( $main_title_tag, $allowed_tags, true ) ) {
    $main_title_tag = 'h1';
}
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="lw-pr-fv-17_inner">
        <?php if ( $main_title ) : ?>
            <<?php echo esc_attr( $main_title_tag ); ?> class="ttl" style="color: <?php echo esc_attr( $text_color ); ?>">
                <span class="main" style="color: <?php echo esc_attr( $text_color ); ?>"><?php echo wp_kses_post( $main_title ); ?></span>
            </<?php echo esc_attr( $main_title_tag ); ?>>
        <?php endif; ?>

        <?php if ( $description ) : ?>
            <p class="description" style="color: <?php echo esc_attr( $text_color ); ?>"><?php echo wp_kses_post( $description ); ?></p>
        <?php endif; ?>

        <?php
        // パンくずリスト
        if ( function_exists( 'put_breadcrumbs' ) ) {
            put_breadcrumbs( array(
                'ul_class' => 'lw_breadcrumb',
            ) );
        }
        ?>
    </div>

    <div class="bg_color" style="background-color: <?php echo esc_attr( $filter_bg_color ); ?>; opacity: <?php echo esc_attr( $filter_opacity ); ?>;"></div>

    <?php if ( $background_image ) : ?>
        <picture class="bg_image" style="--bg_image-op-pc: <?php echo esc_attr( $bg_image_opacity_pc ); ?>; --bg_image-op-sp: <?php echo esc_attr( $bg_image_opacity_sp ); ?>;">
            <source srcset="<?php echo esc_url( $background_image_sp ); ?>" media="(max-width: 800px)">
            <source srcset="<?php echo esc_url( $background_image ); ?>" media="(min-width: 801px)">
            <img src="<?php echo esc_url( $background_image ); ?>" alt="背景画像" loading="eager" fetchpriority="high">
        </picture>
    <?php endif; ?>

    <?php if ( $bg_image_left_pc ) : ?>
        <picture class="bg_image_left" style="--bg_image_left-op-pc: <?php echo esc_attr( $bg_image_left_op_pc ); ?>; --bg_image_left-op-sp: <?php echo esc_attr( $bg_image_left_op_sp ); ?>;">
            <source srcset="<?php echo esc_url( $bg_image_left_sp ? $bg_image_left_sp : $bg_image_left_pc ); ?>" media="(max-width: 800px)">
            <source srcset="<?php echo esc_url( $bg_image_left_pc ); ?>" media="(min-width: 801px)">
            <img src="<?php echo esc_url( $bg_image_left_pc ); ?>" alt="" loading="eager">
        </picture>
    <?php endif; ?>

    <?php if ( $bg_image_right_pc ) : ?>
        <picture class="bg_image_right" style="--bg_image_right-op-pc: <?php echo esc_attr( $bg_image_right_op_pc ); ?>; --bg_image_right-op-sp: <?php echo esc_attr( $bg_image_right_op_sp ); ?>;">
            <source srcset="<?php echo esc_url( $bg_image_right_sp ? $bg_image_right_sp : $bg_image_right_pc ); ?>" media="(max-width: 800px)">
            <source srcset="<?php echo esc_url( $bg_image_right_pc ); ?>" media="(min-width: 801px)">
            <img src="<?php echo esc_url( $bg_image_right_pc ); ?>" alt="" loading="eager">
        </picture>
    <?php endif; ?>
</div>

<?php if ( ! $margin_bottom_zero ) : ?>
<script>
(function() {
    const adjustBreadcrumbMargin = () => {
        const fv = document.querySelector('.lw-pr-fv-17');
        const breadcrumb = document.querySelector('.lw-pr-fv-17 .lw_breadcrumb');
        if (!fv || !breadcrumb) return;

        if (window.innerWidth <= 800) {
            const breadcrumbHeight = breadcrumb.offsetHeight;
            fv.style.marginBottom = (breadcrumbHeight + 20) + 'px';
        } else {
            fv.style.marginBottom = '';
        }
    };

    // 初回実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', adjustBreadcrumbMargin);
    } else {
        adjustBreadcrumbMargin();
    }

    // リサイズ時に再計算
    window.addEventListener('resize', adjustBreadcrumbMargin);
})();
</script>
<?php endif; ?>
