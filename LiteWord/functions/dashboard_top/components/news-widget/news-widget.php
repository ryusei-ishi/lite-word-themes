<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord お知らせウィジェット
 */

// ウィジェットの表示
function lw_dashboard_news_widget() {
    $news_items = lw_get_dashboard_news();
    ?>
    <div class="lw-news-widget">
        <?php if (!empty($news_items)): ?>
            <?php foreach ($news_items as $item): ?>
                <div class="lw-news-item">
                    <?php if (!empty($item['date'])): ?>
                        <div class="lw-news-date"><?php echo esc_html($item['date']); ?></div>
                    <?php endif; ?>
                    <div class="lw-news-title">
                        <?php if (!empty($item['url'])): ?>
                            <a href="<?php echo esc_url($item['url']); ?>" target="_blank">
                                <?php echo esc_html($item['title']); ?>
                            </a>
                        <?php else: ?>
                            <?php echo esc_html($item['title']); ?>
                        <?php endif; ?>
                    </div>
                    <?php if (!empty($item['excerpt'])): ?>
                        <div class="lw-news-excerpt"><?php echo esc_html($item['excerpt']); ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="lw-news-empty">
                <span class="dashicons dashicons-megaphone"></span>
                <p>現在お知らせはありません</p>
            </div>
        <?php endif; ?>

        <div class="lw-news-links">
            <a href="https://lite-word.com/" target="_blank" class="lw-btn">
                <span class="dashicons dashicons-admin-home"></span>
                公式サイト
            </a>
            <a href="https://lite-word.com/contact/" target="_blank" class="lw-btn">
                <span class="dashicons dashicons-email"></span>
                お問い合わせ
            </a>
            <a href="<?php echo admin_url('admin.php?page=lw-manual-viewer'); ?>" class="lw-btn">
                <span class="dashicons dashicons-book-alt"></span>
                マニュアル
            </a>
        </div>
    </div>
    <?php
}

// お知らせ情報を取得
function lw_get_dashboard_news() {
    $news = array(
        array(
            'date' => '2024.12.03',
            'title' => 'LiteWordをご利用いただきありがとうございます',
            'excerpt' => '旧）操作マニュアルをご確認の上、サイト制作をお楽しみください。',
            'url' => ''
        ),
    );

    return apply_filters('lw_dashboard_news_items', $news);
}
