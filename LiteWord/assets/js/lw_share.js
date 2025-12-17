document.addEventListener("DOMContentLoaded", () => {
  const popupFeatures = "noopener,noreferrer,width=640,height=480";

  // すべてのクリックを拾い、data‑type に応じて処理
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".lw_share");
    if (!btn) return;

    e.preventDefault();

    const type = btn.dataset.type;
    const title = encodeURIComponent(document.title);
    const url = encodeURIComponent(location.href);

    let shareUrl = "";

    switch (type) {
      case "x": // X（旧 Twitter）
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "line":
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "hatena":
        shareUrl = `https://b.hatena.ne.jp/add?mode=confirm&url=${url}&title=${title}`;
        break;
      case "pocket":
        shareUrl = `https://getpocket.com/edit?url=${url}&title=${title}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
        break;
      case "tumblr":
        shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}&caption=${title}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case "mastodon":
        // 汎用インスタンス（mastodon.social）に投げる例
        shareUrl = `https://mastodon.social/share?text=${title}%20${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        window.location.href = shareUrl; // メールだけは現在タブで遷移
        return;
      case "copy":
        navigator.clipboard.writeText(location.href).then(() => {
          const msg = document.querySelector(".lw_share_copy_feedback");
          if (msg) {
            msg.style.display = "flex";
            setTimeout(() => {
              msg.style.display = "none";
            }, 2000);
          }
        });
        return;
      default:
        return;
    }

    // ポップアップで開く
    window.open(shareUrl, "_blank", popupFeatures);
  });
});
