<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * 投稿ページ FV「ショートコード」パターンの出し分け
 *
 * 入力欄（single_post_layout_fv_ptn_short_code_put）そのものは single_post.php の
 * 「ファーストビュー設定」セクションで登録している（FVパターンのラジオ直下に並べるため）。
 * ここでは「ショートコードを選んだ時だけ入力欄を出す」制御だけを受け持つ。
 * コントロールが出来上がった後に触るので priority 11。
 */
add_action( 'customize_register', 'single_post_ptn_short_code_set_custom', 11 );
function single_post_ptn_short_code_set_custom( $wp_customize ) {

    $control = $wp_customize->get_control( 'single_post_layout_fv_ptn_short_code_put' );
    if ( ! $control ) return;

    // サーバー側の判定（これが正。カスタマイザーが状態を再計算するたびに評価される）
    $control->active_callback = function () use ( $wp_customize ) {
        $setting = $wp_customize->get_setting( 'single_post_layout_fv_ptn' );
        return $setting && $setting->value() === 'fv_ptn_short_code';
    };

    // ラジオを切り替えた瞬間の反映（サーバーの再計算を待つと約2秒かかるため）
    add_action( 'customize_controls_print_footer_scripts', 'single_post_ptn_short_code_customize_scripts' );
}

/**
 * カスタマイザー画面でのみ出力されるJavaScript。
 *
 * ⚠ 生の DOM 操作（querySelector + style.display）では効かない。実機で確認済み。
 *   カスタマイザーはコントロールの DOM を後から構築するため、DOMContentLoaded で掴んで
 *   インラインスタイルを当てても、その後の再構築で失われる。
 *   表示の出し入れは必ず wp.customize の control.active を使うこと。
 *   （既存の deadline_setting.php は生DOM操作だが、あちらに倣わないこと）
 */
function single_post_ptn_short_code_customize_scripts() {
    ?>
    <script>
    (function() {
        'use strict';
        if ( typeof wp === 'undefined' || ! wp.customize ) return; // 判定できない時は入力欄を出したままにする

        wp.customize( 'single_post_layout_fv_ptn', function( setting ) {
            wp.customize.control( 'single_post_layout_fv_ptn_short_code_put', function( control ) {

                function updateShortCodeField() {
                    control.active.set( setting.get() === 'fv_ptn_short_code' );
                }

                updateShortCodeField();               // 初期表示
                setting.bind( updateShortCodeField ); // ラジオを変えた瞬間
            } );
        } );
    })();
    </script>
    <?php
}
