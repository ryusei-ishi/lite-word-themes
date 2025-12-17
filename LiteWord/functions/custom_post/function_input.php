<?php
if ( !defined( 'ABSPATH' ) ) exit;

// 新規で作る時か、既に設定済みかの判断をする関数
function post_status_news_check($post_id){
    $post_status = get_post_status($post_id);
    return in_array($post_status, array('draft', 'publish', 'future', 'private', 'revision', 'trash')) ? "true" : "false";
}

// Lw_input_text（編集エディター用）
function Lw_input_text($value, $class="", $placeholder="", $df_value="") {
    if (!is_admin()) return;
    
    $post_id = get_the_ID();
    $set_value = get_post_meta($post_id, $value, true);
    
    if (empty($set_value) && !empty($df_value)) {
        $set_value = $df_value;
    }

    return "<input class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' type='text' name='".esc_attr($value)."' placeholder='".esc_attr($placeholder)."' value='".esc_attr($set_value)."'>";
}

// Lw_input_textarea（編集エディター用）
function Lw_input_textarea($value, $class="", $placeholder="", $rows="", $df_value="") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $set_value = get_post_meta($post_id, $value, true);

    if (empty($set_value) && !empty($df_value)) {
        $set_value = $df_value;
    }

    return "<textarea class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' name='".esc_attr($value)."' rows='".esc_attr($rows)."' placeholder='".esc_attr($placeholder)."'>".esc_textarea($set_value)."</textarea>";
}

// Lw_input_hidden（編集エディター用）
function Lw_input_hidden($value, $class="", $placeholder="", $df_value="") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $set_value = get_post_meta($post_id, $value, true);

    if (empty($set_value) && !empty($df_value)) {
        $set_value = $df_value;
    }

    return "<input class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' type='hidden' name='".esc_attr($value)."' placeholder='".esc_attr($placeholder)."' value='".esc_attr($set_value)."'>";
}
// Lw_input_color（編集エディター用）
function Lw_input_color($value, $class="", $df_value="#ADA993") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $color = get_post_meta($post_id, $value, true);

    if (empty($color) && !empty($df_value)) {
        $color = $df_value;
    }

    $output = '<div class="lw-color-input-wrapper" style="display: flex; align-items: center; gap: 8px;">';
    $output .= '<input class="'.esc_attr($class).' editor_input" id="cus_pr_'.esc_attr($value).'" type="color" name="'.esc_attr($value).'" value="'.esc_attr($color).'" data-default="'.esc_attr($df_value).'">';
    $output .= '<button type="button" class="button lw-color-reset" data-target="cus_pr_'.esc_attr($value).'" title="デフォルトに戻す">リセット</button>';
    $output .= '</div>';

    return $output;
}

// Lw_input_range（編集エディター用）
function Lw_input_range($name, $class="", $df_value="100",$max="300") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $value = get_post_meta($post_id, $name, true);

    if (empty($value)) {
        $value = $df_value;
    } elseif (empty($value)) {
        $value = $df_value;
    }

    return "<input class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($name)."' type='range' name='".esc_attr($name)."' min='0' max='".esc_attr($max)."' value='".esc_attr($value)."'>";
}


// Lw_input_date（編集エディター用）
function Lw_input_date($value, $class="") {
    if (!is_admin()) return;

    return "<input class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' type='date' name='".esc_attr($value)."' value='".esc_attr(get_post_meta(get_the_ID(), $value, true))."'>";
}

// Lw_input_time（編集エディター用）
function Lw_input_time($value, $class="") {
    if (!is_admin()) return;

    return "<input class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' type='time' name='".esc_attr($value)."' value='".esc_attr(get_post_meta(get_the_ID(), $value, true))."'>";
}

// Lw_input_number（編集エディター用）
function Lw_input_number($value, $class="", $placeholder="", $df_value="") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $initial_set = post_status_news_check($post_id);
    $set_value = get_post_meta($post_id, $value, true);

    if (empty($set_value) && $initial_set == "false" && !empty($df_value)) {
        $set_value = $df_value;
    }

    return "<input style='width:80px;' class='".esc_attr($class)." editor_input' id='cus_pr_".esc_attr($value)."' type='number' name='".esc_attr($value)."' placeholder='".esc_attr($placeholder)."' value='".esc_attr($set_value)."'>";
}

// Lw_input_select（編集エディター用）
function Lw_input_select($value_id = "", $options = array(), $class = "", $placeholder = "") {
    if (!is_admin()) return;

    // 現在選択されている値を取得
    $selected = get_post_meta(get_the_ID(), $value_id, true);

    // 初期状態の<select>タグを生成
    $output = "<select name='" . esc_attr($value_id) . "' class='" . esc_attr($class) . "' id='cus_pr_" . esc_attr($value_id) . "'>";

    // 未選択のオプションを追加（重複を防ぐ）
    if ($placeholder) {
        // プレースホルダーが指定されている場合
        if (!array_key_exists('', $options) && $selected === '') {
            $output .= "<option value=''>" . esc_html($placeholder) . "</option>";
        }
    } else {
        // プレースホルダーが指定されていない場合のデフォルトテキスト
        if (!array_key_exists('', $options) && !array_key_exists(null, $options) && ($selected === '' || $selected === null)) {
            $output .= "<option value=''>未選択</option>";
        }
    }

    // その他のオプションを生成
    foreach ($options as $key => $option) {
        $output .= "<option value='" . esc_attr($key) . "' " . selected($selected, $key, false) . ">" . esc_html($option) . "</option>";
    }

    $output .= "</select>";
    return $output;
}

// Lw_input_select用のよく使うアイテムを関数化
function switch_array(){
    return [
        "on" => "ON",
        "off" => "OFF",
    ];
}

function switch_array_2(){
    return [
        "on" => "表示する",
        "off" => "表示しない",
    ];
}

// メディアセレクト（編集エディター用）
function Lw_input_media($name = "", $class = "", $btn_text = "メディアの選択", $df_value="") {
    if (!is_admin()) return;

    $post_id = get_the_ID();
    $img_value = get_post_meta($post_id, $name, true);

    if (empty($img_value)  && !empty($df_value)) {
        $img_value = $df_value;
    }

    if (empty($btn_text)) {
        $btn_text = "メディアの選択";
    }

    ?>
    <div class="costom_post_media_select">
        <input type="hidden" name="<?php echo esc_attr($name); ?>" class="editor_input" id="<?php echo esc_attr($name); ?>_url" value="<?php echo esc_attr($img_value); ?>"/>
        <input type="hidden" name="<?php echo esc_attr($name); ?>_id" id="<?php echo esc_attr($name); ?>_id" value=""/>
        <div class="preview_img" id="<?php echo esc_attr($name); ?>_past_preview">
            <?php if($img_value): ?>
                <img src="<?php echo esc_url($img_value); ?>">
            <?php endif; ?>
        </div>
        <div class="preview_img" id="<?php echo esc_attr($name); ?>_preview"></div>
        <div class="btn">
            <button class="add_upload_media" data-targetId="<?php echo esc_attr($name); ?>" data-title="ファイルアップロード" data-library="" data-frame="select" data-button="選択" data-multiple="false" data-preview="true"><?php echo esc_html($btn_text); ?></button>
            <button class="remove_upload_media" data-targetId="<?php echo esc_attr($name); ?>" href="#">削除</button>
        </div>
    </div>
    <?php
}
