<?php
if ( !defined( 'ABSPATH' ) ) exit;
get_template_part('./functions/lw_my_parts/shortcode');
get_template_part('./functions/lw_my_parts/rest_access');// REST で読める人を絞る（custom_post_type より先に読む）
get_template_part('./functions/lw_my_parts/custom_post_type');
get_template_part('./functions/lw_my_parts/limitation');
get_template_part('./functions/lw_my_parts/code_editor');
get_template_part('./functions/lw_my_parts/code_editor_fullscreen');
get_template_part('./functions/lw_my_parts/code_editor_preview');


/**
 * REST APIレスポンスのキャッシュは 2.6.1 でやめた（2026-11-02 再点検 R6）
 *
 * 2.6.0 までは /wp/v2/lw_my_parts* と /lw-template/v1/get-template の返事を transient（rest_api_*）に貯めていた。
 * - 書く側（rest_request_after_callbacks）と読む側（rest_pre_dispatch）で get_params() の中身が違い
 *   （読む側には既定値と URL の値がまだ入っていない）、手元で測ると当たりは 0 回だった
 *   （同じ問い合わせを3回ずつ・マイパーツの一覧・1件・テンプレート）。テンプレートは返事が配列なので貯まってもいなかった
 * - 一方で、未ログインでも ?好きな値 を付けるたびに12時間残る行が増えた
 * - 貯めた返事は権限の確認より前に返す作りだった
 * 効き目が無く、穴だけがあったのでやめる。管理画面の「APIキャッシュ」の画面もやめる。
 *
 * ⚠️ 既に貯まっている rest_api_* の transient は、もう誰も読まないので返事には効かない。
 *    期限（12〜24時間）が来れば WordPress が毎日の掃除で消す。自動で読み込まれる行でもない（autoload は off）。
 */
