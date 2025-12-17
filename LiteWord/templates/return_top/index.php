<?php
$ptn = Lw_theme_mod_set("return_top_ptn", "ptn_1");
if($ptn == "none") return;
?>
<link rel="stylesheet" href="<?=get_template_directory_uri()?>/templates/return_top/<?=$ptn?>/style.min.css<?=css_version()?>">
<?php
get_template_part("templates/return_top/$ptn/index"); 
?>
<script>
'use strict';
{
    // スクロールトップボタン
    scrollTop('return_top', 600);

    function scrollTop(el, duration) {
        const target = document.getElementById(el);
        target.addEventListener('click', function () {
            let currentY = window.pageYOffset; // 現在のスクロール位置を取得
            let step = duration / currentY > 1 ? 10 : 100; // 三項演算子
            let timeStep = duration / currentY * step; // スクロール時間
            let intervalId = setInterval(scrollUp, timeStep);

            function scrollUp() {
                currentY = window.pageYOffset;
                if (currentY === 0) {
                    clearInterval(intervalId); // ページ最上部に来たら終了
                } else {
                    scrollBy(0, -step); // step分上へスクロール
                }
            }
        });
    }

    const $return_top = document.getElementById('return_top');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        let followCta = document.querySelector('.follow_bottom_cta');

        // .follow_bottom_ctaが存在する場合、スクロールトップボタンを無効化して非表示
        if (followCta) {
            $return_top.classList.remove('on');
            $return_top.style.display = 'none';
            return; // 処理を終了
        } else {
            $return_top.style.display = ''; // 表示を戻す
        }

        if (scrollY > 500) {
            $return_top.classList.add('on');
        } else {
            $return_top.classList.remove('on');
        }

        let h = document.documentElement.scrollHeight;
        let win_h = document.documentElement.clientHeight;
        if (h < scrollY + win_h + 240) {
            $return_top.classList.remove('on');
        }
    });

    // 「#cta_fixed_sp_001.on」が存在したら、配置を変える
    window.addEventListener('scroll', () => {
        if (document.querySelector('#cta_fixed_sp_001.on')) {
            $return_top.classList.add('position_change');
        } else {
            $return_top.classList.remove('position_change');
        }

        if (document.querySelector('#cta_fixed_sp_002.on')) {
            $return_top.classList.add('position_change_2');
        } else {
            $return_top.classList.remove('position_change_2');
        }
    });
}
</script>
