<?php
/**
 * カテゴリーの色（term meta: category_color）
 *
 * ・カテゴリー編集画面でカラーパレットから色を選べるようにする
 * ・REST API のカテゴリー情報に lw_color として乗せる
 *   → 「投稿一覧 4」（wdl/lw-pr-post-list-4）がカテゴリーラベルの背景色に使う
 * ・未設定（空）ならブロック側で設定した色をそのまま使う（＝従来どおりの見た目）
 *
 * ⚠️ REST リクエストは is_admin() が false になるため、このファイルは
 *    functions/index.php の is_admin() ブロックの「外」で読み込むこと。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* ==============================================================
 * 1) 取得ヘルパー（フロント・管理画面・REST から共通で使う）
 * ============================================================== */

/**
 * カテゴリーに設定された色を返す。未設定・不正値なら空文字。
 *
 * @param int $term_id カテゴリーの term_id
 * @return string '#rrggbb' か ''
 */
function lw_get_category_color( $term_id ) {
	$color = get_term_meta( (int) $term_id, 'category_color', true );
	if ( ! is_string( $color ) || $color === '' ) {
		return '';
	}
	$color = sanitize_hex_color( $color );
	return $color ? $color : '';
}

/**
 * カラーピッカーに並べるパレット。
 * サイトのテーマカラーを先に並べ、足りない分を汎用色で埋める。
 *
 * @return string[] 最大8色の '#rrggbb'
 */
function lw_get_category_color_palette() {
	$theme_colors = [
		Lw_theme_mod_set( 'color_main',   '#1a72ad' ),
		Lw_theme_mod_set( 'color_accent', '#d34a4a' ),
		Lw_theme_mod_set( 'color_sub',    '#0e1013' ),
		Lw_theme_mod_set( 'color_1',      '' ),
		Lw_theme_mod_set( 'color_2',      '' ),
		Lw_theme_mod_set( 'color_3',      '' ),
	];
	// テーマカラーが未設定・重複でも寂しくならないように汎用色で埋める
	$fallback = [ '#4a90e2', '#3aa675', '#e8973a', '#c0518f', '#f9d648', '#060606' ];

	$palette = [];
	foreach ( array_merge( $theme_colors, $fallback ) as $color ) {
		$color = sanitize_hex_color( $color );
		if ( ! $color ) {
			continue;
		}
		$color = strtolower( $color );
		if ( ! in_array( $color, $palette, true ) ) {
			$palette[] = $color;
		}
		if ( count( $palette ) >= 8 ) {
			break;
		}
	}
	return $palette;
}

/* ==============================================================
 * 2) REST API にカテゴリーの色を乗せる（読み取り専用）
 *
 *    ブロックは /wp-json/wp/v2/posts?_embed で投稿を取り、
 *    _embedded['wp:term'] からカテゴリー名を拾っている。
 *    埋め込みレスポンスは context=embed で作られるので、
 *    schema の context に 'embed' を入れないと出てこない。
 * ============================================================== */
add_action( 'rest_api_init', 'lw_register_category_color_rest_field' );
function lw_register_category_color_rest_field() {
	register_rest_field( 'category', 'lw_color', [
		// get_callback だけ（update_callback は付けない＝REST から書き換えできない）
		'get_callback' => function ( $term ) {
			return lw_get_category_color( $term['id'] );
		},
		'schema'       => [
			'description' => 'カテゴリーに設定された色（#rrggbb）。未設定なら空文字',
			'type'        => 'string',
			'context'     => [ 'view', 'edit', 'embed' ],
			'readonly'    => true,
		],
	] );
}

/* ==============================================================
 * 3) 管理画面（カテゴリー編集フォーム／一覧の色チップ）
 * ============================================================== */
if ( ! is_admin() ) {
	return;
}

/* ---------- (1) 編集フォームの入力欄 ---------- */
add_action( 'category_edit_form_fields', 'lw_add_category_color_field' );
function lw_add_category_color_field( $term ) {
	$color    = lw_get_category_color( $term->term_id );
	$fallback = Lw_theme_mod_set( 'color_main', '#1a72ad' );
	?>
<tr class="form-field">
	<th scope="row"><label for="lw_category_color">カテゴリーの色</label></th>
	<td>
		<input type="text" name="lw_category_color" id="lw_category_color"
		       value="<?php echo esc_attr( $color ); ?>" data-default-color="">
		<div class="lw-cat-color-preview-wrap">
			<span class="lw-cat-color-preview__label">表示イメージ</span>
			<span id="lw_category_color_preview" class="lw-cat-color-preview"
			      data-fallback="<?php echo esc_attr( $fallback ); ?>"
			      style="background-color:<?php echo esc_attr( $color ? $color : $fallback ); ?>"><?php echo esc_html( $term->name ); ?></span>
			<span id="lw_category_color_state" class="lw-cat-color-preview__state"></span>
		</div>
		<p class="description">
			「投稿一覧 4」ブロックのカテゴリーラベルの背景色に使われます。<br>
			未設定のままなら、これまでどおりブロック側で設定した色になります（「クリア」で未設定に戻せます）。
		</p>
	</td>
</tr>
	<?php
}

/* ---------- (2) 保存 ---------- */
add_action( 'edited_category', 'lw_save_category_color' );
function lw_save_category_color( $term_id ) {
	// 権限チェックと nonce は WP 本体（edit-tags.php の editedtag 処理）が済ませている。
	// プログラムからの wp_update_term() で誤爆しないよう、POST があるときだけ触る。
	if ( ! isset( $_POST['lw_category_color'] ) ) {
		return;
	}
	$color = sanitize_hex_color( trim( wp_unslash( $_POST['lw_category_color'] ) ) );
	if ( $color ) {
		update_term_meta( $term_id, 'category_color', $color );
	} else {
		delete_term_meta( $term_id, 'category_color' );
	}
}

/* ---------- (3) カテゴリー一覧に色チップの列を出す ---------- */
add_filter( 'manage_edit-category_columns', function ( $columns ) {
	$columns['category_color'] = '色';
	return $columns;
} );

add_filter( 'manage_category_custom_column', function ( $content, $column_name, $term_id ) {
	if ( $column_name !== 'category_color' ) {
		return $content;
	}
	$color = lw_get_category_color( $term_id );
	if ( ! $color ) {
		return '<span class="lw-cat-color-chip is-none" title="未設定">—</span>';
	}
	return '<span class="lw-cat-color-chip" style="background-color:' . esc_attr( $color ) . '" title="' . esc_attr( $color ) . '"></span>';
}, 10, 3 );

/* ---------- (4) スタイル ---------- */
add_action( 'admin_head', function () {
	$screen = get_current_screen();
	if ( ! $screen || ! in_array( $screen->id, [ 'edit-category', 'category' ], true ) ) {
		return;
	}
	echo '<style>
		.column-category_color { width:60px; text-align:center; }
		.lw-cat-color-chip { width:22px; height:22px; display:inline-block; vertical-align:middle; border:1px solid rgba(0,0,0,.15); border-radius:3px; }
		.lw-cat-color-chip.is-none { width:auto; height:auto; border:none; color:#a7aaad; }
		.lw-cat-color-preview-wrap { margin-top:10px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
		.lw-cat-color-preview__label { color:#646970; font-size:12px; }
		.lw-cat-color-preview { padding:5px 8px; max-width:200px; overflow:hidden; line-height:1.2em; font-size:11px; color:#fff; border-radius:2px; white-space:nowrap; text-overflow:ellipsis; }
		.lw-cat-color-preview__state { color:#646970; font-size:12px; }
	</style>';
} );

/* ---------- (5) カラーピッカー（wp-color-picker）の読み込みと初期化 ---------- */
add_action( 'admin_enqueue_scripts', function ( $hook ) {
	// term.php ＝ カテゴリーの編集画面（入力欄を出しているのはここだけ）
	if ( $hook !== 'term.php' ) {
		return;
	}
	$taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_key( wp_unslash( $_GET['taxonomy'] ) ) : '';
	if ( $taxonomy !== 'category' ) {
		return;
	}
	wp_enqueue_style( 'wp-color-picker' );
	wp_enqueue_script( 'wp-color-picker' );
} );

add_action( 'admin_footer-term.php', function () {
	$taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_key( wp_unslash( $_GET['taxonomy'] ) ) : '';
	if ( $taxonomy !== 'category' ) {
		return;
	}
	?>
<script>
jQuery( function ( $ ) {
	var $field = $( '#lw_category_color' );
	if ( ! $field.length ) return;

	var $preview = $( '#lw_category_color_preview' );
	var $state   = $( '#lw_category_color_state' );
	var fallback = $preview.data( 'fallback' );

	var sync = function ( color ) {
		$preview.css( 'background-color', color || fallback );
		$state.text( color ? '' : '未設定（ブロック側の設定色を使います）' );
	};

	$field.wpColorPicker( {
		// defaultColor:false で「クリア」＝未設定に戻せるようにする
		defaultColor: false,
		palettes: <?php echo wp_json_encode( lw_get_category_color_palette() ); ?>,
		change: function ( event, ui ) { sync( ui.color.toString() ); },
		clear:  function () { sync( '' ); }
	} );

	sync( $field.val() );
} );
</script>
	<?php
} );
