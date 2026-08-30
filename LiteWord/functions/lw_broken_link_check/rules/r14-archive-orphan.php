<?php
/**
 * R14 — 一覧ページ（カテゴリー等）にサイト内からのリンクが1本も無い。
 *
 * R13 が「記事そのものに入る道があるか」を見るのに対し、こちらは
 * **記事へ向かう通り道（一覧ページ）に入る道があるか**を見る。
 *
 * 🚨 これが無いと R13 が穴になる（2026-08-23・#870）。
 *    R13 は一覧ページを直接取りに行って「一覧から張られている」と数えていたので、
 *    その一覧ページ自体がどこからも辿れなくても孤立と判定しなかった。
 *    lite-word.com は実際にその状態で、カテゴリー一覧へのリンクがサイト内に0本、
 *    記事11本はそこからしか辿れなかったのに、診断は「孤立0件」と言っていた。
 *
 * 🚨 重大度は必ず info（気づき）にする。
 *    ここが原因で辿れなくなっている記事は R13 が要改善として1ページずつ挙げる。
 *    同じ原因を両方で減点すると、点数が二重に下がって実態と合わなくなる。
 *    この行は「なぜそうなったか」を1行で示す役目に徹する。
 *
 * 🚨 サイト全体への指摘なので post_id = 0 の1行にまとめる。
 *    テーブルの UNIQUE KEY は (post_id, rule_id) なので、複数行にはできない
 *    （そもそも直す場所は「メニュー」の1か所なので、件数ぶん並べても直しやすくならない）。
 *
 * 🚨 HTTP は1本も叩かない。入口があるかは巡回済みの台帳を見れば分かる。
 *
 * @package LiteWord
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 文章に名前を並べる上限。これを超えたぶんは「ほか◯件」にする
if ( ! defined( 'LW_SITE_ARCHIVE_NAMES_IN_MESSAGE' ) ) {
    define( 'LW_SITE_ARCHIVE_NAMES_IN_MESSAGE', 3 );
}

/**
 * 判定する。
 *
 * @param array $ledger lw_link_list_get_from_db() の戻り値。
 * @return array 指摘の配列。
 */
function lw_site_rule_archive_orphan( $ledger ) {
    // 公開記事が1本もない一覧は対象外（記事が無い一覧に導線が無いのは当たり前）
    $archives = LW_Site_Diagnostics::term_archives();

    if ( empty( $archives ) ) {
        return array();
    }

    $link_paths = LW_Site_Diagnostics::ledger_link_paths( $ledger );
    $orphans    = array();

    foreach ( $archives as $archive ) {
        $path = LW_Site_Diagnostics::link_path( $archive['url'] );

        // パスにできない一覧（URL の形が特殊）は判定しない。誤報を出さない側に倒す
        if ( '' === $path ) {
            continue;
        }

        if ( ! empty( $link_paths[ $path ] ) ) {
            continue;
        }

        $orphans[] = array(
            'label'    => $archive['label'],
            'url'      => $archive['url'],
            'taxonomy' => $archive['taxonomy'],
            'term_id'  => $archive['term_id'],
            'posts'    => $archive['posts'],
        );
    }

    if ( empty( $orphans ) ) {
        return array();
    }

    return array(
        lw_site_issue_make(
            0,
            'R14',
            'info',
            lw_site_rule_archive_orphan_message( $orphans ),
            array(
                'archives' => $orphans,
                'menus'    => admin_url( 'nav-menus.php' ),
            )
        ),
    );
}

/**
 * 1行の文章にする。
 *
 * @param array $orphans 入口の無い一覧ページ。
 * @return string
 */
function lw_site_rule_archive_orphan_message( $orphans ) {
    $names = array();

    foreach ( array_slice( $orphans, 0, (int) LW_SITE_ARCHIVE_NAMES_IN_MESSAGE ) as $orphan ) {
        $names[] = sprintf( '%s（記事%d本）', $orphan['label'], (int) $orphan['posts'] );
    }

    $text = implode( '・', $names );
    $rest = count( $orphans ) - count( $names );

    if ( $rest > 0 ) {
        $text .= sprintf( ' ほか%d件', $rest );
    }

    return ( 1 === count( $orphans ) )
        ? sprintf( '一覧ページ「%s」へのリンクが、サイト内に1本もありません', $text )
        : sprintf( '一覧ページ%d件（%s）へのリンクが、サイト内に1本もありません', count( $orphans ), $text );
}
