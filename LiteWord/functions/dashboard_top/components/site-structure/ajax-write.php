<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord サイト構造ページ — 書き込み系AJAX
 *
 * 親子付け替え・ノード詳細更新・自由配置座標の保存/クリア・新規ページ作成。
 * すべて edit_pages 権限 + nonce 検証を通す。読み取り系・共通ヘルパーは ajax-read.php。
 */

// node_type（page/category/post）に対して、new_parent_id の種別（lw_ss_parse_node_id の type）が
// 親として妥当か（クライアントの canDrop と同じ組み合わせ）。page-5 と cat-5 のようなID衝突を
// 使って「circular-reference チェックは通るが実際は無関係な相手に付け替わる」事故を防ぐ。
function lw_ss_is_valid_parent_type( $node_type, $parent_prefix_type ) {
    switch ( $node_type ) {
        case 'page':
            return $parent_prefix_type === 'page';
        case 'category':
            return $parent_prefix_type === 'cat' || $parent_prefix_type === 'page';
        case 'post':
            return $parent_prefix_type === 'cat';
    }
    return false;
}

// Ajax: 親子付け替えを一括保存
add_action( 'wp_ajax_lw_save_structure_changes', 'lw_ss_ajax_save_structure_changes' );
function lw_ss_ajax_save_structure_changes() {
    check_ajax_referer( LW_SITE_STRUCTURE_NONCE_ACTION, 'nonce' );

    if ( !current_user_can( 'edit_pages' ) ) {
        wp_send_json_error( '権限がありません' );
    }

    $changes = isset( $_POST['changes'] ) ? json_decode( stripslashes( $_POST['changes'] ), true ) : array();

    if ( empty( $changes ) ) {
        wp_send_json_error( '変更がありません' );
    }

    if ( !is_array( $changes ) || count( $changes ) > 500 ) {
        wp_send_json_error( '一度に変更できる件数を超えています' );
    }

    // 一部だけ失敗しても、成功した分は確実にDBへ反映されたまま返す（丸ごとエラー扱いにしない）。
    // クライアント側はここで返す succeeded_ids を見て pendingReparent から成功分だけを外す。
    $succeeded_ids = array();
    $failed        = array();

    foreach ( $changes as $change ) {
        if ( !is_array( $change ) ) {
            continue;
        }

        $node_id       = isset( $change['nodeId'] ) ? sanitize_text_field( $change['nodeId'] ) : '';
        $node_type     = isset( $change['nodeType'] ) ? sanitize_text_field( $change['nodeType'] ) : '';
        $new_parent_id = isset( $change['newParentId'] ) ? sanitize_text_field( $change['newParentId'] ) : '';

        $parsed_node   = lw_ss_parse_node_id( $node_id );
        $parsed_parent = lw_ss_parse_node_id( $new_parent_id );

        if ( !$parsed_node || !$parsed_parent ) {
            $failed[] = array( 'nodeId' => $node_id, 'message' => '無効なIDです' );
            continue;
        }

        // ID の数値部分が page/category/post 間で衝突していても、想定外の相手に付け替わらないようにする
        if ( !lw_ss_is_valid_parent_type( $node_type, $parsed_parent['type'] ) ) {
            $failed[] = array( 'nodeId' => $node_id, 'message' => '親の種類が不正です' );
            continue;
        }

        // 循環参照ガード（自分自身を祖先にしようとしていないか）
        if ( lw_ss_would_create_cycle( $node_id, $new_parent_id ) ) {
            $failed[] = array( 'nodeId' => $node_id, 'message' => '循環参照になるため変更できません' );
            continue;
        }

        $raw_id        = $parsed_node['raw_id'];
        $raw_parent_id = $parsed_parent['raw_id'];

        $result = false;

        switch ( $node_type ) {
            case 'page':
                $result = ( get_post_type( $raw_id ) === 'page' )
                    ? wp_update_post( array( 'ID' => $raw_id, 'post_parent' => $raw_parent_id ) )
                    : new WP_Error( 'lw_ss_invalid_type', '対象がページではありません' );
                break;

            case 'category':
                $result = wp_update_term( $raw_id, 'category', array(
                    'parent' => $raw_parent_id,
                ) );
                break;

            case 'post':
                $result = ( get_post_type( $raw_id ) === 'post' )
                    ? wp_set_post_categories( $raw_id, array( $raw_parent_id ) )
                    : new WP_Error( 'lw_ss_invalid_type', '対象が投稿ではありません' );
                break;
        }

        // wp_update_post() は失敗時に false ではなく 0（int）を返すため、false 単独では検知できない
        if ( is_wp_error( $result ) ) {
            $failed[] = array( 'nodeId' => $node_id, 'message' => $result->get_error_message() );
        } elseif ( $result === false || $result === 0 ) {
            $failed[] = array( 'nodeId' => $node_id, 'message' => '更新に失敗しました' );
        } else {
            $succeeded_ids[] = $node_id;
        }
    }

    wp_send_json_success( array(
        'message'       => count( $succeeded_ids ) . '件の変更を保存しました',
        'count'         => count( $succeeded_ids ),
        'succeeded_ids' => $succeeded_ids,
        'failed'        => $failed,
    ) );
}

// $new_parent_id を辿って $node_id 自身に戻ってこないか（循環参照）を見る
function lw_ss_would_create_cycle( $node_id, $new_parent_id ) {
    $current_id = $new_parent_id;
    $visited    = array();
    $guard      = 0;

    while ( $current_id && $guard < 100 ) {
        if ( $current_id === $node_id ) {
            return true;
        }
        if ( isset( $visited[ $current_id ] ) ) {
            return false;
        }
        $visited[ $current_id ] = true;

        $parsed = lw_ss_parse_node_id( $current_id );
        if ( !$parsed ) {
            return false;
        }

        if ( $parsed['type'] === 'cat' ) {
            $term = get_term( $parsed['raw_id'], 'category' );
            $current_id = ( $term && !is_wp_error( $term ) && $term->parent ) ? 'cat-' . $term->parent : null;
        } else {
            $post = get_post( $parsed['raw_id'] );
            $current_id = ( $post && $post->post_parent ) ? 'page-' . $post->post_parent : null;
        }

        $guard++;
    }

    return false;
}

// Ajax: ノード詳細を更新（タイトル、スラッグ、ステータス）
add_action( 'wp_ajax_lw_update_node_details', 'lw_ss_ajax_update_node_details' );
function lw_ss_ajax_update_node_details() {
    check_ajax_referer( LW_SITE_STRUCTURE_NONCE_ACTION, 'nonce' );

    if ( !current_user_can( 'edit_pages' ) ) {
        wp_send_json_error( '権限がありません' );
    }

    $node_id   = isset( $_POST['node_id'] ) ? sanitize_text_field( $_POST['node_id'] ) : '';
    $node_type = isset( $_POST['node_type'] ) ? sanitize_text_field( $_POST['node_type'] ) : '';
    $title     = isset( $_POST['title'] ) ? sanitize_text_field( $_POST['title'] ) : '';
    $slug      = isset( $_POST['slug'] ) ? sanitize_title( $_POST['slug'] ) : '';
    $status    = isset( $_POST['status'] ) ? sanitize_text_field( $_POST['status'] ) : '';

    $allowed_statuses = array( 'publish', 'draft', 'private', 'pending' );
    if ( $node_type !== 'category' && !in_array( $status, $allowed_statuses, true ) ) {
        wp_send_json_error( '無効なステータスです' );
    }

    $parsed = lw_ss_parse_node_id( $node_id );
    if ( !$parsed ) {
        wp_send_json_error( '無効なIDです' );
    }
    $raw_id = $parsed['raw_id'];

    $result = false;

    switch ( $node_type ) {
        case 'page':
        case 'post':
            // page-5 と post-5 のようなID衝突があっても、実際の投稿タイプが一致する時だけ更新する
            if ( get_post_type( $raw_id ) !== $node_type ) {
                wp_send_json_error( '対象の種類が一致しません' );
            }
            $result = wp_update_post( array(
                'ID'          => $raw_id,
                'post_title'  => $title,
                'post_name'   => $slug,
                'post_status' => $status,
            ) );
            break;

        case 'category':
            $result = wp_update_term( $raw_id, 'category', array(
                'name' => $title,
                'slug' => $slug,
            ) );
            break;
    }

    if ( is_wp_error( $result ) ) {
        wp_send_json_error( $result->get_error_message() );
    }

    if ( $result === false || $result === 0 ) {
        wp_send_json_error( '更新に失敗しました' );
    }

    wp_send_json_success( array(
        'message' => '保存しました',
        'node_id' => $node_id,
    ) );
}

// Ajax: ノードの自由配置座標を保存／クリア
add_action( 'wp_ajax_lw_save_node_position', 'lw_ss_ajax_save_node_position' );
function lw_ss_ajax_save_node_position() {
    check_ajax_referer( LW_SITE_STRUCTURE_NONCE_ACTION, 'nonce' );

    if ( !current_user_can( 'edit_pages' ) ) {
        wp_send_json_error( '権限がありません' );
    }

    $node_id = isset( $_POST['node_id'] ) ? sanitize_text_field( $_POST['node_id'] ) : '';
    $parsed  = lw_ss_parse_node_id( $node_id );

    if ( !$parsed ) {
        wp_send_json_error( '無効なIDです' );
    }

    if ( !empty( $_POST['clear'] ) ) {
        if ( $parsed['type'] === 'cat' ) {
            delete_term_meta( $parsed['raw_id'], '_lw_sitestructure_pos' );
        } else {
            delete_post_meta( $parsed['raw_id'], '_lw_sitestructure_pos' );
        }
        wp_send_json_success( array( 'node_id' => $node_id, 'pos' => null ) );
    }

    if ( !isset( $_POST['x'] ) || !isset( $_POST['y'] ) ) {
        wp_send_json_error( '座標が指定されていません' );
    }

    $pos     = array( 'x' => floatval( $_POST['x'] ), 'y' => floatval( $_POST['y'] ) );
    $encoded = wp_json_encode( $pos );

    if ( $parsed['type'] === 'cat' ) {
        update_term_meta( $parsed['raw_id'], '_lw_sitestructure_pos', $encoded );
    } else {
        update_post_meta( $parsed['raw_id'], '_lw_sitestructure_pos', $encoded );
    }

    wp_send_json_success( array( 'node_id' => $node_id, 'pos' => $pos ) );
}

// Ajax: 空いた場所から新規固定ページを作成
add_action( 'wp_ajax_lw_create_page_from_map', 'lw_ss_ajax_create_page_from_map' );
function lw_ss_ajax_create_page_from_map() {
    check_ajax_referer( LW_SITE_STRUCTURE_NONCE_ACTION, 'nonce' );

    if ( !current_user_can( 'edit_pages' ) ) {
        wp_send_json_error( '権限がありません' );
    }

    $title = isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '';
    if ( $title === '' ) {
        wp_send_json_error( 'タイトルを入力してください' );
    }

    $parent_id     = isset( $_POST['parent_id'] ) ? sanitize_text_field( $_POST['parent_id'] ) : '';
    $raw_parent_id = 0;
    if ( $parent_id !== '' ) {
        $parsed_parent = lw_ss_parse_node_id( $parent_id );
        if ( $parsed_parent && $parsed_parent['type'] === 'page' && get_post_type( $parsed_parent['raw_id'] ) === 'page' ) {
            $raw_parent_id = $parsed_parent['raw_id'];
        }
    }

    $new_id = wp_insert_post( array(
        'post_type'   => 'page',
        'post_title'  => $title,
        'post_status' => 'draft',
        'post_parent' => $raw_parent_id,
    ), true );

    if ( is_wp_error( $new_id ) ) {
        wp_send_json_error( $new_id->get_error_message() );
    }

    $pos = null;
    if ( isset( $_POST['x'] ) && isset( $_POST['y'] ) ) {
        $pos = array( 'x' => floatval( $_POST['x'] ), 'y' => floatval( $_POST['y'] ) );
        update_post_meta( $new_id, '_lw_sitestructure_pos', wp_json_encode( $pos ) );
    }

    $new_page = get_post( $new_id );

    wp_send_json_success( array(
        'node' => array(
            'id'            => 'page-' . $new_id,
            'raw_id'        => $new_id,
            'title'         => $new_page->post_title,
            'slug'          => $new_page->post_name,
            'status'        => $new_page->post_status,
            'parent_id'     => $raw_parent_id ? 'page-' . $raw_parent_id : '',
            'type'          => 'page',
            'edit_url'      => get_edit_post_link( $new_id, 'raw' ),
            'is_front'      => false,
            'is_posts_page' => false,
            'pos'           => $pos,
        ),
    ) );
}
