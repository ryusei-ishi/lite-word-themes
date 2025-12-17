document.addEventListener('DOMContentLoaded', function () {
    const analyticsID = analyticsData.analyticsID; // PHPから取得したID
    if (!analyticsID) return; // IDがない場合は中断

    // Google Analyticsの非同期読み込み
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsID}`;
    script.async = true;
    document.head.appendChild(script);

    // gtagの初期設定
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }

    script.onload = function () {
        gtag('js', new Date());

        // 基本的な設定（例: IPアドレスの匿名化）
        gtag('config', analyticsID, {
            'anonymize_ip': true, // IPアドレスの匿名化
            'send_page_view': false // 初期のページビューを無効化し、手動で送信
        });

        // ページ読み込み後3秒で手動のページビューイベントをトリガー
        setTimeout(function () {
            gtag('event', 'page_view', {
                'page_location': window.location.href,
                'page_path': window.location.pathname,
                'page_title': document.title
            });
        }, 3000);
    };
});
