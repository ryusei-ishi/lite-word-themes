<?php
if ( !defined( 'ABSPATH' ) ) exit;

function my_menu_init() {
  // 通常の登録方法
  register_nav_menus( array(
    'header'  => 'ヘッダーメニュー（PC）',
    'drawer'  => 'スマホメニュー（ドロワーメニュー）',
    'footer'  => 'フッターメニュー',
  ) );
}
add_action( 'init', 'my_menu_init' );

// タイトル属性のところを<span>で表示
add_filter('walker_nav_menu_start_el', 'description_in_nav_menu', 10, 4);
function description_in_nav_menu($item_output, $item){
    // 画像タグの生成（descriptionフィールドが空でない場合のみ）
   // $img = !empty($item->description) ? "<img loading='lazy' src='$item->description'>" : "";
    
    // spanタグの生成（attr_titleフィールドが空でない場合のみ）
    $span = !empty($item->attr_title) ? "<span>{$item->attr_title}</span>" : "";

    // aタグ内に画像タグとspanタグを挿入
    return preg_replace('/(<a.*?>[^<]*?)</', '$1' . "<", $item_output);
}
