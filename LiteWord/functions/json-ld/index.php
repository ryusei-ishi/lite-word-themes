<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直アクセス防止
}

// noindexページの判定（SEO設定も考慮）
function is_noindex_page_simple() {
    // カスタムフィールドのnoindex設定を優先
    if ( is_singular() ) {
        global $post;
        $seo_noindex = get_post_meta( $post->ID, 'seo_noindex', true );
        if ( $seo_noindex === 'noindex' ) {
            return true;
        }
    }
    
    // WordPress標準のRobots API
    $robots = wp_robots();
    return isset( $robots['noindex'] ) && $robots['noindex'];
}

// SEOカスタムフィールドから値を取得する関数
function lw_get_seo_meta( $key, $default = '' ) {
    if ( is_singular() ) {
        global $post;
        $meta_value = get_post_meta( $post->ID, $key, true );
        if ( ! empty( $meta_value ) ) {
            return $meta_value;
        }
    }
    return $default;
}

// 投稿者のnoindex状態を確認する関数
function is_author_noindex( $author_id ) {
    $user_noindex = get_user_meta( $author_id, 'user_noindex', true );
    // 'follow'以外はすべてnoindexとして扱う
    return ( $user_noindex !== 'follow' );
}

// 投稿者情報のJSON-LD生成関数
function get_author_json_ld( $author_id ) {
    // 表示名を取得
    $display_name = get_the_author_meta( 'display_name', $author_id );
    $login = get_the_author_meta( 'user_login', $author_id );
    
    // 表示名が未設定またはログイン名と同じ場合は情報を出力しない
    if ( empty( $display_name ) || $display_name === $login ) {
        return '';
    }
    
    // 投稿者ページのnoindex状態を確認
    $is_noindex = is_author_noindex( $author_id );
    
    // noindexの場合はURLを含めない
    if ( $is_noindex ) {
        return '"author": {
            "@type": "Person",
            "name": "' . esc_attr( $display_name ) . '"
        },';
    }
    
    // 通常の場合は名前とURLを含める
    return '"author": {
        "@type": "Person",
        "name": "' . esc_attr( $display_name ) . '",
        "url": "' . esc_url( get_author_posts_url( $author_id ) ) . '"
    },';
}

// カスタムJSON-LDを出力する関数
function output_custom_json_ld() {
    if ( is_singular() ) {
        global $post;
        $custom_json_ld = get_post_meta( $post->ID, 'lw_custom_json_ld', true );
        
        // nullでも空文字でもない場合のみ出力
        if ( $custom_json_ld !== null && $custom_json_ld !== '' ) {
            // JSON形式の妥当性を確認
            $json = json_decode( $custom_json_ld, true );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                echo '<script type="application/ld+json">' . "\n";
                echo $custom_json_ld . "\n";
                echo '</script>' . "\n";
            }
        }
    }
}

// 実行用フック
function output_json_dl() {
    // 管理画面、404ページ、noindexページは除外
    if ( is_admin() || is_404() || is_noindex_page_simple() ) {
        return;
    }
    
    if ( is_front_page() ) {
        lw_json_dl_homepage();
    } elseif ( is_single() ) {
        lw_json_dl_single();
    } elseif ( is_page() ) {
        lw_json_dl_page();
    } elseif ( is_category() ) {
        lw_json_dl_category();
    } elseif ( is_tag() ) {
        lw_json_dl_tag();
    } elseif ( is_author() ) {
        lw_json_dl_author();
    } elseif ( is_search() ) {
        lw_json_dl_search();
    }
    
    // カスタムJSON-LDを出力
    output_custom_json_ld();
}
add_action( 'wp_head', 'output_json_dl' );

// トップページ
function lw_json_dl_homepage(){
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "<?php echo esc_attr( get_bloginfo('name') ); ?>",
        "url": "<?php echo esc_url( home_url() ); ?>",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "<?php echo esc_url( home_url('/?s={search_term_string}') ); ?>"
            },
            "query-input": "required name=search_term_string"
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "<?php echo esc_attr( get_bloginfo('name') ); ?>",
        "url": "<?php echo esc_url( home_url() ); ?>"
    }
    </script>
    <?php
}

// 固定ページ
function lw_json_dl_page(){
    global $post;
    
    // SEOカスタムフィールドから取得
    $title = lw_get_seo_meta( 'seo_title', get_the_title() );
    $description = lw_get_seo_meta( 'seo_description', get_the_excerpt() );
    $canonical = lw_get_seo_meta( 'seo_canonical', get_permalink() );
    $og_image = lw_get_seo_meta( 'seo_og_image' );
    
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "<?php echo esc_attr( $title ); ?>",
        "description": "<?php echo esc_attr( $description ); ?>",
        "url": "<?php echo esc_url( $canonical ); ?>"<?php if( $og_image ): ?>,
        "image": "<?php echo esc_url( $og_image ); ?>"<?php endif; ?>,
        "publisher": {
            "@type": "Organization",
            "name": "<?php echo esc_attr( get_bloginfo('name') ); ?>"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "ホーム",
                "item": "<?php echo esc_url( home_url() ); ?>"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": "<?php echo esc_attr( get_the_title() ); ?>",
                "item": "<?php echo esc_url( get_permalink() ); ?>"
            }]
        }
    }
    </script>
    <?php
}

// 投稿ページ
function lw_json_dl_single(){
    global $post;
    $author_id = $post->post_author;
    
    // SEOカスタムフィールドから取得
    $title = lw_get_seo_meta( 'seo_title', get_the_title() );
    $description = lw_get_seo_meta( 'seo_description', get_the_excerpt() );
    $canonical = lw_get_seo_meta( 'seo_canonical', get_permalink() );
    $og_image = lw_get_seo_meta( 'seo_og_image' );
    
    // OGP画像が設定されていない場合はアイキャッチ画像を使用
    if ( empty( $og_image ) ) {
        $og_image = get_the_post_thumbnail_url( $post->ID, 'full' );
    }
    
    // 投稿者情報を取得（セキュリティ対策済み）
    $author_json = get_author_json_ld( $author_id );
    
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "<?php echo esc_attr( $title ); ?>"<?php if( $og_image ): ?>,
        "image": "<?php echo esc_url( $og_image ); ?>"<?php endif; ?>,
        "datePublished": "<?php echo esc_attr( get_the_date('c') ); ?>",
        "dateModified": "<?php echo esc_attr( get_the_modified_date('c') ); ?>",
        <?php echo $author_json; ?>
        "publisher": {
            "@type": "Organization",
            "name": "<?php echo esc_attr( get_bloginfo('name') ); ?>"
        },
        "description": "<?php echo esc_attr( $description ); ?>",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "<?php echo esc_url( $canonical ); ?>"
        }
    }
    </script>
    <?php
}

// カテゴリーアーカイブ
function lw_json_dl_category(){
    $category = get_queried_object();
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "<?php echo esc_attr( single_cat_title('', false) ); ?>",
        "description": "<?php echo esc_attr( category_description() ); ?>",
        "url": "<?php echo esc_url( get_category_link($category->term_id) ); ?>",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "ホーム",
                "item": "<?php echo esc_url( home_url() ); ?>"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": "<?php echo esc_attr( single_cat_title('', false) ); ?>",
                "item": "<?php echo esc_url( get_category_link($category->term_id) ); ?>"
            }]
        }
    }
    </script>
    <?php
}

// タグアーカイブ
function lw_json_dl_tag(){
    $tag = get_queried_object();
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "<?php echo esc_attr( single_tag_title('', false) ); ?>",
        "description": "<?php echo esc_attr( tag_description() ); ?>",
        "url": "<?php echo esc_url( get_tag_link($tag->term_id) ); ?>",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "ホーム",
                "item": "<?php echo esc_url( home_url() ); ?>"
            },{
                "@type": "ListItem",
                "position": 2,
                "name": "<?php echo esc_attr( single_tag_title('', false) ); ?>",
                "item": "<?php echo esc_url( get_tag_link($tag->term_id) ); ?>"
            }]
        }
    }
    </script>
    <?php
}

// 著者アーカイブ
function lw_json_dl_author(){
    $author = get_queried_object();
    
    // 表示名のセキュリティチェック
    $display_name = $author->display_name;
    $login = $author->user_login;
    
    // 表示名が設定されている場合のみJSON-LDを出力
    if ( ! empty( $display_name ) && $display_name !== $login ) {
        ?>
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "name": "<?php echo esc_attr( $display_name ); ?>",
            "description": "<?php echo esc_attr( get_the_author_meta('description', $author->ID) ); ?>",
            "url": "<?php echo esc_url( get_author_posts_url($author->ID) ); ?>",
            "mainEntity": {
                "@type": "Person",
                "name": "<?php echo esc_attr( $display_name ); ?>",
                "url": "<?php echo esc_url( get_author_posts_url($author->ID) ); ?>",
                "description": "<?php echo esc_attr( get_the_author_meta('description', $author->ID) ); ?>"
            }
        }
        </script>
        <?php
    }
}

// 検索結果ページ
function lw_json_dl_search() {
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "name": "検索結果: <?php echo esc_attr( get_search_query() ); ?>",
        "url": "<?php echo esc_url( get_search_link() ); ?>"
    }
    </script>
    <?php
}
?>