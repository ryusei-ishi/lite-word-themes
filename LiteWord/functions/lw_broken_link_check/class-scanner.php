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
     * スキャン対象の投稿タイプを返す
     *
     * @return array
     */
    public static function get_target_post_types() {
        $post_types = get_post_types(array('public' => true), 'names');

        /**
         * スキャン対象の投稿タイプを差し替える。
         *
         * @param array $post_types 投稿タイプの配列。
         */
        return apply_filters('lw_link_list_post_types', array_values($post_types));
    }

    /**
     * スキャン対象の総件数を返す（バッチの進捗表示用）
     *
     * @return int
     */
    public static function count_scannable_posts() {
        $total = 0;

        foreach (self::get_target_post_types() as $post_type) {
            $count = wp_count_posts($post_type);
            if ($count && isset($count->publish)) {
                $total += (int) $count->publish;
            }
        }

        return $total;
    }

    /**
     * 公開ページを $limit 件ずつスキャンする。
     *
     * 🚨 全件を一度に読まないこと。
     *    以前は posts_per_page => -1 で全投稿をメモリに載せ、さらに1投稿あたり
     *    apply_filters('the_content') を2回かけていた。the_content は他プラグインの
     *    フック・ショートコード・外部API呼び出しまで巻き込むため、ページ数の多い
     *    サイトではメモリ枯渇かタイムアウトで落ちる。
     *
     * @param int $offset 開始位置。
     * @param int $limit  取得件数。
     * @return array ページ情報の配列（各要素が links と ids を持つ）
     */
    public static function scan_batch($offset = 0, $limit = 20) {
        $posts = get_posts(array(
            'post_type'        => self::get_target_post_types(),
            'post_status'      => 'publish',
            'posts_per_page'   => (int) $limit,
            'offset'           => (int) $offset,
            'orderby'          => 'ID',
            'order'            => 'ASC',
            'suppress_filters' => false,
        ));

        $pages = array();

        foreach ($posts as $post) {
            $pages[] = self::scan_post($post);
        }

        return $pages;
    }

    /**
     * 投稿1件をスキャンする
     *
     * @param WP_Post $post 対象。
     * @return array
     */
    public static function scan_post($post) {
        $raw_content = $post->post_content;

        // the_content は重いので1回だけ。id 抽出とリンク抽出で使い回す
        $filtered_content = apply_filters('the_content', $raw_content);

        $links = array();

        // ① 生コンテンツから抽出する。
        //    ここで採れた link_index だけが post_content 内の出現順と一致するので、
        //    インライン編集（lw_link_list_update_href）で対象を特定できる＝編集可能。
        if (!empty($raw_content)) {
            foreach (self::extract_all_a_tags($raw_content) as $link) {
                $link['source_field'] = 'post_content';
                $link['editable']     = true;
                $links[]              = $link;
            }
        }

        // ② フィルター適用後にしか現れないリンク（ブロックのレンダリング結果など）。
        //    post_content には無いので link_index では特定できない＝編集不可にする。
        if ($filtered_content !== $raw_content) {
            foreach (self::extract_all_a_tags($filtered_content) as $link) {
                if (self::link_exists($links, $link)) {
                    continue;
                }

                $link['source_field'] = 'post_content (filtered)';
                $link['editable']     = false;
                $link['link_index']   = -1; // 生コンテンツ内の位置が無いことを明示する
                $links[]              = $link;
            }
        }

        return array(
            'post_id'    => (int) $post->ID,
            'post_type'  => $post->post_type,
            'post_title' => $post->post_title,
            'ids'        => self::extract_all_ids($filtered_content),
            'links'      => $links,
        );
    }

    /**
     * その href が既に採れているか
     *
     * 🚨 テキストを突き合わせに使わないこと。
     *    the_content() は呼ぶたびに出力が揺れる。同じ投稿を続けて通しただけで
     *    18,030 → 18,290 → 18,205 バイトと変わる（動的ブロックが
     *    「1ページに1回だけ出す」類の状態を内部に持つため）。a タグの数は
     *    27 のまま変わらないのに、テキストや空白の入り方だけが変わる。
     *    そのためテキストを鍵にすると、同じリンクが実行のたびに別物と判定され、
     *    スキャン結果が 408〜530 件と安定しなかった（2026-08-22 に判明）。
     *    リンク切れの検査に必要なのは href なので、href だけで見る。
     *
     * @param array $links 既存。
     * @param array $link  候補。
     * @return bool
     */
    private static function link_exists($links, $link) {
        foreach ($links as $existing) {
            if ($existing['href'] === $link['href']) {
                return true;
            }
        }

        return false;
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
                'href'       => $href,
                'text'       => self::trim_text($text, 100),
                'full_tag'   => $full_tag,
                'link_index' => $link_index, // コンテンツ内での出現順（0始まり）
            );

            $link_index++;
        }

        return $links;
    }

    /**
     * リンクテキストを表示用に詰める
     *
     * 🚨 mb_* を条件分岐で使い分けないこと。
     *    ① mb_strimwidth() は mbstring 拡張が要る。共用サーバーでは無効なことがあり、
     *      そのままだと Fatal error でスキャンごと落ちる（php -l では検出できない）。
     *    ② かといって「あれば mb_strimwidth、無ければ _mb_substr」にすると、
     *      前者は【表示幅】（全角=2）・後者は【文字数】で切るため、
     *      同じサイトでも mbstring の有無でリンクテキストの長さが変わる。
     *      テキストは重複判定にも使うので、環境ごとにスキャン結果がぶれる。
     *      （実際にローカル CLI 530 件 / Apache 408 件とずれた）
     *    → WordPress の _mb_substr() に統一する。mbstring が無くても UTF-8 を壊さず、
     *      どの環境でも同じ結果になる（wp-includes/compat.php で必ず定義される）。
     *
     * @param string $text   元テキスト。
     * @param int    $length 上限（文字数）。
     * @return string
     */
    private static function trim_text($text, $length) {
        $trimmed = _mb_substr($text, 0, $length);

        return ($trimmed !== $text) ? $trimmed . '...' : $trimmed;
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
