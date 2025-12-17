<?php
/**
 * ブロックディレクトリクリーンアップ機能
 *
 * テーマ更新時に、build/ ディレクトリ内の古いブロック（src/ に存在しないブロック）を自動削除する
 * これにより、削除されたブロックがユーザー環境に残り続けることを防ぐ
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * テーマ更新後に古いブロックを削除
 */
function lw_cleanup_old_blocks() {
    // block-dev は開発環境にのみ存在するため、本番環境では処理をスキップ
    $dev_src_dir = get_template_directory() . '/../block-dev/src';

    // 開発環境の場合はスキップ（開発環境では webpack の clean: true が動作するため）
    if ( file_exists( $dev_src_dir ) ) {
        return;
    }

    $build_dir = get_template_directory() . '/my-blocks/build';
    $manifest_file = get_template_directory() . '/my-blocks/.block-manifest.json';

    if ( ! is_dir( $build_dir ) ) {
        return;
    }

    // バージョンチェック：前回のクリーンアップバージョンを取得
    $theme_version = wp_get_theme()->get('Version');
    $last_cleanup_version = get_option( 'lw_blocks_cleanup_version', '' );

    // 既に同じバージョンでクリーンアップ済みならスキップ
    if ( $last_cleanup_version === $theme_version ) {
        return;
    }

    // マニフェストファイルを読み込み（有効なブロックのリスト）
    $valid_blocks = array();
    if ( file_exists( $manifest_file ) ) {
        $manifest_content = file_get_contents( $manifest_file );
        $manifest = json_decode( $manifest_content, true );

        if ( json_last_error() === JSON_ERROR_NONE && isset( $manifest['blocks'] ) ) {
            $valid_blocks = $manifest['blocks'];
        }
    }

    // build ディレクトリ内の全ブロックディレクトリを取得
    $build_blocks = glob( $build_dir . '/*', GLOB_ONLYDIR );

    if ( empty( $build_blocks ) ) {
        return;
    }

    $deleted_count = 0;
    $error_blocks = array();

    foreach ( $build_blocks as $block_path ) {
        $block_name = basename( $block_path );
        $should_delete = false;

        // マニフェストが存在する場合、リストに含まれないブロックを削除
        if ( ! empty( $valid_blocks ) ) {
            if ( ! in_array( $block_name, $valid_blocks, true ) ) {
                $should_delete = true;
            }
        } else {
            // マニフェストが存在しない場合は、不完全なブロックのみ削除
            $block_json = $block_path . '/block.json';

            // block.json が存在しない場合は削除対象
            if ( ! file_exists( $block_json ) ) {
                $should_delete = true;
            } else {
                // block.json が存在してもパースエラーの場合は削除
                $json_content = file_get_contents( $block_json );
                $block_data = json_decode( $json_content, true );

                if ( json_last_error() !== JSON_ERROR_NONE ) {
                    $should_delete = true;
                }
            }
        }

        // 削除実行
        if ( $should_delete ) {
            if ( lw_remove_block_directory( $block_path ) ) {
                $deleted_count++;
            } else {
                $error_blocks[] = $block_name;
            }
        }
    }

    // クリーンアップ完了をオプションに記録
    update_option( 'lw_blocks_cleanup_version', $theme_version );

    // 管理者通知（削除されたブロックがある場合のみ）
    if ( $deleted_count > 0 ) {
        set_transient( 'lw_blocks_cleanup_notice', array(
            'deleted' => $deleted_count,
            'errors' => $error_blocks,
        ), 300 ); // 5分間表示
    }
}

/**
 * ブロックディレクトリを再帰的に削除
 *
 * @param string $dir 削除するディレクトリのパス
 * @return bool 削除成功時 true、失敗時 false
 */
function lw_remove_block_directory( $dir ) {
    if ( ! is_dir( $dir ) ) {
        return false;
    }

    // ディレクトリ内のファイルとサブディレクトリを取得
    $files = array_diff( scandir( $dir ), array( '.', '..' ) );

    foreach ( $files as $file ) {
        $path = $dir . '/' . $file;

        if ( is_dir( $path ) ) {
            // サブディレクトリの場合は再帰的に削除
            lw_remove_block_directory( $path );
        } else {
            // ファイルの場合は削除
            @unlink( $path );
        }
    }

    // ディレクトリを削除
    return @rmdir( $dir );
}

/**
 * 管理者通知を表示
 */
function lw_blocks_cleanup_admin_notice() {
    $notice = get_transient( 'lw_blocks_cleanup_notice' );

    if ( ! $notice ) {
        return;
    }

    $deleted = isset( $notice['deleted'] ) ? $notice['deleted'] : 0;
    $errors = isset( $notice['errors'] ) ? $notice['errors'] : array();

    ?>
    <div class="notice notice-success is-dismissible">
        <p>
            <strong>LiteWord ブロッククリーンアップ:</strong>
            <?php echo esc_html( $deleted ); ?>個の古いブロックを削除しました。
        </p>
        <?php if ( ! empty( $errors ) ) : ?>
            <p>
                <em>削除に失敗したブロック: <?php echo esc_html( implode( ', ', $errors ) ); ?></em>
            </p>
        <?php endif; ?>
    </div>
    <?php

    // 通知を一度表示したら削除
    delete_transient( 'lw_blocks_cleanup_notice' );
}
add_action( 'admin_notices', 'lw_blocks_cleanup_admin_notice' );

// テーマアップグレード時にクリーンアップを実行
add_action( 'after_switch_theme', 'lw_cleanup_old_blocks' );
add_action( 'upgrader_process_complete', 'lw_cleanup_old_blocks', 10, 0 );
