/**
 * LiteWord Web Font Loader（ブロックエディタ iframe 対応）
 *
 * 背景:
 *   WordPress 7.0 でブロックエディタの編集キャンバスが classic テーマでも
 *   <iframe name="editor-canvas"> 化された。従来 font.js は外側 document しか
 *   見ていなかったため、iframe 内のテキストに Google Fonts が読み込まれず、
 *   フォント変更がエディタ内に反映されなくなった。
 *
 * 役割（iframe 専任。外側 document は font.js が担当する）:
 *   - iframe（編集キャンバス）の出現・load を監視する
 *   - iframe 内の [data-lw_font_set] を検出し、iframe の <head> にフォントを注入する
 *   - フォント適用（data-lw_font_set の付与/変更）を MutationObserver で監視し、
 *     変更時に再注入してライブ反映する
 *
 * 依存: font.js（window.LW_injectFontsIntoDoc / LW_scanFontSets）
 *       このスクリプトはエディタ画面でのみ読み込まれる（フロントには影響しない）
 */
(function () {
  "use strict";

  var IFRAME_SELECTOR = 'iframe[name="editor-canvas"], iframe.editor-canvas';
  var RESCAN_DEBOUNCE = 150; // フォント変更時の再注入デバウンス(ms)

  var started = false;       // start() の二重初期化防止
  var rescanTimer = null;

  // 編集キャンバス iframe の document を取得（クロスオリジン時は null）
  function getEditorDoc() {
    var iframe = document.querySelector(IFRAME_SELECTOR);
    if (!iframe) return null;
    try {
      return iframe.contentDocument ||
        (iframe.contentWindow && iframe.contentWindow.document) || null;
    } catch (e) {
      return null;
    }
  }

  // フォント定義CSS（[data-lw_font_set] への font-family）を iframe の <head> に注入する。
  // WP7.0 では font_style.min.css が iframe にコピーされないため、block_style.js と同じく
  // JS で直接注入する。URL は editor.php の wp_localize_script（LW_FONT_ASSETS）で渡される。
  // id 付きで重複防止。iframe 再生成時は新 document なので改めて注入される。
  function injectFontStyleCss(editorDoc) {
    if (!editorDoc || !editorDoc.head) return;
    if (typeof window.LW_FONT_ASSETS === "undefined" || !window.LW_FONT_ASSETS.fontStyleCss) return;
    if (editorDoc.getElementById("lw-font-style-iframe")) return;
    var link = editorDoc.createElement("link");
    link.id = "lw-font-style-iframe";
    link.rel = "stylesheet";
    link.href = window.LW_FONT_ASSETS.fontStyleCss;
    editorDoc.head.appendChild(link);
  }

  // iframe 内を走査してフォントを注入（外側 document は font.js が担当するので扱わない）
  function rescanAndInject() {
    if (typeof window.LW_injectFontsIntoDoc !== "function") return; // font.js 未読み込み
    var editorDoc = getEditorDoc();
    if (!editorDoc || !editorDoc.body) return;
    window.LW_injectFontsIntoDoc(editorDoc, window.LW_scanFontSets(editorDoc));
  }

  function scheduleRescan() {
    clearTimeout(rescanTimer);
    rescanTimer = setTimeout(rescanAndInject, RESCAN_DEBOUNCE);
  }

  // iframe 内の DOM 変化（フォント適用 = data-lw_font_set 付与/変更、ブロック追加）を監視
  function observeEditorDoc(editorDoc) {
    if (!editorDoc || !editorDoc.body) return;

    // 同一 document に対する二重 observe を防ぐ。iframe 再生成時は新しい document に
    // なるためこのフラグは無く、改めて observe される（古い observer は document ごと破棄）。
    if (editorDoc._lwFontObserver) {
      editorDoc._lwFontObserver.disconnect();
    }

    injectFontStyleCss(editorDoc); // font-family 定義CSSを iframe に注入
    rescanAndInject();             // 必要な Google Fonts(webフォント) を iframe に注入

    var observer = new MutationObserver(scheduleRescan);
    observer.observe(editorDoc.body, {
      childList: true,                       // ブロック追加（属性付きノードの挿入）を検出
      subtree: true,
      attributes: true,
      attributeFilter: ["data-lw_font_set"]  // フォント適用による属性変更を検出
    });
    editorDoc._lwFontObserver = observer;
  }

  // iframe を取得できたら observe を仕掛ける
  function attach() {
    var editorDoc = getEditorDoc();
    if (editorDoc) observeEditorDoc(editorDoc);
  }

  // iframe 要素に load リスナーを一度だけ束ねる（reload 毎に attach が再実行される）
  function bindIframeLoad(iframe) {
    if (!iframe || iframe._lwFontLoadBound) return;
    iframe._lwFontLoadBound = true;
    iframe.addEventListener("load", attach);
  }

  // iframe の出現・load を監視して observe を仕掛ける
  function watchForIframe() {
    var attempts = 0;
    var maxAttempts = 60; // 最大約30秒（500ms × 60）

    var tryAttach = function () {
      var iframe = document.querySelector(IFRAME_SELECTOR);
      if (!iframe) return false;
      bindIframeLoad(iframe);
      attach(); // 既に読込済みのケースに対応（重複は observeEditorDoc 側で吸収）
      return true;
    };

    if (!tryAttach()) {
      // まだ無ければ定期チェック（取りこぼし防止）
      var poll = setInterval(function () {
        attempts++;
        if (tryAttach() || attempts >= maxAttempts) clearInterval(poll);
      }, 500);
    }

    // iframe が後から差し込まれる場合に備えて DOM 追加も監視
    var domObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes || [], function (node) {
          if (node.tagName === "IFRAME" &&
              (node.name === "editor-canvas" ||
                (node.classList && node.classList.contains("editor-canvas")))) {
            bindIframeLoad(node);
          }
        });
      });
    });
    domObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function start() {
    if (started) return;
    started = true;
    watchForIframe();
  }

  if (window.wp && window.wp.domReady) {
    window.wp.domReady(start);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
