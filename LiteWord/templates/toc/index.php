<?php
/* --------------------------------
目次用
------------------------------------ */
$toc_set = Lw_theme_mod_set("single_post_layout_toc_switch", "on");
$toc_set = Lw_put_text("toc_page_switch", $toc_set);
// カテゴリー単位の上書き（"on"/"off" 設定時のみ優先）
$_lw_cats = get_the_category();
if ( ! empty( $_lw_cats ) ) {
	foreach ( $_lw_cats as $_lw_cat ) {
		$_cat_toc = get_term_meta( $_lw_cat->term_id, 'category_toc_switch', true );
		if ( $_cat_toc === 'on' || $_cat_toc === 'off' ) {
			$toc_set = $_cat_toc;
			break;
		}
	}
}
if($toc_set !== "off"):
$toc_ptn = Lw_theme_mod_set("single_post_layout_toc_ptn", "ptn_1");
$toc_conditions = Lw_theme_mod_set("single_post_layout_toc_conditions", "heading_3");
$toc_ttl_switch = Lw_theme_mod_set("single_post_layout_toc_ttl_switch", "on");
$toc_ttl_text = Lw_theme_mod_set("single_post_layout_toc_ttl_text", "INDEX");
?>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // .post_content 要素を取得
  const pageStyle = document.querySelector('.post_content .post_style');
  if (!pageStyle) return;

  // h2～h3 の見出し要素を取得
  const headings = pageStyle.querySelectorAll('h2, h3');
  const h2Count = pageStyle.querySelectorAll('h2').length;
  const minH2 = <?php echo (int) str_replace('heading_', '', $toc_conditions); ?>;
  if (h2Count < minH2) return; // 見出し2が条件数未満の場合は目次を作成しない

  // 目次のコンテナを作成
  const toc = document.createElement('nav');
  toc.setAttribute('aria-label', '目次');
  toc.classList.add('toc_content', '<?php echo esc_attr($toc_ptn); ?>');
  toc.innerHTML = '<?php if ($toc_ttl_switch !== "off") : ?><div class="ttl"><?php echo esc_html($toc_ttl_text); ?></div><?php endif; ?><ul></ul>';
  const tocList = toc.querySelector('ul');
  tocList.classList.add('toc_list');
  let currentH2 = null;

  // 目次の1項目（a > div.text）を作る。
  // 見出しの文字は textContent で入れる（HTML として組み立て直さない）。
  // （2026-11-02 再チェック R2）以前は textContent を innerHTML の中に入れていたため、見出しに文字で
  // 「<img src=x onerror=…>」と書くと、目次の中で本物のタグになって JS が動いた（寄稿者の下書きを管理者がプレビューした時点で）。
  const makeTocItem = (id, text) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', '#' + id);
      const label = document.createElement('div');
      label.className = 'text';
      label.textContent = text;
      link.appendChild(label);
      listItem.appendChild(link);
      return listItem;
  };

  // 目次の項目を生成
  headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      if (heading.tagName.toLowerCase() === 'h2') {
          const listItem = makeTocItem(id, heading.textContent);
          const subList = document.createElement('ul');
          subList.className = 'toc_list_sub';
          listItem.appendChild(subList);
          tocList.appendChild(listItem);
          currentH2 = subList;
      } else if (heading.tagName.toLowerCase() === 'h3' && currentH2) {
          currentH2.appendChild(makeTocItem(id, heading.textContent));
      }
  });

  // 最初の h2 要素の手前に目次を挿入
  const firstH2 = pageStyle.querySelector('h2');
  if (firstH2) {
      pageStyle.insertBefore(toc, firstH2);
  }
});


</script>
<?php endif?>
