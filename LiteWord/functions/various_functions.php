<?php
// 簡易的セキュリティ対策
function hh($s) {
    return htmlspecialchars($s, ENT_QUOTES, "UTF-8");
}
//textarea内で改行したら自動的にbrを付与して。「n\」などは無効にする
function brSt($item){
    $str = nl2br($item);
    echo str_replace(array("\r\n", "\r", "\n"), '',$str);
}
//新しいタブ
function new_tab(){
    echo 'target="_blank" rel="noopener noreferrer"';
}
if(is_admin()){
    // wp_optionsの更新（フォームをいっぺんに表示したい場合）
    function Lw_opt_text(
        $opt_name = "",
        $input_type = "text",
        $placeholder = "",
        $class = "",
        $rows = "10",
        $df = ""                // ★ 追加：未保存時の既定値
    ) {
        // ────────────────────────
        // 1) 初期化（未登録時だけ $df を返す）
        // ────────────────────────
        $opt_val = get_option( $opt_name, $df );

        // ────────────────────────
        // 2) 更新された時の処理
        // ────────────────────────
        if ( isset( $_POST[ $opt_name ] ) ) {
            $opt_val = $_POST[ $opt_name ];
            update_option( $opt_name, $opt_val );
        }

        // ────────────────────────
        // 3) フィールド出力（元コードそのまま）
        // ────────────────────────
        switch ( $input_type ) {
            case 'text':
                echo "<input type='text' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'textarea':
                echo "<textarea name='$opt_name' cols='30' rows='$rows' placeholder='$placeholder' class='$class'>$opt_val</textarea>";
                break;
            case 'color':
                echo "<input type='color' name='$opt_name' value='$opt_val' class='$class'>";
                break;
            case 'number':
                echo "<input type='number' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'email':
                echo "<input type='email' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'tel':
                echo "<input type='tel' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'url':
                echo "<input type='url' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'password':
                echo "<input type='password' name='$opt_name' value='$opt_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'hidden':
                echo "<input type='hidden' name='$opt_name' value='$opt_val' class='$class'>";
                break;
            case 'range':
                if ( $opt_val == "50" ) {
                    $opt_val = "";
                }
                echo "<input type='range' name='$opt_name' value='$opt_val' class='$class'>";
                break;
        }
    }

    //input_select（編集エディター用）
    function Lw_opt_select( $opt_name = "", $options = [], $placeholder = "",
                            $class = "", $df = "未選択" ) {

        /* ---------- 1) 現在値を取得 ---------- */
        $opt_val = get_option( $opt_name, '' );

        /* ---------- 2) フォーム送信があった場合に更新 ---------- */
        if ( isset( $_POST[ $opt_name ] ) ) {
            $opt_val = sanitize_text_field( $_POST[ $opt_name ] );
            update_option( $opt_name, $opt_val );
        }

        /* ---------- 3) 未保存なら $df をキーに変換して採用 ---------- */
        if ( $opt_val === '' && $df !== '' ) {
            /* $df がキーそのものならそのまま、ラベルならキーを逆引き */
            $opt_val = array_key_exists( $df, $options )
                ? $df                                     // キーが直接渡された
                : array_search( $df, $options, true );   // ラベル文字列 → キー
            /* 見つからなければ空のまま（プレースホルダーが選択状態） */
        }

        $selected = esc_attr( $opt_val );

        /* ---------- 4) <select> 出力 ---------- */
        if ( ! is_array( $options ) ) $options = [];

        $html  = '<select name="' . esc_attr( $opt_name ) . '" class="' . esc_attr( $class ) . '">' . "\n";
        $placeholder_text = $placeholder ?: $df;
        $html .= '  <option value=""' . ( $selected === '' ? ' selected' : '' ) . '>'
            . esc_html( $placeholder_text ) . "</option>\n";

        foreach ( $options as $key => $label ) {
            $key_esc   = esc_attr( $key );
            $label_esc = esc_html( $label );
            $sel_attr  = ( $selected === (string) $key ) ? ' selected' : '';
            $html .= "  <option value=\"$key_esc\"$sel_attr>$label_esc</option>\n";
        }
        $html .= "</select>\n";

        echo $html;
    }

    function Lw_opt_editor($opt_name = "", $settings = array()) {
        // 初期化
        $opt_val = get_option($opt_name); // 既に保存してある値があれば取得
        
        // 更新された時の処理
        if (isset($_POST[$opt_name])) {
            $opt_val = wp_kses_post($_POST[$opt_name]); // ここで不要な属性を除去
            update_option($opt_name, $opt_val);
        }
    
        // デフォルト設定（クラシックエディタ用）
        $default_settings = array(
            'textarea_name' => $opt_name,
            'media_buttons' => true,  // メディアアップロードボタンの有無
            'teeny' => false,         // 簡易エディタモード（falseでフル機能）
            'quicktags' => true,      // クイックタグの有無
            'editor_height' => 300    // エディタの高さ
        );
    
        // ユーザーが設定を渡した場合は、デフォルトとマージ
        $settings = wp_parse_args($settings, $default_settings);
    
        // WordPressのエディタを表示
        wp_editor($opt_val, $opt_name, $settings);
    }
    
}