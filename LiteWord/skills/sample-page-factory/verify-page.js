/**
 * LiteWord ページ検品スクリプト
 *
 * 使い方: 公開ページ（またはプレビュー）を開いたブラウザのコンソール、
 *         あるいは Claude in Chrome の javascript_tool にそのまま貼って実行する。
 *
 * 見るのは4点:
 *   1. 低コントラスト（背景と同色で文字が消えていないか）
 *   2. 画像切れ
 *   3. プレースホルダの置き忘れ
 *   4. 色のCSS変数の実効値
 *
 * ⚠️ このスクリプトは目の代わりではない。実行後に必ずページを上から下まで目で見ること。
 */
(function () {
  const toRGB = s => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : null; };
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  // 祖先に背景画像があるか（写真の上の白文字は誤検知になるため除外する）
  const hasBgImage = el => {
    let e = el;
    while (e && e !== document.documentElement) {
      const bi = getComputedStyle(e).backgroundImage;
      if (bi && bi !== 'none') return true;
      if (e.querySelector && e.matches('section, .fv-4, [class*="fv-"], [class*="cta"]') && e.querySelector('img')) return true;
      e = e.parentElement;
    }
    return false;
  };
  const effBg = el => {
    let e = el;
    while (e) {
      const cs = getComputedStyle(e);
      const c = toRGB(cs.backgroundColor);
      if (c && (c[3] === undefined || c[3] > 0.5)) return c;
      e = e.parentElement;
    }
    return [255, 255, 255];
  };

  // ---- 1. 低コントラスト ----
  const lowContrast = [];
  document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,td,th,div').forEach(el => {
    const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').trim();
    if (!t || t.length < 3) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
    if (hasBgImage(el)) return;                       // 写真の上は判定しない
    const fg = toRGB(cs.color); if (!fg) return;
    const bg = effBg(el);
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (ratio < 3) lowContrast.push({ 文言: t.slice(0, 30), 比: Math.round(ratio * 100) / 100, 文字色: cs.color, 背景: 'rgb(' + bg.slice(0, 3).join(',') + ')' });
  });

  // ---- 2. 画像切れ ----
  const brokenImages = [...document.querySelectorAll('img')]
    .filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc && !i.currentSrc.endsWith('/'))
    .map(i => i.currentSrc);

  // ---- 3. プレースホルダの置き忘れ ----
  const html = document.body.innerHTML;
  const NG = ['タイトルタイトル', '説明テキスト説明テキスト', 'picsum.photos', 'lorem ipsum',
              'サンプルテキスト', 'ダミーテキスト', 'ここにテキスト', '〇〇〇〇'];
  const placeholders = NG.filter(k => html.toLowerCase().includes(k.toLowerCase()));

  // ---- 4. 色の実効値 ----
  const cs = getComputedStyle(document.documentElement);
  const colors = {};
  ['--color-main', '--color-accent', '--color-text', '--color-content-bg-pc', '--color-page-bg-pc']
    .forEach(v => colors[v] = cs.getPropertyValue(v).trim());
  const textVsBg = (() => {
    const a = colors['--color-text'], b = colors['--color-content-bg-pc'];
    if (!a || !b) return '(取得できず)';
    return a.toLowerCase() === b.toLowerCase() ? '★ 文字色と背景色が同じ。必ず直すこと' : 'OK';
  })();

  return {
    低コントラスト件数: lowContrast.length,
    低コントラスト: lowContrast.slice(0, 15),
    画像切れ: brokenImages,
    プレースホルダ残り: placeholders,
    色の実効値: colors,
    文字色と背景色: textVsBg,
    判定: (lowContrast.length === 0 && brokenImages.length === 0 && placeholders.length === 0 && textVsBg === 'OK')
      ? '✅ 自動検査は通過。このあと必ず目視とスマホ幅の確認を行うこと'
      : '★ 要修正あり'
  };
})();
