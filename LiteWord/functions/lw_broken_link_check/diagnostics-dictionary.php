<?php
/**
 * 検査ルールの辞書（何がダメか・なぜダメか・どう直すか）。
 *
 * 実体は diagnostics-rules.json。結果テーブルには rule_id しか持たせず、
 * 説明はここから引く。同じ説明を画面と（将来の）MCP の両方が使うため、
 * 文言を2か所に書かないようにする。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 辞書を読む（1リクエストに1回だけ）。
 *
 * @return array rule_id => array('title','severity','what','why','how')
 */
function lw_site_rules_dictionary() {
    static $rules = null;

    if ( null !== $rules ) {
        return $rules;
    }

    $rules = array();
    $path  = LW_BROKEN_LINK_CHECK_PATH . 'diagnostics-rules.json';

    if ( ! file_exists( $path ) ) {
        return $rules;
    }

    $decoded = json_decode( (string) file_get_contents( $path ), true );

    if ( is_array( $decoded ) && isset( $decoded['rules'] ) && is_array( $decoded['rules'] ) ) {
        $rules = $decoded['rules'];
    }

    return $rules;
}

/**
 * 1ルール分の説明。無ければ空の形を返す（画面が壊れないように）。
 *
 * @param string $rule_id R10 など。
 * @return array
 */
function lw_site_rule_info( $rule_id ) {
    $rules = lw_site_rules_dictionary();

    $empty = array(
        'title'    => $rule_id,
        'severity' => 'info',
        'what'     => '',
        'why'      => '',
        'how'      => '',
    );

    if ( ! isset( $rules[ $rule_id ] ) || ! is_array( $rules[ $rule_id ] ) ) {
        return $empty;
    }

    return array_merge( $empty, $rules[ $rule_id ] );
}
