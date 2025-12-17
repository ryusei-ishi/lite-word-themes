document.addEventListener("DOMContentLoaded", () => {
  // ★ グローバル変数の初期化（安全のため）
  if (!window.LW_loadedFonts) {
    window.LW_loadedFonts = new Set();
  }

  // MutationObserverを使って指定した要素が追加されるのを監視する関数
  function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          const element = document.querySelector(selector);
          if (element && !element.classList.contains("processed")) {
            observer.disconnect();
            element.classList.add("processed");
            callback(element);
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // フォントのCDNを動的に読み込む関数（重複防止）
  function loadFontCDNs(fontSet) {
    // Google Fontsのpreconnectの設定（重複防止）
    if (!window.LW_preconnectLoaded) {
      const preconnectUrls = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
      preconnectUrls.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = url;
        if (url.includes("gstatic")) link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
      window.LW_preconnectLoaded = true;
    }

    // フォントのCDNを動的に追加（重複防止）
    fontSet.forEach((font) => {
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

  // .wp-block-post-contentが表示されるのを待機して、2秒後にフォントCDNを読み込む処理を実行
  waitForElement(".wp-block-post-content", (editorContent) => {
    // 2秒後にフォントのCDNを読み込み
    setTimeout(() => {
      const fontSetValues = Array.from(document.querySelectorAll('[data-lw_font_set]'))
        .map(element => element.getAttribute('data-lw_font_set'))
        .filter((value, index, self) => value && self.indexOf(value) === index);

      // フォントのCDNを動的に読み込む
      loadFontCDNs(fontSetValues);
    }, 2000);
  });
});