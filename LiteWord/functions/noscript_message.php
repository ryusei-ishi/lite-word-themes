<?php
if ( !defined( 'ABSPATH' ) ) exit;
function show_noscript_message_in_dashboard() {
    echo '
    <noscript>
        <div style="background-color: #e04444; color: #fff; padding: 10px; text-align: center;">
            LiteWordテーマを利用するには、お使いのブラウザのJavaScriptを有効にしてください。
        </div>
    </noscript>
    ';
}
add_action('admin_notices', 'show_noscript_message_in_dashboard');
