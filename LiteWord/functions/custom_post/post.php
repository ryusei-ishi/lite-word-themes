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
            $value = sanitize_textarea_field($_POST[$field]);

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
