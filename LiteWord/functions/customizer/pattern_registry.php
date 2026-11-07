<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ヘッダー・フッターのパターンの一覧と、選べる人の確かめ（2026-11-07）
 *
 * 新しいパターンを足すときに番号を書き足す場所を減らすため、番号つきのパターンの一覧は
 * テンプレートのフォルダ（templates/{header|footer}/ptn_N/index.php）から作る。
 * 次がここを読む:
 *  - 選択肢 header_ptn_arr() / footer_ptn_arr()（カスタマイザーと固定ページの「ページ独自のデザイン設定」）
 *  - カスタマイザーの各パターンの設定欄の読み込み（functions/customizer/index.php）
 *  - 初期設定ウィザードの一覧と保存の許可（functions/dashboard_top/index.php）
 *  - ヘッダーのメニューのホバーの書き方（Lw_header_menu_put()）
 *
 * 選べる人の決まり
 *  - 特定テンプレートを持つサイトだけ: lw_part_template_gated_patterns()（ヘッダー4・フッター3）
 *  - プレミアムだけ: lw_header_premium_pattern_labels()（functions.php）/ lw_footer_premium_pattern_labels()（選択肢の表示名もここ）
 * 注意: 選択肢から隠すだけでは足りない。プレミアムのパターンは表示するときも lw_part_renderable_ptn() で確かめる。
 */

// 番号つきのパターン（ptn_1, ptn_2, …）を、テンプレートのあるものだけ番号の順に返す
function lw_part_numbered_patterns( $part ) {
    static $cache = [];
    if ( isset( $cache[ $part ] ) ) {
        return $cache[ $part ];
    }
    $nums = [];
    if ( in_array( $part, [ 'header', 'footer' ], true ) ) {
        foreach ( (array) glob( get_template_directory() . "/templates/{$part}/ptn_*", GLOB_ONLYDIR ) as $dir ) {
            if ( preg_match( '/^ptn_(\d+)$/', basename( $dir ), $m ) && is_file( $dir . '/index.php' ) ) {
                $nums[] = (int) $m[1];
            }
        }
    }
    sort( $nums );
    $cache[ $part ] = array_map( function ( $n ) { return "ptn_{$n}"; }, $nums );
    return $cache[ $part ];
}

// 特定テンプレートを持つサイトだけが選べるパターン
function lw_part_template_gated_patterns( $part ) {
    $map = [
        'header' => [ 'ptn_4' ],
        'footer' => [ 'ptn_3' ],
    ];
    return $map[ $part ] ?? [];
}

// 特定テンプレート（shin_gas_station_01 / template_001）を持つサイトか
function lw_part_has_gate_template() {
    return function_exists( 'templateSettingCheck' ) && ( templateSettingCheck( "shin_gas_station_01" ) || templateSettingCheck( "template_001" ) );
}

// プレミアム限定のフッターのパターン（キー → 選択肢の表示名）。いまは無い
function lw_footer_premium_pattern_labels() {
    return [];
}

// プレミアム限定のパターン（キー → 選択肢の表示名）
function lw_part_premium_pattern_labels( $part ) {
    if ( $part === 'header' ) {
        return lw_header_premium_pattern_labels();
    }
    if ( $part === 'footer' ) {
        return lw_footer_premium_pattern_labels();
    }
    return [];
}

// そのサイトで選べるパターンか（特定テンプレート・プレミアムの確かめ）
function lw_part_pattern_available( $part, $ptn ) {
    if ( in_array( $ptn, lw_part_template_gated_patterns( $part ), true ) && ! lw_part_has_gate_template() ) {
        return false;
    }
    if ( array_key_exists( $ptn, lw_part_premium_pattern_labels( $part ) ) && ! lw_header_has_premium() ) {
        return false;
    }
    return true;
}

// 表示してよいパターン。プレミアム限定のパターンが選ばれていても、契約が無ければパターン1にする（消さない）
function lw_part_renderable_ptn( $part, $ptn ) {
    if ( is_string( $ptn ) && array_key_exists( $ptn, lw_part_premium_pattern_labels( $part ) ) && ! lw_header_has_premium() ) {
        return 'ptn_1';
    }
    return $ptn;
}
function lw_footer_renderable_ptn( $ptn ) {
    return lw_part_renderable_ptn( 'footer', $ptn );
}

// カスタマイザーと固定ページの選択肢（未選択・番号つき・ショートコード・非表示）
function lw_part_ptn_arr( $part, $name ) {
    $arr = [ '' => '未選択' ];
    $premium = lw_part_premium_pattern_labels( $part );
    foreach ( lw_part_numbered_patterns( $part ) as $ptn ) {
        if ( ! lw_part_pattern_available( $part, $ptn ) ) {
            continue;
        }
        if ( isset( $premium[ $ptn ] ) ) {
            $arr[ $ptn ] = $premium[ $ptn ];
            continue;
        }
        $arr[ $ptn ] = $name . 'パターン' . substr( $ptn, 4 ) . ( $ptn === 'ptn_1' ? '（デフォルト）' : '' );
    }
    $arr['ptn_short_code'] = 'ショートコード';
    $arr['none'] = '非表示';
    return $arr;
}

// 初期設定ウィザードの一覧（選べないものも鍵をつけて並べる）
function lw_part_wizard_patterns( $part ) {
    $base_url = get_template_directory_uri() . "/assets/image/lw_{$part}_sample/";
    $premium = lw_part_premium_pattern_labels( $part );
    $gated = lw_part_template_gated_patterns( $part );
    $has_premium = lw_header_has_premium();
    $patterns = [];
    foreach ( lw_part_numbered_patterns( $part ) as $ptn ) {
        $premium_locked = isset( $premium[ $ptn ] ) && ! $has_premium;
        $template_locked = in_array( $ptn, $gated, true ) && ! lw_part_has_gate_template();
        $is_locked = $premium_locked || $template_locked;
        $patterns[] = [
            'value' => $ptn,
            'label' => 'パターン ' . substr( $ptn, 4 ),
            'image' => $base_url . $ptn . '.webp',
            'locked' => $is_locked,
            'locked_message' => $premium_locked ? 'プレミアムプランで使えます' : ( $template_locked ? '特定テンプレートの購入が必要です' : '' ),
        ];
    }
    return $patterns;
}

// カスタマイザーの各パターンの設定欄（functions/customizer/{part}/ptn_N_set.php）を、そのサイトで選べるものだけ番号の順に読む
function lw_customizer_load_part_pattern_settings( $part ) {
    foreach ( lw_part_numbered_patterns( $part ) as $ptn ) {
        if ( ! lw_part_pattern_available( $part, $ptn ) ) {
            continue;
        }
        if ( is_file( get_template_directory() . "/functions/customizer/{$part}/{$ptn}_set.php" ) ) {
            get_template_part( "./functions/customizer/{$part}/{$ptn}_set" );
        }
    }
}

// ヘッダーのメニューのホバーと現在地の書き方。塗り型はパターン2・3だけで、ほかは下線型（新しいパターンは下線型が既定）
function lw_header_menu_hover_type( $ptn ) {
    return in_array( $ptn, [ 'ptn_2', 'ptn_3' ], true ) ? 'fill' : 'underline';
}

// フッターのパターンの CSS（templates/footer/ptn_N/style.css）を読む <link> を出す。
// 親テーマの版を印に付ける（テーマを更新したとき、古い CSS がブラウザに残らないように）
function lw_footer_ptn_style_link( $ptn ) {
    if ( ! lw_is_ptn_name( $ptn ) ) {
        return;
    }
    $rel = "/templates/footer/{$ptn}/style.css";
    if ( ! is_file( get_template_directory() . $rel ) ) {
        return;
    }
    $ver = wp_get_theme( get_template() )->get( 'Version' );
    echo '<link rel="stylesheet" href="' . esc_url( get_template_directory_uri() . $rel . '?ver=' . rawurlencode( (string) $ver ) ) . '">';
}
