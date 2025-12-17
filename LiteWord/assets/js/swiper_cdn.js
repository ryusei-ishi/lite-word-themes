(function () {
  // 既に実行されているかチェック（重複実行防止）
  if (window.lw_swiperLoaderInitialized) {
    return;
  }
  window.lw_swiperLoaderInitialized = true;
  
  document.addEventListener("DOMContentLoaded", function () {
    let lw_swiperLoaded = false;

    // MyThemeSettingsの存在確認
    if (typeof MyThemeSettings === 'undefined') {
      return;
    }

    // 既にSwiperが読み込まれているかチェック
    if (typeof Swiper !== 'undefined') {
      const event = new CustomEvent("lw:swiperReady");
      window.dispatchEvent(event);
      document.dispatchEvent(event);
      return;
    }

    // .swiper が出てきたらテーマ内のSwiperを読み込む（1回だけ）
    function lw_waitForElement(selector, callback) {
      // 初回チェック
      const existingElements = document.querySelectorAll(selector);
      if (existingElements.length > 0 && !lw_swiperLoaded) {
        lw_swiperLoaded = true;
        callback(existingElements);
        return;
      }
      
      // MutationObserverで監視
      const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 && !lw_swiperLoaded) {
          lw_swiperLoaded = true;
          observer.disconnect();
          callback(elements);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // テーマ内のSwiperファイルを読み込み
    function lw_loadSwiperFromTheme(callback) {
      // 既に読み込み中または読み込み済みの場合はスキップ
      if (window.lw_swiperLoadingInProgress || window.lw_swiperLoadComplete) {
        if (window.lw_swiperLoadComplete && callback) {
          callback();
        }
        return;
      }
      
      window.lw_swiperLoadingInProgress = true;
      
      // theme_Url（アンダースコア付き）を使用
      const themeUrl = MyThemeSettings.theme_Url;
      
      if (!themeUrl) {
        window.lw_swiperLoadingInProgress = false;
        return;
      }
      
      // CSS読み込み
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = themeUrl + "/assets/css/swiper.min.css";
      document.head.appendChild(link);

      // JS読み込み
      const script = document.createElement("script");
      script.src = themeUrl + "/assets/js/swiper.min.js";
      script.async = false;
      
      script.onload = function() {
        // 少し待機してからチェック（モバイル対応）
        setTimeout(() => {
          if (typeof Swiper !== 'undefined') {
            window.lw_swiperLoadComplete = true;
            window.lw_swiperLoadingInProgress = false;
            
            // コールバック実行
            if (callback) callback();
            
            // グローバルイベント発火
            const event = new CustomEvent("lw:swiperReady", {
              bubbles: true,
              detail: { loaded: true }
            });
            window.dispatchEvent(event);
            document.dispatchEvent(event);
          } else {
            window.lw_swiperLoadingInProgress = false;
          }
        }, 100);
      };
      
      script.onerror = function() {
        window.lw_swiperLoadingInProgress = false;
      };
      
      document.body.appendChild(script);
    }

    // メイン処理
    lw_waitForElement(".swiper", function(elements) {
      lw_loadSwiperFromTheme();
    });
    
  });
  
  // window.loadイベントでも再チェック（モバイル対応）
  window.addEventListener('load', function() {
    // Swiperが読み込まれていない & .swiperが存在する場合
    if (typeof Swiper === 'undefined' && document.querySelector('.swiper')) {
      // DOMContentLoadedのハンドラーが実行されていない可能性があるため
      if (!window.lw_swiperLoaderInitialized) {
        window.lw_swiperLoaderInitialized = true;
      }
      
      // 既存の関数を再利用できないため、シンプルに再実装
      if (typeof MyThemeSettings !== 'undefined' && MyThemeSettings.theme_Url) {
        const script = document.createElement("script");
        script.src = MyThemeSettings.theme_Url + "/assets/js/swiper.min.js";
        script.onload = function() {
          setTimeout(() => {
            if (typeof Swiper !== 'undefined') {
              const event = new CustomEvent("lw:swiperReady");
              window.dispatchEvent(event);
              document.dispatchEvent(event);
            }
          }, 100);
        };
        document.body.appendChild(script);
      }
    }
  });
  
})();