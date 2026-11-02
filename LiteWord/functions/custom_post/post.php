<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action('admin_menu', 'Lw_add_post_setting_fields');
function Lw_add_post_setting_fields() {
    add_meta_box('post_setting_page_setting', '入力フォーム', 'insert_post_setting_meta_fields', 'post');
}

/**------------------------
 * 入力エリア
--------------------------*/
function insert_post_setting_meta_fields() { 
    get_template_part('./functions/custom_post/lw_block_insert');
    get_template_part('./functions/custom_post/lw_block_insert_functions');
    get_template_part('./functions/custom_post/lw_block_insert_arr');
    ?>
    <input type="hidden" name="meta_nonce" id="meta_nonce" value="<?php echo wp_create_nonce( 'meta_nonce' ) ?>" />
    <div class="Lw_edit_style_wrap">
        <div class="Lw_edit_style reset">
            <details open>
                <summary>メインビジュアルの設定</summary>
                <dl>
                    <dt class="left">パターンの選択</dt>
                    <dd><?=Lw_input_select("fv_select",[
                        "fv_ptn_1"=>"パターン１",
                        "fv_ptn_2"=>"パターン２",
                        "fv_ptn_3"=>"パターン３",
                    ],"Lw_input_select_switch")?></dd>
                    <dt class="left">タイトル</dt>
                    <dd class=""><?php echo Lw_input_textarea("ttl_main", "", "", ""); ?></dd>
                    
                    <dt class="left">サブタイトル</dt>
                    <dd class=""><?php echo Lw_input_textarea("ttl_sub", "", "", ""); ?></dd>
                    
                    <dt class="fv_ptn_1 fv_ptn_2 fv_ptn_3 hidden_section left">イメージ画像</dt>
                    <dd class="fv_ptn_1 fv_ptn_2 fv_ptn_3 hidden_section"><?=Lw_input_media("fv_image")?></dd>
                    <dt class=" hidden_section left">イメージ画像（スマホの時）</dt>
                    <dd class=" hidden_section"><?=Lw_input_media("fv_image_sp")?></dd>
                    <!-- 比率 -->
                    <dt class="fv_ptn_1 hidden_section left">イメージ画像の比率</dt>
                    <dd class="fv_ptn_1 hidden_section">
                        <?=Lw_input_select("fv_image_ratio",[
                            ""=>"未選択",
                            "auto"=>"画像の元の比率をそのまま使用",
                            "16/6"=>"16:6",
                            "16/7"=>"16:7",
                            "16/8"=>"16:8",
                            "16/9"=>"16:9",
                            "4/3"=>"4:3",
                            "3/2"=>"3:2",
                            "1/1"=>"1:1",
                        ])?>
                    </dd>
                    <dt class="fv_ptn_2 fv_ptn_3 hidden_section left">画像上のフィルターの色</dt>
                    <dd class="fv_ptn_2 fv_ptn_3 hidden_section"><?=Lw_input_color("fv_filter_color")?></dd>
                    <dt class="fv_ptn_2 fv_ptn_3 hidden_section left">フィルター透明度</dt>
                    <dd class="fv_ptn_2 fv_ptn_3 hidden_section"><?=Lw_input_range("fv_filter_opacity","","20")?></dd>
                    <dt class="hidden_section left">説明文</dt>
                    <dd class="hidden_section"><?php echo Lw_input_textarea("ttl_btm_p", "", "説明テキスト", "", ""); ?></dd>
                </dl>
            </details>
            <details open>
                <summary>その他の設定</summary>
                <dl>
                    <dt class="left">目次 ON / OFF</dt>
                    <dd><?= Lw_input_select("toc_page_switch", ctm_switch_array_2()) ?></dd>
                    <dt class="left">コメント欄 ON / OFF</dt>
                    <dd><?= Lw_input_select("comment_page_switch", ctm_switch_array_2()) ?></dd>
                    <dt class="left">PR表記（広告）</dt>
                    <dd><?= Lw_input_select("pr_notice_page_switch", [
                        "" => "カスタマイザー設定に従う",
                        "on" => "この記事で表示する",
                        "off" => "この記事では表示しない",
                    ]) ?></dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>カラー設定</summary>
                <dl>
                    <dt class="left">メインカラー</dt>
                    <dd><?= Lw_input_color("color_main") ?></dd>
                    <dt class="left">アクセントカラー</dt>
                    <dd><?= Lw_input_color("color_accent") ?></dd>
                    <dt class="left">文字の色</dt>
                    <dd><?= Lw_input_color("color_text") ?></dd>
                    <dt class="left">リターンボタンの色</dt>
                    <dd><?= Lw_input_color("color_return_btn") ?></dd>
                    <dt class="left">カラー 01</dt>
                    <dd><?= Lw_input_color("color_1") ?></dd>
                    <dt class="left">カラー 02</dt>
                    <dd><?= Lw_input_color("color_2") ?></dd>
                    <dt class="left">カラー 03</dt>
                    <dd><?= Lw_input_color("color_3") ?></dd>
                </dl>
            </details>
        </div>
    </div>
    <br><br><br><br><br><br><br><br><br><br><br>
    <?php 
}

/**------------------------
 * 保存エリア
--------------------------*/
function Lw_save_post_setting_meta_fields($post_id) {
    // nonceを確認して、リクエストが正当なものか確認
    if (!isset($_POST['meta_nonce']) || !wp_verify_nonce($_POST['meta_nonce'], 'meta_nonce')) {
        return;
    }

    // 自動保存の際は何もしない
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // ユーザーが権限を持っているか確認
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // この入力フォームは投稿（post）だけに出している（add_meta_box の 'post'）。
    // ほかの種類の保存では動かさない（meta_nonce は固定ページの設定と同じ名前なので、送り元だけでは区別できない）
    if (get_post_type($post_id) !== 'post') {
        return;
    }

    $input = [
        "ttl_main",
        "ttl_sub",
        "fv_select",
        "fv_image",
        "fv_image_sp",
        "fv_image_ratio",
        "fv_filter_color",
        "fv_filter_opacity",
        "ttl_btm_p",
        "toc_page_switch",
        "comment_page_switch",
        "pr_notice_page_switch",
        'color_main',
        'color_sub',
        'color_accent',
        'color_text',
        'color_return_btn',
        'color_1',
        'color_2',  
        'color_3',
        
    ];

    foreach ($input as $field) {
        if (isset($_POST[$field])) {
            // 改行を有効にするためにすべてのフィールドに `sanitize_textarea_field()` を適用
            $value = is_scalar($_POST[$field]) ? sanitize_textarea_field($_POST[$field]) : '';
            // 形の決まっている欄は、その形だけを受け付ける（寄稿者も自分の投稿に書けるため・2026-11-02 の点検 T1）
            $value = lw_post_setting_sanitize_value($field, $value);

            if ($value !== '' && $value !== null) {
                update_post_meta($post_id, $field, $value);
            } else {
                delete_post_meta($post_id, $field);
            }
        } else {
            delete_post_meta($post_id, $field);
        }
    }
}


add_action('save_post', 'Lw_save_post_setting_meta_fields');

/**
 * 投稿の入力フォームの値のうち、形の決まっているものを確かめる。形に合わなければ空（＝保存しない）。
 * 値は update_post_meta() に渡す前の、スラッシュの付いたままの文字列（update_metadata が外す）。
 *
 * 🚨 fv_image・fv_image_ratio は FV のテンプレートで style 属性に入る。2.5.2 までは確かめておらず、
 *    寄稿者が自分の投稿に入れた値で、管理者がプレビューした画面に JS を仕込めた（2026-11-02 の点検 T1）。
 *    出す側（templates/post_fv/）でもエスケープしている。両方そろって守り。
 *
 * @param string $field 欄の名前
 * @param string $value sanitize_textarea_field() を通した値
 * @return string
 */
function lw_post_setting_sanitize_value($field, $value) {
    $value = (string) $value;
    if ($value === '') {
        return '';
    }
    switch ($field) {
        case 'fv_select':
            return preg_match('/^fv_ptn_[a-z0-9_]+$/', $value) ? $value : '';
        case 'fv_image':
        case 'fv_image_sp':
            if (ctype_digit($value)) {
                return $value; // 添付ファイルの ID
            }
            if (!preg_match('#^https?://#i', $value)) {
                return ''; // メディアの選択から入るのは http(s) の URL だけ
            }
            return esc_url_raw($value, array('http', 'https'));
        case 'fv_image_ratio':
            return ($value === 'auto' || preg_match('#^\d{1,3}\s*/\s*\d{1,3}$#', $value)) ? $value : '';
        case 'fv_filter_opacity':
            if (!is_numeric($value)) {
                return '';
            }
            return (string) max(0, min(100, (int) round((float) $value)));
        case 'fv_filter_color':
        case 'color_main':
        case 'color_sub':
        case 'color_accent':
        case 'color_text':
        case 'color_return_btn':
        case 'color_1':
        case 'color_2':
        case 'color_3':
            return lw_is_safe_css_color($value) ? $value : '';
        default:
            return $value;
    }
}

// lw_is_safe_css_color() は functions/custom_post/meta_guard.php に移した（表側のテンプレートでも使うため・2026-11-02 再チェック R1）
