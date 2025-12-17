<!-- wp:wdl/paid-block-before-after-2 {"items":[{"imgUrl":"https://lite-word.com/sample_img/women/6_2.webp"},{"imgUrl":"https://lite-word.com/sample_img/women/6.webp"}]} -->
    <div class="wp-block-wdl-paid-block-before-after-2 paid-block-before-after-2"><div class="this_wrap" style="max-width:1280px"><p class="label" style="background:rgba(209, 77, 77, 0.85)">before</p><p class="label right" style="background:rgba(77, 209, 77, 0.85)">after</p><img src="https://lite-word.com/sample_img/women/6.webp" class="before-image" alt="Before" style="aspect-ratio:1280 / 800"/><div class="after-wrapper"><div class="after-inner"><img src="https://lite-word.com/sample_img/women/6_2.webp" class="after-image" alt="After" style="aspect-ratio:1280 / 800"/></div></div><div class="slider-line"><div class="slider-circle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 
 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 
 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 
 45.3 0l192 192z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 
 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 
 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 
 45.3 0l192 192z"></path></svg></div></div></div><script>
                        document.addEventListener('DOMContentLoaded', function() {
                            var blocks = document.querySelectorAll('.paid-block-before-after-2');
                            blocks.forEach(function(block) {
                                var container = block.querySelector('.this_wrap');
                                var slider = block.querySelector('.slider-line');
                                var afterWrapper = block.querySelector('.after-wrapper');
                                if (!container || !slider || !afterWrapper) return;

                                function updateSliderPosition(x) {
                                    var rect = container.getBoundingClientRect();
                                    var offsetX = x - rect.left;
                                    if (offsetX < 0) offsetX = 0;
                                    if (offsetX > rect.width) offsetX = rect.width;
                                    afterWrapper.style.width = offsetX + 'px';
                                    slider.style.left = offsetX + 'px';
                                }

                                // 初期位置：中央にスライダーを配置
                                var initialCenter = container.getBoundingClientRect().width / 2;
                                updateSliderPosition(container.getBoundingClientRect().left + initialCenter);

                                // PCマウス対応
                                container.addEventListener('mousemove', function(e) {
                                    updateSliderPosition(e.clientX);
                                });

                                // スマホタッチ対応
                                container.addEventListener('touchmove', function(e) {
                                    if (e.touches.length > 0) {
                                        updateSliderPosition(e.touches[0].clientX);
                                    }
                                }, { passive: false });

                                // スマホでスクロールしないようにする
                                container.addEventListener('touchstart', function(e) {
                                    e.preventDefault();
                                }, { passive: false });
                            });
                        });
                        </script></div>
<!-- /wp:wdl/paid-block-before-after-2 -->