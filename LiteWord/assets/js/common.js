/* ------------------------------------------------------------------
 * ① ドロワー開閉ボタン
 * ----------------------------------------------------------------*/

//ページが読み込みされたら
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".drawer_nav")) {
    const drawerNavOpenBtns = document.querySelectorAll(".drawer_nav_open");
    const body = document.body;
    const html = document.documentElement;
    const hamBtn = document.querySelector(".ham_btn");
    const drawer = document.querySelector(".drawer_nav");
    const filter = document.querySelector(".drawer_nav_filter");

    const toggleDrawer = () => {
      hamBtn.classList.toggle("active");
      drawer.classList.toggle("active");
      filter.classList.toggle("active");
      body.classList.toggle("scroll_off");
      html.classList.toggle("scroll_off");
    };

    drawerNavOpenBtns.forEach((btn) =>
      btn.addEventListener("click", toggleDrawer)
    );

    /* ----------------------------------------------------------------
     * ② 同一ページ内アンカーリンクでドロワーを閉じる  ★追加
     * ----------------------------------------------------------------*/
    const drawerLinks = drawer.querySelectorAll("a");

    drawerLinks.forEach((link) => {
      // 絶対 URL 化して現在ページと比較
      const url = new URL(link.href, location.href);

      // ① hash がある ＆ ② pathname・search が現在と一致 ⇒ 同一ページ内アンカー
      const isSamePageAnchor =
        url.hash &&
        url.pathname === location.pathname &&
        url.search === location.search;

      if (isSamePageAnchor) {
        link.addEventListener("click", () => {
          // ドロワーが開いているときだけ閉じる
          if (drawer.classList.contains("active")) {
            hamBtn.classList.remove("active");
            drawer.classList.remove("active");
            filter.classList.remove("active");
            body.classList.remove("scroll_off");
            html.classList.remove("scroll_off");
          }
        });
      }
    });
  } else {
    // ドロワーがない場合はハンバーガーボタンを非表示に
    if (document.querySelector(".ham_btn")) {
      document.querySelector(".ham_btn").style.display = "none";
    }
  }
});

/* ------------------------------------------------------------------
 * ③ サブメニュー用：jQuery（そのまま）
 * ----------------------------------------------------------------*/
jQuery(document).ready(function ($) {
  const addDownBtn = function (menuItems) {
    menuItems.each(function () {
      const subMenu = $(this).children("ul.sub-menu");
      if (subMenu.length) {
        const downBtn = $('<div class="down_btn"><div></div></div>');
        $(this).prepend(downBtn);

        downBtn.on("click", function () {
          $(this).toggleClass("active");
          subMenu.slideToggle().toggleClass("active");
        });

        addDownBtn(subMenu.children("li")); // 再帰
      }
    });
  };

  addDownBtn($(".menu_sp > li")); // ルート階層から開始
});

/**
 * .lw_header_mainの高さを取得して、cssの変数「--lw_header_height」にセット
 */
{
  const lw_header = document.querySelector(".lw_header_main");
  if (lw_header) {
    const LwheaderMeinHeight = lw_header.offsetHeight; // .lw_header_mainの高さを取得
    document.documentElement.style.setProperty(
      "--header-main-height",
      `${LwheaderMeinHeight}px`
    ); // CSS変数にセット
  }
}
/**
 * 固定ヘッダー対応：アンカーリンクのスクロール位置調整
 */
(function () {
  // 固定ヘッダーとフォローメニューの高さを取得する関数
  function getFixedElementsHeight() {
    let totalHeight = 0;

    // 固定ヘッダーの高さを取得
    const fixedHeader = document.querySelector(".lw_header_main.fixed_on");
    if (fixedHeader) {
      totalHeight += fixedHeader.offsetHeight;
    }

    // フォローメニューの高さを取得
    const followMenu = document.querySelector(".lw_follow_menu");
    if (followMenu) {
      totalHeight += followMenu.offsetHeight;
    }

    return totalHeight;
  }

  // 指定された要素にスクロールする関数
  function scrollToTarget(targetElement) {
    const offsetHeight = getFixedElementsHeight();
    if (offsetHeight > 0 && targetElement) {
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offsetHeight,
        behavior: "smooth",
      });
    }
  }

  // ページ読み込み時：別ページからのアンカーリンク対応
  window.addEventListener("load", function () {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        setTimeout(function () {
          scrollToTarget(targetElement);
        }, 100);
      }
    }
  });

  // ページ内アンカーリンククリック時の対応
  document.addEventListener("click", function (e) {
    // クリックされた要素がアンカーリンクかチェック
    const anchor = e.target.closest('a[href^="#"]');

    if (anchor) {
      const href = anchor.getAttribute("href");

      // "#"だけの場合は処理しない
      if (href === "#") return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault(); // デフォルトの動作をキャンセル
        scrollToTarget(targetElement);

        // URLのハッシュを更新
        history.pushState(null, null, href);
      }
    }
  });
})();

/**
 * 新しいタブで開くをdataで指定
 */
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('a[data-open-in-new-tab="true"]')
    .forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
});

/* ================================================
    lw_in_text_splitが付与されていたら
    * 文字列を分割して <span> タグで囲む
   ----------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // 対象 … .ttl .main.no_line_break
  const targets = document.querySelectorAll(".lw_in_text_split");

  targets.forEach((el) => {
    // 既に処理済みならスキップ
    if (el.classList.contains("lw_split_done")) return;

    // <br> → \n へ置換して分割
    const lines = el.innerHTML.replace(/<br\s*\/?>/gi, "\n").split(/\n/);

    // 各行を <span class="in_text"> で囲む
    el.innerHTML = lines
      .map((txt) => `<span class="lw_in_text_box">${txt}</span>`)
      .join("");

    // 二重処理防止フラグ
    el.classList.add("lw_split_done");
  });
});

/* ------------------------------------------------------------
 * 〈ピュア JavaScript〉
 * <span class="lw-br …"> → <br class="lw-br …"> に置換
 * ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // 1) すべての span.lw-br を取得
  document.querySelectorAll("span.lw-br").forEach((span) => {
    // 2) 新しい <br> 要素を生成
    const br = document.createElement("br");

    // 3) span が持つすべての属性をそのままコピー
    [...span.attributes].forEach((attr) => {
      br.setAttribute(attr.name, attr.value);
    });

    // 4) DOM を置き換え
    span.replaceWith(br);
  });
});

/**
 * サイト全体のtel:リンクから余計なHTMLタグを除去
 * テーマのfunctions.phpでwp_enqueueして読み込む、またはfooter.phpに直接記述
 */

(function () {
  "use strict";

  /**
   * 電話番号として有効な文字かどうかをチェック
   * 有効: 数字(0-9)、ハイフン(-)、括弧(())、プラス(+)、スペース
   */
  function isValidPhoneChar(char) {
    return /[\d\-+()\s]/.test(char);
  }

  /**
   * tel:以降の部分に不正な文字が含まれているかチェック
   */
  function hasInvalidCharsInTel(telPart) {
    // HTMLタグの形跡（<, >, &lt;, &gt;, &quot;など）
    if (
      telPart.includes("<") ||
      telPart.includes(">") ||
      telPart.includes("&lt;") ||
      telPart.includes("&gt;") ||
      telPart.includes("&quot;") ||
      telPart.includes("&#")
    ) {
      return true;
    }

    // アルファベットが含まれている（電話番号には不要）
    if (/[a-zA-Z]/.test(telPart)) {
      return true;
    }

    return false;
  }

  /**
   * HTMLエンティティをデコードしてテキストのみを抽出
   */
  function extractPlainPhoneNumber(href) {
    if (!href || !href.includes("tel:")) {
      return href;
    }

    // tel:以降の部分を取得
    const telPart = href.substring(href.indexOf("tel:") + 4);

    // 不正な文字が含まれているかチェック
    if (hasInvalidCharsInTel(telPart)) {
      // 一時的なdiv要素を作成してHTMLをデコード
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = telPart;

      // テキストコンテンツのみを取得（HTMLタグを除去）
      const plainText = tempDiv.textContent || tempDiv.innerText || "";

      // 電話番号として有効な文字のみを抽出
      // 数字、ハイフン、括弧、プラス、スペースのみ許可
      const phoneNumber = plainText.replace(/[^\d\-+()\s]/g, "");

      // 余分なスペースを削除
      const cleanedNumber = phoneNumber.trim();

      return "tel:" + cleanedNumber;
    }

    return href;
  }

  /**
   * サイト全体のtel:リンクを修正
   */
  function fixAllTelLinks() {
    // サイト内の全てのtel:リンクを取得
    const telLinks = document.querySelectorAll('a[href^="tel:"]');

    let fixedCount = 0;

    telLinks.forEach(function (link) {
      const originalHref = link.getAttribute("href");
      const cleanedHref = extractPlainPhoneNumber(originalHref);

      // hrefが変更された場合のみ更新
      if (originalHref !== cleanedHref) {
        link.setAttribute("href", cleanedHref);
        fixedCount++;
        console.log("Tel link fixed:", originalHref, "->", cleanedHref);
      }
    });

    if (fixedCount > 0) {
      console.log("Total tel links fixed:", fixedCount);
    }
  }

  // DOMContentLoaded後に実行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixAllTelLinks);
  } else {
    // すでに読み込み完了している場合は即座に実行
    fixAllTelLinks();
  }

  // Gutenbergエディタでのブロック更新にも対応（オプション）
  // エディタ内でもプレビュー時に動作させたい場合
  if (window.wp && window.wp.data) {
    window.wp.data.subscribe(function () {
      // ブロックが更新された時に再実行
      setTimeout(fixAllTelLinks, 100);
    });
  }
})();

/*
ふりがな
*/
  document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('ruby[data-rt]').forEach(function(ruby) {
          var rt = ruby.getAttribute('data-rt');
          var position = ruby.getAttribute('data-rt-position') || 'over';

          if (rt && !ruby.querySelector('rt')) {
              var rtElement = document.createElement('rt');
              rtElement.textContent = rt;
              ruby.appendChild(rtElement);
              ruby.removeAttribute('data-rt');

              // 位置クラスを追加
              ruby.classList.add('ruby-' + position);
          }
      });
  });