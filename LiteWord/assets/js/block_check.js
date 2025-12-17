// フィルタリング用の文字列配列
const FILTER_KEYWORDS = [
    "paid-block", "shin_gas_station"
];

// 無効なブロックを格納する配列
let disabledBlocksList = [];

// Gutenbergエディタが完全に読み込まれるまで待機
function waitForGutenbergAndListBlocks() {
    if (typeof wp === 'undefined' || !wp.data) {
        setTimeout(waitForGutenbergAndListBlocks, 500);
        return;
    }

    const isEditorReady = wp.data.select('core/editor');
    if (!isEditorReady) {
        setTimeout(waitForGutenbergAndListBlocks, 500);
        return;
    }

    wp.domReady(() => {
        const unsubscribe = wp.data.subscribe(() => {
            const blocks = wp.data.select('core/block-editor').getBlocks();
            
            if (blocks && blocks.length > 0) {
                unsubscribe();
                findFilteredBlocks();
            }
        });
    });
}

// フィルタリングされたブロック名を検索
function findFilteredBlocks(keywords = FILTER_KEYWORDS) {
    try {
        // 無効なブロックリストをリセット
        disabledBlocksList = [];
        
        // 1. 登録済みブロックから検索
        const registeredBlocks = [];
        const allBlocks = wp.data.select('core/block-editor').getBlocks();
        
        function searchRegisteredBlocks(blocks) {
            blocks.forEach(block => {
                if (block.name && !block.name.startsWith('core/')) {
                    // キーワードでフィルタリング
                    if (keywords.some(keyword => block.name.includes(keyword))) {
                        registeredBlocks.push(block.name);
                    }
                }
                
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    searchRegisteredBlocks(block.innerBlocks);
                }
            });
        }
        
        searchRegisteredBlocks(allBlocks);
        
        // 2. HTMLコメントから検索
        const htmlBlocks = [];
        const content = wp.data.select('core/editor').getEditedPostContent();
        const blockPattern = /<!-- wp:([^\s\{]+)(?:\s+\{[^}]*\})?\s*-->/g;
        
        let match;
        while ((match = blockPattern.exec(content)) !== null) {
            const blockName = match[1];
            // wdl/で始まり、キーワードを含むブロックのみ
            if (blockName.startsWith('wdl/') && keywords.some(keyword => blockName.includes(keyword))) {
                htmlBlocks.push(blockName);
            }
        }
        
        // 3. 結果を統合してユニークにする
        const allFoundBlocks = [...new Set([...registeredBlocks, ...htmlBlocks])];
        
        if (allFoundBlocks.length > 0) {
            allFoundBlocks.forEach(name => {
                // ブロックが無効化されているかチェック
                checkIfBlockIsDisabled(name);
            });
            
            // 無効なブロックが存在する場合、ポップアップを表示
            if (disabledBlocksList.length > 0) {
                showDisabledBlocksPopup();
            }
        }
        
        return allFoundBlocks;
        
    } catch (error) {
        console.error('エラーが発生しました:', error);
        return [];
    }
}

// ブロックが無効化されているかチェックする関数
function checkIfBlockIsDisabled(blockName) {
    let isDisabled = false;
    
    // ブロックタイプレジストリから該当のブロックを取得
    const blockType = wp.blocks.getBlockType(blockName);
    
    // ブロックタイプが見つからない場合は無効と判断
    if (!blockType) {
        isDisabled = true;
    }
    
    // ブロックの設定やサポート状況を確認
    else if (blockType.supports && blockType.supports.inserter === false) {
        isDisabled = true;
    }
    
    // カスタム属性で無効化フラグをチェック
    else if (blockType.attributes && blockType.attributes._disabled && blockType.attributes._disabled.default === true) {
        isDisabled = true;
    }
    
    // WordPress のグローバル変数やカスタムデータから無効化リストを確認
    else if (window.disabledCustomBlocks && window.disabledCustomBlocks.includes(blockName)) {
        isDisabled = true;
    }
    
    // 無効なブロックをリストに追加
    if (isDisabled && !disabledBlocksList.includes(blockName)) {
        disabledBlocksList.push(blockName);
    }
}

// カスタムキーワードで検索する関数
function searchBlocksByKeywords(keywords) {
    return findFilteredBlocks(keywords);
}

// ポップアップHTMLを作成して挿入する関数
function createPopupHTML() {
    const popup = document.createElement('div');
    popup.className = 'custom_block_check_alert_popup';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close_btn';
    closeBtn.textContent = '閉じる';
    
    const inner = document.createElement('div');
    inner.className = 'custom_block_check_alert_popup_inner';
    
    
    
    // パーツ名のリスト（シンプルな一覧）
    const blockListDiv = document.createElement('div');
    blockListDiv.className = 'disabled_blocks_list';
    
    const ul = document.createElement('ul');
    ul.className = 'block_names_list';
    
    // 無効なブロックをリストに追加（パーツ名のみ）
    disabledBlocksList.forEach(blockName => {
        const li = document.createElement('li');
        li.className = 'block_name_item';
        
        // blockSamplesから該当するブロック情報を検索（タイトル取得用）
        let displayName = blockName;
        if (typeof blockSamples !== 'undefined') {
            const blockId = blockName.replace('wdl/', '');
            const blockInfo = blockSamples.find(sample => 
                sample.id === blockId || 
                sample.file && sample.file.includes(blockId)
            );
            if (blockInfo && blockInfo.title) {
                displayName = blockInfo.title;
            }
        }
        
        li.textContent = displayName;
        ul.appendChild(li);
    });
    
    blockListDiv.appendChild(ul);
    
    // プレミアムプランへのリンク
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'premium_cta';
    
    const premiumButton = document.createElement('a');
    premiumButton.href = 'https://lite-word.com/yuryo-plan/';
    premiumButton.target = '_blank';
    premiumButton.className = 'premium_upgrade_button';
    premiumButton.textContent = 'プレミアムプランの詳細を見る';
    
    const supplementText = document.createElement('p');
    supplementText.className = 'supplement_text';
    supplementText.textContent = `このページでは、${disabledBlocksList.length}件のLiteWordフリーでは利用できない、デザインパーツが見つかりました。『LiteWordプレミアム』にアップグレードすると、デザインパーツが使い放題になります。`;
    
    ctaDiv.appendChild(supplementText);
    ctaDiv.appendChild(premiumButton);
    
    // 要素を組み立て
    inner.appendChild(blockListDiv);
    inner.appendChild(ctaDiv);
    popup.appendChild(closeBtn);
    popup.appendChild(inner);
    
    // 閉じるボタンのイベントリスナー
    closeBtn.addEventListener('click', function() {
        popup.classList.remove('active');
    });
    
    return popup;
}

// 無効なブロックのポップアップを表示する関数
function showDisabledBlocksPopup() {
    // 既存のポップアップを削除
    const existingPopup = document.querySelector('.custom_block_check_alert_popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // 新しいポップアップを作成
    const popup = createPopupHTML();
    
    // body要素に追加
    document.body.appendChild(popup);
    
    // activeクラスを追加（少し遅延させて、CSSアニメーションが動作するように）
    setTimeout(() => {
        popup.classList.add('active');
    }, 100);
}

// リセット関数（開発用）
function resetDisabledBlocksList() {
    disabledBlocksList = [];
    const popup = document.querySelector('.custom_block_check_alert_popup');
    if (popup) {
        popup.remove();
    }
}

// 自動実行
waitForGutenbergAndListBlocks();

// ブロックエラー警告を監視して書き換える関数
function watchAndModifyBlockWarnings() {
    // MutationObserverを使用してDOMの変更を監視
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 追加されたノードをチェック
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // block-editor-warningを探す
                    const warnings = node.classList && node.classList.contains('block-editor-warning')
                        ? [node]
                        : node.querySelectorAll ? node.querySelectorAll('.block-editor-warning') : [];

                    warnings.forEach(function(warning) {
                        modifyBlockWarning(warning);
                    });
                }
            });
        });
    });

    // 監視を開始（メインドキュメント）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // iframe内も監視する関数
    function observeIframe(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
                const iframeObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) {
                                const warnings = node.classList && node.classList.contains('block-editor-warning')
                                    ? [node]
                                    : node.querySelectorAll ? node.querySelectorAll('.block-editor-warning') : [];

                                warnings.forEach(function(warning) {
                                    modifyBlockWarning(warning);
                                });
                            }
                        });
                    });
                });

                iframeObserver.observe(iframeDoc.body, {
                    childList: true,
                    subtree: true
                });

                console.log('LiteWord: iframe監視を開始しました');
            }
        } catch (e) {
            console.log('LiteWord: iframe監視エラー:', e.message);
        }
    }

    // 既存のiframeを監視
    document.querySelectorAll('iframe[name="editor-canvas"]').forEach(observeIframe);

    // 新しく追加されるiframeも監視
    const iframeWatcher = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.tagName === 'IFRAME' && node.name === 'editor-canvas') {
                    // iframeの読み込みを待つ
                    node.addEventListener('load', function() {
                        observeIframe(node);
                    });
                }
            });
        });
    });

    iframeWatcher.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 既存の警告も処理
    processAllWarnings();

    // 定期的にチェック（タイミングの問題に対応）
    // 最初の10秒間は300msごと、次の10秒は1秒ごと、その後は3秒ごとにチェック
    let checkCount = 0;
    const intensiveCheckInterval = setInterval(() => {
        processAllWarnings();
        checkCount++;
        if (checkCount >= 33) { // 10秒後（300ms × 33回）
            clearInterval(intensiveCheckInterval);
            // 次の10秒間は1秒ごと
            let mediumCheckCount = 0;
            const mediumCheckInterval = setInterval(() => {
                processAllWarnings();
                mediumCheckCount++;
                if (mediumCheckCount >= 10) { // 10秒後
                    clearInterval(mediumCheckInterval);
                    // 以降は3秒ごとに継続チェック
                    setInterval(processAllWarnings, 3000);
                }
            }, 1000);
        }
    }, 300);
}

// すべての警告を処理する関数
function processAllWarnings() {
    // メインドキュメントの警告をチェック
    document.querySelectorAll('.block-editor-warning').forEach(warning => {
        modifyBlockWarning(warning);
    });

    // iframeの中もチェック（Gutenbergエディターはiframeを使用することがある）
    const iframes = document.querySelectorAll('iframe[name="editor-canvas"]');
    iframes.forEach(iframe => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
                iframeDoc.querySelectorAll('.block-editor-warning').forEach(warning => {
                    modifyBlockWarning(warning);
                });
            }
        } catch (e) {
            // クロスオリジンエラーの場合はスキップ
            console.log('LiteWord: iframe access error (expected for some iframes):', e.message);
        }
    });
}

// グローバルに公開
window.lwProcessAllBlockWarnings = processAllWarnings;

// ブロック警告を修正する関数
function modifyBlockWarning(warningElement) {
    // 既に処理済みならスキップ
    if (warningElement.dataset.lwProcessed) return;
    warningElement.dataset.lwProcessed = '1';

    const messageElement = warningElement.querySelector('.block-editor-warning__message');
    if (!messageElement) {
        // メッセージ要素がなくても復旧ボタンがあれば自動復旧を試みる
        autoRecoverBlock(warningElement);
        return;
    }

    const messageText = messageElement.textContent;

    // ブロック名を抽出（「wdl/xxx」の形式、または英語版）
    const blockNameMatch = messageText.match(/「([^」]+)」/) || messageText.match(/"([^"]+)"/);
    if (!blockNameMatch) {
        // ブロック名が取得できなくても自動復旧を試みる
        autoRecoverBlock(warningElement);
        return;
    }

    const blockName = blockNameMatch[1];

    // FILTER_KEYWORDSに含まれるブロックかチェック
    const isTargetBlock = FILTER_KEYWORDS.some(keyword => blockName.includes(keyword));

    // 対象外ブロック（標準ブロックやプレミアム以外）は自動復旧
    if (!isTargetBlock) {
        autoRecoverBlock(warningElement);
        return;
    }

    // メッセージを変更
    messageElement.textContent = `このサイトは「${blockName}」ブロックに対応していません。利用するにはプレミアムプランへのアップグレードが必要です。`;

    // ボタンコンテナを探す（なければ作成）
    let buttonContainer = warningElement.querySelector('.block-editor-warning__actions');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'block-editor-warning__actions';
        warningElement.appendChild(buttonContainer);
    }

    // 既存のボタンをクリア
    const existingButtons = buttonContainer.querySelectorAll('.components-button');
    existingButtons.forEach(btn => btn.remove());

    // プレミアムプランボタンのみ追加
    const premiumButton = document.createElement('button');
    premiumButton.textContent = 'プレミアムプランの詳細を見る';
    premiumButton.className = 'components-button is-primary lw-premium-button';
    premiumButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://lite-word.com/yuryo-plan/', '_blank');
    };

    // ボタンをコンテナに追加
    buttonContainer.appendChild(premiumButton);
}

// ブロックを自動復旧する関数
function autoRecoverBlock(warningElement) {
    // 既に自動復旧済みならスキップ
    if (warningElement.dataset.lwAutoRecovered) return;

    // 復旧ボタンを探す（複数のセレクタパターンに対応）
    const buttonSelectors = [
        '.block-editor-warning__action button',
        '.block-editor-warning__actions button',
        'button.components-button',
        '.components-button.is-secondary',
        'button[type="button"]'
    ];

    let recoverButton = null;

    // まず警告要素内のすべてのボタンを取得
    const allButtons = warningElement.querySelectorAll('button');

    for (const button of allButtons) {
        const buttonText = (button.textContent || '').trim();
        const ariaLabel = button.getAttribute('aria-label') || '';

        // 復旧関連のテキストをチェック
        if (buttonText.includes('復旧') ||
            buttonText.includes('ブロックの復旧を試行') ||
            buttonText.includes('Attempt') ||
            buttonText.includes('attempt') ||
            buttonText.includes('Recovery') ||
            buttonText.includes('recovery') ||
            buttonText.includes('回復') ||
            ariaLabel.includes('復旧') ||
            ariaLabel.includes('Attempt')) {
            recoverButton = button;
            break;
        }
    }

    if (recoverButton && !recoverButton.disabled) {
        // 自動復旧済みフラグを設定
        warningElement.dataset.lwAutoRecovered = '1';

        // 少し遅延させてクリック（DOMが完全に準備されるのを待つ）
        setTimeout(() => {
            try {
                recoverButton.click();
                console.log('LiteWord: ブロックを自動復旧しました');
            } catch (error) {
                console.error('LiteWord: 自動復旧に失敗しました', error);
            }
        }, 100);
    } else {
        // 復旧ボタンが見つからない場合、デバッグ情報を出力
        if (!warningElement.dataset.lwDebugLogged) {
            warningElement.dataset.lwDebugLogged = '1';
            console.log('LiteWord: 復旧ボタンが見つかりませんでした。利用可能なボタン:',
                Array.from(allButtons).map(b => b.textContent?.trim()));
        }
    }
}

// Gutenbergエディタが読み込まれたら監視を開始
if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(() => {
        setTimeout(() => {
            watchAndModifyBlockWarnings();
        }, 1000);
    });
} else {
    console.log('block_check: wp not available');
}

// === 使用例 ===
// デフォルトのキーワードで再検索
// findFilteredBlocks();

// カスタムキーワードで検索
// searchBlocksByKeywords(["lw-post-list", "content"]);

// 1つのキーワードで検索
// searchBlocksByKeywords(["paid"]);

// 無効なブロックリストをリセット
// resetDisabledBlocksList();

// グローバルスコープに公開（page-title-wizard.jsから呼び出せるように）
window.lwTriggerBlockWarningCheck = function() {
    if (typeof window.lwProcessAllBlockWarnings === 'function') {
        console.log('LiteWord: ブロック警告チェックをトリガーします');
        // 少し遅延させてから実行（DOMの準備を待つ）
        setTimeout(function() {
            window.lwProcessAllBlockWarnings();
        }, 500);
        // さらに1秒後にもう一度実行（念のため）
        setTimeout(function() {
            window.lwProcessAllBlockWarnings();
        }, 1500);
    } else {
        console.error('LiteWord: lwProcessAllBlockWarnings が見つかりません');
    }
};