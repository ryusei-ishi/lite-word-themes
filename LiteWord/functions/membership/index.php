<?php
if ( !defined( 'ABSPATH' ) ) exit;
if(is_admin()){
    get_template_part('./functions/membership/restrict_admin');
}else{
    get_template_part('./functions/membership/restrict_front');
}