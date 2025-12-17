<?php 
/**
 * Template Name: マイパーツプレビュー
 * Template Post Type: lw_my_parts
 * 
 * マイパーツのシンプルなプレビュー表示
 */

if ( !defined( 'ABSPATH' ) ) exit;

// 管理者のみアクセス可能（既にcustom_post_type.phpで制御されているが念のため）
if ( ! current_user_can( 'administrator' ) && ! is_preview() ) {
    wp_die( 'このページにはアクセスできません。' );
}
get_header(); ?>
<main>
    <div class="lw_content_wrap page">
        <div class="main_content">
            <section class="post_content">
                <div class="post_style page">
                    
                    <?php
                    // マイパーツの内容を表示
                    if ( have_posts() ) :
                        while ( have_posts() ) : the_post();
                            
                            $post_id = get_the_ID();
                            $editor_mode = get_post_meta( $post_id, '_lw_editor_mode', true );
                            $full_width = get_post_meta( $post_id, '_lw_full_width', true );
                            $is_full_width = ( $full_width === 'on' );
                            
                            // コードエディタモードの場合
                            if ( 'code' === $editor_mode ) {
                                $custom_html = get_post_meta( $post_id, '_lw_custom_html', true );
                                $custom_css = get_post_meta( $post_id, '_lw_custom_css', true );
                                $custom_js = get_post_meta( $post_id, '_lw_custom_js', true ); // ★ JS取得
                                
                                // CSSを出力
                                if ( ! empty( $custom_css ) ) {
                                    echo '<style>' . $custom_css . '</style>';
                                }
                                
                                // HTMLを出力
                                if ( ! empty( $custom_html ) ) {
                                    if ( $is_full_width ) {
                                        echo '<div class="lw_width_full_on">' . $custom_html . '</div>';
                                    } else {
                                        echo $custom_html;
                                    }
                                }
                                
                                // ★ JavaScriptをグローバル配列に保存（wp_footerで出力される）
                                if ( ! empty( $custom_js ) ) {
                                    global $lw_my_parts_scripts;
                                    if ( ! isset( $lw_my_parts_scripts ) ) {
                                        $lw_my_parts_scripts = array();
                                    }
                                    // 重複チェック（同じpost_idのJSは1回だけ出力）
                                    if ( ! isset( $lw_my_parts_scripts[ $post_id ] ) ) {
                                        $lw_my_parts_scripts[ $post_id ] = $custom_js;
                                    }
                                }
                            } 
                            // 通常エディタモードの場合
                            else {
                                $content = get_the_content();
                                $content = apply_filters( 'the_content', $content );
                                
                                if ( $is_full_width && ! empty( $content ) ) {
                                    echo '<div class="lw_width_full_on">' . $content . '</div>';
                                } else {
                                    echo $content;
                                }
                            }
                            
                        endwhile;
                    endif;
                    ?>
                    
                </div>
            </section>
        </div>
    </div>
</main>
<style>
    body.single .lw_content_wrap::after{
        display: none;
    }
</style>
<?php 
get_footer(); 
?>




