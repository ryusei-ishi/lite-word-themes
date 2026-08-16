<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * カスタマイザー ― 会員限定ページ設定
 *
 * ここで決めるのはサイト全体の既定値。
 *   ・ログイン画面のデザイン（templates/membership/login/ptn_*）
 *   ・投稿のタイトル部分（FV）を残すか
 *   ・会員登録（受け付けるか・デザイン・付ける権限・入力項目）
 * 投稿ごとの上書きは「観覧権限」メタボックス（functions/membership/restrict_admin.php）。
 *
 * 閲覧権限そのものの設定は投稿サイドバーとカテゴリー編集画面。
 * 仕様 → sl_management/knowledge/products/liteword/doc/specs/membership-restriction.md
 * =============================================================== */

add_action( 'customize_register', 'lw_membership_customizer' );
function lw_membership_customizer( $wp_customize ) {

    $set_ttl = '会員限定ページ設定';
    $sec     = 'lw_membership_sec';
    $set     = 'lw_membership';

    $wp_customize->add_section( $sec, [
        'title'    => $set_ttl,
        'priority' => 206, // 拡張機能設定(205)の直後
    ] );

    $items = [
        [
            [
                'select',
                'login_ptn',
                '■ ログイン画面のデザイン',
                '会員限定に設定したページを、権限のない人が開いたときに表示される画面です。',
                lw_membership_login_ptn_arr(),
            ],
            [
                'select',
                'keep_post_fv',
                '■ 投稿のタイトル部分を残す',
                'ONにすると、投稿ではタイトル・アイキャッチ・日付・カテゴリー（FV）を表示したまま、'
                . '本文の位置にログイン画面を出します。<br>'
                . '本文と抜粋は出力されません。<br>'
                . '投稿ごとに変えたい場合は、その投稿の「観覧権限」から上書きできます。',
                ctm_switch_array( '残さない（既定）' ),
            ],
            [
                'select',
                'lock_admin',
                '■ 会員を管理画面に入れない',
                '会員（<strong>記事を書けない権限</strong>＝購読者や、購読者をベースに作った権限）に対して、'
                . 'サイト上部の管理バーを出さず、<code>/wp-admin/</code> を開いてもトップページに戻します。<br>'
                . '寄稿者・投稿者・編集者は記事を書くために管理画面が必要なので対象外です。<br>'
                . '⚠️ OFFにすると、会員にもWordPressの管理画面が見えるようになります。',
                ctm_switch_array( '入れない（既定）' ),
            ],
        ],
        lw_membership_register_customizer_items(),
    ];

    customize_set( $items, $set, $sec, $wp_customize );
}

/**
 * 会員登録の設定項目
 *
 * 実際の読み取りは functions/membership/register/settings.php・role.php。
 * ここは「画面に何を並べるか」だけを持つ。
 *
 * @return array
 */
function lw_membership_register_customizer_items() {

    return [
        [
            'select',
            'register_switch',
            '■ 会員登録を受け付ける',
            '固定ページにショートコード <code>[lw_member_register]</code> を貼ると、そこに登録フォームが出ます。<br>'
            . '<strong>登録された方には、パスワード設定用のリンクをメールでお送りします。</strong>'
            . 'このフォームでパスワードを直接入力してもらうことはありません（なりすまし登録を防ぐため）。',
            ctm_switch_array( '受け付けない（既定）' ),
        ],
        [
            'select',
            'register_page',
            '■ 会員登録ページ',
            'ショートコードを貼った固定ページを選んでください。<br>'
            . 'ログイン画面に「新規登録はこちら」のリンクが出るようになります。',
            lw_member_register_page_choices(),
        ],
        [
            'select',
            'register_ptn',
            '■ 会員登録フォームのデザイン',
            'ショートコードに <code>ptn="ptn_2"</code> のように書くと、そのページだけ別のデザインにできます。',
            lw_member_register_ptn_arr(),
        ],
        [
            'select',
            'register_role',
            '■ 登録した人に付ける権限',
            '未選択のときは「購読者」になります。<br>'
            . '🚨 <strong>記事に自由なHTMLを書ける権限（編集者など）は、安全のため一覧に出していません。</strong>'
            . 'メールアドレスだけで誰でも取得できる権限になるためです。<br>'
            . '「ユーザー &gt; 権限（ロール）の設定」で作った権限もここに並びます。',
            lw_member_register_role_choices(),
        ],
        [
            'select',
            'register_name',
            '■ お名前欄を出す',
            'ONのとき必須項目になります。入力された名前が、その方の表示名になります。',
            ctm_switch_array( '出す（既定）' ),
        ],
        [
            'select',
            'register_login',
            '■ ユーザー名欄を出す',
            'OFFのときは、メールアドレスから自動でユーザー名を作ります。<br>'
            . '会員はメールアドレスでもログインできるので、通常はOFFのままで困りません。',
            ctm_switch_array( '出さない（既定）' ),
        ],
        [
            'select',
            'register_profile',
            '■ プロフィール項目も入力してもらう',
            'ONにすると「ユーザー &gt; プロフィール管理」で作った項目を登録フォームにも出します。<br>'
            . 'これらはすべて任意入力です（必須にする仕組みがプロフィール管理側にないため）。',
            ctm_switch_array( '出さない（既定）' ),
        ],
        [
            'select',
            'register_consent',
            '■ 同意チェックを出す',
            '個人情報の取り扱いやご利用規約への同意を求める場合はONにしてください。<br>'
            . 'ONのときはチェックが入っていないと登録できません。',
            ctm_switch_array( '出さない（既定）' ),
        ],
        [
            'text',
            'register_consent_text',
            '■ 同意チェックの文言',
            '空欄のときは「個人情報の取り扱いに同意します」になります。<br>'
            . 'リンクを張れます（例: <code>&lt;a href="/privacy/"&gt;プライバシーポリシー&lt;/a&gt;に同意します</code>）。',
        ],
    ];
}

/**
 * ログイン画面のデザインパターン一覧（カスタマイザーの選択肢）
 *
 * 増やすときは templates/membership/login/{キー}/index.php と style.css も作ること。
 * フロント側（templates/membership/login/index.php）は
 * ディレクトリの存在で判定しているので、ここに足すだけで動く。
 */
function lw_membership_login_ptn_arr() {
    return [
        'ptn_1' => 'パターン1（カード型）',
        'ptn_2' => 'パターン2（シンプル）',
        'ptn_3' => 'パターン3（横並び）',
    ];
}
