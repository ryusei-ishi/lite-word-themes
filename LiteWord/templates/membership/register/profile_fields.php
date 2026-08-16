<?php
/**
 * 会員登録フォーム ― プロフィール項目
 *
 * 「ユーザー > プロフィール管理」で作った項目を出す。
 * カスタマイザーで「プロフィール項目も入力してもらう」がONのときだけ中身が出る
 * （判定は lw_member_register_profile_fields() の中）。
 *
 * ⚠️ ここはすべて任意入力。必須にする仕組みが「プロフィール管理」側に無いため、
 *    必須にしたい項目はお名前・メールアドレスのように専用の欄を作ること。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_fields = lw_member_register_profile_fields();
if ( ! $lw_fields ) {
    return;
}

foreach ( $lw_fields as $lw_field ) :

    $lw_type  = (string) ( $lw_field['type'] ?? '' );
    $lw_name  = (string) ( $lw_field['name'] ?? '' );
    $lw_label = (string) ( $lw_field['label'] ?? '' );
    $lw_note  = (string) ( $lw_field['note'] ?? '' );

    /* ---------- 飾り（入力欄ではないもの） ---------- */

    if ( $lw_type === 'heading_h2' || $lw_type === 'heading_h3' ) :
        // ページ本文の中に入るので、見出しは h3 / h4 に落とす
        $lw_tag = $lw_type === 'heading_h2' ? 'h3' : 'h4';
        ?>
        <<?php echo $lw_tag; ?> class="group_title"><?php echo esc_html( $lw_label ); ?></<?php echo $lw_tag; ?>>
        <?php if ( $lw_note !== '' ) : ?>
            <p class="group_note"><?php echo nl2br( esc_html( $lw_note ) ); ?></p>
        <?php endif; ?>
        <?php
        continue;
    endif;

    if ( $lw_type === 'paragraph' ) :
        ?>
        <p class="group_note"><?php echo nl2br( esc_html( (string) ( $lw_field['opt'] ?? '' ) ) ); ?></p>
        <?php
        continue;
    endif;

    /* ---------- 入力欄 ---------- */

    // 🚨 権限を書き換えられる項目名は保存側で弾いている。出す側でも出さない
    if ( $lw_name === '' || ! lw_member_register_meta_is_safe( $lw_name ) ) {
        continue;
    }

    $lw_id  = 'lw_reg_pm_' . $lw_name;
    $lw_val = lw_member_register_field_value( $lw_field );
    ?>

    <label class="label" for="<?php echo esc_attr( $lw_id ); ?>"><?php echo esc_html( $lw_label ); ?></label>

    <?php if ( $lw_type === 'textarea' ) : ?>

        <textarea class="input textarea" id="<?php echo esc_attr( $lw_id ); ?>"
                  name="<?php echo esc_attr( $lw_name ); ?>" rows="5"><?php echo esc_textarea( $lw_val ); ?></textarea>

    <?php elseif ( $lw_type === 'select' ) : ?>

        <select class="input select" id="<?php echo esc_attr( $lw_id ); ?>" name="<?php echo esc_attr( $lw_name ); ?>">
            <option value="">選択してください</option>
            <?php foreach ( lw_member_register_field_options( $lw_field ) as $lw_option ) : ?>
                <option value="<?php echo esc_attr( $lw_option ); ?>" <?php selected( $lw_val, $lw_option ); ?>>
                    <?php echo esc_html( $lw_option ); ?>
                </option>
            <?php endforeach; ?>
        </select>

    <?php else : ?>

        <input class="input" type="text" id="<?php echo esc_attr( $lw_id ); ?>"
               name="<?php echo esc_attr( $lw_name ); ?>" value="<?php echo esc_attr( $lw_val ); ?>">

    <?php endif; ?>

    <?php if ( $lw_note !== '' ) : ?>
        <p class="field_note"><?php echo nl2br( esc_html( $lw_note ) ); ?></p>
    <?php endif; ?>

<?php endforeach; ?>
