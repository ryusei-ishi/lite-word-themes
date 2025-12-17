<?php
if ( !defined( 'ABSPATH' ) ) exit;
// css, jsの読み込み
wp_enqueue_style('follow_bottom_cta_02_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_2/style.min.css', array(), css_version(), 'all');
$switch = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_2_switch","none");
$logo_url_type = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_logo_url","home_page");
$logo_tag = "a";
switch ($logo_url_type) {
   case 'this_page':
      // 現在のページIDを取得してURLを生成(ローカル・本番完全対応)
      $current_id = get_the_ID();
      if ($current_id) {
         $url = get_permalink($current_id);
      } else {
         // IDが取得できない場合(アーカイブページなど)
         global $wp;
         $url = home_url(add_query_arg(array(), $wp->request));
      }
      $logo_url = "href='$url'";
      break;
   case 'no_link':
      $logo_tag = "div";
      $logo_url = "";
      break;
   
   default: // 'home_page'
      $url = home_url('/');
      $logo_url = "href='$url'";
      break;
}

?>
<div class="follow_bottom_cta_02 follow_bottom_cta">
   <div class="pc">
      <?php
         // ロゴ部分
         $blog_info_name = get_bloginfo('name');
         $logo_text = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_logo_text", $blog_info_name);
         $font_family = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_font_family","");
         $font_weight = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_font_weight","");
         $logo_img = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_logo_img","");
         $font_family_set = "";
         if($font_family != ""){
            $font_family_set = "data-lw_font_set='$font_family'";
         }
         $font_weight_set = "";
         if($font_weight !=""){
            $font_weight_set = "font-weight:$font_weight;";
         }
         if(!empty($logo_img)):
      ?>
         <<?=$logo_tag?> class="logo" <?=$logo_url?>>
            <div class="image">
               <img src="<?=$logo_img?>" alt="<?=$logo_text?>">
            </div>
         </<?=$logo_tag?>>
      <?php elseif(empty($logo_img) && !empty($logo_text)):?>
         <<?=$logo_tag?> class="logo" <?=$logo_url?>>
               <div class="text" style="<?=$font_weight_set?>" <?=$font_family_set?>><?=$logo_text?></div>
         </<?=$logo_tag?>>
      <?php endif;?>
      <?php 
         // ポイント部分
         $ul_switch = false;
         $ul_point_no = 1;
         for ($i=1; $i <= 4; $i++) : 
         $point_text = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_point_text_{$i}","");
         if(!empty($point_text)){
            $ul_switch = true;
            $ul_point_no++; 
            break;
         }
         endfor;
         if($ul_switch == true): 
      ?>
      <ul class="point point_<?=$ul_point_no?>">
         <?php 
            for ($i=1; $i <= 4; $i++) : 
            $point_text = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_point_text_{$i}","");
            $point_color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_point_text_{$i}_color_bg","var(--color-main)");
         ?>
            <?php if(!empty($point_text)): ?>
               <li style="background:<?=$point_color_bg?>"><?=$point_text?></li>
         <?php endif;endfor;?>
      </ul>
      <?php endif;?>
      <?php 
         // 電話番号
         $tel = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_tel","");
         $tel_color = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_tel_color","");
         if(!empty($tel)):
      ?>
      <a href="tel:<?=$tel?>" class="tel" style="color:<?=$tel_color?>" data-lw_font_set="Lato"><?=$tel?></a>
      <?php endif;?>
      <?php 
         // ボタン部分
         $btn_text = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_btn_text","");
         $btn_text = str_replace("\n","<br>",$btn_text);
         $btn_url = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_btn_url","");
         $btn_color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_btn_color_bg","");
         if(!empty($btn_text)):
      ?>
     
      <a href="<?=$btn_url?>" class="btn" style="background:<?=$btn_color_bg?>;">
         <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/></svg></div>
         <div class="text"><?=$btn_text?></div>
      </a>
      <?php endif;?>

   </div>
   <?php
      $sp_switch = false;
      for ($i=1; $i <= 2; $i++) :
      $sp_btn_text_sub = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_text_sub","");
      $sp_btn_text_main = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_text_main","");
      if(!empty($sp_btn_text_sub) || !empty($sp_btn_text_main)){
         $sp_switch = true;
         break;
      }
      endfor;
      if($sp_switch == true):

   ?>
   <div class="sp">
      <ul>
         <?php 
            for ($i=1; $i <= 2; $i++) :
            $sp_btn_text_sub = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_text_sub","テキストテキスト");
            $sp_btn_text_main = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_text_main","LINE無料相談");
            $sp_btn_url = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_url","");
            $sp_btn_color_bg = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_color_bg","");
            $sp_btn_border_radius = Lw_theme_mod_set("follow_bottom_cta_ptn_2_set_sp_btn_{$i}_border_radius","16");
            if(!empty($sp_btn_text_sub) || !empty($sp_btn_text_main)):
         ?>
         <li>
            <a href="<?=$sp_btn_url?>" data-lw_font_set="Lato" style="background:<?=$sp_btn_color_bg?>; border-radius: <?=$sp_btn_border_radius?>px <?=$sp_btn_border_radius?>px 0 0;">
               <div class="sub"><?=$sp_btn_text_sub?></div>
               <div class="main"><?=$sp_btn_text_main?></div>
            </a>
         </li>
         <?php endif;endfor;?>
      </ul>
   </div>
   <?php endif;?>
</div>



