<?php
if ( !defined( 'ABSPATH' ) ) exit;
/*------------------------------
固定ページを作らず、ページを作る
こちらの場合はサイトマップにも表示されない
------------------------------*/
// エンドポイントの設定をグローバル変数で定義
$GLOBALS['custom_endpoints'] = [
    [
        'title'   => 'テンプレートアクティベートスタート',
        'slug'    => 'template_activate_start',
        'custom_file' => get_template_directory() .'/functions/template_activate_start.php'
    ],
    // （2026-11-02 の点検 I17）「テンプレートの保存」（slug: save_template → functions/save_template.php）を外した。
    // save_template.php は functions/index.php で毎回読み込み済みなので、ここでもう一度 include すると
    // lw_save_full_templates_to_db() の二重定義で致命的エラーになり、URL に save_template を含めるだけで
    // 未ログインでも 500 にできた。今の save_template.php は admin-post の受け口を登録するだけで画面を出さないため、
    // この入口で読む意味も無い（/save_template/ はふつうの WordPress の表示＝多くは 404 になる）。
];

add_action('template_redirect', 'custom_template_redirect');
function custom_template_redirect() {
    global $wp_query;
    $endpoints = $GLOBALS['custom_endpoints'];

    foreach ($endpoints as $endpoint) {
        if (strpos($_SERVER['REQUEST_URI'], $endpoint['slug']) !== false) {
            if (file_exists($endpoint['custom_file'])) {
                header('X-Robots-Tag: noindex, nofollow', true);
                $wp_query->is_404 = false;
                status_header(200); // HTTPステータスを200に設定

                // ページタイトルの設定
                add_filter('document_title_parts', function($title) use ($endpoint) {
                    $title['title'] = $endpoint['title'];
                    return $title;
                });

                include($endpoint['custom_file']);
                exit;
            }
        }
    }
}
