<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ==========================================================
 * 【LW】ショートコード – 任意のショートコードを実行するウィジェット
 * ======================================================= */
class Lw_Shortcode_Widget extends WP_Widget {

	public function __construct() {
		parent::__construct(
			'lw_shortcode_widget',
			__( '【LW】ショートコード', 'liteword' ),
			[ 'description' => __( '任意のショートコードを実行して表示します', 'liteword' ) ]
		);
	}

	/* ---------- フロント表示 ---------- */
	public function widget( $args, $instance ) {

		$title     = ! empty( $instance['title'] )     ? $instance['title'] : '';
		$shortcode = ! empty( $instance['shortcode'] ) ? $instance['shortcode'] : '';

		if ( empty( $shortcode ) ) {
			return;
		}

		echo $args['before_widget'];

		if ( ! empty( $title ) ) {
			echo $args['before_title'] . esc_html( $title ) . $args['after_title'];
		}

		echo '<div class="lw_shortcode_widget_content">';
		echo do_shortcode( $shortcode );
		echo '</div>';

		echo $args['after_widget'];
	}

	/* ---------- 管理画面フォーム ---------- */
	public function form( $instance ) {

		$title     = ! empty( $instance['title'] )     ? $instance['title'] : '';
		$shortcode = ! empty( $instance['shortcode'] ) ? $instance['shortcode'] : '';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				<?php _e( 'タイトル（任意）:', 'liteword' ); ?>
			</label>
			<input class="widefat"
			       type="text"
			       id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
			       name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
			       value="<?php echo esc_attr( $title ); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'shortcode' ) ); ?>">
				<?php _e( 'ショートコード:', 'liteword' ); ?>
			</label>
			<textarea class="widefat"
			          rows="4"
			          id="<?php echo esc_attr( $this->get_field_id( 'shortcode' ) ); ?>"
			          name="<?php echo esc_attr( $this->get_field_name( 'shortcode' ) ); ?>"
			          placeholder="[shortcode_name]"><?php echo esc_textarea( $shortcode ); ?></textarea>
			<small><?php _e( '例: [contact-form-7 id="123"]', 'liteword' ); ?></small>
		</p>
		<?php
	}

	/* ---------- 保存 ---------- */
	public function update( $new_instance, $old_instance ) {
		$instance              = [];
		$instance['title']     = ! empty( $new_instance['title'] )     ? sanitize_text_field( $new_instance['title'] ) : '';
		$instance['shortcode'] = ! empty( $new_instance['shortcode'] ) ? wp_kses_post( $new_instance['shortcode'] ) : '';
		return $instance;
	}
}

/* ==========================================================
 * ウィジェット登録
 * ======================================================= */
function liteword_register_shortcode_widget() {
	register_widget( 'Lw_Shortcode_Widget' );
}
add_action( 'widgets_init', 'liteword_register_shortcode_widget' );
