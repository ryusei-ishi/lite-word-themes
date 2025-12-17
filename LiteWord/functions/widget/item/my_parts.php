<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ==========================================================
 * 【LW】マイパーツ – ショートコード呼び出しウィジェット
 * ======================================================= */
class Lw_My_Parts_Shortcode_Widget extends WP_Widget {

	public function __construct() {
		parent::__construct(
			'lw_my_parts_shortcode_widget',
			__( '【LW】マイパーツ呼び出し', 'liteword' ),
			[ 'description' => __( '選択したマイパーツをショートコードで表示', 'liteword' ) ]
		);
	}

	/* ---------- フロント表示 ---------- */
	public function widget( $args, $instance ) {

		$parts_id   = ! empty( $instance['parts_id'] )   ? absint( $instance['parts_id'] ) : 0;
		$show_draft = ! empty( $instance['show_draft'] ) ? 'true' : 'false';

		if ( ! $parts_id ) {
			return; // 未設定
		}

		$shortcode = sprintf(
			'[my_parts_content id="%d" show_draft="%s"]',
			$parts_id,
			$show_draft
		);

		echo $args['before_widget'];
		/* ▼ post_style でラップ */
		echo '<div class="post_style lw_my_parts_widget" data-parts-id="' . esc_attr( $parts_id ) . '">';
		echo do_shortcode( $shortcode );
		echo '</div>';
		echo $args['after_widget'];
	}

	/* ---------- 管理画面フォーム ---------- */
	public function form( $instance ) {

		$parts_id   = ! empty( $instance['parts_id'] )   ? absint( $instance['parts_id'] ) : 0;
		$show_draft = ! empty( $instance['show_draft'] ) ? (bool) $instance['show_draft'] : false;

		$parts_posts = get_posts( [
			'post_type'      => 'lw_my_parts',
			'post_status'    => [ 'publish', 'draft' ],
			'posts_per_page' => -1,
			'orderby'        => 'modified',
			'order'          => 'DESC',
		] );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'parts_id' ) ); ?>">
				<?php _e( '表示するマイパーツ:', 'liteword' ); ?>
			</label>
			<select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'parts_id' ) ); ?>"
			        name="<?php echo esc_attr( $this->get_field_name( 'parts_id' ) ); ?>">
				<option value="0">— <?php _e( '選択してください', 'liteword' ); ?> —</option>
				<?php foreach ( $parts_posts as $p ) : ?>
					<option value="<?php echo esc_attr( $p->ID ); ?>"
						<?php selected( $parts_id, $p->ID ); ?>>
						<?php echo esc_html( $p->post_title ? $p->post_title : '(無題)' ); ?>
						<?php echo ' (' . esc_html( $p->post_status ) . ')'; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<p>
			<input class="checkbox"
			       type="checkbox"
			       <?php checked( $show_draft ); ?>
			       id="<?php echo esc_attr( $this->get_field_id( 'show_draft' ) ); ?>"
			       name="<?php echo esc_attr( $this->get_field_name( 'show_draft' ) ); ?>"
			       value="1" />
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_draft' ) ); ?>">
				<?php _e( '下書き状態でも表示する', 'liteword' ); ?>
			</label>
		</p>
		<?php
	}

	/* ---------- 保存 ---------- */
	public function update( $new_instance, $old_instance ) {
		$instance                 = [];
		$instance['parts_id']     = ! empty( $new_instance['parts_id'] )   ? absint( $new_instance['parts_id'] ) : 0;
		$instance['show_draft']   = ! empty( $new_instance['show_draft'] ) ? 1 : 0;
		return $instance;
	}
}

/* ==========================================================
 * ウィジェット登録
 * ======================================================= */
function liteword_register_my_parts_shortcode_widget() {
	register_widget( 'Lw_My_Parts_Shortcode_Widget' );
}
add_action( 'widgets_init', 'liteword_register_my_parts_shortcode_widget' );
