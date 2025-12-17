<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action('admin_menu', 'Lw_add_page_template_popup_setting_fields');
function Lw_add_page_template_popup_setting_fields() {
    add_meta_box('page_template_popup_setting_page_setting', '入力フォーム', 'insert_page_template_popup_setting_meta_fields', 'page');
}

/**------------------------
 * 入力エリア
--------------------------*/
function insert_page_template_popup_setting_meta_fields() {     
    //アイコン
    $template_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M96 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L80 480c-44.2 0-80-35.8-80-80L0 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 272c0 8.8 7.2 16 16 16s16-7.2 16-16L96 96zm64 24l0 80c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24l0-80c0-13.3-10.7-24-24-24L184 96c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16z"/></svg>';
    $pc_icon       = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M128 32C92.7 32 64 60.7 64 96l0 256 64 0 0-256 384 0 0 256 64 0 0-256c0-35.3-28.7-64-64-64L128 32zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480l486.4 0c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2L19.2 384z"/></svg>';
    $file_icon     = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"/></svg>';
    $next_icon     = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>';

    // 新規投稿の場合、`post-new.php`かどうか確認
    $is_post_new = isset($_GET['post_type']) && $_GET['post_type'] === 'page' && strpos($_SERVER['REQUEST_URI'], 'post-new.php') !== false;
    if ( $is_post_new ) :

    $page_template_url = get_template_directory_uri() . "/page_template";
    $dashboard_url     = admin_url();

    // テンプレートのデータを配列で管理
    $LwTemplateItems = LwTemplateItems( $page_template_url, lw_shop_url() );

    // 有効なページテンプレートのIDを取得して、JavaScriptの配列に変換
    $lw_active_template_ids       = lw_active_template_ids();
    $lw_active_template_ids_json  = json_encode( $lw_active_template_ids );
    if ( $lw_active_template_ids_json === false ) {
        echo "<script>console.error('JSON encoding error for lw_active_template_ids');</script>";
    } else {
        echo "<script>var lw_active_template_ids = {$lw_active_template_ids_json};</script>";
    }
?>
    <div class="lw_template_popup_field true reset <?php echo $is_post_new ? 'true' : ''; ?>" data-lw_font_set="Noto Sans JP">
        <?php
            // テンプレが更新された場合
            if ( isset( $_GET['lw_template_update'] ) ) :
                if ( $_GET['lw_template_update'] === 'success' ) :
        ?>
                    <div class="lw_template_update_message">
                        <div class="inner">
                            <p>有料テンプレートの反映に<br>成功しました</p>
                            <a class="btn" href="<?=$dashboard_url?>post-new.php?post_type=page">新規固定ページの編集を行う</a>
                            <a class="btn" href="<?=$dashboard_url?>">ダッシュボードに戻る</a>
                        </div>
                    </div>
        <?php
                elseif ( $_GET['lw_template_update'] === 'error' ) :
        ?>
                    <div class="lw_template_update_message">
                        <div class="inner">
                            <p>有料テンプレートの反映に<br>失敗しました</p>
                            <a class="btn" href="<?=$dashboard_url?>post-new.php?post_type=page">固定ページの編集を行う</a>
                        </div>
                    </div>
        <?php
                endif;
            endif;
        ?>
        <div class="lw_template_popup_field_sidebar">
            <div class="inner">
                <a href="<?=$dashboard_url?>edit.php?post_type=page" class="close_btn"><?=$next_icon?></a>
                <ul class="lw_menu_list">
                    <li>
                        <div class="a CloseLwTemplatePopup">
                            <div class="text"><?=$file_icon?>白紙から始める</div><div class="next"><?=$next_icon?></div>
                        </div>
                    </li>
                </ul>
                <ul class="lw_menu_list">
                    <li onClick="CloseLwTemplateDetail()">
                        <a href="#title_only">
                            <div class="text"><?=$pc_icon?>ページタイトルのみ</div><div class="next"><?=$next_icon?></div>
                        </a>
                    </li>
                    <li onClick="CloseLwTemplateDetail()">
                        <a href="#page_template">
                            <div class="text"><?=$template_icon?>ページテンプレート</div><div class="next"><?=$next_icon?></div>
                        </a>
                    </li>
                    <?php
                    $this_nav = false;
                    if ( $this_nav == true ) :
                    ?>                
                    <li onClick="CloseLwTemplateDetail()">
                        <a href="">
                            <div class="text"><?=$template_icon?>フィットネスジム</div><div class="next"><?=$next_icon?></div>
                        </a>
                    </li>
                    <?php 
                        endif;
                        $this_nav = false;
                    ?>
                </ul>
            </div>
        </div>

        <div class="lw_template_popup_field_content_wrap">
            <ul class="lw_template_items" id="lw_template_items">
                <?php foreach ( $LwTemplateItems as $item ) : ?>
                    <?php 
                        if ( $item['type'] === 'item' ) : 
                            $item_detail = '';
                            if ( ! empty( $item['item_detail'] ) ) {
                                $item_detail = json_encode( $item['item_detail'] );
                                $item_detail = "onClick='OpenLwTemplateDetail({$item_detail})'";
                            }
                    ?>
                        <li class="item <?=$item["class"]?>" <?=$item_detail?>>
                            <div class="image <?=$item["img_size"]?>"><img loading="lazy" src="<?=$item['img']?>"></div>
                            <div class="ttl"><?=$item['title']?></div>
                            <?php if ( ! empty( $item['item_detail']['price'] ) ) : ?>
                                <div class="price"><?=$item['item_detail']['price']?>円（税込）</div>
                            <?php endif; ?>
                        </li>
                    <?php elseif ( $item['type'] === 'h2' ) : ?>
                        <h2 id="<?=$item["id"]?>"><?=$item['title']?></h2>
                    <?php endif; ?>
                <?php endforeach; ?>
            </ul>
            <br><br><br><br><br><br><br><br><br><br><br>
        </div>
        <div class="lw_template_detail"></div>
    </div>

    <script>
        /* ------------------------------------------------------------
         * ページ読み込み時：ポップアップを .wp-admin 直下へ移動
         * ------------------------------------------------------------ */
        document.addEventListener('DOMContentLoaded', () => {
            movePopupFieldToAdmin();
            function movePopupFieldToAdmin() {
                const popupField = document.querySelector('.lw_template_popup_field');
                const wpAdmin    = document.querySelector('.wp-admin');
                if (popupField && wpAdmin) {
                    wpAdmin.appendChild(popupField);
                }
            }
        });

        /* ------------------------------------------------------------
         * テンプレート詳細を開く
         * ------------------------------------------------------------ */
        function OpenLwTemplateDetail(detail) {

            const templateDetailElement = document.querySelector('.lw_template_detail');
            if (!templateDetailElement) return;

            const img_url   = detail.img;
            const title     = detail.title;
            const code_url  = detail.code_url;
            const designer  = detail.designer;
            const message   = detail.message;
            const price     = detail.price;
            const shop_url  = detail.shop_url;
            const sampleUrl = detail.sample_site ?? ''; // 未定義対策

            /* ---------- 購入済み判定 ---------- */
            let purchased_check = false; // false = 未購入
            if (detail.template_id) {
                lw_active_template_ids.forEach(id => {
                    if (id === detail.template_id) purchased_check = true;
                });
            }

            /* ---------- アクションボタン生成 ---------- */
            let lw_action_buttons = '';

            if (detail.paid === true) {
                /* ===== 有料テンプレート ===== */
                if (purchased_check) {
                    /* --- 購入済み --- */
                    lw_action_buttons = `
                        <ul class="lw_action_buttons">
                            <li class="return CloseLwTemplateDetail"><?=$next_icon?>戻る</li>
                            <li class="active CloseLwTemplatePopup_in" onClick="LwTemplateCodeIn('${code_url}')">このテンプレートを使う</li>
                            <li class="purchased">購入済み</li>
                        </ul>
                    `;
                } else {
                    /* --- 未購入 --- */
                    const sampleHtml = sampleUrl
                        ? `<li class="sample_site"><a href="${sampleUrl}" target="_blank">サンプルサイトを見る</a></li>`
                        : `<li class="">有料テンプレート</li>`;

                    lw_action_buttons = `
                        <ul class="lw_action_buttons">
                            <li class="return CloseLwTemplateDetail"><?=$next_icon?>戻る</li>
                            ${sampleHtml}
                            <li class="pay"><a href="${shop_url}" target="_blank">購入する</a></li>
                        </ul>
                    `;
                }
            } else {
                /* ===== 無料テンプレート ===== */
                lw_action_buttons = `
                    <ul class="lw_action_buttons">
                        <li class="return CloseLwTemplateDetail"><?=$next_icon?>戻る</li>
                        <li class="active CloseLwTemplatePopup_in" onClick="LwTemplateCodeIn('${code_url}')">このテンプレートを使う</li>
                        <li class="free">無料</li>
                    </ul>
                `;
            }

            /* ---------- デザイナー情報 ---------- */
            let designerInfoHtml = '';
            if (designer) {
                designerInfoHtml = `
                    <h3>デザイナーからのメッセージ</h3>
                    <div class="lw_designer_info">
                        <p>
                            デザイナー名：${designer} <br>
                            ${designer}へデザイナーへの直接依頼は<a>こちら</a>
                        </p>
                    </div>
                `;
            }

            /* ---------- 詳細HTML出力 ---------- */
            templateDetailElement.innerHTML = `
                <div class="image"><img src="${img_url}"></div>
                <div class="detail">
                    <h2>${title}</h2>
                    ${lw_action_buttons}
                    <div class="message">
                        ${designerInfoHtml}
                        <p>${message}</p>
                    </div>
                </div>
            `;
            templateDetailElement.classList.add('true');

            /* ---------- 閉じる処理 ---------- */
            document.querySelectorAll('.lw_template_detail .CloseLwTemplateDetail').forEach(btn => {
                btn.addEventListener('click', () => templateDetailElement.classList.remove('true'));
            });
            document.querySelectorAll('.CloseLwTemplatePopup_in').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelector('.lw_template_popup_field').classList.remove('true');
                });
            });
        }

        /* ------------------------------------------------------------
         * テンプレート選択画面を閉じる
         * ------------------------------------------------------------ */
        document.querySelectorAll(".CloseLwTemplatePopup").forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.lw_template_popup_field').classList.remove('true');
            });
        });

        /* ------------------------------------------------------------
         * テンプレート詳細を閉じる
         * ------------------------------------------------------------ */
        function CloseLwTemplateDetail() {
            const detail = document.querySelector('.lw_template_detail');
            if (detail) detail.classList.remove('true');
        }

        /* ------------------------------------------------------------
         * テンプレート取得 → エディタへ挿入
         * ------------------------------------------------------------ */
        function LwTemplateCodeIn(url) {
            if (url) fetchTemplateAndInsert(url);
        }

        async function fetchTemplateAndInsert(templateUrl) {
            try {
                const response = await fetch(templateUrl);
                if (!response.ok) {
                    throw new Error(`HTTPエラー! status: ${response.status}`);
                }
                const content = await response.text();
                insertIntoEditor(content);
            } catch (error) {
                alert(`テンプレートの取得に失敗しました: ${error.message}`);
            }
        }

        function insertIntoEditor(content) {
            const { resetBlocks, insertBlocks } = wp.data.dispatch('core/block-editor');
            const blocks = wp.blocks.parse(content);
            const currentBlocks = wp.data.select('core/block-editor').getBlocks();

            if (currentBlocks.length > 0) {
                if (window.confirm('すでに入力されている内容が消えますが、よろしいですか？')) {
                    resetBlocks(blocks);
                    // リセット後の自動復旧処理
                    setTimeout(() => {
                        autoRecoverAllBlocks();
                    }, 200);
                }
            } else {
                insertBlocks(blocks);
                // 挿入後の自動復旧処理
                setTimeout(() => {
                    autoRecoverAllBlocks();
                }, 200);
            }
        }

        // 自動復旧用の関数を追加
        function autoRecoverAllBlocks() {
            const allBlocks = wp.data.select('core/block-editor').getBlocks();
            
            allBlocks.forEach(block => {
                if (block.clientId) {
                    const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
                    if (blockElement) {
                        // 復旧ボタンを探す
                        const recoverButtons = blockElement.querySelectorAll('button');
                        for (let button of recoverButtons) {
                            const buttonText = button.textContent;
                            if (buttonText.includes('復旧') || 
                                buttonText.includes('ブロックの復旧') ||
                                buttonText.includes('Attempt Block Recovery')) {
                                // 復旧ボタンをクリック
                                button.click();
                                console.log(`ブロック ${block.name} を自動復旧しました`);
                                break;
                            }
                        }
                    }
                }
            });
        }
    </script>
<?php 
    endif;
}
