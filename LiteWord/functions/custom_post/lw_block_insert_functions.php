<?php
/* =============================================================
 * Lw汎用ブロック挿入システム
 * =========================================================== */

/**
 * ブロック挿入システムを生成するクラス
 */
class LwBlockInsertSystem {
    
    private $block_types = [];
    private $template_dir_uri;
    private $default_css_files = []; // デフォルトCSSを格納
    
    public function __construct() {
        $this->template_dir_uri = get_template_directory_uri();
        
        // デフォルトCSSファイルを設定
        $this->default_css_files = [
            $this->template_dir_uri . '/assets/css/reset.min.css',
            $this->template_dir_uri . '/assets/css/common.min.css',
            $this->template_dir_uri . '/assets/css/page.min.css',
            $this->template_dir_uri . '/assets/css/font_style.min.css',
            $this->template_dir_uri . '/my-blocks/build/style-lw-button-1/style-lw-button-1.css',
            $this->template_dir_uri . '/my-blocks/build/lw-button-2/style.css',
            $this->template_dir_uri . '/my-blocks/build/lw-button-3/style.css',
        ];
    }
    
    /**
     * ブロックタイプを登録
     * 
     * @param string $type_id ブロックタイプのID (例: 'button', 'heading')
     * @param array $config 設定配列
     *   - 'button_text' => ボタンのテキスト
     *   - 'button_id' => ボタンのID
     *   - 'blocks' => ブロック配列
     *   - 'base_url' => ベースURL（オプション）
     *   - 'css_url' => CSS用URL（オプション）
     */
    public function register_block_type($type_id, $config) {
        $this->block_types[$type_id] = $config;
    }
    
    /**
     * すべてのブロックタイプのHTMLとJavaScriptを出力
     */
    public function render() {
        if (empty($this->block_types)) {
            return;
        }
        
        // 共通CSSを出力
        $this->render_common_css();
        
        // 各ブロックタイプのHTMLを出力
        foreach ($this->block_types as $type_id => $config) {
            $this->render_block_type_html($type_id, $config);
        }
        
        // 共通JavaScriptを出力
        $this->render_common_javascript();
    }
    
    /**
     * 共通CSSを出力
     */
    private function render_common_css() {
        ?>
        <link rel="stylesheet" href="<?=$this->template_dir_uri?>/assets/css/lw-custom-insert-block.css">
        <style>
            /* 追加のスタイル調整 */
            .lw-custom-block-meta-box {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .lw_custom_popup_block_list__wraps h2 {
                margin: 0 0 20px 0;
                padding: 0 0 10px 0;
                border-bottom: 1px solid #ddd;
                font-size: 18px;
                color: #333;
            }
        </style>
        <?php
    }
    
    /**
     * 各ブロックタイプのHTMLを出力
     */
    private function render_block_type_html($type_id, $config) {
        // ブロック配列を処理
        $blocks_array = $this->process_blocks_array($config);
        
        ?>
        <!-- ボタン -->
        <button class="button button-primary lw-block-insert-btn" 
                id="<?= esc_attr($config['button_id']) ?>"
                data-type-id="<?= esc_attr($type_id) ?>">
            <?= esc_html($config['button_text']) ?>
        </button>
        
        <!-- ポップアップ -->
        <div class="lw_custom_popup_block_list reset" id="popup-<?= esc_attr($type_id) ?>">
            <div class="lw_custom_list_popup_bg_filter lw_custom_popup_block_list_close"></div>
            <div class="lw_custom_popup_block_list__wraps">
                <div class="lw_custom_close lw_custom_popup_block_list_close"></div>
                <div class="lw_custom_block_grid" data-blocks='<?= esc_attr(json_encode($blocks_array)) ?>'>
                    <!-- ここに動的にブロックが挿入される -->
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * ブロック配列を処理（購入状態などを追加）
     */
    private function process_blocks_array($config) {
        $blocks_array = $config['blocks'];
        
        // デフォルトURLを設定
        $base_url = $config['base_url'] ?? $this->template_dir_uri . '/my-blocks/block_sample_list/';
        $css_url = $config['css_url'] ?? $this->template_dir_uri . '/my-blocks/build/';
        
        // 各ブロックにフルパスを設定
        foreach ($blocks_array as &$block) {
            // fileがフルパスでない場合は、base_urlを付与
            if (!empty($block['file']) && !filter_var($block['file'], FILTER_VALIDATE_URL)) {
                $block['file'] = $base_url . $block['file'];
            }
            
            // cssの処理（複数対応）
            if (!empty($block['css'])) {
                // 配列に正規化
                $css_array = is_array($block['css']) 
                    ? $block['css'] 
                    : array_map('trim', explode(',', $block['css']));
                
                // 各CSSファイルにフルパスを付与
                $css_full_paths = [];
                foreach ($css_array as $css_file) {
                    if (!empty($css_file)) {
                        if (filter_var($css_file, FILTER_VALIDATE_URL)) {
                            $css_full_paths[] = $css_file;
                        } else {
                            $css_full_paths[] = $css_url . $css_file;
                        }
                    }
                }
                
                // 配列として保存
                $block['css'] = $css_full_paths;
            }
            
            // imageがフルパスでない場合は、base_urlを付与
            if (!empty($block['image']) && !filter_var($block['image'], FILTER_VALIDATE_URL)) {
                $block['image'] = $base_url . $block['image'];
            }
            
            // 個別購入状態を追加
            if (class_exists('LwTemplateSetting')) {
                $templateSetting = new LwTemplateSetting();
                if ($block['premium']) {
                    $block_setting = $templateSetting->get_template_setting_by_id($block['name']);
                    $block['purchased'] = $block_setting && intval($block_setting['active_flag']) === 1;
                } else {
                    $block['purchased'] = false;
                }
            }
        }
        
        return $blocks_array;
    }
    
    /**
     * 共通JavaScriptを出力
     */
    private function render_common_javascript() {
        ?>
        <script>
        /* =============================================================
         * Lw汎用ブロック挿入システム JavaScript
         * =========================================================== */
        
        class LwBlockInsertManager {
            constructor() {
                this.blockTypes = {};
                this.lwIsCustomPremium = <?php
                    $is_subscription_active = lw_template_is_active('paid-lw-parts-sub-hbjkjhkljh', 'sub_pre_set');
                    $is_trial_active = false;
                    if (function_exists('lw_is_trial_active')) {
                        $is_trial_active = lw_is_trial_active();
                    }
                    echo ($is_subscription_active || $is_trial_active) ? 'true' : 'false';
                    
                ?>;
                
                this.lwExcludedBlocks = <?php
                    $excluded = function_exists('block_Outright_purchase_only') ? block_Outright_purchase_only() : [];
                    echo json_encode($excluded);
                ?>;
                
                // デフォルトCSSファイルのパス
                this.defaultCssFiles = <?php echo json_encode($this->default_css_files); ?>;
                
                this.init();
            }
            
            init() {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupAllBlockTypes();
                });
            }
            
            setupAllBlockTypes() {
                // すべてのブロック挿入ボタンを取得
                const insertButtons = document.querySelectorAll('.lw-block-insert-btn');
                
                insertButtons.forEach(button => {
                    const typeId = button.dataset.typeId;
                    const popup = document.querySelector(`#popup-${typeId}`);
                    
                    if (!popup) return;
                    
                    // body.wp-admin直下へ移動
                    this.moveToWpAdminTop(button);
                    this.moveToWpAdminTop(popup);
                    
                    // ボタンクリック処理を設定
                    button.addEventListener('click', () => {
                        this.showPopup(typeId, popup);
                    });
                    
                    // 閉じるボタンの設定
                    const closeButtons = popup.querySelectorAll('.lw_custom_popup_block_list_close');
                    closeButtons.forEach(closeBtn => {
                        closeBtn.addEventListener('click', () => {
                            popup.classList.remove('active');
                        });
                    });
                });
            }
            
            moveToWpAdminTop(node) {
                const wpAdmin = document.querySelector('body.wp-admin');
                if (!wpAdmin || !node) return;
                if (node.parentNode !== wpAdmin) {
                    wpAdmin.insertBefore(node, wpAdmin.firstChild);
                }
            }
            
            async showPopup(typeId, popup) {
                // ポップアップを表示
                popup.classList.add('active');
                
                const grid = popup.querySelector('.lw_custom_block_grid');
                if (!grid) return;
                
                // 初回のみブロック一覧を生成
                if (!popup.dataset.loaded) {
                    popup.dataset.loaded = '1';
                    
                    // ブロック配列を取得
                    const blocksArray = JSON.parse(grid.dataset.blocks || '[]');
                    
                    // グリッドをクリア
                    grid.innerHTML = '<div class="lw_custom_block_loading">ブロックを読み込み中...</div>';
                    
                    // ブロックプレビューを生成
                    const blockPromises = blocksArray.map(block => this.createBlockPreview(block));
                    const blockElements = await Promise.all(blockPromises);
                    
                    // グリッドに追加
                    grid.innerHTML = '';
                    blockElements.forEach(element => {
                        grid.appendChild(element);
                    });
                    
                    // ブロッククリック時の処理
                    grid.addEventListener('click', (e) => {
                        this.handleBlockClick(e, popup);
                    });
                }
            }
            
            async createBlockPreview(block) {
                const blockItem = document.createElement('div');
                
                const isExcluded = this.lwExcludedBlocks.includes(block.name);
                const isPurchased = block.purchased === true;
                const isLocked = block.premium && !this.lwIsCustomPremium && !isPurchased && !isExcluded;
                
                let additionalClasses = '';
                if (block.class) {
                    additionalClasses = ` ${block.class}`;
                }
                
                blockItem.className = `lw_custom_block_item${additionalClasses} ${isLocked ? 'lw_locked' : ''}`;
                blockItem.dataset.blockName = block.name;
                blockItem.dataset.blockFile = block.file;
                blockItem.dataset.isLocked = isLocked;
                blockItem.dataset.isExcluded = isExcluded;
                
                // プレビューを生成
                if (block.image) {
                    const imgElement = document.createElement('img');
                    imgElement.src = block.image;
                    imgElement.alt = block.name;
                    imgElement.style.width = '100%';
                    imgElement.style.height = 'auto';
                    imgElement.style.display = 'block';
                    
                    blockItem.appendChild(imgElement);
                } else {
                    await this.loadHtmlPreview(blockItem, block);
                }
                
                // バッジとオーバーレイを追加
                if (block.premium) {
                    if (isLocked) {
                        const badge = document.createElement('div');
                        badge.className = 'lw_premium_badge';
                        badge.textContent = isExcluded ? 'プレミアムプラン対象外' : 'プレミアム限定';
                        blockItem.appendChild(badge);
                        
                        const overlay = document.createElement('div');
                        overlay.className = 'lw_locked_overlay';
                        blockItem.appendChild(overlay);
                    } else if (isPurchased && !this.lwIsCustomPremium) {
                        const badge = document.createElement('div');
                        badge.className = 'lw_purchased_badge';
                        badge.textContent = '購入済み';
                        badge.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;';
                        blockItem.appendChild(badge);
                    }
                }
                
                return blockItem;
            }
            
            async loadHtmlPreview(blockItem, block) {
                blockItem.innerHTML = '<div class="lw_custom_block_loading">読み込み中...</div>';
                
                try {
                    const htmlResponse = await fetch(block.file);
                    let htmlContent = await htmlResponse.text();
                    
                    // HTMLコメントを除去
                    htmlContent = this.removeHTMLComments(htmlContent);
                    
                    // デフォルトCSSを最初に読み込む
                    let cssContent = '';
                    
                    // デフォルトCSSの読み込み
                    for (const defaultCssFile of this.defaultCssFiles) {
                        try {
                            const cssResponse = await fetch(defaultCssFile);
                            if (cssResponse.ok) {
                                cssContent += await cssResponse.text() + '\n';
                            }
                        } catch (cssError) {
                            console.log(`デフォルトCSS読み込みスキップ: ${defaultCssFile}`);
                        }
                    }
                    
                    // ブロック個別のCSSファイルが指定されている場合は取得（複数対応）
                    if (block.css) {
                        // 配列として扱う
                        const cssArray = Array.isArray(block.css) ? block.css : [block.css];
                        
                        // 複数のCSSを順番に読み込んで結合
                        for (const cssFile of cssArray) {
                            try {
                                const cssResponse = await fetch(cssFile);
                                if (cssResponse.ok) {
                                    cssContent += await cssResponse.text() + '\n';
                                }
                            } catch (cssError) {
                                console.log(`CSS読み込みスキップ: ${cssFile}`);
                            }
                        }
                    }
                    
                    // プレビューコンテナを作成
                    const previewContainer = document.createElement('div');
                    previewContainer.className = 'lw_custom_block_preview';
                    previewContainer.style.fontSize = '17px';
                    
                    // size='half'の場合にスタイルを適用
                    if (block.size === 'half') {
                        previewContainer.style.transform = 'scale(0.5)';
                    }
                    
                    // Shadow DOMを使用してスタイルを隔離
                    const shadowRoot = previewContainer.attachShadow({ mode: 'open' });
                    
                    // size='half'の場合のコンテンツスタイルを設定
                    const contentStyle = block.size === 'half' 
                        ? 'width: 200%; margin-left: -50%;' 
                        : '';
                    
                    shadowRoot.innerHTML = `
                        <style>
                            :host {
                                display: block;
                                width: 100%;
                                padding: 20px;
                                box-sizing: border-box;
                            }
                            ${cssContent}
                            a {
                                pointer-events: none;
                                display: inline-block;
                            }
                        </style>
                        <div 
                            class="lw_custom_block_content"
                            style="${contentStyle}"
                        >${htmlContent}</div>
                    `;
                    
                    blockItem.innerHTML = '';
                    blockItem.appendChild(previewContainer);
                    
                } catch (error) {
                    console.error(`ブロックのプレビュー生成エラー: ${block.name}`, error);
                    blockItem.innerHTML = `
                        <div class="lw_custom_block_loading">
                            プレビューを生成できませんでした<br>
                            <small>${block.name}</small>
                        </div>
                    `;
                }
            }
            
            removeHTMLComments(html) {
                return html.replace(/<!--[\s\S]*?-->/g, '');
            }
            
            handleBlockClick(e, popup) {
                const blockItem = e.target.closest('.lw_custom_block_item');
                if (!blockItem) return;
                
                const isLocked = blockItem.dataset.isLocked === 'true';
                const isExcluded = blockItem.dataset.isExcluded === 'true';
                
                if (isLocked) {
                    if (isExcluded) {
                        alert('このブロックはプレミアムプラン対象外です。個別購入が必要です。');
                    } else {
                        alert('このブロックはプレミアムメンバー限定です。');
                    }
                    return;
                }
                
                const filePath = blockItem.dataset.blockFile;
                if (filePath && wp && wp.data) {
                    this.insertBlock(filePath, popup);
                }
            }
            
            insertBlock(filePath, popup) {
                const editor = wp.data.select('core/block-editor');
                const selectedBlockId = editor.getSelectedBlockClientId();
                const insertionPoint = editor.getBlockInsertionPoint();
                
                const scrollContainer = document.querySelector('.interface-interface-skeleton__content');
                const initialScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
                
                fetch(filePath)
                    .then(res => res.text())
                    .then(async html => {
                        const blocks = wp.blocks.parse(html);
                        
                        const { insertBlocks } = wp.data.dispatch('core/block-editor');
                        
                        const insertedBlocks = await insertBlocks(
                            blocks,
                            insertionPoint.index,
                            insertionPoint.rootClientId
                        );
                        
                        popup.classList.remove('active');
                        
                        setTimeout(() => {
                            if (blocks.length > 0) {
                                const insertedBlockId = blocks[0].clientId;
                                
                                const blockElement = document.querySelector(`[data-block="${insertedBlockId}"]`);
                                if (blockElement) {
                                    // 復旧ボタンを探してクリック
                                    const recoverButtons = blockElement.querySelectorAll('button');
                                    for (let button of recoverButtons) {
                                        const buttonText = button.textContent;
                                        if (buttonText.includes('復旧') || 
                                            buttonText.includes('ブロックの復旧') ||
                                            buttonText.includes('Attempt Block Recovery')) {
                                            button.click();
                                            console.log('ブロックを自動復旧しました');
                                            break;
                                        }
                                    }
                                    
                                    wp.data.dispatch('core/block-editor').selectBlock(insertedBlockId);
                                    
                                    setTimeout(() => {
                                        blockElement.scrollIntoView({ 
                                            behavior: 'smooth', 
                                            block: 'center' 
                                        });
                                    }, 100);
                                } else if (scrollContainer) {
                                    scrollContainer.scrollTop = initialScrollTop;
                                }
                            }
                        }, 200);
                    })
                    .catch(err => {
                        console.error('ブロックの読み込みに失敗しました:', err);
                        alert('ブロックの読み込みに失敗しました。');
                    });
            }
        }
        
        // インスタンスを作成
        const lwBlockManager = new LwBlockInsertManager();
        </script>
        <?php
    }
}

?>