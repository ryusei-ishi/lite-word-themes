//カスタム投稿メディアライブラリ -------------------------------
jQuery(document).ready(function () {
  function buildMedia(self) {
    return wp.media({
      title: self.data("title"),
      library: { type: self.data("library") },
      frame: self.data("frame"),
      button: { text: self.data("button") },
      multiple: self.data("multiple"),
    });
  }

  var setMedia = {};

  jQuery(".costom_post_media_select .add_upload_media").on(
    "click",
    function (event) {
      event.preventDefault();

      var self = jQuery(this);
      var targetId = self.data("targetid");

      // キャッシュが存在する場合はそれを再利用
      if (setMedia[targetId]) {
        setMedia[targetId].open();
        return;
      }

      // メディアビルド
      setMedia[targetId] = buildMedia(self);

      // ファイル選択時の動作
      setMedia[targetId].on("select", function () {
        var media = setMedia[targetId]
          .state()
          .get("selection")
          .first()
          .toJSON();
        var $targetUrl = jQuery("#" + targetId + "_url");
        var $targetId = jQuery("#" + targetId + "_id");
        var $targetPreview = jQuery("#" + targetId + "_preview");

        $targetUrl.val(media.url);
        $targetId.val(media.id);

        // 過去のプレビューが存在すれば削除
        var pastPreview = document.getElementById(targetId + "_past_preview");
        if (pastPreview) {
          pastPreview.remove();
        }

        // プレビュー表示
        if (self.data("preview") === true) {
          var $mediaElement;
          if (/\.(mp4|avi|fiv|mov|wmv)$/i.test(media.url)) {
            $mediaElement = jQuery("<video>").attr("src", media.url);
          } else {
            $mediaElement = jQuery("<img>").attr("src", media.url);
          }
          $targetPreview.html($mediaElement);
        }
      });

      // モーダルを展開
      setMedia[targetId].open();
    }
  );

  // 削除イベント
  jQuery(".costom_post_media_select .remove_upload_media").on(
    "click",
    function (event) {
      event.preventDefault();

      var self = jQuery(this);
      var targetId = self.data("targetid");

      if (confirm("ファイルを削除しますか？")) {
        jQuery("#" + targetId + "_url").val("");
        jQuery("#" + targetId + "_id").val("");
        jQuery("#" + targetId + "_preview").empty();

        var pastPreview = document.getElementById(targetId + "_past_preview");
        if (pastPreview) {
          pastPreview.remove();
        }
      }
    }
  );
});
//カスタム投稿 selectで表示非表示 -------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // セレクトボックスの選択に基づいてactiveクラスを更新する関数
  function updateActiveClasses(selectElement) {
    var relatedClasses = selectElement
      .closest(".Lw_edit_style")
      .querySelectorAll("dt, dd");

    // すべての関連クラスからactiveを削除
    relatedClasses.forEach(function (elm) {
      elm.classList.remove("visible_section");
    });

    // 選択されたオプションのクラスにactiveを追加
    var selectedValue = selectElement.value.trim(); // 余分なスペースを削除
    if (selectedValue) {
      // 未選択の時に処理をスキップする
      var activeElements = selectElement
        .closest(".Lw_edit_style")
        .querySelectorAll("." + selectedValue);
      activeElements.forEach(function (elm) {
        elm.classList.add("visible_section");
      });
    }
  }

  // ページ内のすべてのセレクトボックスに対して初期状態のクラスを制御
  document
    .querySelectorAll(".Lw_input_select_switch")
    .forEach(function (selectElement) {
      updateActiveClasses(selectElement);

      // セレクトボックスの変更イベントでクラスを更新
      selectElement.addEventListener("change", function () {
        updateActiveClasses(selectElement);
      });
    });
});





// /assets/js/lw-color-picker-sync.js
(() => {
	const HEX_RE = /^#?[0-9A-Fa-f]{6}$/;

	/* -------------------------------------------------- *
	 * 対象 1 個を初期化                                    *
	 * -------------------------------------------------- */
	function initPicker(picker) {
		if (picker.dataset.lwColorSync) return;           // 二重処理防止

		// テキスト入力欄を生成
		const codeInput = document.createElement('input');
		codeInput.type        = 'text';
		codeInput.placeholder = '#RRGGBB';
		codeInput.value       = picker.value;
		codeInput.className   = 'Lw_color_code';

		picker.insertAdjacentElement('afterend', codeInput);

		// テキスト欄 → ピッカー
		codeInput.addEventListener('input', e => {
			let v = e.target.value.trim();
			if (HEX_RE.test(v)) {
				if (v[0] !== '#') v = '#' + v;
				picker.value = v;
			}
		});

		// ピッカー → テキスト欄
		picker.addEventListener('input', e => {
			codeInput.value = e.target.value;
		});

		picker.dataset.lwColorSync = '1';
	}

	/* 初期ロード分 */
	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll('input[type="color"].Lw_color_picker').forEach(initPicker);
	});

	/* 動的に挿入された場合（Gutenberg の再レンダーなど） */
	const obs = new MutationObserver(mutations => {
		mutations.forEach(m => {
			m.addedNodes.forEach(node => {
				if (node.nodeType === 1) { // ELEMENT_NODE
					if (node.matches?.('input[type="color"].Lw_color_picker')) {
						initPicker(node);
					}
					// 子孫にある場合
					node.querySelectorAll?.('input[type="color"].Lw_color_picker').forEach(initPicker);
				}
			});
		});
	});
	obs.observe(document.body, { childList: true, subtree: true });
})();


/**
 * ブロック自動復旧機能
 * ※ block_check.js に移行済み（iframe対応のため）
 * このファイルの処理は block_check.js の autoRecoverBlock() で実行されます
 */


/**
 * ローディング（投稿・固定ページ編集画面用）
 */
(function() {
    'use strict';
    
    // 現在のURLをチェック
    const currentURL = window.location.href;
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // ローディングを表示すべきページかチェック
    const shouldShowLoader = () => {
        // 投稿・固定ページの編集画面
        if (pathname.includes('/wp-admin/post.php') && searchParams.get('action') === 'edit') {
            return true;
        }
        
        // 新規投稿作成画面
        if (pathname.includes('/wp-admin/post-new.php')) {
            return true;
        }
        
        // Gutenbergエディタが有効な場合の追加チェック（オプション）
        // カスタム投稿タイプの編集画面も含める場合
        if (pathname.includes('/wp-admin/') && 
            (currentURL.includes('post.php') || currentURL.includes('post-new.php'))) {
            return true;
        }
        
        return false;
    };
    
    // 対象ページでない場合は処理を終了
    if (!shouldShowLoader()) {
        return;
    }
    
    // ローダーHTML作成
    const loaderHTML = `
        <div id="gutenberg-loader" class="gutenberg-loader is-visible">
            <div class="gutenberg-loader__overlay">
                <div class="gutenberg-loader__container">
                    <div class="gutenberg-loader__spinner">
                        <div class="gutenberg-loader__circle"></div>
                        <div class="gutenberg-loader__circle"></div>
                        <div class="gutenberg-loader__circle"></div>
                    </div>
                    <div class="gutenberg-loader__text">
                        <span>読み込み中</span>
                        <span class="gutenberg-loader__dots">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // ローダー挿入
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
    
    // ローダー削除関数
    function removeLoader() {
        const loader = document.getElementById('gutenberg-loader');
        if (loader) {
            loader.remove();
        }
    }
    
    // ページ読み込み完了時に削除
    if (document.readyState === 'complete') {
        removeLoader();
    } else {
        window.addEventListener('load', removeLoader);
    }
    
    // 5秒後に必ず削除
    setTimeout(removeLoader, 5000);
    
})();


/**
 * カラー入力のリセットボタン機能
 */
document.addEventListener('DOMContentLoaded', function() {
    const resetButtons = document.querySelectorAll('.lw-color-reset');
    
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const colorInput = document.getElementById(targetId);
            
            if (colorInput) {
                const defaultValue = colorInput.getAttribute('data-default');
                colorInput.value = defaultValue;
            }
        });
    });
});