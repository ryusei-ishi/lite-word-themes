<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ---------- 共通関数 ---------- */
require_once __DIR__ . '/functions.php';

/* ---------- CSS ---------- */
wp_enqueue_style(
	'lw_seo_bulk_edit',
	get_template_directory_uri() . '/functions/seo/css/lw_seo_bulk_edit.css',
	[],
	css_version(),
	'all'
);

/* ---------- 動的文字列 ---------- */
$site_title  = get_option( 'blogname' );
$catchphrase = get_option( 'blogdescription' );

/* ---------- 区切り文字 ---------- */
$sep = [ '|' => '|', '・' => '・', '｜' => '｜', '／' => '／', '-' => '-' ];

/* ---------- 共通候補 ---------- */
$common_opts = [
	'none'        => '（表示しない）',
	'site_title'  => 'サイトタイトル：'  . $site_title,
	'catchphrase' => 'キャッチフレーズ：' . $catchphrase,
];

/* ---------- 専用候補 ---------- */
$search_opts   = [ 'search_label'      => '検索結果ページ用テキスト' ];
$notfound_opts = [ 'notfound'          => '404: ページが見つかりませんでした' ];
$page_opts     = [ 'page_title'        => '固定ページタイトル' ];
$post_opts     = [ 'post_title'        => '投稿タイトル' ];
$cat_opts      = [ 'cat_name'          => 'カテゴリ名' ];
$tag_opts      = [ 'tag_name'          => 'タグ名' ];
$archive_opts  = [ 'archive_title'     => 'アーカイブタイトル' ];
$author_opts   = [ 'author_name'       => '著者名' ];
$date_opts     = [ 'date_archive'      => '日付アーカイブ' ];
$cpt_opts      = [ 'cpt_archive_title' => 'カスタム投稿タイプ名' ];

/* ---------- sub 用ベース ---------- */
$sub_base = $common_opts ;

/* ---------- sub 用（セクション別） ---------- */
$sub_front   = $sub_base;
$sub_post    = $sub_base + $post_opts;
$sub_page    = $sub_base + $page_opts;
$sub_cat     = $sub_base + $cat_opts;
$sub_tag     = $sub_base + $tag_opts;
$sub_other   = $sub_base + $archive_opts;
$sub_author  = $sub_base + $author_opts;
$sub_date    = $sub_base + $date_opts;
$sub_cpt     = $sub_base + $cpt_opts;
?>
<div class="none_plugin_message"></div>

<div class="lw_seo_base_setting">
	<h1>Lw SEO基本設定</h1>

	<!-- =======================================================
	     1) フロントページ
	     ======================================================= -->
	<div class="lw_seo_base_setting_form_in">
		<form method="post">
			<div class="lw-h2-with-help">
				<h2>フロントページ</h2>
				<?php lw_voice_help_button( 'lw-base-front-guide' ); ?>
				<?php lw_site_settings_popup_button(); ?>
			</div>
			<?php lw_voice_help_text( 'lw-base-front-guide', lw_get_base_front_guide_text() ); ?>

			<h3>「フロントページ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_front_title_main', $common_opts, '', '', 'サイトタイトル：' . $site_title );
				Lw_opt_select( 'lw_front_title_sep',  $sep,          '', '', '-' );
				Lw_opt_select( 'lw_front_title_sub',  $sub_front,    '', '', 'キャッチフレーズ：' . $catchphrase );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<h3>メタディスクリプション</h3>
			<?php Lw_opt_text( 'lw_front_meta_description', 'textarea', '', '', '3' ); ?>

			<br><input type="submit" value="保存" class="button">
		</form>
	</div>

	<!-- =======================================================
	     2) 投稿・固定ページ
	     ======================================================= -->
	<div class="lw_seo_base_setting_form_in">
		<form method="post">
			<div class="lw-h2-with-help">
				<h2>投稿・固定ページ</h2>
				<?php lw_voice_help_button( 'lw-base-post-guide' ); ?>
			</div>
			<?php lw_voice_help_text( 'lw-base-post-guide', lw_get_base_post_guide_text() ); ?>

			<!-- 投稿 -->
			<h3>「投稿ページ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_post_title_main', $post_opts + $common_opts, '', '', '投稿タイトル' );
				Lw_opt_select( 'lw_post_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_post_title_sub',  $sub_post, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- 固定ページ -->
			<h3>「固定ページ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_page_title_main', $page_opts + $common_opts, '', '', '固定ページタイトル' );
				Lw_opt_select( 'lw_page_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_page_title_sub',  $sub_page, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<br><input type="submit" value="保存" class="button">
		</form>
	</div>

	<!-- =======================================================
	     3) アーカイブ系
	     ======================================================= -->
	<div class="lw_seo_base_setting_form_in">
		<form method="post">
			<div class="lw-h2-with-help">
				<h2>アーカイブ系</h2>
				<?php lw_voice_help_button( 'lw-base-archive-guide' ); ?>
			</div>
			<?php lw_voice_help_text( 'lw-base-archive-guide', lw_get_base_archive_guide_text() ); ?>

			<!-- カテゴリー -->
			<h3>「カテゴリーアーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_cat_archive_title_main', $cat_opts + $common_opts, '', '', 'カテゴリ名' );
				Lw_opt_select( 'lw_cat_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_cat_archive_title_sub',  $sub_cat, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- タグ -->
			<h3>「タグアーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_tag_archive_title_main', $tag_opts + $common_opts, '', '', 'タグ名' );
				Lw_opt_select( 'lw_tag_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_tag_archive_title_sub',  $sub_tag, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- その他 -->
			<h3>「その他のアーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_other_archive_title_main', $archive_opts + $common_opts, '', '', 'アーカイブタイトル' );
				Lw_opt_select( 'lw_other_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_other_archive_title_sub',  $sub_other, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<br><input type="submit" value="保存" class="button">
		</form>
	</div>

	<!-- =======================================================
	     4) 特殊ページ
	     ======================================================= -->
	<div class="lw_seo_base_setting_form_in">
		<form method="post">
			<div class="lw-h2-with-help">
				<h2>特殊ページ</h2>
				<?php lw_voice_help_button( 'lw-base-special-guide' ); ?>
			</div>
			<?php lw_voice_help_text( 'lw-base-special-guide', lw_get_base_special_guide_text() ); ?>

			<!-- 検索結果 -->
			<h3>「検索結果ページ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_search_title_main', $common_opts + $search_opts, '', '', '検索結果ページ用テキスト' );
				Lw_opt_select( 'lw_search_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_search_title_sub',  $sub_front, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- 404 -->
			<h3>「404ページ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_404_title_main', $notfound_opts + $common_opts, '', '', '404: ページが見つかりませんでした' );
				Lw_opt_select( 'lw_404_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_404_title_sub',  $sub_front, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<br><input type="submit" value="保存" class="button">
		</form>
	</div>

	<!-- =======================================================
	     5) その他のアーカイブ
	     ======================================================= -->
	<div class="lw_seo_base_setting_form_in">
		<form method="post">
			<div class="lw-h2-with-help">
				<h2>その他のアーカイブ</h2>
				<?php lw_voice_help_button( 'lw-base-other-guide' ); ?>
			</div>
			<?php lw_voice_help_text( 'lw-base-other-guide', lw_get_base_other_guide_text() ); ?>

			<!-- 著者 -->
			<h3>「著者アーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_author_archive_title_main', $author_opts + $common_opts, '', '', '著者名' );
				Lw_opt_select( 'lw_author_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_author_archive_title_sub',  $sub_author, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- 日付 -->
			<h3>「日付アーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_date_archive_title_main', $date_opts + $common_opts, '', '', '日付アーカイブ' );
				Lw_opt_select( 'lw_date_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_date_archive_title_sub',  $sub_date, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<!-- CPT -->
			<h3>「カスタム投稿タイプアーカイブ」のタイトルタグ</h3>
			<div class="flex title_tag">
				<?php
				Lw_opt_select( 'lw_cpt_archive_title_main', $cpt_opts + $common_opts, '', '', 'カスタム投稿タイプ名' );
				Lw_opt_select( 'lw_cpt_archive_title_sep',  $sep, '', '', '-' );
				Lw_opt_select( 'lw_cpt_archive_title_sub',  $sub_cpt, '', '', 'サイトタイトル：' . $site_title );
				?>
			</div>
			<div class="title_tag_display_sample"></div>

			<br><input type="submit" value="保存" class="button">
		</form>
	</div>
</div>

<!-- =========================================================
     JavaScript（そのまま使用可）
     ======================================================= -->
<script>
document.addEventListener('DOMContentLoaded', () => {

	const SITE_TITLE   = <?php echo json_encode($site_title ); ?>;
	const CATCHPHRASE  = <?php echo json_encode($catchphrase); ?>;
	const NOTFOUND_TXT = '404: ページが見つかりませんでした';
	const SEARCH_TXT   = '検索結果ページ用テキスト';
	const PAGE_TXT     = '固定ページタイトル';
	const POST_TXT     = '投稿タイトル';
	const CAT_TXT      = 'カテゴリ名';
	const TAG_TXT      = 'タグ名';
	const ARCHIVE_TXT  = 'アーカイブタイトル';
	const AUTHOR_TXT   = '著者名';
	const DATE_TXT     = '日付アーカイブ';
	const CPT_TXT      = 'カスタム投稿タイプ名';

	const resolve = (key, opt) => {
		switch (key) {
			case 'none'              : return '';
			case 'site_title'        : return SITE_TITLE;
			case 'catchphrase'       : return CATCHPHRASE;
			case 'notfound'          : return NOTFOUND_TXT;
			case 'search_label'      : return SEARCH_TXT;
			case 'page_title'        : return PAGE_TXT;
			case 'post_title'        : return POST_TXT;
			case 'cat_name'          : return CAT_TXT;
			case 'tag_name'          : return TAG_TXT;
			case 'archive_title'     : return ARCHIVE_TXT;
			case 'author_name'       : return AUTHOR_TXT;
			case 'date_archive'      : return DATE_TXT;
			case 'cpt_archive_title' : return CPT_TXT;
			default                  : return opt ? opt.textContent.replace(/^.+?：/, '') : '';
		}
	};

	document.querySelectorAll('.title_tag').forEach(group => {
		const mainSel = group.querySelector('select[name$="_title_main"]');
		const sepSel  = group.querySelector('select[name$="_title_sep"]');
		const subSel  = group.querySelector('select[name$="_title_sub"]');
		const sample  = group.nextElementSibling;

		if (!mainSel || !sepSel || !subSel || !sample || !sample.classList.contains('title_tag_display_sample')) return;

		const update = () => {
			const mainTxt = resolve(mainSel.value, mainSel.selectedOptions[0]);
			const subTxt  = resolve(subSel.value , subSel.selectedOptions[0]);
			const sepChar = sepSel.value || '-';
			const sepStr  = ` ${sepChar} `;
			let title = mainTxt;
			if (subTxt) title += (title ? sepStr : '') + subTxt;
			sample.textContent = `<title>${title}</title>`;
		};

		[mainSel, sepSel, subSel].forEach(el => el.addEventListener('change', update));
		update();
	});
});
</script>

<?php
// Site settings popup modal
lw_site_settings_modal();
?>