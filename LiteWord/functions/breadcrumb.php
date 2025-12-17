<?php
// =====================================
//  パンくずリスト put_breadcrumbs()
// =====================================
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * lw_get_ancestors_cached()のキャッシュラッパー関数
 * パフォーマンス最適化のため、祖先チェーンをキャッシュ
 */
function lw_get_ancestors_cached( $object_id, $object_type, $resource_type = '' ) {
	$cache_key = 'lw_ancestors_' . $object_type . '_' . $object_id;
	$cache_group = 'lw_breadcrumb';

	$cached = wp_cache_get( $cache_key, $cache_group );
	if ( $cached !== false ) {
		return $cached;
	}

	$ancestors = get_ancestors( $object_id, $object_type, $resource_type );
	wp_cache_set( $cache_key, $ancestors, $cache_group, 3600 );

	return $ancestors;
}

/**
 * カテゴリー・タームが更新された時にパンくずキャッシュをクリア
 */
function lw_clear_breadcrumb_cache($term_id, $tt_id = 0, $taxonomy = '') {
	// タームIDに基づいてキャッシュを削除
	if ($term_id) {
		wp_cache_delete('lw_ancestors_' . $taxonomy . '_' . $term_id, 'lw_breadcrumb');
	}
}
add_action('edited_term', 'lw_clear_breadcrumb_cache', 10, 3);
add_action('delete_term', 'lw_clear_breadcrumb_cache', 10, 3);

/**
 * 投稿が更新された時にパンくずキャッシュをクリア
 */
function lw_clear_breadcrumb_cache_for_post($post_id) {
	// この投稿に関連するカテゴリーのキャッシュを削除
	$categories = get_the_category($post_id);
	if ($categories) {
		foreach ($categories as $category) {
			wp_cache_delete('lw_ancestors_category_' . $category->term_id, 'lw_breadcrumb');
		}
	}
}
add_action('save_post', 'lw_clear_breadcrumb_cache_for_post');

/**
 * パンくずリストを出力する
 * ------------------------------------
 * 2025-05-13 Fix:
 * ・投稿ページ（is_home）では「Home › Blog」と表示
 * ・フロントページと投稿ページは早期 return で処理終了
 */
function put_breadcrumbs( $args = array() ) {

	// --------------------------------------------------
	// ① デフォルト引数
	// --------------------------------------------------
	$defaults = array(
		'nav_div'               => 'nav',
		'aria_label'            => '',
		'id'                    => '',
		'nav_div_class'         => '',
		'ul_class'              => 'lw_breadcrumb',
		'li_class'              => '',
		'li_active_class'       => '',
		'aria_current'          => '',
		'show_home'             => true,
		'show_current'          => true,
		'home'                  => 'Home',
    'blog_home' => get_option( 'page_for_posts' )
        ? get_the_title( get_option( 'page_for_posts' ) )
        : 'Blog',
		'search'                => 'で検索した結果',
		'tag'                   => 'タグ : ',
		'author'                => '投稿者',
		'notfound'              => '404 Not found',
		'separator'             => '',
		'cat_off'               => false,
		'cat_parents_off'       => false,
		'tax_off'               => false,
		'tax_parents_off'       => false,
		'show_cpta'             => true,
		'show_cat_tag_for_cpt'  => false,
	);
	$args = wp_parse_args( $args, $defaults );
	extract( $args, EXTR_SKIP );

	// --------------------------------------------------
	// ② attribute 文字列生成
	// --------------------------------------------------
	$aria_label       = $aria_label       ? ' aria-label="' . $aria_label . '"'         : '';
	$id               = $id               ? ' id="'         . $id         . '"'         : '';
	$nav_div_class    = $nav_div_class    ? ' class="'      . $nav_div_class . '"'       : '';
	$ul_class         = $ul_class         ? ' class="'      . $ul_class . '"'            : '';
	$li_class         = $li_class         ? ' class="'      . $li_class . '"'            : '';
	$li_active_class  = $li_active_class  ? ' class="'      . $li_active_class . '"'     : '';
	$aria_current     = $aria_current     ? ' aria-current="' . $aria_current . '"'      : '';

	// --------------------------------------------------
	// ③ Home アイコン（Font Awesome SVG）
	// --------------------------------------------------
	$icon_home = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 .0 .7 160.2c0 2.7-.2 5.4-.5 8.1l.0 16.2c0 22.1-17.9 40-40 40l-16 .0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 .0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>';

	// =========================================================================
	// ④ フロントページ  ─────────────────────────────────
	// =========================================================================
	if ( is_front_page() ) {

		if ( $show_home ) {
			echo '<' . $nav_div . $id . $nav_div_class . $aria_label . '>';
			echo '<ul' . $ul_class . '>';
			echo '<li' . $li_active_class . $aria_current . '>' . $home . '</li>';
			echo '</ul></' . $nav_div . '>';
		}
		return; // ここで終了
	}

	// =========================================================================
	// ⑤ 投稿ページ（ブログ一覧）───────────────────────────
	// =========================================================================
	if ( is_home() ) {

		echo '<' . $nav_div . $id . $nav_div_class . $aria_label . '>';
		echo '<ul' . $ul_class . '>';

		// Home リンク
		if ( $show_home ) {
			echo '<li' . $li_class . '><a href="' . esc_url( home_url( '/' ) ) . '">' .
			      $icon_home . $home . '</a></li>' . $separator;
		}

		// Blog（現在地）
		echo '<li' . $li_active_class . $aria_current . '>' . $blog_home . '</li>';

		echo '</ul></' . $nav_div . '>';
		return; // ここで終了
	}

	// =========================================================================
	// ⑥ それ以外のページ（管理画面以外）──────────────────
	// =========================================================================
	if ( is_admin() ) {
		return;
	}

	global $post;
	$str  = '<' . $nav_div . $id . $nav_div_class . $aria_label . '>' . "\n";
	$str .= '<ul' . $ul_class . '>' . "\n";
	$str .= '<li' . $li_class . '><a href="' . esc_url( home_url( '/' ) ) . '">' .
	        $icon_home . $home . '</a></li>';

	// --------------------------------------------------
	// ここから下は「既存ロジック」をそのまま使用
	// --------------------------------------------------

	// タクソノミー名
	$my_taxonomy = get_query_var( 'taxonomy' );
	// カスタム投稿タイプ名
	$cpt         = get_query_var( 'post_type' );

	// ① カスタムタクソノミーアーカイブ
	if ( $my_taxonomy && is_tax( $my_taxonomy ) ) {

		$my_term = get_queried_object(); // 現在のターム
		if ( $my_term ) {

			// CPT アーカイブリンク
			$post_types = get_taxonomy( $my_taxonomy )->object_type;
			$cpt        = $post_types[0];
			$str       .= $separator .
			              '<li' . $li_class . '><a href="' .
			              esc_url( get_post_type_archive_link( $cpt ) ) . '">' .
			              get_post_type_object( $cpt )->label . '</a></li>';

			// 親ターム
			if ( $my_term->parent && $my_term->parent != 0 ) {
				$ancestors = array_reverse( lw_get_ancestors_cached( $my_term->term_id, $my_term->taxonomy ) );
				foreach ( $ancestors as $ancestor ) {
					$str .= $separator .
					        '<li' . $li_class . '><a href="' .
					        esc_url( get_term_link( $ancestor, $my_term->taxonomy ) ) . '">' .
					        get_term( $ancestor, $my_term->taxonomy )->name . '</a></li>';
				}
			}

			// 現在のターム
			$str .= $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        $my_term->name . '</li>';
		}

	// ② カテゴリーアーカイブ
	} elseif ( is_category() ) {

		$cat = get_queried_object();
		if ( $cat ) {

			if ( $cat->parent && $cat->parent != 0 ) {
				$ancestors = array_reverse( lw_get_ancestors_cached( $cat->term_id, 'category' ) );
				foreach ( $ancestors as $ancestor ) {
					$str .= $separator .
					        '<li' . $li_class . '><a href="' .
					        esc_url( get_category_link( $ancestor ) ) . '">' .
					        get_cat_name( $ancestor ) . '</a></li>';
				}
			}

			$str .= $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        $cat->name . '</li>';
		}

	// ③ カスタム投稿タイプアーカイブ
	} elseif ( is_post_type_archive() ) {

		$cpt = get_query_var( 'post_type' );
		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        get_post_type_object( $cpt )->label . '</li>';

	// ④ カスタム投稿タイプ個別
	} elseif ( $cpt && is_singular( $cpt ) ) {

		if ( $show_cpta ) {
			$str .= $separator .
			        '<li' . $li_class . '><a href="' .
			        esc_url( get_post_type_archive_link( $cpt ) ) . '">' .
			        get_post_type_object( $cpt )->label . '</a></li>';
		}

		/* ----- タクソノミー処理（省略なしで元コード維持） ----- */
		$taxes = get_object_taxonomies( $cpt );
		if ( count( $taxes ) !== 0 && ! $tax_off ) {

			$tax_index = 0;
			if ( ! $show_cat_tag_for_cpt ) {
				for ( $i = 0; $i < count( $taxes ); $i ++ ) {
					if ( ! in_array( $taxes[ $i ], array( 'category', 'post_tag', 'post_format' ), true ) ) {
						$tax_index = $i;
						break;
					}
				}
			}

			$mytax = isset( $taxes[ $tax_index ] ) ? $taxes[ $tax_index ] : null;

			// 固有タクソノミー優先
			global $post;
			$my_pref_tax_label = get_post_meta( get_the_ID(), 'my_pref_tax', true )
				? esc_attr( get_post_meta( get_the_ID(), 'my_pref_tax', true ) ) : null;
			$my_pref_tax_name = get_taxonomies( array( 'label' => $my_pref_tax_label ) );
			$my_pref_tax      = count( $my_pref_tax_name ) === 1 ? $my_pref_tax_name[ key( $my_pref_tax_name ) ] : '';
			if ( $my_pref_tax && is_object_in_taxonomy( $post->post_type, $my_pref_tax ) ) {
				$mytax = $my_pref_tax;
			}

			$terms   = get_the_terms( $post->ID, $mytax );
			$myterm  = get_post_meta( get_the_ID(), 'myterm', true )
				? esc_attr( get_post_meta( get_the_ID(), 'myterm', true ) ) : null;
			$my_term = $terms ? get_deepest_term( $terms, $mytax, $myterm ) : null;

			if ( ! empty( $my_term ) ) {

				if ( $my_term->parent && $my_term->parent != 0 && ! $tax_parents_off ) {
					$ancestors = array_reverse( lw_get_ancestors_cached( $my_term->term_id, $mytax ) );
					foreach ( $ancestors as $ancestor ) {
						$str .= $separator .
						        '<li' . $li_class . '><a href="' .
						        esc_url( get_term_link( $ancestor, $mytax ) ) . '">' .
						        get_term( $ancestor, $mytax )->name . '</a></li>';
					}
				}

				$str .= $separator .
				        '<li' . $li_class . '><a href="' .
				        esc_url( get_term_link( $my_term, $mytax ) ) . '">' .
				        $my_term->name . '</a></li>';
			}
		}

		if ( $show_current ) {
			$str .= $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        wp_strip_all_tags( get_the_title() ) . '</li>';
		}

	// ⑤ 通常投稿（single）
	} elseif ( is_single() && ! is_attachment() ) {

		$categories = get_the_category( get_the_ID() );
		if ( ! $cat_off && $categories ) {

			$myterm = get_post_meta( get_the_ID(), 'myterm', true )
				? esc_attr( get_post_meta( get_the_ID(), 'myterm', true ) ) : null;
			$cat    = get_deepest_term( $categories, 'category', $myterm );

			if ( $cat && $cat->parent && ! $cat_parents_off ) {
				$ancestors = array_reverse( lw_get_ancestors_cached( $cat->term_id, 'category' ) );
				foreach ( $ancestors as $ancestor ) {
					$str .= $separator .
					        '<li' . $li_class . '><a href="' .
					        esc_url( get_category_link( $ancestor ) ) . '">' .
					        get_cat_name( $ancestor ) . '</a></li>';
				}
			}

			if ( $cat ) {
				$str .= $separator .
				        '<li' . $li_class . '><a href="' .
				        esc_url( get_category_link( $cat->term_id ) ) . '">' .
				        $cat->name . '</a></li>';
			}
		}

		if ( $show_current ) {
			$str .= $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        wp_strip_all_tags( get_the_title() ) . '</li>';
		}

	// ⑥ 固定ページ
	} elseif ( is_page() ) {

		if ( $post->post_parent && $post->post_parent != 0 ) {
			$ancestors = array_reverse( get_post_ancestors( $post->ID ) );
			foreach ( $ancestors as $ancestor ) {
				$str .= $separator .
				        '<li' . $li_class . '><a href="' .
				        esc_url( get_permalink( $ancestor ) ) . '">' .
				        get_the_title( $ancestor ) . '</a></li>';
			}
		}

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        wp_strip_all_tags( get_the_title() ) . '</li>';

	// ⑦ 日付アーカイブ
	} elseif ( is_date() ) {

		if ( get_query_var( 'day' ) ) {
			$str .= $separator .
			        '<li' . $li_class . '><a href="' .
			        esc_url( get_year_link( get_query_var( 'year' ) ) ) . '">' .
			        get_query_var( 'year' ) . '年</a></li>' . $separator .
			        '<li' . $li_class . '><a href="' .
			        esc_url( get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) ) ) . '">' .
			        get_query_var( 'monthnum' ) . '月</a></li>' . $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        get_query_var( 'day' ) . '日</li>';

		} elseif ( get_query_var( 'monthnum' ) ) {
			$str .= $separator .
			        '<li' . $li_class . '><a href="' .
			        esc_url( get_year_link( get_query_var( 'year' ) ) ) . '">' .
			        get_query_var( 'year' ) . '年</a></li>' . $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        get_query_var( 'monthnum' ) . '月</li>';

		} else {
			$str .= $separator .
			        '<li' . $li_active_class . $aria_current . '>' .
			        get_query_var( 'year' ) . '年</li>';
		}

	// ⑧ 検索結果
	} elseif ( is_search() ) {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>「' .
		        esc_html( get_search_query() ) . '」' . $search . '</li>';

	// ⑨ 投稿者アーカイブ
	} elseif ( is_author() ) {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        $author . ' : ' .
		        esc_html( get_the_author_meta( 'display_name', get_query_var( 'author' ) ) ) .
		        '</li>';

	// ⑩ タグアーカイブ
	} elseif ( is_tag() ) {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        single_tag_title( $tag, false ) . '</li>';

	// ⑪ 添付ファイル
	} elseif ( is_attachment() ) {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        wp_strip_all_tags( get_the_title() ) . '</li>';

	// ⑫ 404
	} elseif ( is_404() ) {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        $notfound . '</li>';

	// ⑬ その他
	} else {

		$str .= $separator .
		        '<li' . $li_active_class . $aria_current . '>' .
		        wp_get_document_title() . '</li>';
	}

	$str .= "\n</ul>\n</" . $nav_div . ">\n";

	// --------------------------------------------------
	// ⑦ HTML 出力
	// --------------------------------------------------
	echo $str;

	// --------------------------------------------------
	// ⑧ JSON-LD 自動生成（schema.org）
	// --------------------------------------------------
	echo <<<EOT
<script>
(function(){
	const nav = document.currentScript.previousElementSibling;
	if(!nav || !nav.matches('nav')) return;
	const head = document.querySelector('head.lw_head') || document.head;
	if(head.querySelector('#lw-breadcrumb-ld')) return;

	const items = [];
	nav.querySelectorAll('li').forEach((li,i)=>{
		const a = li.querySelector('a');
		const obj={
			"@type":"ListItem",
			"position":i+1,
			"name":(a?a.textContent:li.textContent).trim()
		};
		if(a) obj.item=a.href;
		items.push(obj);
	});
	if(!items.length) return;

	const ld=document.createElement('script');
	ld.type='application/ld+json';
	ld.id='lw-breadcrumb-ld';
	ld.textContent=JSON.stringify({
		"@context":"https://schema.org",
		"@type":"BreadcrumbList",
		"itemListElement":items
	});
	head.appendChild(ld);
})();
</script>
EOT;
}

/**
 * 一番深い階層のタームを返す
 * --------------------------------------------------
 * @param WP_Term[] $terms       投稿が属するターム配列
 * @param string    $mytaxonomy  タクソノミー名
 * @param string    $myterm      優先ターム名（任意）
 * @return WP_Term|null
 */
function get_deepest_term( $terms, $mytaxonomy, $myterm = null ) {
	global $post;

	// 優先タームがあればそちらを優先
	if ( $myterm ) {
		$my_pref_term = get_term_by( 'name', $myterm, $mytaxonomy );
		if ( $my_pref_term && is_object_in_term( $post->ID, $mytaxonomy, $my_pref_term->term_id ) ) {
			return $my_pref_term;
		}
	}

	if ( count( $terms ) === 1 ) {
		return $terms[ key( $terms ) ];
	}

	$deepest = $terms[ key( $terms ) ];
	$max     = 0;

	foreach ( $terms as $term ) {
		$ancestors       = array_reverse( lw_get_ancestors_cached( $term->term_id, $term->taxonomy ) );
		$ancestors_count = count( $ancestors );
		if ( $ancestors_count > $max ) {
			$max     = $ancestors_count;
			$deepest = $term;
		}
	}
	return $deepest;
}
