<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ==========================================================
 * 【LW】追従CTA – ウィジェットエリアから配置用
 * ------------------------------------------------------------
 * カスタマイザー（サイト全体・投稿タイプ別）や固定ページ個別設定と同じ
 * lw_render_follow_bottom_cta_once() を通して描画するため、他の設定が
 * 既に「none」以外を出している場合はこのウィジェットは何も表示しない
 * （1ページにつき .follow_bottom_cta は常に最大1つ）。
 * ======================================================= */
class Lw_Follow_Bottom_Cta_Widget extends WP_Widget {

	public function __construct() {
		parent::__construct(
			'lw_follow_bottom_cta_widget',
			__( '【LW】追従CTA', 'liteword' ),
			[ 'description' => __( '追従CTA（画面下に固定表示されるボタン・フォーム等）をウィジェットエリアから配置します。', 'liteword' ) ]
		);
	}

	/* ---------- フロント表示 ---------- */
	public function widget( $args, $instance ) {

		$ptn = ! empty( $instance['ptn'] ) ? sanitize_text_field( $instance['ptn'] ) : 'none';

		if ( ! function_exists( 'lw_render_follow_bottom_cta_once' )
			|| ! function_exists( 'lw_resolve_follow_bottom_cta_ptn' )
			|| ! function_exists( 'lw_follow_bottom_cta_is_renderable' ) ) {
			return; // follow_bottom_cta本体が読み込まれていない環境向けの保険
		}

		// 🚨 本文とウィジェット、どちらのPHPが先に実行されるかに結果を左右されないための明示チェック。
		//    サイト全体・投稿タイプ別・固定ページ個別の設定が「実際に描画される」場合のみ、
		//    実行順に関係なくそちらを優先する（=描画自体を試みない）。
		//    🚨 「非表示以外が設定されているか」だけで判定すると、サブスク失効後も
		//    旧プレミアム設定(theme_mod)が残っている場合に、そちらは結局描画されないのに
		//    ウィジェットも自主的に降りてしまい、追従CTAがページ全体で0個になる事故になる
		//    （2026-09-04レビューで指摘）。必ず「実際に描画されるか」で判定すること。
		$primary_ptn = lw_resolve_follow_bottom_cta_ptn();
		if ( lw_follow_bottom_cta_is_renderable( $primary_ptn ) ) {
			return;
		}

		ob_start();
		$did_render = lw_render_follow_bottom_cta_once( $ptn );
		$output     = ob_get_clean();

		if ( ! $did_render ) {
			return; // 「非表示」、または他のウィジェットインスタンスが既に描画済み
		}

		echo $args['before_widget'];
		echo $output;
		echo $args['after_widget'];
	}

	/* ---------- 管理画面フォーム ---------- */
	public function form( $instance ) {

		$ptn     = ! empty( $instance['ptn'] ) ? $instance['ptn'] : 'none';
		$choices = function_exists( 'follow_bottom_cta_arr' ) ? follow_bottom_cta_arr() : [ 'none' => __( '非表示', 'liteword' ) ];
		unset( $choices[''] ); // 「未選択」はカスタマイザー用の初期値なのでウィジェットには出さない
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'ptn' ) ); ?>">
				<?php _e( '表示するパターン:', 'liteword' ); ?>
			</label>
			<select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'ptn' ) ); ?>"
			        name="<?php echo esc_attr( $this->get_field_name( 'ptn' ) ); ?>">
				<?php foreach ( $choices as $key => $label ) : ?>
					<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $ptn, $key ); ?>>
						<?php echo esc_html( $label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<p style="font-size:12px;color:#666;">
			<?php _e( '※ カスタマイザーの「追従CTA」設定、または固定ページ個別の「追従CTA設定」が「非表示」以外になっている場合は、そちらが優先されこのウィジェットは表示されません（1ページにつき追従CTAは常に1つだけ表示されます）。', 'liteword' ); ?>
		</p>
		<?php
	}

	/* ---------- 保存 ---------- */
	public function update( $new_instance, $old_instance ) {
		$instance        = [];
		$instance['ptn'] = ! empty( $new_instance['ptn'] ) ? sanitize_text_field( $new_instance['ptn'] ) : 'none';
		return $instance;
	}
}

/* ==========================================================
 * ウィジェット登録
 * ======================================================= */
function liteword_register_follow_bottom_cta_widget() {
	register_widget( 'Lw_Follow_Bottom_Cta_Widget' );
}
add_action( 'widgets_init', 'liteword_register_follow_bottom_cta_widget' );

/* ==========================================================
 * ウィジェット画面：複数箇所で「非表示」以外に設定していたら注意する
 * ------------------------------------------------------------
 * 実際に表示されるのは常に1つだけ（二重表示にはならない）だが、
 * どちらが優先されるかはウィジェットエリアの位置（本文に近いか）で
 * 決まり、管理画面には何の手掛かりも無い。設定ミスにその場で
 * 気づけるよう、ウィジェット画面にだけ注意書きを出す（2026-09-04追加）。
 * ======================================================= */
add_action( 'admin_notices', 'lw_follow_bottom_cta_widget_conflict_notice' );
function lw_follow_bottom_cta_widget_conflict_notice() {
	$screen = get_current_screen();
	if ( ! $screen || $screen->id !== 'widgets' ) {
		return;
	}
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	$instances = get_option( 'widget_lw_follow_bottom_cta_widget', [] );
	if ( ! is_array( $instances ) ) {
		return;
	}

	$sidebars_widgets = wp_get_sidebars_widgets();
	global $wp_registered_sidebars;

	$active_locations = [];
	foreach ( $instances as $number => $instance ) {
		if ( ! is_array( $instance ) ) {
			continue; // '_multiwidget' 等、インスタンス以外のキーを除外
		}
		$ptn = ! empty( $instance['ptn'] ) ? $instance['ptn'] : 'none';
		if ( $ptn === 'none' ) {
			continue;
		}
		$widget_id = 'lw_follow_bottom_cta_widget-' . $number;
		foreach ( $sidebars_widgets as $sidebar_id => $widget_ids ) {
			if ( $sidebar_id === 'wp_inactive_widgets' || ! is_array( $widget_ids ) ) {
				continue; // 未配置（無効ウィジェット置き場）は対象外
			}
			if ( in_array( $widget_id, $widget_ids, true ) ) {
				$active_locations[] = isset( $wp_registered_sidebars[ $sidebar_id ]['name'] )
					? $wp_registered_sidebars[ $sidebar_id ]['name']
					: $sidebar_id;
			}
		}
	}

	if ( count( $active_locations ) < 2 ) {
		return;
	}
	?>
	<div class="notice notice-warning">
		<p>
			<strong>「【LW】追従CTA」ウィジェットが複数のエリアで「非表示」以外に設定されています</strong>
			（<?php echo esc_html( implode( '・', $active_locations ) ); ?>）。
			実際に表示されるのはこのうち1つだけで、どちらが優先されるかは配置場所（本文に近いエリアほど優先）で決まります。
			意図した配置でなければ、片方を「非表示」にするかウィジェットを削除してください。
		</p>
	</div>
	<?php
}
