/**
 * 固定ページタイトル・スラッグ入力ポップアップ
 * タイトルがnullまたは空の場合にポップアップを表示
 * 新規ページの場合は既存のブロック挿入モーダルを表示
 */
(function() {
    'use strict';

    // DOMの準備完了を待つ
    wp.domReady(function() {
        // Gutenbergエディタの読み込みを待つ
        setTimeout(checkAndShowPopup, 500);
    });

    function checkAndShowPopup() {
        // wp.dataが利用可能かチェック
        if (typeof wp === 'undefined' || typeof wp.data === 'undefined') {
            setTimeout(checkAndShowPopup, 300);
            return;
        }

        var editor = wp.data.select('core/editor');
        if (!editor) {
            setTimeout(checkAndShowPopup, 300);
            return;
        }

        // エディタの準備が完了するまで待つ
        var post = editor.getCurrentPost();
        if (!post || typeof post.id === 'undefined') {
            setTimeout(checkAndShowPopup, 300);
            return;
        }

        // タイトルを取得
        var title = editor.getEditedPostAttribute('title');

        // タイトルがnull、undefined、または空文字の場合にポップアップを表示
        if (title === null || title === undefined || title === '') {
            showTitlePopup();
        }
    }

    function showTitlePopup() {
        // 既にポップアップが存在する場合は何もしない
        if (document.querySelector('.lw-title-popup-overlay')) {
            return;
        }

        // 公開済みかどうかを判定
        var isPublished = lwPageTitleWizard.isPublished;
        var currentSlug = lwPageTitleWizard.currentSlug || '';
        var buttonText = isPublished ? '確定して更新' : '確定して下書き保存';
        var savingText = isPublished ? '更新中...' : '保存中...';

        // オーバーレイを作成
        var overlay = document.createElement('div');
        overlay.className = 'lw-title-popup-overlay';

        // 戻るボタン（投稿タイプに応じてリンク先を変更）
        var backBtn = document.createElement('a');
        backBtn.className = 'lw-title-popup-back';
        backBtn.href = lwPageTitleWizard.isPage ? 'edit.php?post_type=page' : 'edit.php';
        backBtn.innerHTML =
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>' +
            '</svg>' +
            '<span>戻る</span>';
        overlay.appendChild(backBtn);

        // ポップアップ本体
        var popup = document.createElement('div');
        popup.className = 'lw-title-popup';

        // スラッグは常に必須（既存の値があれば表示）
        var slugValue = currentSlug || '';

        // タイトル推奨文字数
        var titleRecommended = 32;
        var titleWarning = 28;

        popup.innerHTML =
            '<h2>ページ設定</h2>' +
            '<p class="lw-title-popup-subtitle">ページの基本情報を入力してください</p>' +
            '<div class="lw-title-popup-field">' +
                '<label class="lw-title-popup-label">タイトル<span class="required">*</span></label>' +
                '<input type="text" class="lw-title-popup-input" id="lw-title-input" placeholder="ページのタイトルを入力" autofocus />' +
                '<p class="lw-title-popup-counter" id="lw-title-counter"><span id="lw-title-count">0</span> / ' + titleRecommended + '文字</p>' +
            '</div>' +
            '<div class="lw-title-popup-field">' +
                '<label class="lw-title-popup-label">スラッグ（URL）<span class="required">*</span></label>' +
                '<input type="text" class="lw-title-popup-input" id="lw-slug-input" placeholder="page-slug" value="' + slugValue + '" />' +
                '<p class="lw-title-popup-hint">半角英数字とハイフンのみ使用できます</p>' +
            '</div>' +
            '<button type="button" class="lw-title-popup-btn">' + buttonText + '</button>';

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // 入力フィールドを取得
        var titleInput = popup.querySelector('#lw-title-input');
        var slugInput = popup.querySelector('#lw-slug-input');
        var btn = popup.querySelector('.lw-title-popup-btn');
        var titleCounter = popup.querySelector('#lw-title-counter');
        var titleCount = popup.querySelector('#lw-title-count');

        // タイトル文字数カウンター更新
        function updateTitleCounter() {
            var length = titleInput.value.length;
            titleCount.textContent = length;

            titleCounter.classList.remove('warning', 'over');
            if (length > titleRecommended) {
                titleCounter.classList.add('over');
            } else if (length >= titleWarning) {
                titleCounter.classList.add('warning');
            }
        }

        // タイトル入力時に文字数をカウント
        titleInput.addEventListener('input', updateTitleCounter);

        setTimeout(function() {
            titleInput.focus();
        }, 100);

        // スラッグ入力時に自動的にサニタイズ
        slugInput.addEventListener('input', function() {
            // 英数字とハイフン以外を除去、小文字に変換
            var sanitized = slugInput.value
                .toLowerCase()
                .replace(/[^a-z0-9\-]/g, '-')
                .replace(/--+/g, '-')
                .replace(/^-|-$/g, '');
            slugInput.value = sanitized;
        });

        // Enterキーで確定（タイトルフィールドからスラッグへ移動、スラッグから保存）
        titleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                slugInput.focus();
            }
        });

        slugInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveTitle();
            }
        });

        // ボタンクリックで確定
        btn.addEventListener('click', function() {
            saveTitle();
        });

        function saveTitle() {
            var titleValue = titleInput.value.trim();
            var slugValue = slugInput.value.trim();

            // エラー状態をリセット
            titleInput.classList.remove('error');
            slugInput.classList.remove('error');

            var hasError = false;

            // タイトルは必須
            if (!titleValue) {
                titleInput.classList.add('error');
                titleInput.focus();
                hasError = true;
            }

            // スラッグは常に必須
            if (!slugValue) {
                slugInput.classList.add('error');
                if (!hasError) {
                    slugInput.focus();
                }
                hasError = true;
            }

            if (hasError) {
                return;
            }

            btn.disabled = true;
            btn.textContent = savingText;

            // Gutenbergのタイトルを更新
            wp.data.dispatch('core/editor').editPost({ title: titleValue });

            // スラッグも更新（Gutenbergに反映）
            if (slugValue) {
                wp.data.dispatch('core/editor').editPost({ slug: slugValue });
            }

            // AJAXで保存
            var formData = new FormData();
            formData.append('action', 'lw_save_page_title');
            formData.append('post_id', lwPageTitleWizard.postId);
            formData.append('title', titleValue);
            formData.append('slug', slugValue);
            formData.append('is_published', isPublished ? 'true' : 'false');
            formData.append('nonce', lwPageTitleWizard.nonce);

            fetch(lwPageTitleWizard.ajaxUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    // ポップアップを閉じる
                    overlay.remove();

                    // ブロック警告の自動復旧処理をトリガー（壊れたブロックがある場合に対応）
                    if (typeof window.lwTriggerBlockWarningCheck === 'function') {
                        console.log('LiteWord: page-title-wizard から自動復旧をトリガーします');
                        window.lwTriggerBlockWarningCheck();
                    } else {
                        console.error('LiteWord: lwTriggerBlockWarningCheck が見つかりません');
                    }

                    // 新規の固定ページの場合のみブロック挿入モーダルを表示
                    if (lwPageTitleWizard.isNewPage && lwPageTitleWizard.isPage) {
                        // カスタムブロックが既に存在するかチェック
                        var hasCustomBlocks = checkForCustomBlocks();

                        // カスタムブロックが存在しない場合のみモーダルを開く
                        if (!hasCustomBlocks) {
                            // 既存のブロック挿入モーダルを開くイベントを発火（ファーストビューカテゴリーを指定）
                            var openModalEvent = new CustomEvent('lwOpenBlockInsertModal', {
                                detail: { category: 'lw-firstview' }
                            });
                            document.dispatchEvent(openModalEvent);
                        }
                    } else {
                        // 新規作成の場合、保存された投稿のページにリダイレクト
                        if (lwPageTitleWizard.postId === 0 && data.data.post_id) {
                            window.location.href = 'post.php?post=' + data.data.post_id + '&action=edit';
                        } else {
                            // Gutenbergの保存状態を更新
                            wp.data.dispatch('core/editor').savePost();
                        }
                    }
                } else {
                    alert(data.data.message || '保存に失敗しました');
                    btn.disabled = false;
                    btn.textContent = buttonText;
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert('保存中にエラーが発生しました');
                btn.disabled = false;
                btn.textContent = buttonText;
            });
        }
    }

    function checkForCustomBlocks() {
        if (typeof wp === 'undefined' || typeof wp.data === 'undefined') {
            return false;
        }

        var blockEditor = wp.data.select('core/block-editor');
        if (!blockEditor) {
            return false;
        }

        var blocks = blockEditor.getBlocks();

        function hasWdlBlock(blockList) {
            for (var i = 0; i < blockList.length; i++) {
                var block = blockList[i];
                if (block.name && block.name.startsWith('wdl/')) {
                    return true;
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    if (hasWdlBlock(block.innerBlocks)) {
                        return true;
                    }
                }
            }
            return false;
        }

        return hasWdlBlock(blocks);
    }
})();
