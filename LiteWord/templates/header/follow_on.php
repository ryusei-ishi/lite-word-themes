<!-- スペース用ダミー -->
<div class="lw_header_main_space"></div>

<script>
// ------------------------------------------------------------
//  ヘッダー固定 & フォローメニュー表示制御
// ------------------------------------------------------------
(() => {

	// ---- 設定値 --------------------------
	const BREAKPOINT = 1081;     // 1081px 以下で fixed_on
	const SCROLL_Y   = 300;      // 300px 以上で .active
	// -------------------------------------

	/* 要素取得（存在しなければ何もしない） */
	const header     = document.querySelector('.lw_header_main');
	const space      = document.querySelector('.lw_header_main_space');
	const followMenu = document.querySelector('.lw_follow_menu');
	if (!header || !space) return;

	/* ヘッダー高さ確保 & fixed_on 切替 */
	function updateHeader() {

		if (followMenu) {

			// .lw_follow_menu がある場合は BREAKPOINT 以下だけ高さを確保
			if (window.innerWidth <= BREAKPOINT) {
				space.style.height = `${header.offsetHeight}px`;
				header.classList.add('fixed_on');
			} else {
				space.style.height = '';             // 高さリセット
				header.classList.remove('fixed_on');
			}

		} else {

			// .lw_follow_menu が無い場合は常に高さ確保＆固定
			space.style.height = `${header.offsetHeight}px`;
			header.classList.add('fixed_on');
		}
	}

	/* スクロールで .active 切替 */
	let ticking = false;
	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			if (followMenu) {
				(window.scrollY >= SCROLL_Y)
					? followMenu.classList.add('active')
					: followMenu.classList.remove('active');
			}
			ticking = false;
		});
	}

	/* -------- イベント登録 -------- */
	window.addEventListener('resize',  updateHeader, { passive:true });
	window.addEventListener('scroll',  onScroll,     { passive:true });
	window.addEventListener('load',    updateHeader);
	document.addEventListener('DOMContentLoaded', updateHeader);

})();
</script>
<style>
    body:has(#wpadminbar){
        .lw_follow_menu{
            &.active{
                top: 32px; /* wpadminbarの高さを考慮 */
           }
        }
    }
.lw_follow_menu {
    position: fixed;
    top: -64px;
    left: 0;
    z-index: 99998;
    width: 100%;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    visibility: hidden;
    opacity: 0;
    transition:
        top 0.6s,
        visibility 0.6s,
        opacity 0.6s;
    @media (max-width: 1080px) {
        display: none;
    }
    &.active {
        top: 0;
        visibility: visible;
        opacity: 1;
    }
    > div > ul {
        display: flex;
        justify-content: center;
        > li {
            position: relative;
            > a {
                position: relative;
                padding: 0 24px;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #000;
                font-size: 16px;
                line-height: 1.4em;
                font-feature-settings: "palt";
                white-space: nowrap;
                &::after {
                    position: absolute;
                    bottom: 0;
                    left: 2px;
                    right: 0;
                    margin: auto;
                    width: 0;
                    height: 4px;
                    content: "";
                    display: block;
                    background: var(--color-yellow);
                    transition: all 0.3s;
                }
                &:hover {
                    &::after {
                        width: calc(100% - 44px);
                        opacity: 1;
                    }
                }
            }
        }
    }
}

</style>