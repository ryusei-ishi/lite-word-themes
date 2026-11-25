<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * PHP が古いときの警告のポップアップ（lw_php_notice_render() から読む）
 * 使う変数: $version（例 8.2.27）・$status（版ごとの言い方）・$article（記事の URL）
 */
?>
<div class="lw-php-notice" id="lwPhpNotice" role="dialog" aria-modal="true" aria-labelledby="lwPhpNoticeTitle">
    <div class="lw-php-notice-card" tabindex="-1">
        <h2 class="lw-php-notice-title" id="lwPhpNoticeTitle">
            <span class="dashicons dashicons-warning" aria-hidden="true"></span>
            PHP のバージョンを上げてください
        </h2>

        <p class="lw-php-notice-text">このサイトの PHP は <strong><?php echo esc_html( $version ); ?></strong> です。</p>
        <p class="lw-php-notice-text"><?php echo esc_html( $status ); ?>更新が止まった PHP のままだと、見つかった弱点が直らず、攻撃を受けやすくなります。</p>
        <p class="lw-php-notice-text">契約しているサーバーの管理画面で、PHP を 8.3 以上に切り替えてください。</p>

        <div class="lw-php-notice-actions">
            <button type="button" class="lw-php-notice-close">閉じる</button>
            <a href="<?php echo esc_url( $article ); ?>" target="_blank" rel="noopener noreferrer" class="lw-php-notice-link">
                理由と切り替え方を見る
                <span class="dashicons dashicons-arrow-right-alt2" aria-hidden="true"></span>
            </a>
        </div>
    </div>
</div>
