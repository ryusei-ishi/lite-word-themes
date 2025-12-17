<?php
if ( !defined( 'ABSPATH' ) ) exit;

// CSSの読み込み
wp_enqueue_style('post_list_ptn_3_style', get_template_directory_uri() . '/templates/archive/post_list/ptn_3/style.min.css', array(), css_version(), 'all');
?>

<section class="lw_post_list post_list_ptn_3">
    <div class="post_list_put">
        <?php
        // 現在のページ番号を取得
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

        // ベースとなるクエリパラメータ
        $args = array(
            'post_type' => 'post',
            'paged'     => $paged,
        );

        // カテゴリーアーカイブの場合
        if (is_category()) {
            $current_category = get_queried_object();
            if (isset($current_category) && property_exists($current_category, 'term_id')) {
                $args['cat'] = $current_category->term_id;
            }
        }

        // 検索結果ページの場合
        if (is_search()) {
            $args['s'] = get_search_query();
        }

        // 日付アーカイブの場合（年・月・日）
        if (is_date()) {
            $args['year']     = get_query_var('year');
            $args['monthnum'] = get_query_var('monthnum');
            $args['day']      = get_query_var('day');
        }

        // WP_Query の実行
        $the_query = new WP_Query($args);

        if ($the_query->have_posts()):
            while ($the_query->have_posts()): 
                $the_query->the_post();

                $thumbnail_caption          = get_the_post_thumbnail_caption();
                $get_the_post_thumbnail_url = get_the_post_thumbnail_url();
                if (empty($get_the_post_thumbnail_url)) {
                    // テーマのカスタマイザーなどに登録したデフォルト画像を取得する例
                    $get_the_post_thumbnail_url = Lw_theme_mod_set("archive_page_layout_post_list_df_image", $get_the_post_thumbnail_url);
                }
                ?>
                <article class="post_item" itemscope itemtype="http://schema.org/BlogPosting">
                    <a href="<?php the_permalink(); ?>">
                        <div class="data">
                            <time class="public_date" datetime="<?php echo get_the_date('Y-m-d'); ?>" itemprop="datePublished">
                                <?php echo get_the_date('Y.m.d'); ?>
                            </time>
                            <?php
                            // カテゴリーを表示
                            $categories = get_the_category();
                            if (!empty($categories)):
                                // 最初のカテゴリーを取得
                                $first_category = $categories[0]; 
                                ?>
                                <div class="post_category">
                                    <?php echo esc_html($first_category->name); ?>
                                </div>
                            <?php endif; ?>
                           
                        </div>
                        <div class="text_in">
                            <h2 class="post_title" itemprop="headline"><?php the_title(); ?></h2>
                        </div>
                    </a>
                </article>
            <?php endwhile;
        else: ?>
            <p>投稿が見つかりませんでした。</p>
        <?php endif;
        wp_reset_postdata();
        ?>
    </div>

    <nav class="page_nation">
        <?php
        $icon = '
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15">
            <path id="パス_20329" data-name="パス 20329" d="M7.5,0,15,13H0Z" transform="translate(0 15) rotate(-90)"/>
        </svg>
        ';

        // ページネーションの表示
        echo paginate_links(array(
            'prev_text' => $icon,
            'next_text' => $icon,
            'type'      => 'list',  // ページネーションをリスト形式で出力
            'total'     => $the_query->max_num_pages, // 必須の引数
        ));
        ?>
    </nav>
</section>
