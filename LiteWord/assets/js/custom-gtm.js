document.addEventListener('DOMContentLoaded', function () {
    const gtmID = tagManagerData.gtmID; // PHPから取得したGTMのID
    const analyticsID = tagManagerData.analyticsID; // PHPから取得したGA4のID

    if (!gtmID) return; // GTM IDがない場合は中断

    // Google Tag Managerの非同期読み込み
    (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmID);

    console.log('GTM initialized with ID:', gtmID);

    // gtagの初期設定（GA4と連携）
    if (analyticsID) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', analyticsID, {
            'anonymize_ip': true,
            'send_page_view': false
        });

        // 3秒遅延してページビューイベントを送信
        setTimeout(function () {
            gtag('event', 'page_view', {
                'page_location': window.location.href,
                'page_path': window.location.pathname,
                'page_title': document.title
            });
        }, 3000);
    }
});
