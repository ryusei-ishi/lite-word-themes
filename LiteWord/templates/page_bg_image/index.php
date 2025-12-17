<?php 
if ( !defined( 'ABSPATH' ) ) exit;

$lw_page_bg_img = Lw_put_text("lw_page_bg_img", "");
if (empty($lw_page_bg_img)) {
    return; // URLが空またはnullの場合は何も実行しない
}

// ユニークなID生成（JavaScript完全対応版）
$timestamp = time();
$random = mt_rand(1000, 9999);
$unique_hash = substr(md5(uniqid('lwbg', true)), 0, 8);
$unique_id = 'lwPageBgMediaSystem_' . $timestamp . '_' . $random . '_' . $unique_hash;
$container_id = 'bgMediaContainer_' . $unique_hash;

$bg_media_html = "";
$bg_media_class = "";

// ファイル拡張子を取得
$file_extension = strtolower(pathinfo($lw_page_bg_img, PATHINFO_EXTENSION));

// 画像の拡張子リスト
$image_extensions = array('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp');
// 動画の拡張子リスト  
$video_extensions = array('mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv');

if (in_array($file_extension, $image_extensions)) {
    // 画像の場合 - 遅延読み込み対応
    $bg_media_class = "lw_page_bg_img";
    $bg_media_html = '<div class="' . $bg_media_class . '" id="' . $container_id . '">
        <img src="data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="transparent"/></svg>') . '" 
             data-src="' . esc_url($lw_page_bg_img) . '" 
             alt="Background Image" 
             class="bg-lazy-load-' . $unique_hash . '"
             loading="lazy">
    </div>';
} elseif (in_array($file_extension, $video_extensions)) {
    // 動画の場合 - 遅延読み込み対応
    $bg_media_class = "lw_page_bg_video";
    $bg_media_html = '<div class="' . $bg_media_class . '" id="' . $container_id . '">
        <video class="bg-lazy-load-' . $unique_hash . '" muted loop playsinline preload="none" poster="">
            <source data-src="' . esc_url($lw_page_bg_img) . '" type="video/' . $file_extension . '">
        </video>
    </div>';
}

// HTMLが生成された場合のみ出力
if (!empty($bg_media_html)) {
    echo $bg_media_html;
?>

<style>
/* 背景メディア共通スタイル - ユニークID付き */
.lw_page_bg_img,
.lw_page_bg_video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -10;
    overflow: hidden;
    /* 高さは JavaScript で設定 */
}

/* 背景画像スタイル */
.lw_page_bg_img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.3s ease;
    opacity: 0;
}

.lw_page_bg_img img.loaded {
    opacity: 1;
}

/* 背景動画スタイル */
.lw_page_bg_video video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.3s ease;
    opacity: 0;
}

.lw_page_bg_video video.loaded {
    opacity: 1;
}

/* パフォーマンス向上のためのCSS */
.lw_page_bg_img,
.lw_page_bg_video {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* スマホ（700px以下）では背景メディアを完全に非表示 */
@media screen and (max-width: 700px) {
    .lw_page_bg_img,
    .lw_page_bg_video {
        display: none !important;
    }
}
</style>

<script>
(function() {
    'use strict';
    
    // PHP変数を安全にJavaScriptに渡す
    var bgConfig = <?php echo json_encode(array(
        'uniqueId' => $unique_id,
        'containerId' => $container_id,
        'lazyLoadClass' => 'bg-lazy-load-' . $unique_hash
    )); ?>;
    
    // 完全にユニークな変数名を使用（絶対にバッティングしない）
    var configObj = {};
    var methodsObj = {};
    
    configObj[bgConfig.uniqueId + '_config'] = {
        containerId: bgConfig.containerId,
        lazyLoadClass: bgConfig.lazyLoadClass,
        initialHeight: null,
        initialWidth: null,
        bgContainer: null,
        imageObserver: null,
        orientationChangeTimeout: null
    };
    
    methodsObj[bgConfig.uniqueId + '_methods'] = {
        init: function() {
            // スマホサイズ（700px以下）では処理を実行しない
            if (window.innerWidth <= 700) {
                console.log('Mobile device detected (≤700px), background media disabled');
                return;
            }
            
            // より早い初期化のため、DOMContentLoadedとloadの両方をチェック
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', methodsObj[bgConfig.uniqueId + '_methods'].initializeSystem);
            } else {
                methodsObj[bgConfig.uniqueId + '_methods'].initializeSystem();
            }
        },
        
        initializeSystem: function() {
            // 再度サイズチェック（リサイズ等で変更の可能性）
            if (window.innerWidth <= 700) {
                console.log('Mobile device detected during initialization, aborting');
                return;
            }
            
            methodsObj[bgConfig.uniqueId + '_methods'].setupDimensions();
            methodsObj[bgConfig.uniqueId + '_methods'].setupLazyLoading();
            methodsObj[bgConfig.uniqueId + '_methods'].setupOrientationHandler();
            methodsObj[bgConfig.uniqueId + '_methods'].setupIdleCallback();
        },
        
        setupDimensions: function() {
            // 初期画面サイズを取得して固定（リサイズで変更されない）
            configObj[bgConfig.uniqueId + '_config'].initialHeight = window.innerHeight;
            configObj[bgConfig.uniqueId + '_config'].initialWidth = window.innerWidth;
            
            configObj[bgConfig.uniqueId + '_config'].bgContainer = document.getElementById(configObj[bgConfig.uniqueId + '_config'].containerId);
            if (configObj[bgConfig.uniqueId + '_config'].bgContainer) {
                // 高さと幅をpxで固定
                configObj[bgConfig.uniqueId + '_config'].bgContainer.style.height = configObj[bgConfig.uniqueId + '_config'].initialHeight + 'px';
                configObj[bgConfig.uniqueId + '_config'].bgContainer.style.width = configObj[bgConfig.uniqueId + '_config'].initialWidth + 'px';
            }
        },
        
        setupLazyLoading: function() {
            if (!configObj[bgConfig.uniqueId + '_config'].bgContainer) return;
            
            var lazyLoadElement = configObj[bgConfig.uniqueId + '_config'].bgContainer.querySelector('.' + configObj[bgConfig.uniqueId + '_config'].lazyLoadClass);
            
            if (lazyLoadElement) {
                if ('IntersectionObserver' in window) {
                    // Intersection Observer を使用した遅延読み込み
                    configObj[bgConfig.uniqueId + '_config'].imageObserver = new IntersectionObserver(function(entries, observer) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) {
                                methodsObj[bgConfig.uniqueId + '_methods'].loadMedia(entry.target, observer);
                            }
                        });
                    }, {
                        root: null,
                        rootMargin: '50px',
                        threshold: 0.1
                    });
                    
                    configObj[bgConfig.uniqueId + '_config'].imageObserver.observe(lazyLoadElement);
                } else {
                    // Intersection Observer が利用できない場合の即座読み込み
                    setTimeout(function() {
                        methodsObj[bgConfig.uniqueId + '_methods'].loadMedia(lazyLoadElement, null);
                    }, 100);
                }
            }
        },
        
        loadMedia: function(element, observer) {
            console.log('Loading media:', element.tagName, element.dataset.src || element.src);
            
            if (element.tagName === 'IMG') {
                // 画像の場合
                element.src = element.dataset.src;
                element.onload = function() {
                    element.classList.add('loaded');
                    console.log('Background image loaded successfully');
                };
                element.onerror = function() {
                    console.log('Background image failed to load:', element.dataset.src);
                };
            } else if (element.tagName === 'VIDEO') {
                // 動画の場合
                var source = element.querySelector('source');
                if (source && source.dataset.src) {
                    console.log('Loading video source:', source.dataset.src);
                    source.src = source.dataset.src;
                    element.load();
                    
                    element.onloadeddata = function() {
                        element.classList.add('loaded');
                        console.log('Background video loaded successfully');
                        // 動画を自動再生
                        var playPromise = element.play();
                        if (playPromise !== undefined) {
                            playPromise.then(function() {
                                console.log('Video autoplay started');
                            }).catch(function(e) {
                                console.log('Video autoplay failed:', e);
                                // 自動再生に失敗した場合でも表示は維持
                            });
                        }
                    };
                    
                    element.onloadedmetadata = function() {
                        console.log('Video metadata loaded');
                    };
                    
                    element.onerror = function() {
                        console.log('Background video failed to load:', source.dataset.src);
                    };
                    
                    element.oncanplay = function() {
                        console.log('Video can start playing');
                    };
                } else {
                    console.log('Video source not found or data-src not set');
                }
            }
            
            if (observer) {
                observer.unobserve(element);
            }
        },
        
        setupOrientationHandler: function() {
            // リサイズとオリエンテーション変更のハンドリング
            var resizeHandler = function() {
                clearTimeout(configObj[bgConfig.uniqueId + '_config'].orientationChangeTimeout);
                configObj[bgConfig.uniqueId + '_config'].orientationChangeTimeout = setTimeout(function() {
                    var currentWidth = window.innerWidth;
                    var bgContainer = configObj[bgConfig.uniqueId + '_config'].bgContainer;
                    
                    if (bgContainer) {
                        if (currentWidth <= 700) {
                            // スマホサイズになった場合は非表示
                            bgContainer.style.display = 'none';
                            console.log('Switched to mobile view, background media hidden');
                        } else {
                            // PC/タブレットサイズになった場合は表示
                            bgContainer.style.display = 'block';
                            // 高さと幅を再計算
                            var newHeight = window.innerHeight;
                            var newWidth = window.innerWidth;
                            bgContainer.style.height = newHeight + 'px';
                            bgContainer.style.width = newWidth + 'px';
                            console.log('Switched to desktop view, background media shown');
                        }
                    }
                }, 300);
            };
            
            // リサイズとオリエンテーション変更の両方に対応
            window.addEventListener('resize', resizeHandler);
            window.addEventListener('orientationchange', resizeHandler);
        },
        
        setupIdleCallback: function() {
            // パフォーマンス向上のための最適化
            if ('requestIdleCallback' in window) {
                requestIdleCallback(function() {
                    // アイドル時間にプリロードの準備
                    if (configObj[bgConfig.uniqueId + '_config'].bgContainer) {
                        var lazyElement = configObj[bgConfig.uniqueId + '_config'].bgContainer.querySelector('.' + configObj[bgConfig.uniqueId + '_config'].lazyLoadClass);
                        if (lazyElement && lazyElement.tagName === 'VIDEO') {
                            // 動画のメタデータをプリロード
                            lazyElement.preload = 'metadata';
                        }
                    }
                });
            }
        },
        
        destroy: function() {
            // クリーンアップ関数（必要に応じて）
            if (configObj[bgConfig.uniqueId + '_config'].imageObserver) {
                configObj[bgConfig.uniqueId + '_config'].imageObserver.disconnect();
            }
            clearTimeout(configObj[bgConfig.uniqueId + '_config'].orientationChangeTimeout);
        }
    };
    
    // 初期化実行（より早いタイミングで開始）
    methodsObj[bgConfig.uniqueId + '_methods'].init();
    
    // さらに確実にするため、window.onloadでも実行
    window.addEventListener('load', function() {
        if (!configObj[bgConfig.uniqueId + '_config'].bgContainer) {
            methodsObj[bgConfig.uniqueId + '_methods'].initializeSystem();
        }
    });
    
    // グローバルな名前空間汚染を避けるため、必要に応じてクリーンアップ関数を公開
    window[bgConfig.uniqueId + '_cleanup'] = methodsObj[bgConfig.uniqueId + '_methods'].destroy;
    
})();
</script>

<?php
} // HTML生成チェック終了
?>