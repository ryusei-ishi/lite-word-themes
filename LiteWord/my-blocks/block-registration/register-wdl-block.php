<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* =============================================================
 * ブロックリスト定義（1箇所で管理）
 * =========================================================== */

/**
 * 標準ブロック（無料・常に利用可能）
 */
function wdl_get_free_blocks() {
	return [
		"lw-my-parts-embed",
		"cta-1",
		"cta-2",
		"custom-title-1",
		"custom-title-2",
		"custom-title-3",
		"custom-title-4",
		"custom-title-5",
		"custom-title-6",
		"custom-title-accordion-1",
		"fv-1",
		"fv-2",
		"fv-3",
		"fv-4",
		"fv-5",
		"fv-6",
		"fv-7",
		"lw-banner-info-01",
		"lw-banner-info-02",
		"lw-banner-info-03",
		"lw-banner-info-04",
		"lw-banner-info-05",
		"lw-button-1",
		"lw-button-2",
		"lw-button-3",
		"lw-comment-1",
		"lw-company-1",
		"lw-company-2",
		"lw-contact-3",
		"lw-content-1",
		"lw-content-2",
		"lw-content-8",
		"lw-gallery-01",
		"lw-gallery-02",
		"lw-list-1",
		"lw-list-2",
		"lw-list-3",
		"lw-list-4",
		"lw-link-list-1",
		"lw-image-2",
		"lw-message-1",
		"lw-news-list-1",
		"lw-page-list-1",
		"lw-post-list-1",
		"lw-post-list-2",
		"lw-post-list-3",
		"lw-step-1",
		"lw-step-2",
		"lw-qa-1",
		"lw-voice-1",
		"profile-1",
		"solution-1",
		"lw-space-1",
		"lw-bg-1",
	];
}

/**
 * プレミアム限定ブロック（サブスク契約者のみ）
 */
function wdl_get_premium_blocks() {
	return [
		"lw-pr-text-1",
		"lw-pr-table-1",
		"lw-pr-table-2",
		"lw-pr-table-3",
		"lw-pr-calendar-1",
		"lw-pr-button-1",
		"lw-pr-button-2",
		"lw-pr-button-3",
		"lw-pr-button-4",
		"lw-pr-button-5",
		"lw-pr-button-6",
		"lw-pr-button-7",
		"lw-pr-button-8",
		"lw-pr-button-9",
		"lw-pr-button-10",
		"lw-pr-custom-title-11",
		"lw-pr-custom-title-12",
		"lw-pr-custom-title-13",
		"lw-pr-custom-title-14",
		"lw-pr-custom-title-15",
		"lw-pr-custom-title-16",
		"lw-pr-fv-13",
		"lw-pr-fv-14",
		"lw-pr-fv-15",
		"lw-pr-fv-16",
		"lw-pr-fv-17",
		"lw-pr-fv-18",
		"lw-pr-fv-19",
		"lw-pr-fv-20",
		"lw-pr-fv-21",
		"lw-pr-step-7",
		"lw-pr-step-8",
		"lw-pr-list-5",
		"lw-pr-list-6",
		"lw-pr-list-7",
		"lw-pr-list-8",
		"lw-pr-content-8",
		"lw-pr-content-9",
		"lw-pr-column-1",
		"lw-pr-image-0",
		"lw-pr-image-1",
		"lw-pr-waku-1",
		"lw-pr-comment-2",
		"lw-pr-comment-3",
		"lw-pr-qa-2",
		"lw-pr-qa-3",
		"lw-pr-qa-4",
		"lw-pr-qa-5",
		"lw-pr-qa-6",
		"lw-pr-border-1",
		"lw-pr-before-after-3",
		"lw-pr-post-list-4",
		"lw-pr-product-1",
		"lw-pr-ranking-1",
		"lw-pr-goodbad-1",
		"lw-pr-compare-1",
	];
}

/**
 * 有料ブロック（paid-block-*）を取得（キャッシュ付き）
 */
function wdl_get_paid_block_dirs() {
	static $cache = null;
	if ( $cache !== null ) {
		return $cache;
	}
	$dirs = glob( get_theme_file_path( '/my-blocks/build/paid-block-*' ), GLOB_ONLYDIR );
	$cache = array_map( 'basename', $dirs ?: [] );
	return $cache;
}

/**
 * テンプレート専用ブロック（shin-*）を取得（キャッシュ付き）
 */
function wdl_get_template_block_dirs() {
	static $cache = null;
	if ( $cache !== null ) {
		return $cache;
	}
	$dirs = glob( get_theme_file_path( '/my-blocks/build/shin-*' ), GLOB_ONLYDIR );
	$cache = array_map( 'basename', $dirs ?: [] );
	return $cache;
}

/**
 * 全ブロックを取得（登録用）
 */
function wdl_get_all_blocks_for_registration() {
	return array_values( array_unique( array_merge(
		wdl_get_free_blocks(),
		wdl_get_premium_blocks(),
		wdl_get_paid_block_dirs(),
		wdl_get_template_block_dirs()
	) ) );
}

/**
 * 未購入ブロックの警告HTMLを生成
 */
function wdl_get_locked_block_html( $block_name ) {
	if ( ! current_user_can( 'edit_posts' ) ) {
		return '';
	}
	return '<div class="lw-block-unavailable" style="background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);border:2px dashed #dee2e6;border-radius:12px;padding:40px 30px;text-align:center;margin:20px 0;">
		<div style="font-size:48px;margin-bottom:15px;">🔒</div>
		<p style="font-size:16px;font-weight:600;color:#495057;margin:0 0 10px 0;">このブロックは未購入のため表示できません</p>
		<p style="font-size:13px;color:#868e96;margin:0;">ブロック名: ' . esc_html( $block_name ) . '</p>
	</div>';
}

/**
 * ブロックのrender_callback共通処理
 * ------------------------------------------------------------
 * @param string $block_name ブロック名
 * @param string $style_css_file CSSファイルパス
 * @param string $content ブロックコンテンツ
 * @return string
 */
function wdl_render_block_callback( $block_name, $style_css_file, $content ) {
	// エディターでは何もしない（contentをそのまま返す）
	if ( is_admin() ) {
		return $content;
	}

	static $loaded_styles = [];
	static $unlocked_blocks_cache = null;

	// 購入済み/アンロック済みブロックのリストを取得（キャッシュ）
	if ( $unlocked_blocks_cache === null ) {
		$unlocked_blocks_cache = wdl_get_unlocked_blocks();
	}

	// このブロックがアンロックされているかチェック
	$is_unlocked = in_array( $block_name, $unlocked_blocks_cache, true );

	// 未購入ブロックの場合は警告メッセージを表示
	if ( ! $is_unlocked ) {
		return wdl_get_locked_block_html( $block_name );
	}

	// 購入済みの場合はCSSを読み込んでコンテンツを返す
	if ( file_exists( $style_css_file ) && ! in_array( $block_name, $loaded_styles, true ) ) {
		wp_enqueue_style( "wdl-{$block_name}-style" );
		$loaded_styles[] = $block_name;
	}
	return $content;
}

/* =============================================================
 * ユーティリティ関数
 * =========================================================== */

/**
 * 指定 template_id が active_flag = 1 で登録されているか判定
 * ------------------------------------------------------------
 * @param string $template_id_1
 * @param string $template_id_2
 * @return bool
 */
function lw_template_is_active( $template_id_1 = "", $template_id_2 = "" ) {
	if ( empty( $template_id_1 ) && empty( $template_id_2 ) ) {
		return false;
	}

	$templateSetting = new LwTemplateSetting();
	$is_active_1 = false;
	$is_active_2 = false;

	if ( ! empty( $template_id_1 ) ) {
		$row_1 = $templateSetting->get_template_setting_by_id( $template_id_1 );
		$is_active_1 = $row_1 && intval( $row_1['active_flag'] ) === 1;
	}

	if ( ! empty( $template_id_2 ) ) {
		$row_2 = $templateSetting->get_template_setting_by_id( $template_id_2 );
		$is_active_2 = $row_2 && intval( $row_2['active_flag'] ) === 1;
	}

	return $is_active_1 || $is_active_2;
}

/**
 * すべての有料ブロックディレクトリを取得
 * ------------------------------------------------------------
 * サブスクリプション契約者または試用期間中の場合、
 * すべての paid-block-* を返す
 * @return array
 */
function lw_all_paid_block_dirs() {
	// サブスクリプション契約者の確認
	$is_subscription_active = lw_template_is_active( 'paid-lw-parts-sub-hbjkjhkljh', 'sub_pre_set' );

	// 試用期間の確認
	$is_trial_active = function_exists( 'lw_is_trial_active' ) && lw_is_trial_active();

	// サブスクリプション契約者でも試用期間中でもない場合は空配列を返す
	if ( ! $is_subscription_active && ! $is_trial_active ) {
		return [];
	}

	// キャッシュ済み関数を使用
	return wdl_get_paid_block_dirs();
}

/**
 * エディター用動的CSS読み込みスクリプトを登録
 * ------------------------------------------------------------
 */
function wdl_enqueue_editor_dynamic_loader() {
	$script_path = '/my-blocks/build/editor-dynamic-styles.js';
	$script_file = get_theme_file_path( $script_path );

	if ( file_exists( $script_file ) ) {
		wp_enqueue_script(
			'wdl-editor-dynamic-styles',
			get_theme_file_uri( $script_path ),
			['wp-data', 'wp-blocks', 'wp-dom-ready'],
			filemtime( $script_file ),
			true
		);

		wp_localize_script(
			'wdl-editor-dynamic-styles',
			'MyThemeSettings',
			[
				'homeUrl'  => home_url(),
				'themeUrl' => get_template_directory_uri(),
				'adminUrl' => admin_url(),
			]
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'wdl_enqueue_editor_dynamic_loader' );

/**
 * エディター用共通CSSをグローバルに1回だけ読み込み
 * ------------------------------------------------------------
 * block.json の editorStyle から共通CSSを削除したため、
 * ここで1回だけ読み込む
 */
function wdl_enqueue_editor_shared_styles() {
	// ブロックエディター画面でのみ読み込み
	$screen = get_current_screen();
	if ( ! $screen || ! $screen->is_block_editor() ) {
		return;
	}

	// 共通フォントスタイル
	$font_style_path = get_theme_file_path( '/assets/css/font_style.min.css' );
	if ( file_exists( $font_style_path ) ) {
		wp_enqueue_style(
			'wdl-shared-font-style',
			get_theme_file_uri( '/assets/css/font_style.min.css' ),
			[],
			filemtime( $font_style_path )
		);
	}

	// 共通エディターブロックサイドスタイル
	$editor_side_path = get_theme_file_path( '/assets/css/editor_block_side.min.css' );
	if ( file_exists( $editor_side_path ) ) {
		wp_enqueue_style(
			'wdl-shared-editor-block-side',
			get_theme_file_uri( '/assets/css/editor_block_side.min.css' ),
			[],
			filemtime( $editor_side_path )
		);
	}
}
add_action( 'admin_enqueue_scripts', 'wdl_enqueue_editor_shared_styles' );

/**
 * エディター用ブロックロック機能を登録
 * ------------------------------------------------------------
 */
function wdl_enqueue_editor_block_lock() {
	// ロック対象ブロックのリストを取得
	$all_blocks = wdl_get_all_premium_paid_blocks();
	$unlocked_blocks = wdl_get_unlocked_blocks();
	$locked_blocks = array_values( array_diff( $all_blocks, $unlocked_blocks ) );

	// wdl/ プレフィックスを付与
	$locked_block_names = array_map( function( $slug ) {
		return 'wdl/' . $slug;
	}, $locked_blocks );

	// デバッグ用：shin-gas-station-01-custom-title-2がロックリストに含まれているか確認
	$debug_block = 'wdl/shin-gas-station-01-custom-title-2';
	$is_in_locked = in_array( $debug_block, $locked_block_names );
	$is_in_all = in_array( 'shin-gas-station-01-custom-title-2', $all_blocks );
	$is_in_unlocked = in_array( 'shin-gas-station-01-custom-title-2', $unlocked_blocks );

	// インラインスクリプトでロック対象ブロックを渡す
	wp_add_inline_script(
		'wp-block-editor',
		'window.wdlLockedBlocks = ' . wp_json_encode( $locked_block_names ) . ';',
		'before'
	);
}
add_action( 'enqueue_block_assets', 'wdl_enqueue_editor_block_lock' );

/**
 * 全てのプレミアム・有料ブロックのリストを取得
 * ------------------------------------------------------------
 */
function wdl_get_all_premium_paid_blocks() {
	return array_values( array_unique( array_merge(
		wdl_get_premium_blocks(),
		wdl_get_paid_block_dirs(),
		wdl_get_template_block_dirs()
	) ) );
}

/* =============================================================
 * ブロック登録メイン関数
 * =========================================================== */
function wdl_register_blocks() {

	/* ---------- 全ブロックを取得（1箇所で定義された関数を使用） ---------- */
	$block_files = wdl_get_all_blocks_for_registration();

	/* ---------- ローカライズに渡す値は全ブロック共通。ループの外で1回だけ作る ---------- */
	$my_theme_settings = [
		'homeUrl'  => home_url(),
		'themeUrl' => get_template_directory_uri(),
		'adminUrl' => admin_url(),
	];

	/* ------------------------------------------------------------------
	 * ディスクを叩く回数を減らすための下ごしらえ
	 * ------------------------------------------------------------------
	 * この関数は init で毎リクエスト走り、153個のブロックを登録する。
	 * 以前はブロック1つにつき file_exists() を5回、さらに get_theme_file_path()
	 * を6回（この関数も内部で file_exists() を1回打つ）呼んでいたため、
	 * 1リクエストで 1,700回以上ディスクを触っていた（実測 file_exists だけで734回＝45ms）。
	 *
	 * 対策はシンプルに「ディレクトリの中身を scandir で1回読んで、存在確認は
	 * 配列の照合で済ませる」。ブロック1つあたりディスクは1回（子テーマがあれば2回）。
	 *
	 * ⚠️ 結果を transient / option に保存していないのは、テーマのバージョンを上げずに
	 *    ファイルを差し替える運用（lw-remote-manager の files/write）があるため。
	 *    保存すると差し替えたブロックが次の更新まで認識されない。
	 * 🚨 filemtime() は残す。CSS のキャッシュ破棄に使っており、ここを固定すると
	 *    ファイルを直しても利用者のブラウザに古い CSS が残る。
	 * 🚨 「使われたブロックの CSS だけ読む」設計には手を触れていない。
	 *    登録するブロックの数・条件・render_callback は一切変えていない。
	 * ---------------------------------------------------------------- */
	$template_root   = get_template_directory();
	$stylesheet_root = get_stylesheet_directory();
	$has_child_theme = ( $stylesheet_root !== $template_root );

	/* ---------- 5) 各ブロックの登録処理 ---------- */
	foreach ( $block_files as $block_name ) {

		$block_dir     = "/my-blocks/build/{$block_name}/";
		$block_rel     = "my-blocks/build/{$block_name}";
		$parent_dir    = "{$template_root}/{$block_rel}";
		$child_dir     = "{$stylesheet_root}/{$block_rel}";

		/* ディレクトリの中身を1回だけ読む（親・子それぞれ1回） */
		$parent_list = @scandir( $parent_dir );
		$parent_has  = $parent_list ? array_flip( $parent_list ) : [];
		$child_has   = [];
		if ( $has_child_theme ) {
			$child_list = @scandir( $child_dir );
			$child_has  = $child_list ? array_flip( $child_list ) : [];
		}

		if ( ! $parent_has && ! $child_has ) {
			continue; // ブロックのディレクトリ自体が無い
		}

		/* get_theme_file_path() と同じ解決（子テーマにあれば子・無ければ親）＋同じフィルター */
		$resolve = static function ( $file ) use ( $child_has, $child_dir, $parent_dir, $block_rel, $has_child_theme ) {
			$path = ( $has_child_theme && isset( $child_has[ $file ] ) )
				? "{$child_dir}/{$file}"
				: "{$parent_dir}/{$file}";
			return apply_filters( 'theme_file_path', $path, "{$block_rel}/{$file}" );
		};
		$has = static function ( $file ) use ( $child_has, $parent_has ) {
			return isset( $child_has[ $file ] ) || isset( $parent_has[ $file ] );
		};

		$block_dir_path = ( $has_child_theme && $child_has ) ? $child_dir : $parent_dir;
		$block_dir_path = apply_filters( 'theme_file_path', $block_dir_path, $block_rel );

		/* --- JS が無ければ登録しない --- */
		if ( ! $has( "{$block_name}.js" ) ) {
			continue;
		}

		$js_file         = $resolve( "{$block_name}.js" );
		$editor_css_file = $resolve( 'editor.css' );
		$style_css_file  = $resolve( 'style.css' );
		$has_style_css   = $has( 'style.css' );

		/* ============================================================
		 * block.json が存在するブロックは apiVersion 3 対応の新方式で登録
		 * ============================================================ */
		if ( $has( 'block.json' ) ) {
			// フロント用スタイルを登録（render_callbackで使用）
			if ( $has_style_css ) {
				wp_register_style(
					"wdl-{$block_name}-style",
					get_theme_file_uri( "{$block_dir}style.css" ),
					[],
					filemtime( $style_css_file )
				);
			}

			// block.json を使用してブロックを登録（apiVersion 3 対応）
			// render_callback を追加してフロントエンドでのCSS読み込みを制御
			$current_block_name = $block_name;
			$current_style_file = $style_css_file;

			// render.phpが存在する場合はblock.jsonのrenderに任せる（動的ブロック対応）
			if ( $has( 'render.php' ) ) {
				register_block_type( $block_dir_path );
			} else {
				// render.phpがない場合は従来通りrender_callbackを使用
				register_block_type( $block_dir_path, [
					'render_callback' => function ( $attributes, $content, $block ) use ( $current_block_name, $current_style_file ) {
						return wdl_render_block_callback( $current_block_name, $current_style_file, $content );
					},
				] );
			}

			// ローカライズ用にスクリプトを取得して設定
			if ( $has( "{$block_name}.asset.php" ) ) {
				wp_localize_script(
					"wdl-{$block_name}-editor-script",
					'MyThemeSettings',
					$my_theme_settings
				);
			}
			continue;
		}

		/* ============================================================
		 * 従来方式（block.json なし）のブロック登録
		 * ============================================================ */

		/* --- 5-1. スクリプト / アセット登録 --- */
		$asset = $has( "{$block_name}.asset.php" )
			? include( $resolve( "{$block_name}.asset.php" ) )
			: [ 'dependencies' => [], 'version' => filemtime( $js_file ) ];

		wp_register_script(
			"wdl-{$block_name}-script",
			get_theme_file_uri( "{$block_dir}{$block_name}.js" ),
			$asset['dependencies'],
			$asset['version'],
			true
		);

		/* --- ローカライズ --- */
		wp_localize_script(
			"wdl-{$block_name}-script",
			'MyThemeSettings',
			$my_theme_settings
		);

		/* --- 5-2. エディタ用スタイル（動的読み込み用に登録のみ） --- */
		if ( $has( 'editor.css' ) ) {
			wp_register_style(
				"wdl-{$block_name}-editor-style",
				get_theme_file_uri( "{$block_dir}editor.css" ),
				[ 'wp-edit-blocks' ],
				filemtime( $editor_css_file )
			);
		}

		/* --- 5-3. フロント用スタイル（動的読み込み用に登録のみ） --- */
		if ( $has_style_css ) {
			wp_register_style(
				"wdl-{$block_name}-style",
				get_theme_file_uri( "{$block_dir}style.css" ),
				[],
				filemtime( $style_css_file )
			);
		}

		/* --- 5-4. ブロックタイプ登録 --- */
		if ( is_admin() ) {
			/** エディタ（管理画面）側 - CSSは動的読み込みに変更 **/
			register_block_type(
				"wdl/{$block_name}",
				[
					'editor_script' => "wdl-{$block_name}-script",
					// CSS は JavaScript で動的読み込みするため初期では読み込まない
					'editor_style'  => null,
					'style'         => null,
				]
			);
		} else {
			/** フロント側 **/
			register_block_type(
				"wdl/{$block_name}",
				[
					'style'           => null,
					'render_callback' => function ( $attributes, $content ) use ( $block_name, $style_css_file ) {
						return wdl_render_block_callback( $block_name, $style_css_file, $content );
					},
				]
			);
		}
	}
}


add_action( 'init', 'wdl_register_blocks' );

/**
 * アンロック済み（利用可能）ブロックのリストを取得
 * ------------------------------------------------------------
 * @return array 利用可能なブロック名の配列
 */
function wdl_get_unlocked_blocks() {
	// 1) 標準ブロック（常に利用可能）
	$unlocked = wdl_get_free_blocks();

	// 2) プレミアム限定ブロック（サブスク/試用期間中の場合）
	if ( LW_HAS_SUBSCRIPTION === true ) {
		$unlocked = array_merge( $unlocked, wdl_get_premium_blocks() );
	}

	// 3) 有料テンプレートに紐付くブロック（paid-block-*のみ）
	foreach ( lw_active_template_ids() as $block_name ) {
		if ( strpos( $block_name, 'paid-block-' ) !== false ) {
			$unlocked[] = $block_name;
		}
	}

	// 4) 購入済みテンプレートに紐付くブロック（shin-*等）を追加
	// ※買い切り専用ブロックは後で除外される
	foreach ( lw_active_page_template() as $block_name ) {
		$unlocked[] = $block_name;
	}

	// 5) サブスク/試用期間中はpaid-block全解放
	$unlocked = array_merge( $unlocked, lw_all_paid_block_dirs() );

	// 5) 買い切り専用ブロックを除外
	$block_Outright_purchase_only = block_Outright_purchase_only();
	if ( ! empty( $block_Outright_purchase_only ) ) {
		$unlocked = array_diff( $unlocked, $block_Outright_purchase_only );
	}

	return array_values( array_unique( $unlocked ) );
}

/**
 * エディタのiframe内にカスタムブロック専用リセットCSSを読み込む
 * ------------------------------------------------------------
 * wdl/* ブロック内のリストスタイルのみリセット
 */
function wdl_enqueue_editor_block_reset_css() {
	if ( ! is_admin() ) {
		return;
	}

	$css_path = get_theme_file_path( '/assets/css/editor-block-reset.css' );
	if ( file_exists( $css_path ) ) {
		wp_enqueue_style(
			'wdl-editor-block-reset',
			get_theme_file_uri( '/assets/css/editor-block-reset.css' ),
			[],
			filemtime( $css_path )
		);
	}
}
add_action( 'enqueue_block_assets', 'wdl_enqueue_editor_block_reset_css' );

/**
 * エディタのiframe内に 行コントロール等 共通サイドUI のCSSを読み込む
 * ------------------------------------------------------------
 * WP7.0 でエディタが iframe 化され、admin_enqueue_scripts 経由で読ませている
 * editor_block_side.css がブロック描画 canvas（iframe内）に届かなくなったため、
 * iframe に確実に届く enqueue_block_assets で読み込む（reset CSS と同じ方式）。
 * is_admin() ガードでフロントには読み込まない。filemtime でキャッシュ自動更新。
 */
function wdl_enqueue_editor_block_side_css() {
	if ( ! is_admin() ) {
		return;
	}

	$css_path = get_theme_file_path( '/assets/css/editor_block_side.min.css' );
	if ( file_exists( $css_path ) ) {
		wp_enqueue_style(
			'wdl-editor-block-side-iframe',
			get_theme_file_uri( '/assets/css/editor_block_side.min.css' ),
			[],
			filemtime( $css_path )
		);
	}
}
add_action( 'enqueue_block_assets', 'wdl_enqueue_editor_block_side_css' );

/* -------------------------------------------------------------
 * 一覧ブロックをサーバー側でも出す（検索エンジン対策）。
 * ブロックの save() は触らず、表示のときに差し込むだけ。
 * ----------------------------------------------------------- */
require_once __DIR__ . '/server-render-lists.php';
