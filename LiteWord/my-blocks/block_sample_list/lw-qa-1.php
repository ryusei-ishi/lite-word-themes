<!-- wp:wdl/lw-qa-1 {"blockId":"lw-qa-1745031725085-1317"} -->
<div class="wp-block-wdl-lw-qa-1 lw-qa-1" id="lw-qa-1745031725085-1317"><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto" style="font-weight:">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="" style="font-weight:">質問テキスト質問テキスト質問テキスト</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="font-weight:;color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="" style="font-weight:">回答テキスト回答テキスト回答テキスト回答テキスト</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto" style="font-weight:">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="" style="font-weight:">質問テキスト質問テキスト質問テキスト</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="font-weight:;color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="" style="font-weight:">回答テキスト回答テキスト回答テキスト回答テキスト</p></div></dd></dl><dl class="lw-qa-1__dl"><dt><div class="label" data-lw_font_set="Roboto" style="font-weight:">Q<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_q"><p data-lw_font_set="" style="font-weight:">質問テキスト質問テキスト質問テキスト</p></div><div class="open_icon" style="background:var(--color-main)"></div></dt><dd><div class="label" data-lw_font_set="Roboto" style="font-weight:;color:var(--color-main)">A<div style="background:var(--color-main)"></div></div><div class="lw-qa-1__text_a"><p data-lw_font_set="" style="font-weight:">回答テキスト回答テキスト回答テキスト回答テキスト</p></div></dd></dl><script>
(function(){
	const scriptEl  = document.currentScript;
	if ( !scriptEl ) return;
	const container = scriptEl.parentNode;           // <script> の親 = lw-qa-1 本体
	if ( !container || !container.classList.contains('lw-qa-1') ) return;

	/* クリックイベントをバインド ---------------------- */
	function bind () {
		container.querySelectorAll(".lw-qa-1__dl").forEach( function( dl ){
			if ( dl.dataset.lwQaBound ) return;      // 二重バインド防止
			dl.dataset.lwQaBound = "1";
			dl.addEventListener("click", function(){ dl.classList.toggle("active"); } );
		} );
	}

	bind(); // まず 1 回

	/* MutationObserver – QA が動的に増減しても OK */
	const mo = new MutationObserver(bind);
	mo.observe(container,{ childList:true, subtree:true });
})();
		</script></div>
<!-- /wp:wdl/lw-qa-1 -->