/**
 * LiteWord – lw_anime 汎用アニメーション
 * 2025-05-25 fix6: 初回表示（lw_loading）を window.load 後に発火
 */
(function () {
	'use strict';

	/* ==== 1. 対象取得（旧クラスも含む） ==== */
	const lwAnimeEls = Array.from(
		document.querySelectorAll('.lw_anime, .lw_anime_scroll')
	);
	if (!lwAnimeEls.length) return;

	/* ==== 2. 各要素の設定を解析 ==== */
	const parseCfg = el => {
		/* 旧 .lw_anime_scroll を補完 */
		if (el.classList.contains('lw_anime_scroll')) {
			el.classList.add('lw_anime', 'lw_scroll');
		}

		/* threshold-XX → 数値 (既定 80px) */
		const thresholdPx =
			(el.className.match(/threshold-(\d+)/) || [0, 80])[1] * 1;

		/* delay-X-X → 秒 */
		const delayMatch = el.className.match(/delay-(\d+)-(\d+)/);
		const delay = delayMatch ? parseFloat(`${delayMatch[1]}.${delayMatch[2]}`) : 0;

		const mode = el.classList.contains('lw_loading') ? 'load' : 'scroll';

		return { el, thresholdPx, delay, mode };
	};

	const settings = lwAnimeEls.map(parseCfg);

	/* ===========================================================
	 * 3. 初回表示で発火 (lw_loading)
	 *    ──────────────────────────────────
	 *    画像・フォント等を含む “ページ完全読込後” に発火させる
	 * ========================================================= */
	const runLoadAnimations = () => {
		settings
			.filter(s => s.mode === 'load')
			.forEach(s => {
				const run = () => s.el.classList.add('lw_anime_on');
				s.delay ? setTimeout(run, s.delay * 1000) : run();
			});
	};

	/* 既に読み込み済みなら即実行 / まだなら load 待ち */
	if (document.readyState === 'complete') {
		runLoadAnimations();
	} else {
		window.addEventListener('load', runLoadAnimations, { once: true });
	}

	/* ==== 4. スクロール発火組を抽出 ==== */
	const scrollSettings = settings.filter(s => s.mode === 'scroll');
	if (!scrollSettings.length) return;

	/* =================================================================
	   IntersectionObserver 採用ブラウザ
	   rootMargin で「下端を –thresholdPx」ずらし、threshold 0 で判定
	   ================================================================= */
	if ('IntersectionObserver' in window) {
		scrollSettings.forEach(cfg => {
			const io = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach(entry => {
						if (!entry.isIntersecting) return;

						const run = () => entry.target.classList.add('lw_anime_on');
						cfg.delay ? setTimeout(run, cfg.delay * 1000) : run();
						observer.disconnect(); // 1 回で監視終了
					});
				},
				{
					root: null,
					threshold: 0,
					/* 下方向だけ −thresholdPx ずらす */
					rootMargin: `0px 0px -${cfg.thresholdPx}px 0px`,
				}
			);
			io.observe(cfg.el);
		});
		return;
	}

	/* =================================================================
	   Fallback（旧 Safari / IE）
	   上端 ≤ (viewport 高さ − thresholdPx) になったら発火
	   ================================================================= */
	let ticking = false;

	const onScroll = () => {
		if (!ticking) {
			requestAnimationFrame(checkFallback);
			ticking = true;
		}
	};

	const checkFallback = () => {
		ticking = false;

		for (let i = scrollSettings.length - 1; i >= 0; i--) {
			const cfg  = scrollSettings[i];
			const rect = cfg.el.getBoundingClientRect();

			if (
				rect.top <= innerHeight - cfg.thresholdPx &&   // 上端が所定距離に達した
				rect.bottom >= 0 &&                            // 画面外上部でない
				rect.left   <= innerWidth && rect.right >= 0   // 左右も可視領域
			) {
				const run = () => cfg.el.classList.add('lw_anime_on');
				cfg.delay ? setTimeout(run, cfg.delay * 1000) : run();
				scrollSettings.splice(i, 1);
			}
		}

		if (!scrollSettings.length) {
			removeEventListener('scroll',  onScroll);
			removeEventListener('resize',  onScroll);
		}
	};

	addEventListener('scroll', onScroll, { passive: true });
	addEventListener('resize', onScroll);
	checkFallback(); // 初回チェック
})();
