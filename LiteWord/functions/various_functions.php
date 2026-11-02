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
        //    🚨 本物の設定画面から・管理者のときだけ（functions/settings_save_guard.php）。
        //    2026-11-02 までは送り元を確かめておらず、罠のページから通知先などを書き換えられた。
        //    名前が _url で終わる欄（サンクスページ・同意欄のリンク先）は http・https だけを受け付ける。
        // ────────────────────────
        if ( isset( $_POST[ $opt_name ] ) && lw_settings_save_allowed() ) {
            $posted = lw_settings_posted_string( $opt_name );
            if ( null !== $posted ) {
                if ( 'url' === $input_type || lw_settings_is_url_field( $opt_name ) ) {
                    $opt_val = lw_settings_sanitize_url( $posted );
                } else {
                    $opt_val = sanitize_text_field( $posted );
                }
                update_option( $opt_name, $opt_val );
            }
        }

        // ────────────────────────
        // 3) フィールド出力（エスケープ済み）
        // ────────────────────────
        $esc_val  = esc_attr( $opt_val );
        $esc_name = esc_attr( $opt_name );
        $esc_ph   = esc_attr( $placeholder );
        $esc_cls  = esc_attr( $class );
        $esc_rows = esc_attr( $rows );

        lw_settings_nonce_field();

        switch ( $input_type ) {
            case 'text':
                echo "<input type='text' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'textarea':
                echo "<textarea name='{$esc_name}' cols='30' rows='{$esc_rows}' placeholder='{$esc_ph}' class='{$esc_cls}'>" . esc_textarea( $opt_val ) . "</textarea>";
                break;
            case 'color':
                echo "<input type='color' name='{$esc_name}' value='{$esc_val}' class='{$esc_cls}'>";
                break;
            case 'number':
                echo "<input type='number' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'email':
                echo "<input type='email' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'tel':
                echo "<input type='tel' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'url':
                echo "<input type='url' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'password':
                echo "<input type='password' name='{$esc_name}' value='{$esc_val}' placeholder='{$esc_ph}' class='{$esc_cls}'>";
                break;
            case 'hidden':
                echo "<input type='hidden' name='{$esc_name}' value='{$esc_val}' class='{$esc_cls}'>";
                break;
            case 'range':
                if ( $opt_val == "50" ) {
                    $esc_val = "";
                }
                echo "<input type='range' name='{$esc_name}' value='{$esc_val}' class='{$esc_cls}'>";
                break;
        }
    }

    //input_select（編集エディター用）
    function Lw_opt_select( $opt_name = "", $options = [], $placeholder = "",
                            $class = "", $df = "未選択" ) {

        /* ---------- 1) 現在値を取得 ---------- */
        $opt_val = get_option( $opt_name, '' );

        /* ---------- 2) フォーム送信があった場合に更新 ----------
         * 本物の設定画面から・管理者のときだけ（settings_save_guard.php）。選択肢にある値か「未選択」だけを受け付ける */
        if ( ! is_array( $options ) ) $options = [];
        if ( isset( $_POST[ $opt_name ] ) && lw_settings_save_allowed() ) {
            $posted = lw_settings_posted_string( $opt_name );
            if ( null !== $posted && ( '' === $posted || array_key_exists( $posted, $options ) ) ) {
                $opt_val = $posted;
                update_option( $opt_name, $opt_val );
            }
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

        lw_settings_nonce_field();
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
        
        // 更新された時の処理（本物の設定画面から・管理者のときだけ。settings_save_guard.php）
        if (isset($_POST[$opt_name]) && lw_settings_save_allowed()) {
            $posted = lw_settings_posted_string($opt_name);
            if ($posted !== null) {
                $opt_val = wp_kses_post($posted); // ここで不要な属性を除去
                update_option($opt_name, $opt_val);
            }
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
        lw_settings_nonce_field();
        wp_editor($opt_val, $opt_name, $settings);
    }
    
}