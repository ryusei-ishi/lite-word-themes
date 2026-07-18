<?php
/**
 * リンク抽出クラス
 *
 * @package LiteWord
 */

if (!defined('ABSPATH')) {
    exit;
}

class LW_Broken_Link_Check_Scanner {

    /**
     * 全てのaタグを抽出（href値に関わらず）
     *
     * @return array 結果配列 ['links' => リンク配列, 'pages' => 全ページ情報]
     */
    public static function scan_all_links() {
        $all_links = array();
        $all_pages = array();

        // 投稿・固定ページから全aタグを抽出
        $post_types = get_post_types(array('public' => true), 'names');
        $posts = get_posts(array(
            'post_type' => array_values($post_types),
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'suppress_filters' => false,
        ));

        foreach ($posts as $post) {
            $post_id = $post->ID;
            $post_type = $post->post_type;

            // フィルター適用後のコンテンツを取得（id抽出用）
            $filtered_content_for_ids = apply_filters('the_content', $post->post_content);

            // ページ内のid属性を抽出
            $page_ids = self::extract_all_ids($filtered_content_for_ids);

            // 全ページ情報を記録（リンクの有無に関わらず）
            $all_pages[$post_id] = array(
                'post_id' => $post_id,
                'post_type' => $post_type,
                'post_title' => $post->post_title,
                'ids' => $page_ids,
            );

            // 生コンテンツからaタグを抽出
            $content = $post->post_content;
            if (!empty($content)) {
                $links = self::extract_all_a_tags($content);
                foreach ($links as $link) {
                    $all_links[] = array(
                        'href' => $link['href'],
                        'text' => $link['text'],
                        'full_tag' => $link['full_tag'],
                        'source_type' => 'post',
                        'source_id' => $post_id,
                        'source_title' => $post->post_title,
                        'source_field' => 'post_content',
                        'post_type' => $post_type,
                    );
                }
            }

            // フィルター適用後のコンテンツからも抽出
            $filtered_content = apply_filters('the_content', $post->post_content);
            if ($filtered_content !== $content) {
                $filtered_links = self::extract_all_a_tags($filtered_content);
                foreach ($filtered_links as $link) {
                    // 重複チェック
                    $exists = false;
                    foreach ($all_links as $existing) {
                        if ($existing['href'] === $link['href'] &&
                            $existing['source_id'] === $post_id &&
                            $existing['text'] === $link['text']) {
                            $exists = true;
                            break;
                        }
                    }
                    if (!$exists) {
                        $all_links[] = array(
                            'href' => $link['href'],
                            'text' => $link['text'],
                            'full_tag' => $link['full_tag'],
                            'source_type' => 'post',
                            'source_id' => $post_id,
                            'source_title' => $post->post_title,
                            'source_field' => 'post_content (filtered)',
                            'post_type' => $post_type,
                        );
                    }
                }
            }
        }

        return array(
            'links' => $all_links,
            'pages' => array_values($all_pages),
        );
    }

    /**
     * HTMLから全てのaタグを抽出（href値に関わらず）
     * DOMDocumentを使用してネストされたHTML構造を正確に処理
     *
     * @param string $html HTMLコンテンツ
     * @return array aタグ情報の配列
     */
    public static function extract_all_a_tags($html) {
        $links = array();

        if (empty($html)) {
            return $links;
        }

        // DOMDocumentを使用してaタグを抽出
        $dom = new DOMDocument();

        // エラーを抑制（不正なHTMLでも処理続行）
        libxml_use_internal_errors(true);

        // UTF-8エンコーディングを明示
        $html_with_meta = '<?xml encoding="UTF-8">' . $html;
        $dom->loadHTML($html_with_meta, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        libxml_clear_errors();

        // 全てのaタグを取得
        $anchors = $dom->getElementsByTagName('a');

        $link_index = 0; // リンクの通し番号（コンテンツ内での出現順）
        foreach ($anchors as $anchor) {
            // href属性を取得
            $href = $anchor->hasAttribute('href') ? $anchor->getAttribute('href') : '';
            $href = html_entity_decode($href);

            // aタグ内のテキストを取得（ネストされた要素からも抽出）
            $text = self::get_text_content($anchor);
            $text = trim(preg_replace('/\s+/', ' ', $text)); // 空白を正規化

            // 元のHTMLタグを保存
            $full_tag = $dom->saveHTML($anchor);

            $links[] = array(
                'href' => $href,
                'text' => mb_strimwidth($text, 0, 100, '...'),
                'full_tag' => $full_tag,
                'link_index' => $link_index, // コンテンツ内での出現順（0始まり）
            );

            $link_index++;
        }

        return $links;
    }

    /**
     * DOMノードからテキストコンテンツを再帰的に取得
     * SVGやアイコン要素は除外し、実際のテキストのみを抽出
     *
     * @param DOMNode $node DOMノード
     * @return string テキストコンテンツ
     */
    private static function get_text_content($node) {
        $text = '';

        foreach ($node->childNodes as $child) {
            // テキストノードの場合
            if ($child->nodeType === XML_TEXT_NODE) {
                $text .= $child->textContent;
            }
            // 要素ノードの場合
            elseif ($child->nodeType === XML_ELEMENT_NODE) {
                $tag_name = strtolower($child->nodeName);

                // SVG、script、styleは除外
                if (in_array($tag_name, array('svg', 'script', 'style'))) {
                    continue;
                }

                // data-icon属性を持つ要素は除外（アイコンコンテナ）
                if ($child->hasAttribute('data-icon')) {
                    continue;
                }

                // 再帰的に子要素のテキストを取得
                $text .= self::get_text_content($child);
            }
        }

        return $text;
    }

    /**
     * HTMLから全てのid属性を抽出
     *
     * @param string $html HTMLコンテンツ
     * @return array id属性値の配列
     */
    public static function extract_all_ids($html) {
        $ids = array();

        if (empty($html)) {
            return $ids;
        }

        // 全てのid属性を抽出
        // id="value" または id='value' の形式に対応
        preg_match_all('/\bid=["\']([^"\']+)["\']/', $html, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $id) {
                $id = trim($id);
                if (!empty($id) && !in_array($id, $ids)) {
                    $ids[] = $id;
                }
            }
        }

        return $ids;
    }
}
