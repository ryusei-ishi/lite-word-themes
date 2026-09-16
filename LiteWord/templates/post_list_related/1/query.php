<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 関連記事に出す投稿 ID を集める（index.php から使う）
 *
 *   ① 同じカテゴリーの記事からランダムに選ぶ
 *   ② 6件に足りない分を、カスタマイザーで選んだ範囲からランダムに補う
 *      「デザイン設定 - 投稿ページ > 関連記事」（theme mod `single_post_related_fill`）
 *        ''（未選択）… サイト全体（今まで通り）
 *        'parent'    … 同じ親カテゴリーの中だけ（いちばん上の親＋その子カテゴリーすべて）
 *        'none'      … 補わない
 *
 * 🚨 会員限定の記事は、見る権限の無い人には出さない（①②とも）。
 *    判定はページ表示と同じ lw_membership_can_view_post()（functions/membership/roles.php）。
 *    除いた分は同じ条件の中で取り直して補う。
 * =============================================================== */

/**
 * ②をどこから補うか
 *
 * @return string site|parent|none
 */
function lw_related_fill_scope() {
    $scope = Lw_theme_mod_set( 'single_post_related_fill', '' );
    return in_array( $scope, array( 'parent', 'none' ), true ) ? $scope : 'site';
}

/**
 * 「同じ親カテゴリーの中だけ」の範囲（カテゴリー ID）
 *
 * 記事のカテゴリーごとにいちばん上の親を求め、その親と子カテゴリーすべてを足す。
 * 別々の親に属するカテゴリーを持つ記事は、両方の親の範囲になる。
 *
 * @param int[] $category_ids 記事のカテゴリー
 * @return int[]
 */
function lw_related_parent_range( $category_ids ) {
    $range = array();

    foreach ( $category_ids as $category_id ) {
        $ancestors = get_ancestors( (int) $category_id, 'category' );
        $top       = $ancestors ? (int) end( $ancestors ) : (int) $category_id;
        $children  = get_term_children( $top, 'category' );

        $range[] = $top;
        if ( ! is_wp_error( $children ) ) {
            $range = array_merge( $range, $children );
        }
    }

    return array_values( array_unique( array_map( 'intval', $range ) ) );
}

/**
 * 条件に合う投稿を $need 件まで集める（見る権限の無い会員限定の記事は飛ばす）
 *
 * 1回目は今までと同じ件数・条件で取る（関連記事の SQL は今までと同じ。会員限定の機能が有効なサイトでは、
 * 判定のためにメタとタームを読む問い合わせが少し増える）。
 * 飛ばした分があれば、取った ID を除いて多めに取り直す。
 * ⚠️ 取り直しは最大2回（計3回）。orderby=rand は記事が多いと重いので、会員限定の記事ばかりのサイトで
 *    何度も回さない。足りなければ少ないまま出す。
 *
 * @param array $args    get_posts の条件（件数・除外・並び順以外）
 * @param int   $need    欲しい件数
 * @param int[] $exclude 除外する ID。🚨 参照渡し — 見た ID（出さなかった会員限定の記事も）を足して返す。
 *                       ②でそれを除外に使い、①で弾いた記事を何度も引き直さないため
 * @return int[]
 */
function lw_related_collect( $args, $need, &$exclude ) {
    $ids       = array();
    $can_check = function_exists( 'lw_membership_can_view_post' );

    for ( $round = 0; $round < 3 && count( $ids ) < $need; $round++ ) {
        $rest  = $need - count( $ids );
        $limit = ( 0 === $round ) ? $rest : max( $rest * 5, 30 );

        $found = get_posts( array_merge( $args, array(
            'post_type'              => 'post',
            'post_status'            => 'publish',
            'posts_per_page'         => $limit,
            'post__not_in'           => $exclude,
            'orderby'                => 'rand',
            'fields'                 => 'ids',
            'no_found_rows'          => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false,
        ) ) );

        if ( ! $found ) {
            break;
        }
        $exclude = array_merge( $exclude, $found );

        if ( $can_check ) {
            _prime_post_caches( $found, true, true );   // 判定で1件ずつメタとタームを読みに行かない
        }

        foreach ( $found as $id ) {
            if ( count( $ids ) >= $need ) {
                break;
            }
            if ( ! $can_check || lw_membership_can_view_post( $id ) ) {
                $ids[] = (int) $id;
            }
        }

        if ( count( $found ) < $limit ) {
            break;   // 条件に合う記事を使い切った
        }
    }

    return $ids;
}

/**
 * 関連記事に出す投稿 ID
 *
 * @param int $post_id 表示中の記事
 * @param int $want    出したい件数
 * @return int[]
 */
function lw_related_post_ids( $post_id, $want ) {
    $categories = wp_get_post_categories( $post_id );
    $exclude    = array( (int) $post_id );
    $ids        = array();

    /* ① 同じカテゴリーからランダムに集める（従来どおり） */
    if ( $categories ) {
        $ids = lw_related_collect( array( 'category__in' => $categories ), $want, $exclude );
    }

    /*
     * ② 足りない分を補う。
     *    同じカテゴリーに自分しかいない記事や、カテゴリーが付いていない記事では
     *    ①だけだと関連記事が1本も出ず、その記事からどこへも進めなくなるため。
     *    新着順だとどの記事でも同じ最新6本ばかりが並ぶので、①と同じく rand にする。
     */
    $need = $want - count( $ids );
    if ( $need <= 0 ) {
        return $ids;
    }

    $scope = lw_related_fill_scope();
    if ( 'none' === $scope ) {
        return $ids;
    }

    $args = array();
    if ( 'parent' === $scope ) {
        $range = lw_related_parent_range( $categories );
        if ( ! $range ) {
            return $ids;   // カテゴリーが無く、親の範囲を決められない
        }
        $args['category__in'] = $range;
    }

    // $exclude には①で見た ID が全部入っている（会員限定の機能が無いサイトでは①で出す ID と同じ＝今までの除外と同じ）
    return array_merge( $ids, lw_related_collect( $args, $need, $exclude ) );
}
