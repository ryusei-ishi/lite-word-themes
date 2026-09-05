<?php
if ( !defined( 'ABSPATH' ) ) exit;
// 解決・描画は共通関数へ（functions/customizer/functions.php）。
// 追従CTAウィジェット（functions/widget/item/follow_bottom_cta.php）と同じ経路を通ることで、
// 両方が同時に有効でも .follow_bottom_cta が重複して出ないようにしている。
lw_render_follow_bottom_cta_once(lw_resolve_follow_bottom_cta_ptn());
