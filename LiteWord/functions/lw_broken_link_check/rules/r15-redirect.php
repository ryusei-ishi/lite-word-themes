<?php
/**
 * R15 / R16 — 301リダイレクト設定の見直し。
 *
 * 🚨 このテーマの 301 は「逆引き」で動く（functions/301_redirect.php）。
 *    postmeta `seo_301_redirect_url` に入っているのは【旧URL（カンマ区切り・複数可）】で、
 *    そこへアクセスが来たら【そのページ】へ飛ばす、という向き。
 *    向きを取り違えると診断が全部逆になるので注意。
 *
 *   R15 🟡 内部リンクが旧URLを指している … 毎回リダイレクトが挟まって遅くなる
 *   R16 🔴 旧URLとして「いま公開している別のページのURL」が登録されている
 *           … そのページが開けなくなる。設定した本人はまず気づかない
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 301 の比較用にURLをそろえる（301_redirect.php と同じやり方にする）。
 *
 * @param string $url URL。
 * @return string
 */
function lw_site_rule_normalize_url( $url ) {
    $url = untrailingslashit( trim( (string) $url ) );
    $url = preg_replace( '#^https?://#i', '', $url );

    return strtolower( (string) $url );
}

/**
 * 判定する。
 *
 * @param array $ledger lw_link_list_get_from_db() の戻り値。
 * @return array 指摘の配列。
 */
function lw_site_rule_redirect( $ledger ) {
    global $wpdb;

    $rows = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT post_id, meta_value FROM {$wpdb->postmeta}
             WHERE meta_key = %s AND meta_value <> ''",
            'seo_301_redirect_url'
        ),
        ARRAY_A
    );

    if ( empty( $rows ) ) {
        return array();
    }

    $issues = array();
    $old    = array(); // 正規化した旧URL => 登録しているページID

    foreach ( $rows as $row ) {
        $post_id  = (int) $row['post_id'];
        $conflict = array();
        $self     = false;

        $own = lw_site_rule_normalize_url( get_permalink( $post_id ) );

        foreach ( explode( ',', (string) $row['meta_value'] ) as $url ) {
            $key = lw_site_rule_normalize_url( $url );

            if ( '' === $key ) {
                continue;
            }

            if ( $key === $own ) {
                $self = true;
                continue;
            }

            // その旧URLが、いま公開されている別のページの本来のURLだった場合
            $target = LW_Site_Url_Index::resolve( trim( $url ) );

            if ( null !== $target && 'publish' === $target['status'] && $target['post_id'] !== $post_id ) {
                $conflict[] = array(
                    'url'       => trim( $url ),
                    'target_id' => $target['post_id'],
                    'title'     => $target['title'],
                );
            }

            $old[ $key ] = $post_id;
        }

        if ( $conflict ) {
            $issues[] = lw_site_issue_make(
                $post_id,
                'R16',
                'critical',
                sprintf( '転送元として「%s」が登録されています。そのページが開けなくなります', $conflict[0]['title'] ),
                array(
                    'count'     => count( $conflict ),
                    'conflicts' => array_slice( $conflict, 0, 10 ),
                )
            );
        } elseif ( $self ) {
            $issues[] = lw_site_issue_make(
                $post_id,
                'R16',
                'info',
                '転送元に自分自身のURLが登録されています（何も起きないので外して構いません）',
                array( 'self' => true )
            );
        }
    }

    if ( empty( $old ) ) {
        return $issues;
    }

    // 内部リンクが旧URLを指していないか（1ページ1件にまとめる）
    $by_page = array();

    foreach ( $ledger['links'] as $link ) {
        $href = isset( $link['href'] ) ? (string) $link['href'] : '';

        if ( '' === $href || ! LW_Site_Url_Index::is_internal( $href ) ) {
            continue;
        }

        $key = lw_site_rule_normalize_url( lw_site_rule_absolute_url( $href ) );

        if ( ! isset( $old[ $key ] ) ) {
            continue;
        }

        $source_id = isset( $link['source_id'] ) ? (int) $link['source_id'] : 0;

        if ( ! $source_id ) {
            continue;
        }

        if ( ! isset( $by_page[ $source_id ] ) ) {
            $by_page[ $source_id ] = array();
        }

        $by_page[ $source_id ][ $key ] = array(
            'href'     => $href,
            'goes_to'  => get_permalink( $old[ $key ] ),
        );
    }

    foreach ( $by_page as $post_id => $links ) {
        $issues[] = lw_site_issue_make(
            $post_id,
            'R15',
            'warning',
            sprintf( '転送を経由するリンクが%d本あります。転送先を直接リンクすると速くなります', count( $links ) ),
            array(
                'count' => count( $links ),
                'links' => array_slice( array_values( $links ), 0, 10 ),
            )
        );
    }

    return $issues;
}

/**
 * ルート相対のリンクを絶対URLにする（301 の比較は絶対URLで登録されているため）。
 *
 * @param string $href リンク先。
 * @return string
 */
function lw_site_rule_absolute_url( $href ) {
    if ( preg_match( '#^[a-z][a-z0-9+.-]*://#i', $href ) ) {
        return $href;
    }

    return home_url( '/' === substr( $href, 0, 1 ) ? $href : '/' . $href );
}
