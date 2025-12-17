<?php
if ( !defined( 'ABSPATH' ) ) exit;
//ユーザー設定
get_template_part('./functions/user_data/profile');

//profile user_management
$lw_profile_manager_functions = Lw_theme_mod_set("lw_extensions_profile_manager_functions_switch", "off");
if($lw_profile_manager_functions === "on"){
    if(is_admin()){
        get_template_part('./functions/user_data/profile_management_admin');
    }else{
        get_template_part('./functions/user_data/profile_management_front');
    }
}