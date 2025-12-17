<?php
/* --------------------------------
目次用
------------------------------------ */
$toc_set = Lw_theme_mod_set("single_post_layout_toc_switch", "on");
$toc_set = Lw_put_text("toc_page_switch", $toc_set);
if($toc_set !== "off"):
?>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // .post_content 要素を取得
  const pageStyle = document.querySelector('.post_content .post_style');
  console.log(pageStyle);
  if (!pageStyle) return;

  // h2～h3 の見出し要素を取得
  const headings = pageStyle.querySelectorAll('h2, h3');
  if (headings.length < 3) return; // 見出しが3つ未満の場合は目次を作成しない

  // 目次のコンテナを作成
  const toc = document.createElement('div');
  toc.classList.add('toc_content');
  toc.innerHTML = '<div class="ttl">INDEX</div><ul></ul>';
  const tocList = toc.querySelector('ul');
  tocList.classList.add('toc_list');
  let currentH2 = null;

  // 目次の項目を生成
  headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      if (heading.tagName.toLowerCase() === 'h2') {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
              <a href="#${id}">
                  <div class="text">${heading.textContent}</div>
              </a>
              <ul class="toc_list_sub"></ul>
          `;
          tocList.appendChild(listItem);
          currentH2 = listItem.querySelector('ul');
      } else if (heading.tagName.toLowerCase() === 'h3' && currentH2) {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
              <a href="#${id}">
                  <div class="text">${heading.textContent}</div>
              </a>
          `;
          currentH2.appendChild(listItem);
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
