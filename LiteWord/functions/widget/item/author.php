<?php
if ( !defined( 'ABSPATH' ) ) exit;

// カスタムウィジェットクラスを定義
class This_Post_Author_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
            'this_post_author_widget',
            __('【LW】執筆者', 'liteword'),
            array('description' => __('執筆者（投稿者）の情報を表示するウィジェット', 'liteword'))
        );
    }

    // ウィジェットのフロントエンド表示
    public function widget($args, $instance) {
        if (is_single()) { // 投稿ページでのみ表示
            global $post;
            $author_id = $post->post_author;
            $display_name = get_the_author_meta('display_name', $author_id);
            $profile = get_the_author_meta('description', $author_id);
            $profile_image = esc_url(get_user_meta($author_id, 'profile_image', true));
            $gravatar_image = esc_url(get_avatar_url($author_id));

            // 画像の優先順位: カスタムプロフィール画像 > Gravatar画像
            if ($profile_image) {
                $image_url = $profile_image;
            } else {
                $image_url = $gravatar_image;
            }

            // ユーザープロフィールのホームページURLを取得
            $author_posts_url = get_the_author_meta('user_url', $author_id);
            $more_btn_text = !empty($instance['more_btn_text']) ? $instance['more_btn_text'] : __('詳細はこちら', 'liteword');
            $author_title_text = !empty($instance['author_title_text']) ? $instance['author_title_text'] : __('この記事の執筆者', 'liteword');

            echo $args['before_widget'];
            ?>
            <section class="this_post_author">
                <div class="this_post_author_inner">
                    <h2><?php echo esc_html($author_title_text); ?></h2>
                    <div class="image">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($display_name); ?>" loading="lazy">
                    </div>
                    <div class="text_in">
                        <h2><?php echo esc_html($author_title_text); ?></h2>
                        <h3><?php echo esc_html($display_name); ?></h3>
                        <p><?php echo brSt($profile); ?></p>
                        <?php if(!empty($author_posts_url)): ?>
                            <a href="<?php echo esc_url($author_posts_url); ?>" class="more_btn"><?php echo esc_html($more_btn_text); ?></a>
                        <?php endif; ?>
                        <div style="width:100%"></div>
                        <?php
                        /* ============================================================
                        * ⑤ SNS リンク＋アイコン出力（配列でパス指定）
                        * ============================================================ */
                        $sns_fields = [
                            'homepage_2' => [
                                'label'    => 'homepage_2',
                                'template' => 'assets/image/icon/home',   // アイコン用 PHP（拡張子不要）
                            ],
                            'instagram' => [
                                'label'    => 'Instagram',
                                'template' => 'assets/image/icon/instagram',   // アイコン用 PHP（拡張子不要）
                            ],
                            'x' => [
                                'label'    => 'X',
                                'template' => 'assets/image/icon/x',           // 例：x.php を想定
                            ],
                            'line' => [
                                'label'    => 'LINE',
                                'template' => 'assets/image/icon/line',      // line_2.php
                            ],
                            'threads' => [
                                'label'    => 'Threads',
                                'template' => 'assets/image/icon/threads',
                            ],
                            'note' => [
                                'label'    => 'note',
                                'template' => 'assets/image/icon/note',
                            ],
                        ];
    
                        // 1つでも URL があれば ul を表示
                        $has_sns = false;
                        foreach ( $sns_fields as $key => $data ) {
                            if ( get_user_meta( $author_id, $key, true ) ) {
                                $has_sns = true;
                                break;
                            }
                        }
    
                        if ( $has_sns ) : ?>
                            <ul class="author-sns-links">
                                <?php foreach ( $sns_fields as $key => $data ) :
                                    $url = trim( get_user_meta( $author_id, $key, true ) );
                                    if ( ! $url ) {
                                        continue;
                                    } ?>
                                    <li class="sns-<?php echo esc_attr( $key ); ?>">
                                        <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener">
                                            <?php
                                            // アイコン PHP を読み込み（存在しない場合は何も出さない）
                                            get_template_part( $data['template'] );
                                            // テキストも併記したいなら次行を残す / 不要なら削除
                                            // echo esc_html( $data['label'] );
                                            ?>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                    </div>
            </section>
            <?php
            echo $args['after_widget'];
        }
    }

    // ウィジェットのバックエンド設定フォーム
    public function form($instance) {
        $more_btn_text = !empty($instance['more_btn_text']) ? $instance['more_btn_text'] : __('詳細はこちら', 'liteword');
        $author_title_text = !empty($instance['author_title_text']) ? $instance['author_title_text'] : __('この記事の執筆者', 'liteword');
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('author_title_text'); ?>"><?php _e('執筆者タイトルのテキスト:', 'liteword'); ?></label>
            <input class="widefat" id="<?php echo $this->get_field_id('author_title_text'); ?>" name="<?php echo $this->get_field_name('author_title_text'); ?>" type="text" value="<?php echo esc_attr($author_title_text); ?>">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('more_btn_text'); ?>"><?php _e('詳細ボタンのテキスト:', 'liteword'); ?></label>
            <input class="widefat" id="<?php echo $this->get_field_id('more_btn_text'); ?>" name="<?php echo $this->get_field_name('more_btn_text'); ?>" type="text" value="<?php echo esc_attr($more_btn_text); ?>">
        </p>
        <?php
    }

    // ウィジェットの設定更新処理
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['more_btn_text'] = (!empty($new_instance['more_btn_text'])) ? strip_tags($new_instance['more_btn_text']) : '';
        $instance['author_title_text'] = (!empty($new_instance['author_title_text'])) ? strip_tags($new_instance['author_title_text']) : '';
        return $instance;
    }
}

// カスタムウィジェットを登録
function liteword_register_custom_widgets() {
    register_widget('This_Post_Author_Widget');
}
add_action('widgets_init', 'liteword_register_custom_widgets');
