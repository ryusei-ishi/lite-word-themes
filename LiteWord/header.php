<?php if ( !defined( 'ABSPATH' ) ) exit; ?>
<!DOCTYPE html>
<html lang="ja">
<head class="lw_head">
    <meta charset="UTF-8">
    <?=Lw_theme_mod_set("head_set_before")?>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
    <?=Lw_theme_mod_set("head_set_after")?>
</head>
<body <?php body_class( 'w-admin' ); ?> id="body">
    <?php wp_body_open(); ?>
    <?=Lw_theme_mod_set("body_set_before")?>