<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* ==============================================================
 * LiteWord SEO ― タイトル & メタタグ 完全版（デフォルト＋サイト名後置）
 * 2025-06-04 / サブタイトル空白対応版
 * ============================================================ */

/* ----------------------------------------------------------------
 * A) プレースホルダー → 実文字列 変換
 * ---------------------------------------------------------------- */
function lw_resolve_title_key( $key ) {

	// 「表示しない」を選択した場合
	if ( $key === 'none' || $key === '' ) {
		return '';
	}

	$site_title  = get_bloginfo( 'name' );
	$catchphrase = get_bloginfo( 'description' );

	switch ( $key ) {
		case 'site_title'        : return $site_title;
		case 'catchphrase'       : return $catchphrase;

		case 'post_title'        :
		case 'page_title'        : return wp_trim_words( get_the_title(), 60, '' );

		case 'cat_name'          :
		case 'tag_name'          : return single_term_title( '', false );

		case 'author_name'       :
			$author = get_queried_object();
			return $author ? $author->display_name : '';

		case 'date_archive'      :
			if ( is_day()   ) return get_the_date( 'Y年n月j日' );
			if ( is_month() ) return get_the_date( 'Y年n月'   );
			if ( is_year()  ) return get_the_date( 'Y年'      );
			return '';

		case 'archive_title'     : return wp_strip_all_tags( get_the_archive_title() );

		case 'cpt_archive_title' : return post_type_archive_title( '', false );

		case 'search_label'      : return '検索結果ページ用テキスト';

		case 'notfound'          : return '404: ページが見つかりませんでした';

		default                  : return '';
	}
}

/* ----------------------------------------------------------------
 * B) 既存タイトルにサイト名を後置（重複防止）
 * ---------------------------------------------------------------- */
function lw_append_site_title( $base_title, $sep_char = '-' ) {

	$site_title = lw_resolve_title_key( 'site_title' );
	if ( $site_title === '' ) return $base_title;

	if ( strpos( $base_title, $site_title ) !== false ) {
		return $base_title;          // 既に含まれていればそのまま
	}
	$sep_str = " {$sep_char} ";
	return $base_title . $sep_str . $site_title;
}

/* ----------------------------------------------------------------
 * C) main / sep / sub → 完成タイトル生成
 * ---------------------------------------------------------------- */
function lw_build_seo_title( $main_key, $sep_key, $sub_key ) {

	if ( $main_key === '' && $sub_key === '' ) {
		return '';                       // どちらも未選択なら WP デフォルトへ
	}

	$main_txt = lw_resolve_title_key( $main_key );
	$sub_txt  = lw_resolve_title_key( $sub_key  );

	// subが'none'または空の場合は、mainのみ返す
	if ( $sub_txt === '' ) {
		return $main_txt;
	}

	$sep_char = $sep_key !== '' ? $sep_key : '-';
	$sep_str  = " {$sep_char} ";

	$title = $main_txt;
	if ( $title !== '' ) {
		$title .= $sep_str . $sub_txt;
	} else {
		$title = $sub_txt;
	}
	
	return $title;
}

/* ----------------------------------------------------------------
 * D) <title> 出力フィルター
 * ---------------------------------------------------------------- */
function lw_filter_document_title( $title ) {

	/* === 1) 個別フィールド（seo_title, category_seo_title）優先 === */

	/* 投稿・固定ページ */
	if ( is_singular() ) {
		$base = get_post_meta( get_queried_object_id(), 'seo_title', true );
		if ( $base !== '' ) {
			/* サブが'none'の場合はベースタイトルのみを返す */
			$sub_key = get_option( 'lw_post_title_sub', 'site_title' );
			if ( $sub_key === 'none' ) {
				return $base;
			}
			/* 区切り文字：投稿ページ用 sep 設定（未登録なら |） */
			$sep = get_option( 'lw_post_title_sep', '|' ) ?: '|';
			return lw_append_site_title( $base, $sep );
		}
	}

	/* カテゴリー */
	if ( is_category() ) {
		$term_id = get_queried_object_id();
		$base    = get_term_meta( $term_id, 'category_seo_title', true );
		if ( $base !== '' ) {
			$sub_key = get_option( 'lw_cat_archive_title_sub', 'site_title' );
			if ( $sub_key === 'none' ) {
				return $base;
			}
			$sep = get_option( 'lw_cat_archive_title_sep', '|' ) ?: '|';
			return lw_append_site_title( $base, $sep );
		}
	}

	/* === 2) lw_seo_base_setting の選択値を反映（デフォルト付き） === */

	if      ( is_front_page() ) {
		$main = get_option( 'lw_front_title_main', 'site_title'   );
		$sep  = get_option( 'lw_front_title_sep' , '-'            );
		$sub  = get_option( 'lw_front_title_sub' , 'catchphrase'  );
	}
	elseif  ( is_singular( 'post' ) ) {
		$main = get_option( 'lw_post_title_main' , 'post_title'   );
		$sep  = get_option( 'lw_post_title_sep'  , '-'            );
		$sub  = get_option( 'lw_post_title_sub'  , 'site_title'   );
	}
	elseif  ( is_singular( 'page' ) ) {
		// サイト全体の設定を取得
		$main = get_option( 'lw_page_title_main', 'page_title' );
		$sep  = get_option( 'lw_page_title_sep', '|' );
		$sub  = get_option( 'lw_page_title_sub', 'site_title' );

		// 固定ページ個別設定：サイトタイトル表示/非表示（プレミアム限定）
		// 優先順位：個別ページ設定 > サイト全体の設定 > デフォルト値
		if ( defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true ) {
			$page_title_display = get_post_meta( get_queried_object_id(), 'page_title_display', true );
			if ( $page_title_display === 'on' ) {
				// 強制的にサイトタイトルを表示
				$sub = 'site_title';
			} elseif ( $page_title_display === 'off' ) {
				// 強制的にサイトタイトルを非表示
				$sub = 'none';
			}
			// 空の場合はサイト全体の設定を使用（何もしない）
		}
	}
	elseif  ( is_category() ) {
		$main = get_option( 'lw_cat_archive_title_main', 'cat_name'   );
		$sep  = get_option( 'lw_cat_archive_title_sep' , '-'          );
		$sub  = get_option( 'lw_cat_archive_title_sub' , 'site_title' );
	}
	elseif  ( is_tag() ) {
		$main = get_option( 'lw_tag_archive_title_main', 'tag_name'   );
		$sep  = get_option( 'lw_tag_archive_title_sep' , '-'          );
		$sub  = get_option( 'lw_tag_archive_title_sub' , 'site_title' );
	}
	elseif  ( is_author() ) {
		$main = get_option( 'lw_author_archive_title_main', 'author_name' );
		$sep  = get_option( 'lw_author_archive_title_sep' , '-'           );
		$sub  = get_option( 'lw_author_archive_title_sub' , 'site_title'  );
	}
	elseif  ( is_date() ) {
		$main = get_option( 'lw_date_archive_title_main', 'date_archive' );
		$sep  = get_option( 'lw_date_archive_title_sep' , '-'            );
		$sub  = get_option( 'lw_date_archive_title_sub' , 'site_title'   );
	}
	elseif  ( is_post_type_archive() ) {
		$main = get_option( 'lw_cpt_archive_title_main', 'cpt_archive_title' );
		$sep  = get_option( 'lw_cpt_archive_title_sep' , '-'                 );
		$sub  = get_option( 'lw_cpt_archive_title_sub' , 'site_title'        );
	}
	elseif  ( is_search() ) {
		$main = get_option( 'lw_search_title_main' , 'search_label' );
		$sep  = get_option( 'lw_search_title_sep'  , '-'            );
		$sub  = get_option( 'lw_search_title_sub'  , 'site_title'   );
	}
	elseif  ( is_404() ) {
		$main = get_option( 'lw_404_title_main' , 'notfound'   );
		$sep  = get_option( 'lw_404_title_sep'  , '-'          );
		$sub  = get_option( 'lw_404_title_sub'  , 'site_title' );
	}
	else {
		$main = get_option( 'lw_other_archive_title_main', 'archive_title' );
		$sep  = get_option( 'lw_other_archive_title_sep' , '-'             );
		$sub  = get_option( 'lw_other_archive_title_sub' , 'site_title'    );
	}

	$custom_title = lw_build_seo_title( $main, $sep, $sub );
	if ( $custom_title !== '' ) {
		return $custom_title;
	}

	/* === 3) 上記すべて空なら WP デフォルト === */
	return $title;
}
add_filter( 'pre_get_document_title', 'lw_filter_document_title', 20 );

/* --------------------------------------------------------------
 * 共通ヘルパー：X（旧Twitter）／Facebook メタタグ
 * ------------------------------------------------------------ */
function lw_output_sns_common_tags() {

	/* === X（旧Twitter） ===================================== */
	$tw_card     = get_option( 'lw_twitter_card', 'summary_large_image' );
	$tw_site     = get_option( 'lw_twitter_site', '' );
	$tw_creator  = get_option( 'lw_twitter_creator', '' );

	echo '<meta name="twitter:card" content="' . esc_attr( $tw_card ) . '">' . "\n";
	if ( $tw_site    !== '' ) echo '<meta name="twitter:site"    content="' . esc_attr( $tw_site )    . '">' . "\n";
	if ( $tw_creator !== '' ) echo '<meta name="twitter:creator" content="' . esc_attr( $tw_creator ) . '">' . "\n";

	/* === Facebook ========================================== */
	$fb_app  = get_option( 'lw_fb_app_id',  '' );
	$fb_page = get_option( 'lw_fb_page_id', '' );

	if ( $fb_app  !== '' ) echo '<meta property="fb:app_id"  content="' . esc_attr( $fb_app  ) . '">' . "\n";
	if ( $fb_page !== '' ) echo '<meta property="fb:page_id" content="' . esc_attr( $fb_page ) . '">' . "\n";
}

/* ----------------------------------------------------------------
 * E) メタディスクリプション／noindex／OGP画像（改訂版）
 * ---------------------------------------------------------------- */
function lw_output_seo_meta_tags() {

	$default_og_type  = get_option( 'lw_og_default_type', 'website' );
	$default_og_image = get_option( 'lw_og_default_image', '' ); // 共通フォールバック

	/* ===== フロントページ ===== */
	if ( is_front_page() ) {

		/* -- description -- */
		$front_desc = get_option( 'lw_front_meta_description', '' );
		if ( $front_desc !== '' )
			echo '<meta name="description" content="' . esc_attr( $front_desc ) . '">' . "\n";

		/* -- og:type -- */
		echo '<meta property="og:type" content="' . esc_attr( $default_og_type ) . '">' . "\n";

		/* -- og:image -- */
		$og_image = get_option( 'lw_front_og_image', '' );
		if ( $og_image === '' ) $og_image = $default_og_image;

		if ( $og_image === '' ) {
			$logo_id = (int) get_theme_mod( 'custom_logo' );
			if ( $logo_id ) $og_image = wp_get_attachment_image_url( $logo_id, 'full' );
		}
		if ( $og_image === '' ) $og_image = get_site_icon_url( 512 );

		if ( $og_image !== '' )
			echo '<meta property="og:image" content="' . esc_url( $og_image ) . '">' . "\n";

		/* -- 共通 SNS タグ -- */
		lw_output_sns_common_tags();

	/* ===== 投稿・固定ページ ===== */
	} elseif ( is_singular() ) {

		global $post;

		/* description */
		$seo_description = get_post_meta( $post->ID, 'seo_description', true );
		if ( $seo_description !== '' )
			echo '<meta name="description" content="' . esc_attr( $seo_description ) . '">' . "\n";

		/* noindex */
		$noindex = get_post_meta( $post->ID, 'seo_noindex', true ) === 'noindex';
		if ( ! $noindex ) {
			foreach ( get_the_category( $post->ID ) as $cat ) {
				if ( get_term_meta( $cat->term_id, 'category_noindex', true ) === 'noindex' ) {
					$noindex = true; break;
				}
			}
		}
		if ( $noindex )
			echo '<meta name="robots" content="noindex,follow">' . "\n";

		/* canonical */
		$seo_canonical = get_post_meta( $post->ID, 'seo_canonical', true );
		if ( $seo_canonical !== '' )
			echo '<link rel="canonical" href="' . esc_url( $seo_canonical ) . '">' . "\n";

		/* og:type */
		echo '<meta property="og:type" content="article">' . "\n";

		/* og:image */
		$og_image = get_post_meta( $post->ID, 'seo_og_image', true );
		if ( $og_image === '' && has_post_thumbnail( $post->ID ) )
			$og_image = get_the_post_thumbnail_url( $post->ID, 'full' );

		if ( $og_image === '' ) $og_image = $default_og_image;
		if ( $og_image === '' ) {
			$logo_id = (int) get_theme_mod( 'custom_logo' );
			if ( $logo_id ) $og_image = wp_get_attachment_image_url( $logo_id, 'full' );
		}
		if ( $og_image === '' ) $og_image = get_site_icon_url( 512 );

		if ( $og_image !== '' )
			echo '<meta property="og:image" content="' . esc_url( $og_image ) . '">' . "\n";

		lw_output_sns_common_tags();

	/* ===== カテゴリアーカイブ ===== */
	} elseif ( is_category() ) {

		$term = get_queried_object();

		/* description */
		$seo_description = get_term_meta( $term->term_id, 'category_meta_description', true );
		if ( $seo_description !== '' )
			echo '<meta name="description" content="' . esc_attr( $seo_description ) . '">' . "\n";

		/* noindex */
		if ( get_term_meta( $term->term_id, 'category_noindex', true ) === 'noindex' )
			echo '<meta name="robots" content="noindex,follow">' . "\n";

		/* canonical */
		$seo_canonical = get_term_meta( $term->term_id, 'category_canonical', true );
		if ( $seo_canonical !== '' )
			echo '<link rel="canonical" href="' . esc_url( $seo_canonical ) . '">' . "\n";

		/* og:type */
		echo '<meta property="og:type" content="' . esc_attr( $default_og_type ) . '">' . "\n";

		/* og:image */
		$og_image = get_term_meta( $term->term_id, 'category_og_image', true );
		if ( $og_image === '' ) $og_image = $default_og_image;
		if ( $og_image === '' ) {
			$logo_id = (int) get_theme_mod( 'custom_logo' );
			if ( $logo_id ) $og_image = wp_get_attachment_image_url( $logo_id, 'full' );
		}
		if ( $og_image === '' ) $og_image = get_site_icon_url( 512 );

		if ( $og_image !== '' )
			echo '<meta property="og:image" content="' . esc_url( $og_image ) . '">' . "\n";

		lw_output_sns_common_tags();
	}
}
add_action( 'wp_head', 'lw_output_seo_meta_tags', 90 );