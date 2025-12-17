<?php
if ( ! defined( 'ABSPATH' ) ) exit;

$lw_block_arr = lw_block_arr();   // 配列取得
?>
<div class="none_plugin_message"></div>

<div class="lw_block_list reset">
    <!-- ▼ ナビゲーション：ここは空のまま出力しておく -->
    <nav class="lw_block_list_nav">
        <ul></ul>
    </nav>

    <?php foreach ( $lw_block_arr as $block ) : ?>

        <?php if ( $block['type'] === 'h2' ) : ?>
            <!-- ===== 見出し =====
                 ※ id を付与してアンカーの飛び先にする -->
            <h2 id="<?= esc_attr( $block['id'] ); ?>">
                <?= esc_html( $block['title'] ); ?>
            </h2>

        <?php elseif ( $block['type'] === 'block' ) : ?>
            <!-- ===== 無償ブロック ===== -->
            <div id="<?= esc_attr( $block['id'] ); ?>-placeholder"
                 class="sample-placeholder block"
                 data-sample-id="<?= esc_attr( $block['id'] ); ?>">
                <img src="<?= esc_url( $block['image'] ); ?>"
                     alt="<?= esc_attr( $block['title'] ); ?>" />
                <p class="template-id">
                    Block&nbsp;ID:&nbsp;
                    <span class="copyId" data-id="<?= esc_attr( $block['id'] ); ?>">
                        <?= esc_html( $block['id'] ); ?>
                    </span>
                </p>
            </div>

        <?php elseif ( $block['type'] === 'paid_block' && $block['switch'] ) : ?>
            <!-- ===== 購入済みブロック ===== -->
            <div id="<?= esc_attr( $block['id'] ); ?>-placeholder"
                 class="sample-placeholder paid_block purchased"
                 data-sample-id="<?= esc_attr( $block['id'] ); ?>">
                <img src="<?= esc_url( $block['image'] ); ?>"
                     alt="<?= esc_attr( $block['title'] ); ?>" />
                <div class="pay_info_text">購入 or 取得済み</div>
                <p class="template-id">
                    Block&nbsp;ID:&nbsp;
                    <span class="copyId" data-id="<?= esc_attr( $block['id'] ); ?>">
                        <?= esc_html( $block['id'] ); ?>
                    </span>
                </p>
            </div>

        <?php elseif ( $block['type'] === 'paid_block' && ! $block['switch'] ) : ?>
            <!-- ===== 未購入ブロック ===== -->
            <div id="<?= esc_attr( $block['id'] ); ?>-placeholder"
                 class="sample-placeholder paid_block not-purchased"
                 data-sample-id="<?= esc_attr( $block['id'] ); ?>">
                <img src="<?= esc_url( $block['image'] ); ?>"
                     alt="<?= esc_attr( $block['title'] ); ?>" />
                <div class="pay_info_text">
                    有料&nbsp;<?= number_format( $block['price'] ); ?>円
                </div>
                <a href="<?= esc_url( $block['shop_url'] ); ?>"
                   class="pay_btn" target="_blank" rel="noopener noreferrer">
                    購入ページへ
                </a>
            </div>

        <?php endif; ?>
    <?php endforeach; ?>

    <div id="copyNotification" class="copy-notification">コピーしました</div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {

    /* ========== ① ID コピー処理 ========== */
    document.querySelectorAll('.copyId').forEach(el => {
        el.addEventListener('click', () => {
            navigator.clipboard.writeText(el.dataset.id)
                .then(showCopyNotification)
                .catch(err => console.error('クリップボードへのコピーに失敗しました:', err));
        });
    });
    function showCopyNotification () {
        const note = document.getElementById('copyNotification');
        note.classList.add('show');
        setTimeout(() => note.classList.remove('show'), 2000);
    }

    /* ========== ② ナビゲーション自動生成 ========== */
    const navUl = document.querySelector('.lw_block_list_nav ul');
    // .lw_block_list 直下にある h2（id 付き見出し）を取得
    document.querySelectorAll('.lw_block_list > h2[id]').forEach(h2 => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#' + h2.id;          // アンカー先
        a.textContent = h2.textContent; // 表示テキスト
        li.appendChild(a);
        navUl.appendChild(li);
    });

    /* お好みでスムーススクロール */
    navUl.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60, // ヘッダー分オフセットなど
                    behavior: 'smooth'
                });
            }
        }
    });
});
</script>
