/**
 * LiteWord Web Font Loader（共有ヘルパー + 外側ドキュメント用ローダー）
 *
 * 役割:
 *   - [data-lw_font_set] を走査し、必要な Google Fonts を該当 document の <head> に動的注入する
 *   - 任意の document を対象にできる注入ヘルパーを window に公開する（font_set.js が iframe 用に利用）
 *
 * 注意:
 *   - フロントエンドではこの font.js のみが読み込まれ、document（=ページ本体）に対して動作する
 *   - 既読判定は「対象 document の <head> に当該フォントの <link> が既にあるか」で行う
 *     （外側 document と iframe document は別物なので、グローバル変数では共有しない）
 */
(function () {
  "use strict";

  // 指定 document の <head> に preconnect を一度だけ追加
  function ensurePreconnect(targetDoc) {
    if (!targetDoc || !targetDoc.head) return;
    if (targetDoc.querySelector('link[data-lw-font-preconnect]')) return;
    ["https://fonts.googleapis.com", "https://fonts.gstatic.com"].forEach(function (url) {
      var link = targetDoc.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      link.setAttribute("data-lw-font-preconnect", "1");
      if (url.indexOf("gstatic") !== -1) link.crossOrigin = "anonymous";
      targetDoc.head.appendChild(link);
    });
  }

  // 指定 document 内の [data-lw_font_set] からフォント名一覧を取得（重複排除）
  function scanFontSets(scopeDoc) {
    if (!scopeDoc) return [];
    return Array.prototype.slice
      .call(scopeDoc.querySelectorAll("[data-lw_font_set]"))
      .map(function (el) { return el.getAttribute("data-lw_font_set"); })
      .filter(function (value, index, self) {
        return value && self.indexOf(value) === index;
      });
  }

  // 対象 document の <head> に当該フォントの <link> が既にあるか
  function hasFontLink(targetDoc, font) {
    var links = targetDoc.querySelectorAll('link[data-lw-font]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-lw-font") === font) return true;
    }
    return false;
  }

  // 指定 document の <head> に Google Fonts の <link> を注入（重複防止）
  function injectFontsIntoDoc(targetDoc, fontNames) {
    if (!targetDoc || !targetDoc.head) return;
    if (typeof LW_fontCDNs === "undefined") return; // font_cdn.js 未読み込み時は何もしない
    if (!fontNames || !fontNames.length) return;
    ensurePreconnect(targetDoc);
    fontNames.forEach(function (font) {
      var cdn = LW_fontCDNs[font];
      if (!cdn) return; // システムフォント（gothic/mincho 等）は CDN 不要
      if (hasFontLink(targetDoc, font)) return;
      var link = targetDoc.createElement("link");
      link.rel = "stylesheet";
      link.href = cdn;
      link.setAttribute("data-lw-font", font);
      targetDoc.head.appendChild(link);
    });
  }

  // 走査 + 注入のショートカット（scopeDoc 未指定時は targetDoc を走査）
  function loadFontsForDoc(targetDoc, scopeDoc) {
    injectFontsIntoDoc(targetDoc, scanFontSets(scopeDoc || targetDoc));
  }

  // 他スクリプト（font_set.js の iframe 対応）から使えるよう公開
  window.LW_injectFontsIntoDoc = injectFontsIntoDoc;
  window.LW_scanFontSets = scanFontSets;
  window.LW_loadFontsForDoc = loadFontsForDoc;

  // 外側 document 用（フロントエンド / iframe 非対応のクラシック編集画面のフォールバック）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadFontsForDoc(document, document);
    });
  } else {
    loadFontsForDoc(document, document);
  }
})();
