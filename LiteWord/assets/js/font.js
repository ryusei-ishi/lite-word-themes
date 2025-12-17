// ★ グローバル変数の初期化（安全のため）
if (!window.LW_loadedFonts) {
  window.LW_loadedFonts = new Set();
}

// Google Fonts用の preconnect タグを追加する関数（重複防止）
function addGoogleFontsPreconnect() {
  if (!window.LW_preconnectLoaded) {
    ["https://fonts.googleapis.com", "https://fonts.gstatic.com"].forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      if (url.includes("gstatic")) link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
    window.LW_preconnectLoaded = true;
  }
}

// Googleフォントリンクを動的に追加する関数（重複防止）
function loadGoogleFonts(fontSetValues) {
  fontSetValues.forEach((font) => {
    // 既に読み込み済みならスキップ
    if (window.LW_loadedFonts.has(font)) {
      return;
    }

    const fontCDNLink = LW_fontCDNs[font];
    if (fontCDNLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontCDNLink;
      document.head.appendChild(link);
      
      // 読み込み済みとしてマーク
      window.LW_loadedFonts.add(font);
    }
  });
}

// DOMの読み込み完了後に実行
document.addEventListener("DOMContentLoaded", () => {
  // ページ内のすべての `data-lw_font_set` 属性の値を取得し、重複を排除して配列に格納
  const fontSetValues = Array.from(document.querySelectorAll('[data-lw_font_set]'))
    .map(element => element.getAttribute('data-lw_font_set'))
    .filter((value, index, self) => value && self.indexOf(value) === index);

  // Google Fonts の preconnect を設定
  addGoogleFontsPreconnect();

  // 必要なフォントを読み込み
  loadGoogleFonts(fontSetValues);
});