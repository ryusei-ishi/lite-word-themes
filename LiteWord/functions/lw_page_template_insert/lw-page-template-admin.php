<?php
/**
 * LiteWord ページテンプレート挿入 - 管理画面用
 * 管理メニュー、テンプレート一覧画面など
 */

if (!defined('ABSPATH')) exit;


/**
 * 管理メニューの追加
 */
add_action('admin_menu', 'lw_page_template_insert_menu');

function lw_page_template_insert_menu() {
    add_submenu_page(
        'edit.php?post_type=page',           // 親メニューのスラッグ（固定ページ）
        '固定ページサンプルテンプレート挿入',         // ページタイトル
        'テンプレートの挿入',                   // メニュータイトル
        'edit_pages',                         // 権限
        'lw_page_template_insert',            // スラッグ
        'lw_page_template_insert_page'        // コールバック関数
    );
}

/**
 * 🚨 この画面では管理画面の通知（admin_notices）を一切出さない（2026-09-01 Ryuichi 依頼）
 *
 * > Ryuichi「ページテンプレートの画面で、これが出てこないようにしてほしい。**他の通知も出てほしくない**」
 *
 * この画面は左に一覧・右にプレビューを敷き詰めた**全画面のUI**なので、
 * 通知が入るとレイアウトの上にかぶさって一覧の見出しが読めなくなる
 * （テーマの更新通知「LiteWord v2.4.0 が利用可能です」で実際に起きた）。
 * ダッシュボードでも同じことをしている → functions/theme_update.php の lw_hide_dashboard_notices()
 *
 * ⚠️ 消しても困らない理由: この画面は結果を**自前のポップアップ**
 *    （#lw-success-popup / #lw-error-popup）で出すので、admin_notices を使っていない。
 * ⚠️ 優先度を 999 にしているのは、current_screen / admin_init / admin_head で
 *    あとから登録された通知まで拾うため。早く消すと後付けのものが生き残る。
 */
add_action('admin_head', 'lw_page_template_insert_hide_notices', 999);

function lw_page_template_insert_hide_notices() {
    if (!isset($_GET['page']) || 'lw_page_template_insert' !== sanitize_key(wp_unslash($_GET['page']))) {
        return;
    }

    remove_all_actions('admin_notices');
    remove_all_actions('all_admin_notices');
    remove_all_actions('network_admin_notices');
    remove_all_actions('user_admin_notices');

    // 🚨 取りこぼし対策。フックを通さず直接書き出すプラグインがあるのでCSSでも隠す。
    //    #wpbody-content の直下だけを対象にして、この画面自身の中身は触らない。
    echo '<style id="lw-ti-hide-notices">'
        . '#wpbody-content > .notice,'
        . '#wpbody-content > .notice-info,'
        . '#wpbody-content > .notice-warning,'
        . '#wpbody-content > .notice-error,'
        . '#wpbody-content > .notice-success,'
        . '#wpbody-content > .update-nag,'
        . '#wpbody-content > .updated,'
        . '#wpbody-content > .error,'
        . '#wpbody-content > .lw-update-notice'
        . '{display:none !important;}'
        . '</style>' . "\n";
}

/**
 * 固定ページ一覧にテンプレート挿入ボタンを追加
 */
add_action('admin_head-edit.php', 'lw_add_template_button_to_page_list');

function lw_add_template_button_to_page_list() {
    global $typenow;
    
    // 固定ページ一覧の場合のみ実行
    if ($typenow != 'page') {
        return;
    }
    ?>
    <style>
    .lw-template-insert-button {

    }
    .lw-template-insert-button:hover {

    }
    .lw-template-insert-button:focus {

    }
    </style>
    <script>
    jQuery(document).ready(function($) {
        // テンプレート挿入ボタンを作成
        var templateButton = '<a href="<?php echo admin_url('edit.php?post_type=page&page=lw_page_template_insert'); ?>" class="page-title-action lw-template-insert-button">Lw専用 固定ページテンプレートの挿入</a>';
        
        // 「固定ページを追加」ボタンの後に追加
        $('.page-title-action').first().after(templateButton);
    });
    </script>
    <?php
}

/**
 * 統合されたテンプレート設定
 */
function lw_get_integrated_template_configs() {
    return [
        'standard-page' => [
            'label' => 'サンプルページ',
            'items' => [
                'top' => [
                    'label' => 'トップページ',
                    'templates' => [
                        [
                            'name' => 'トップページ サンプル',
                            'description' => '動画ヘッダーとブログ一覧などが表示される<br>シンプルなトップページ',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'トップページ カメラマン系 01',
                            'description' => '写真で見せる業種に。<br>お知らせ・コンセプト・写真集・ブログを1枚に並べた構成',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_2.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'トップページ カメラマン系 02',
                            'description' => 'カメラマン系 01 の別バージョン。<br>ヘッダーが切り替わるスライダーで、写真集も横に流れる形',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_2_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ パターン3',
                            'description' => 'いちばん短い構成。<br>中央に一言のヘッダー＋おすすめ3つ＋ブログ一覧だけ',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_3.php',
                            'public' => false,
                        ],
                          [
                            'name' => 'トップページ パターン4',
                            'description' => 'エステ・サロンに。<br>動画ヘッダー＋コンセプト＋施術メニュー＋スタッフ紹介＋アクセス',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_4.php',
                            'public' => false,
                        ],
                          [
                            'name' => 'トップページ 税理士系ブログ',
                            'description' => '士業・事務所に。<br>分野別の解説とブログ一覧で、記事を積んで信頼を得る形',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_5.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 美容室系1-1',
                            'description' => '美容室・サロンに。<br>コンセプト＋3つの特長＋ギャラリー＋オーナーあいさつ',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_6.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 美容室系1-2',
                            'description' => '美容室系1-1 のメニュー版。<br>特長のかわりに3つのメニューを並べ、問い合わせフォームまで付く',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_6_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ブログ系',
                            'description' => '発信が中心の方に。<br>おすすめ記事と最新記事だけの、いちばん軽い構成',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_7.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ カフェ系',
                            'description' => 'カフェ・飲食店に。<br>大きな写真と、ランチ・カフェ・テイクアウトの写真グリッド',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_8.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 動物病院系',
                            'description' => 'クリニック・動物病院に。<br>診療内容3つ＋予約の導線2本＋よくある質問＋アクセス',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_9.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ インテリア系',
                            'description' => '見せる商品がある業種に。<br>スタイリング例のギャラリーとスタッフ紹介が入った長めの構成',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_10.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ヘアーサロン系',
                            'description' => '美容室・サロンに。<br>丸いメニューの入口＋スタイル写真＋ビフォーアフター＋ご予約',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_11.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ ショップ系',
                            'description' => '物販・ショップに。<br>こだわり3つ＋ベストセラー＋作り手の言葉で締める構成',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_12.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ アウトドア系',
                            'description' => '体験・ツアーに。<br>動画ヘッダー＋ツアー3コース＋ベストシーズン＋よくある質問',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_13.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ リフォーム系',
                            'description' => '工務店・リフォームに。<br>お悩み3つ＋施工事例のビフォーアフター＋料金表＋お客様の声',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_15.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ 法律事務所系',
                            'description' => '士業・法律事務所に。<br>相談例6つ＋選ばれる6つの理由＋対応分野＋相談の流れ',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_16.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ お米農家系',
                            'description' => '生産者・産直に。<br>おすすめの食べ方＋作り手の想い＋お客様の声＋購入への導線',
                            'preview_url' => '',
                            'path' => 'page_template/top/ptn_17.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'トップページ エステサロン系',
                            'description' => 'エステ・サロンに。<br>美容室系1-1 と同じ組み立てを、エステの言葉と写真にした版',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_page_top_18/',
                            'path' => 'page_template/top/ptn_18.php',
                            'public' => false,
                        ],
                    ]
                ],
                 'service' => [
                    'label' => 'サービス紹介',
                    'templates' => [
                        [
                            'name' => 'サービス紹介ページ 01',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'サービス紹介ページ 施術メニュー',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 法律事務所',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 会計事務所',
                            'description' => 'サービス内容を紹介するページ',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 05 くらべて選ぶ',
                            'description' => '【型O：くらべるが主役】選ぶ物差しを先に3つ示してから、上下2段のチェックリストで「どちらが向いているか」を見せます。売り込む段を作らない形です。<br>不動産の売却相談を例にしていますが、<b>2択で迷わせる商売すべて</b>（売る／貸す、通う／通信、買う／借りる など）に使えます。<br>🚨 <b>会社名・条件・金額はすべて架空です。必ずご自身の内容に書き換えてください。</b>',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_5.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'サービス紹介ページ 06 向く人・向かない人',
                            'description' => '【型P：正直さが主役】<b>売り込む段を1つも作りません。</b>いちばん上に「向いていない方」を置き、良い点と気になる点を同じ大きさで並べます。<br>オンライン教室を例にしていますが、<b>合う合わないがはっきり分かれるサービス</b>に向きます。<br>🚨 <b>「気になる点」を空にしないでください。</b>良いことしか書いていないページは読む人にすぐ伝わります。<br>🚨 効果を断定する言い方（治る・必ず〜になる）は薬機法・景品表示法で書けません。',
                            'preview_url' => '',
                            'path' => 'page_template/service_list/ptn_6.php',
                            'public' => false,
                        ],
                    ]
                ],
                'company' => [
                    'label' => '会社情報',
                    'templates' => [
                        [
                            'name' => '会社概要ページ 01',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_1.php',
                            'public' => true,
                        ],
                         [
                            'name' => '会社概要ページ 02',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_2.php',
                            'public' => false,
                        ],
                         [
                            'name' => '会社概要ページ クリニック系',
                            'description' => '会社情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => '会社情報ページ 04 創業からの3つの節目',
                            'description' => '【型B：説明が主役】年表の表をやめて、<b>写真つきの横長カードを3段</b>積み、そのときに何を決めたかを物語として書く形です。<br>町工場を例にしていますが、<b>長く続いている商売</b>（工務店・飲食・士業・小売）に向きます。<br>🚨 会社名・年・数字はすべて架空です。必ず書き換えてください。<br>🚨 FVのボタンは「沿革を見る」でページ内（#history）へ飛びます。見出しを消すとリンク先が無くなります。',
                            'preview_url' => '',
                            'path' => 'page_template/company/ptn_4.php',
                            'public' => false,
                        ],
                    ]
                ],
                'contact' => [
                    'label' => 'お問合わせページ',
                    'templates' => [
                        [
                            'name' => 'お問合わせページ 01',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_1/',
                            'path' => 'page_template/contact/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'お問合わせページ 02',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_2/',
                            'path' => 'page_template/contact/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'お問合わせページ 03',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_3/',
                            'path' => 'page_template/contact/ptn_3.php',
                            'public' => false,
                        ],
                         [
                            'name' => 'お問合わせページ 04',
                            'description' => 'お問合わせフォームを掲載するページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_4/',
                            'path' => 'page_template/contact/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'お問合わせページ 05',
                            'description' => 'LiteWordで実際に使用しているお問合わせフォームのページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_5/',
                            'path' => 'page_template/contact/ptn_5.php',
                            'public' => false,
                        ],
                         [
                            'name' => 'お問合わせページ 06',
                            'description' => 'LiteWordで実際に使用しているお問合わせフォームのページ',
                            'preview_url' => 'https://lite-word.com/page-sample-list/sample_contact_6/',
                            'path' => 'page_template/contact/ptn_6.php',
                            'public' => false,
                        ],
                         
                    ]
                ],
                'profile' => [
                    'label' => '自己紹介・プロフィール',
                    'templates' => [
                        [
                            'name' => '自己紹介ページ 01',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => '自己紹介ページ 02',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 占い師系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 税理士系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => '自己紹介ページ 英会話教室系',
                            'description' => '自己紹介を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/profile/ptn_5.php',
                            'public' => false,
                        ],
                    ]
                ],
                'access' => [
                    'label' => 'アクセス・地図',
                    'templates' => [
                        [
                            'name' => 'アクセスページ 01',
                            'description' => 'アクセス情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_1.php',
                            'public' => true,
                        ],
                        [
                            'name' => 'アクセスページ 02',
                            'description' => 'アクセス情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'アクセスページ 03 3つの行き方',
                            'description' => '【型N：探す入口が主役】電車・バス・車の3通りを先に見せ、<b>駅からの道順を①②③④の番号カード</b>で目印つきに。最後によくある質問を置きます。<br>ヘアサロンを例にしていますが、<b>初めての人が迷いやすい場所にある店</b>（2階・路地・住宅街）すべてに向きます。<br>🚨 住所・電話・駅名・道順はすべて架空です。必ず書き換えてください。',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'アクセスページ 04 複数店舗・駐車場',
                            'description' => '【型N：探す入口が主役】<b>店が複数あるとき</b>のページ。住所を並べても選べないので、写真つきカードで「何がある店か」を先に見せます。駐車場の目印を写真4枚で添えています。<br>パン屋を例にしていますが、<b>2店舗以上ある商売</b>すべてに使えます。<br>🚨 FVは写真1枚だけのブロックです。<b>横長（16:9前後）の写真</b>に差し替えてください。縦長を入れると画面が写真で埋まります。<br>🚨 店名・営業時間・台数はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/access/ptn_4.php',
                            'public' => false,
                        ],
                    ]
                ],
                 'recruit' => [
                    'label' => '採用情報',
                    'templates' => [
                        [
                            'name' => '採用情報ページ スタートアップ企業',
                            'description' => '採用情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => '採用情報ページ 不動産系',
                            'description' => '採用情報を掲載するページ',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => '採用情報ページ 01 ある一日の流れ',
                            'description' => '【型B：説明が主役】募集要項の前に<b>働く一日を時間で見せる</b>形。応募する人が給料の次に知りたいのは「毎日どう過ごすか」です。最後に「先に言っておきます」で条件の悪い面も正直に書いています。<br>工務店を例にしていますが、<b>現場や店舗のある仕事</b>すべてに向きます。<br>🚨 FVは<b>動画背景</b>です。見本の動画が入っているので、ご自身の動画に差し替えてください。<br>🚨 時間・人数・残業時間はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_1.php',
                            'public' => false,
                        ],
                        [
                            'name' => '採用情報ページ 04 数字と募集要項',
                            'description' => '【型A：表が主役】01 と対になる形で、<b>数字4つと、職種ごとの募集要項の表</b>で作っています。セルの統合ができる表なので、職種で条件が違う募集に向きます。<br>事務・オフィスを例にしていますが、<b>複数の職種を同時に募集する会社</b>すべてに使えます。<br>🚨 人数・勤務時間・有給取得率・給与はすべて架空です。<b>実績のない数字を載せると求人票との食い違いになります。必ず自社の実数に書き換えてください。</b>',
                            'preview_url' => '',
                            'path' => 'page_template/recruit/ptn_4.php',
                            'public' => false,
                        ],
                    ]
                ],
                'pricing' => [
                    'label' => '料金表',
                    'templates' => [
                        [
                            'name' => '料金表ページ 01 3つのプラン比較',
                            'description' => '【型A：表が主役】3つのプランを横に並べて比べる表と、その直後に<b>「料金に含まれていないもの」を本文と同じ大きさで</b>置いた形です。<br>出張撮影を例にしていますが、<b>プランで分かれるサービス</b>すべてに使えます。<br>🚨🚨 <b>「含まれていないもの」の枠を消さないでください。</b>「〇〇円から」「初期費用0円」のような表示には、その条件を小さな注釈ではなく<b>近くに同じ大きさで</b>書く必要があります（景品表示法の打消し表示）。<br>🚨 金額・時間・枚数はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/pricing/ptn_1.php',
                            'public' => false,
                        ],
                        [
                            'name' => '料金表ページ 02 メニューごとの料金',
                            'description' => '【型A：表が主役】01 と違い、<b>項目と金額が縦に並ぶ品書きの形</b>です。追加でかかるものを3つの箱で示し、お金まわりの質問を開閉式のQ&amp;Aで置いています。<br>整体を例にしていますが、<b>メニューが並ぶ商売</b>（サロン・治療院・修理・清掃）に向きます。<br>🚨 金額・所要時間・回数券の条件はすべて架空です。<br>🚨 医療機関でない場合、保険が使える書き方をしないでください（テンプレートでは「使えません」と明記しています）。',
                            'preview_url' => '',
                            'path' => 'page_template/pricing/ptn_2.php',
                            'public' => false,
                        ],
                    ]
                ],
                'cases' => [
                    'label' => '実績・事例',
                    'templates' => [
                        [
                            'name' => '実績・事例ページ 01 工事の前と後',
                            'description' => '【型C：写真が主役】文字を持たない<b>写真スライダー</b>で始め、前と後を左右に並べ、最後にお客様の言葉で締める形です。工期と費用も添えています。<br>リフォームを例にしていますが、<b>前後が写真で分かる仕事</b>（外構・清掃・修復・整体・美容）すべてに向きます。<br>🚨🚨 <b>ビフォーアフターの写真と体験談は、必ずご本人の許可を得てから載せてください。</b><br>🚨 施術・美容では、効果を断定する言い方（必ず〇〇になる）は薬機法で書けません。<br>🚨 金額・工期はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/cases/ptn_1.php',
                            'public' => false,
                        ],
                        [
                            'name' => '実績・事例ページ 02 手がけた仕事と数字',
                            'description' => '【型O：結果を数字で置く】<b>横に流れるカードスライダー</b>で仕事を6件並べ、写真だけで終わらせず「そのあとどうなったか」を1件ずつ書く形です。件数・年数・日数の3つの数字と、進め方も置いています。<br>デザイン制作を例にしていますが、<b>実績が積み上がる仕事</b>（制作・工事・コンサル・修理）に向きます。<br>🚨 <b>「売上が1.3倍」のような成果は、実際に確認できた数字だけを書いてください。</b>根拠のない数字は景品表示法にふれることがあります。<br>🚨 事例・数字はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/cases/ptn_2.php',
                            'public' => false,
                        ],
                    ]
                ],
                'news' => [
                    'label' => 'お知らせ一覧',
                    'templates' => []
                ],
            ]
        ],
        'sales-framework' => [
            'label' => 'セールス系フレームワーク',
            'items' => [
                'aidma' => [
                    'label' => 'AIDMA（認知→行動）',
                    'templates' => []
                ],
                'aisas' => [
                    'label' => 'AISAS（検索型購買）',
                    'templates' => []
                ],
                'pasona' => [
                    'label' => 'PASONA（問題解決型）',
                    'templates' => []
                ],
                'pas' => [
                    'label' => 'PAS（シンプル訴求）',
                    'templates' => []
                ],
                'quest' => [
                    'label' => 'QUEST（教育型セールス）',
                    'templates' => []
                ],
                'fab' => [
                    'label' => 'FAB（機能→利益変換）',
                    'templates' => []
                ],
            ]
        ],
        'content-type' => [
            'label' => 'コンテンツ構成別',
            'items' => [
                'video-cta' => [
                    'label' => '動画メイン + CTA',
                    'templates' => [
                        [
                            'name' => '動画メインページ 01 レッスンの様子',
                            'description' => '【型D：動きが主役】<b>文章で伝わらないもの</b>（空気・速さ・人の距離）を、動画1本と横に流れる写真だけで見せる形です。文字は「行く前に知りたいこと」に絞っています。<br>ヨガ・ピラティスのスタジオを例にしていますが、<b>見ないと分からない商売</b>（教室・道場・工房・現場）すべてに向きます。<br>🚨🚨 <b>ファーストビューの動画は見本です。必ずご自身の動画に差し替えてください。</b>差し替えないまま公開すると、他のサイトと同じ絵になります。<br>🚨 写真を横に流す段は1枚が約320×200pxと小さいので、<b>寄った写真</b>を入れてください。引きの絵では何が写っているか分かりません。<br>🚨 料金・人数はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/video_cta/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'story' => [
                    'label' => 'ストーリー型（起承転結）',
                    'templates' => [
                        [
                            'name' => 'ストーリーページ 01 この店を始めた理由',
                            'description' => '【型Z：はじまりが主役】起承転結の4段だけで作る読み物です。「想い」を抽象語で書かず、<b>その日に何があったか</b>を書きます（半分を捨てていた1年目 → 「今日は無い」と言うことにした日 → いま決めている3つ）。<br>花屋を例にしていますが、<b>店主の顔で選ばれる商売</b>（工房・農家・飲食・整体・士業）すべてに向きます。<br>🚨 縦長の写真を1枚使います。PCでは左に立ち、スマホでは写真の上に見出しが重なるので、<b>中央に主役がある写真</b>に差し替えてください。<br>🚨 年・数字・出来事はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/story/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'comparison' => [
                    'label' => '比較表メイン',
                    'templates' => [
                        [
                            'name' => '比較表ページ 01 自分で・サロンで・病院で',
                            'description' => '【型Y：他の手段とくらべるのが主役】自社のプランを比べるのではなく、<b>自社を使わない方法とも並べて</b>表にする形です。「当店でなくてよい場合」を1段まるごと使って書いています。<br>フェイシャルサロンを例にしていますが、<b>自分でもできて、専門家にも頼める仕事</b>（清掃・整理・修理・学習・確定申告）すべてに向きます。<br>🚨 効果を断定する言い方（シミが消える・必ず白くなる）は薬機法で書けません。このテンプレートは「できること・できないこと」の対比だけで書いてあります。<br>🚨 表は左端が項目名の列です。列を増やすときは、見出しの数と列数の関係にご注意ください。<br>🚨 金額はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/comparison/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'faq' => [
                    'label' => 'FAQ中心型',
                    'templates' => [
                        [
                            'name' => 'FAQページ 01 4つに畳んだよくある質問',
                            'description' => '【型X：質問が主役】売り込む段を1つも作らないページです。いちばん多い3つだけ<b>畳まずに</b>出し、残りは「はじめての方」「料金」「ご予約」「お肌」の4つに畳みます。最後に聞き方を4つ（電話・フォーム・LINE・来店）。<br>脱毛サロンを例にしていますが、<b>問い合わせの多い商売</b>すべてに使えます。<br>🚨🚨 <b>いちばん下の「ここに無いご質問は」という見出しを消さないでください。</b>この見出しが「畳みの終わり」の目印になっていて、消すとその下のブロックが全部たたまれて見えなくなります。<br>🚨 質問文は14字までにしてください（スマホで2行になり、1文字だけ次の行に落ちます）。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_1.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 02 タブで分けるよくある質問',
                            'description' => '【型X2：分類が主役】上のタブを押すと、その分類の質問だけが下に出ます。<b>質問が25件あってもページが縦に伸びません。</b><br>歯科クリニックを例にしていますが、<b>問い合わせの多い業種</b>（内科・整形外科・動物病院・修理・窓口業務）すべてに使えます。<br>🚨 タブの文字は<b>全角6字まで</b>にしてください。スマホでタブが2行に折れると、分類の切れ目が分からなくなります。<br>🚨 分類は3〜6個が適量です。2個ならタブにする意味がなく、7個を超えると横スクロールが長くなります。<br>⚠️ JavaScript が動かない環境では、全部の分類が分類名つきで縦に並びます（壊れません）。<br>🚨 診療時間・費用の目安はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_2.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 03 検索して探すよくある質問',
                            'description' => '【型X3：探すのが主役】検索窓に言葉を入れると<b>その場で絞り込みます</b>。「よく探されている言葉」のボタンと、0件だったときの問い合わせ導線つき。見本は18件入っています。<br>ネットショップを例にしていますが、<b>質問が15件以上ある</b>ページ（宿・チケット・教室の申込）に向きます。<br>🚨 <b>質問が5件しかないページに検索窓を置かないでください。</b>目の前にある答えをわざわざ探させることになります。<br>🚨 各質問の「検索用の言葉」は<b>表示されません</b>。ひらがな・別の言い方（「領収書」に「りょうしゅうしょ インボイス」など）を入れておくと当たりやすくなります。<br>⚠️ ひらがな・カタカナ・全角半角の違いは自動で吸収します。漢字とかなの違いは吸収しないので、そこは検索用の言葉でおぎなってください。<br>🚨 送料・日数・返品の条件はすべて架空です。特定商取引法の表示はご自身の内容に必ず書き換えてください。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_3.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 04 左に分類が追従する2カラム',
                            'description' => '【型X4：地図のように読む】左の分類一覧が<b>スクロールしてもついてきます</b>。いま何の話を読んでいるかが常に見えていて、押すとその分類まで飛びます。<br>引越し会社を例にしていますが、<b>一度きりの大きな依頼</b>（リフォーム・葬儀・車の買取）に向きます。<br>🚨 分類は4〜8個が適量です。3個以下ならタブ（FAQページ 02）で足ります。<br>🚨 このブロックを<b>「はみ出しを隠す」設定の中に入れないでください。</b>追従が効かなくなります。<br>⚠️ スマホでは分類が上の横並び（横スクロール）に変わります。<br>🚨 料金・保険の上限額はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_4.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 05 会話で読むよくある質問',
                            'description' => '【型X5：会話が主役】Q&Aの一覧ではなく、<b>お客さまと店主の会話</b>として読ませる形です。「聞きにくいこと」ほど会話にすると角が立ちません。<br>学習塾を例にしていますが、<b>本人ではない人が申し込む業種</b>（習い事・保育・介護）に向きます。<br>🚨🚨 <b>顔写真は必ず差し替えてください。</b>質問者側はイラスト、回答者側は実際の担当者の写真がおすすめです。<br>🚨 <b>質問文は20字以内にしてください。</b>このブロックの質問文は色が固定（青）で、読みやすさを保つために文字を大きくしてあります。長いとスマホで4行になります。<br>🚨 月謝・人数・面談の回数はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_5.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 06 表で一気に見るよくある質問',
                            'description' => '【型X6：表が主役】「プランによって答えが違う質問」を<b>Q&Aで3回書かずに表1枚</b>にまとめる形です。その下に、どのプランでも答えが同じ質問を置いています。<br>貸し会議室を例にしていますが、<b>プランが複数ある業種</b>（コワーキング・レンタカー・宿泊・保守契約）に向きます。<br>🚨 表は<b>左端が項目名の列</b>です。列を増やすときは、見出しの数と列数の関係にご注意ください。<br>⚠️ スマホでは表が横スクロールになります。列は3〜4本までにしてください。<br>🚨 定員・料金・機材はすべて架空です。消防法の定員はご自身の物件のものに必ず書き換えてください。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_6.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 07 1問1答の読み物',
                            'description' => '【型X7：1つの答えが長い】Q&Aの一覧にせず、<b>1問を1つの節としてしっかり書く</b>形です。上に目次（押すとその問いへ飛ぶ）、1問ごとに見出し＋本文＋要点の囲い。<br>相続のご相談を例にしていますが、<b>答えが3行では終わらない相談ごと</b>（保険の見直し・不動産の売却・許認可）に向きます。<br>🚨 目次のリンク（#q1〜#q5）と、飛び先の見出しは<b>対になっています。</b>見出しを消すと目次のボタンがどこにも飛ばなくなります。<br>🚨 <b>法律の期限・税率・金額はすべて執筆時点の例です。</b>必ずご自身で最新の内容を確認してから書き換えてください。<br>🚨 報酬額・実績の割合はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_7.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 08 時間の順に答えるよくある質問',
                            'description' => '【型X8：時間軸が主役】分類ではなく<b>「いつの疑問か」</b>で分ける形です。「預ける前」「預けている日」「返ってきたあと」の3段で、帯の色を交互にして進んでいくのが分かるようにしています。<br>車検・整備工場を例にしていますが、<b>物や車を預かる商売</b>（クリーニング・修理・リペア・ペットホテル）すべてに使えます。<br>⚠️ 3段とも同じ形のQ&Aを使っています。<b>形をそろえてあるからこそ、変わっているのが「時間」だけだと分かります。</b>1つだけ別の形にしないでください。<br>🚨 費用の内訳にある自賠責保険料・重量税は執筆時点の例です。金額は必ず最新のものに書き換えてください。<br>🚨 基本料・所要時間はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_8.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 09 お断りしていることを先に書くFAQ',
                            'description' => '【型X9：断りが主役】ふつうのFAQは「できます」を並べますが、これは逆で<b>できないこと・お願いしていることを先に、同じ大きさで</b>書きます。最後に「それでも来てほしい」と書いて締めます。<br>飲食店の予約を例にしていますが、<b>席や時間を押さえる商売</b>（美容室・宿・撮影スタジオ）すべてに使えます。<br>🚨 <b>「できない」を小さく書かないでください。</b>小さく書くと、あとで「聞いていない」になります。このテンプレートは同じ大きさで並べてあります。<br>🚨 キャンセル料の金額と条件は、ご自身の規約に必ず合わせてください。書いてある金額は架空です。<br>🚨 席数・営業時間・支払い方法はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_9.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'FAQページ 10 窓口の案内が主役のサポートページ',
                            'description' => '【型X10：たどり着かせるのが主役】質問に答えるより、<b>正しい窓口へ渡す</b>ためのページです。①まず自分で確かめる3つ ②症状からさがす ③窓口3つと、何を書いて送ればいいか。<br>アプリ・オンラインサービスを例にしていますが、<b>問い合わせ窓口が複数ある商売</b>（通信・保守契約・機器の販売）に向きます。<br>🚨🚨 <b>ファーストビューの動画は見本です。必ずご自身の動画に差し替えてください。</b>差し替えないまま公開すると、他のサイトと同じ絵になります。<br>🚨 このページは写真を1枚も使っていません（動画のみ）。<b>サポートのページに営業用の写真を入れると、困って探している人の邪魔になります。</b><br>🚨 受付時間・返信の目安・障害情報のリンク先はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/faq/ptn_10.php',
                            'public' => false,
                        ],
                    ]
                ],
                'testimonial' => [
                    'label' => 'お客様の声メイン',
                    'templates' => [
                        [
                            'name' => 'お客様の声ページ 01 通ってくださっている方の言葉',
                            'description' => '【型Q：他人の言葉が主役】<b>自分の売り文句を1行も書かない</b>ページです。いちばん上に「どうやって集めた声か」（謝礼なし・文章を直していない・許可を得ている）を置いてから、写真つきのスライダーで6人ぶん。押すと全文が開きます。<br>エステサロンを例にしていますが、<b>続けて通っていただく商売</b>（治療院・教室・美容室・飲食）すべてに向きます。<br>🚨🚨 <b>体験談は必ずご本人の許可を得てから載せてください。</b><br>🚨 「同じことがどなたにも起きるという意味ではありません」という段を入れてあります。<b>消さないでください</b>（景品表示法・薬機法）。<br>🚨 お名前・年代・写真・文章はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/testimonial/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'before-after' => [
                    'label' => 'ビフォーアフター型',
                    'templates' => [
                        [
                            'name' => 'ビフォーアフターページ 01 手もとの前と後',
                            'description' => '【型R：変化が主役】説明を先に書かず、<b>写真2枚だけ</b>で見せる形です。前と後を3組、その下に金額と所要時間を1行ずつ添えています。<br>ネイルサロンを例にしていますが、<b>前と後が写真で分かる仕事</b>（整体・美容室・清掃・外構・修復）すべてに使えます。<br>🚨🚨 <b>写真は必ずご本人の許可を得てから載せてください。</b><br>🚨 前と後は<b>同じ場所・同じ照明</b>で撮り、明るさや色を後から変えないでください（景品表示法）。テンプレートにもその旨を書いてあります。<br>🚨 施術・美容では効果を断定する言い方（必ず〇〇になる）は薬機法で書けません。<br>🚨 金額・時間はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/before_after/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
            ]
        ],
        'lead-generation' => [
            'label' => 'リード獲得特化',
            'items' => [
                'whitepaper' => [
                    'label' => 'ホワイトペーパーDL',
                    'templates' => [
                        [
                            'name' => '資料ダウンロードページ 01 受け取り方は3つ',
                            'description' => '【型I：導線が主役】資料そのものより<b>受け取り方の道</b>を先に見せる形です。「入力せずにその場で開く／メールで受け取る／冊子を郵送する」の3つを並べ、入力する項目と、送ったあとに何をしないかまで書いています。<br>小さな会社向けの業務資料を例にしていますが、<b>会社どうしの取引で資料を配る場面</b>すべてに使えます。<br>🚨 「営業のご連絡はいたしません」と書くなら、<b>必ず守れる範囲で</b>書いてください。<br>🚨 ページ数・容量・中身はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/whitepaper/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'webinar' => [
                    'label' => 'ウェビナー登録',
                    'templates' => [
                        [
                            'name' => 'ウェビナー登録ページ 01 3回でひととおり',
                            'description' => '【型A：表が主役】料金表ではなく<b>日程表</b>を主役にした形です。日程・受け方・費用・定員・録画・欠席・顔出し・そのあと、の8行を1つの表にまとめています。<br>小さなお店向けのオンライン講座を例にしていますが、<b>説明会・体験会・セミナー</b>すべてに使えます。<br>🚨🚨 <b>「無料」「録画つき」と書いたら、その条件</b>（録画は2週間・ダウンロード不可 など）<b>を、小さな注釈ではなく本文と同じ大きさで書いてください</b>（景品表示法の打消し表示）。<br>🚨 日付・定員・内容はすべて架空です。必ず書き換えてください。',
                            'preview_url' => '',
                            'path' => 'page_template/webinar/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'consultation' => [
                    'label' => '無料相談予約',
                    'templates' => [
                        [
                            'name' => '無料相談予約ページ 01 相談の日に何をするか',
                            'description' => '【型K：予約までの段取りが主役】予約が押されない理由は値段ではなく「その日に何をされるか分からない」ことです。だから<b>当日すること → 予約から当日までの5段 → 無料の範囲</b>の順で作っています。<br>ブライダルエステを例にしていますが、<b>相談から始まる商売</b>（リフォーム・保険・士業・整体・カウンセリング）すべてに使えます。<br>🚨 ファーストビューのボタンはページの中（#flow）へ飛びます。「予約から当日まで」の見出しを消すとリンク先が無くなります。<br>🚨 「無料」の範囲と、どこから有料かを本文の大きさで書いてあります。<b>この段を消さないでください。</b><br>🚨 金額・日程はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/consultation/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'document' => [
                    'label' => '資料請求',
                    'templates' => [
                        [
                            'name' => '資料請求ページ 01 お送りする冊子の中身',
                            'description' => '【型L：手元に残る資料が主役】「資料をお送りします」だけでは請求されません。<b>中身を写真つきで3つ</b>見せてから、届いたあとに何をしないか（電話しない・続けて送らない）を書く形です。画面で完結せず、<b>紙で郵送する</b>ものを想定しています。<br>パン・お菓子の教室を例にしていますが、<b>手元に置いて読んでもらう商売</b>（住宅・介護・学校・保険）に向きます。<br>🚨 個人情報をお預かりするので、<b>何に使い、何に使わないか</b>を本文の大きさで書いてあります。<b>消さないでください。</b><br>🚨 ページ数・内容はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/document/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'newsletter' => [
                    'label' => 'メルマガ登録',
                    'templates' => [
                        [
                            'name' => 'メルマガ登録ページ 01 月に2回だけ送ります',
                            'description' => '【型B：説明が主役】登録が押されない理由は「毎日来そう」「やめにくそう」の2つです。だから<b>頻度とやめ方をいちばん上</b>に書き、中身の説明はそのあとに置いています。最後は読者の言葉を吹き出しで。<br>化粧品の小さな店を例にしていますが、<b>続けて読んでいただく商売</b>すべてに使えます。<br>🚨 メールアドレスをお預かりするので、<b>頻度・解除の方法・使い道</b>を本文の大きさで書いてあります。<b>消さないでください。</b><br>🚨 吹き出しの似顔絵・お名前・文章はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/newsletter/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'assessment' => [
                    'label' => '無料診断・査定',
                    'templates' => [
                        [
                            'name' => '無料診断・査定ページ 01 まず、いまの状態を知る',
                            'description' => '【型E：まず知ることが主役】申し込みではなく<b>「知るだけ」を目的地にする</b>ページです。診断で分かること・当日の流れ・<b>分からないこと</b>の3つで作っています。<br>エステの肌チェックを例にしていますが、<b>見てもらってから決める商売</b>（査定・買取・点検・住宅診断・相談）すべてに使えます。<br>🚨🚨 <b>「無料」と書いたら、どこから有料になるかを、小さな注釈ではなく本文と同じ大きさですぐ近くに書いてください</b>（景品表示法の打消し表示）。テンプレートの「無料の範囲」がそれです。<b>消さないでください。</b><br>🚨 医療機関でない場合、診断・治療と読める書き方をしないでください。',
                            'preview_url' => '',
                            'path' => 'page_template/assessment/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'estimate' => [
                    'label' => '無料見積もり',
                    'templates' => [
                        [
                            'name' => '無料見積もりページ 01 見積書のどこを見るか',
                            'description' => '【型L2：見積書の中身が主役】「無料でお見積りします」だけでは依頼されません。<b>工事ごとの金額の目安を先に出し、見積書のどこを見ればよいかをこちらから教える</b>形です。相見積もりが当たり前の商売なので、「比べてください」と自分から言い、比べ方まで書いています。<br>外壁塗装を例にしていますが、<b>現地を見ないと金額が出ない工事</b>（リフォーム・外構・解体・引越）すべてに向きます。<br>🚨 金額・坪数・年数はすべて架空です。ご自分の相場に必ず書き換えてください。<br>🚨 「お断りのご連絡は要りません」と書くなら、<b>必ず守れる範囲で</b>書いてください。<br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/estimate/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'trial' => [
                    'label' => '無料体験の予約',
                    'templates' => [
                        [
                            'name' => '無料体験予約ページ 01 空いている日から選ぶ',
                            'description' => '【型L3：空いている日が主役】「体験できます」ではなく<b>いちばん上に空き枠の表を置いて、「いつ行けるか」から入る</b>形です。当日の60分を分単位で見せ、「楽譜が読めない」「そのまま入会にならないか」といった心配を先に潰します。<br>ピアノ教室を例にしていますが、<b>通って習う商売</b>（教室・塾・ジム・治療院・サロン）すべてに向きます。<br>🚨 空き枠の○△×・月謝・日程はすべて架空です。<br>🚨 「その場でお返事をいただくことはありません」と書くなら、<b>必ず守ってください。</b><br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/trial/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'line' => [
                    'label' => 'メッセージ配信の登録',
                    'templates' => [
                        [
                            'name' => 'メッセージ配信の登録ページ 01 届く文面をそのまま見せる',
                            'description' => '【型L4：手元のスマホが主役】「登録してください」と頼まず、<b>登録すると実際に届く文面を、そのまま3枚見せる</b>形です。送る回数・送らない時間帯・やめ方まで書いています。<br>美容室を例にしていますが、<b>お店とお客さまが続く商売</b>（飲食・整体・小売・ネイル）すべてに向きます。<br>🚨🚨 <b>このページだけ入力フォームを入れていません。</b>1タップで終わるのが正しい導線で、入力欄を置くと途中でやめる人が増えるためです。<b>ボタンの飛び先を、ご自身のアカウントのURLに差し替えてください。</b><br>🚨 見本の画面3枚は<b>架空のもの</b>で、実在するメッセージアプリの画面ではありません。ご自身の配信の見本に差し替えていただけます。<br>🚨 割引額・配信回数はすべて架空です。',
                            'preview_url' => '',
                            'path' => 'page_template/line/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'sample' => [
                    'label' => '無料サンプル・お試し',
                    'templates' => [
                        [
                            'name' => '無料サンプル・お試しページ 01 届く箱の中身',
                            'description' => '【型L5：届く箱の中が主役】お試しを頼まれない理由は「そのまま定期購入にされそう」です。だからこのページは<b>自動継続にならないことを、値段より先に、本文と同じ大きさで</b>書いています。箱の中身・お届けの条件・使い方の3つで作っています。<br>自家焙煎のコーヒーを例にしていますが、<b>まず試してもらう商売</b>（お茶・調味料・化粧品・日用品）に向きます。<br>🚨🚨 <b>「自動継続はありません」と書くなら、必ずそのとおりにしてください。</b>定期購入につながる場合は、その条件を同じ大きさで書く必要があります（景品表示法・特定商取引法）。<br>🚨 内容量・産地・金額はすべて架空です。<br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/sample/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'event' => [
                    'label' => '見学会・説明会の予約',
                    'templates' => [
                        [
                            'name' => '見学会・説明会の予約ページ 01 当日の時間割',
                            'description' => '【型L6：当日の時間割が主役】見学の予約が入らないいちばんの理由は「行ったら断りにくくなりそう」です。だからこのページは<b>当日の60分を分単位で先に見せて、何が起きないかまで書き</b>ます。「その場でお申し込みはうかがいません」「あとからお電話しません」を並べています。<br>デイサービスの見学会を例にしていますが、<b>来てもらってから決める商売</b>（工務店の完成見学会・保育園の説明会・学校のオープンキャンパス・住宅展示場）すべてに向きます。<br>🚨 日時・人数・費用はすべて架空です。<br>🚨 「勧誘はしません」と書くなら、<b>必ず守ってください。</b><br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/event/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'campaign' => [
                    'label' => 'キャンペーン応募',
                    'templates' => [
                        [
                            'name' => 'キャンペーン応募ページ 01 締切と当選人数を先に出す',
                            'description' => '【型L7：締切と当選人数が主役】応募ページで書かれないものが3つあります — 当たる人数、発表の方法、そして規約。このページは<b>その3つを上から順に置き、規約は畳んで全文を載せ</b>ます。<br>雑貨店の周年キャンペーンを例にしていますが、飲食・EC・美容のプレゼント企画すべてに向きます。<br>🚨🚨 <b>このテンプレートを貼るページは、ヘッダーを「非表示」に設定してください。</b>ファーストビューがロゴ・メニュー・ボタンまで自分で描くので、設定しないとヘッダーが二重になります。<br>🚨 ファーストビューのメニューは<b>このページに焼き込まれます</b>（サイトのメニュー設定とは連動しません）。リンク先を必ずご自分のページに直してください。<br>🚨🚨 景品表示法の対象です。<b>当選人数・締切・発表方法・景品の価額</b>を必ず実際のものに書き換えてください。期間・人数・賞品はすべて架空です。<br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/campaign/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'checklist' => [
                    'label' => 'チェックで自己診断',
                    'templates' => [
                        [
                            'name' => '自己診断ページ 01 10のチェックで、いまの位置を知る',
                            'description' => '【型L8：自分で答えるのが主役】売り込む段を1つも作らず、<b>読む人が自分で手を動かす</b>形です。10個のチェック → 当てはまった数の読み方 → 次にやること、と進み、<b>急がなくてよい場合も同じ大きさで</b>書いています。<br>相続の相談を例にしていますが、<b>状況によって答えが変わる商売</b>（保険の見直し・補助金の可否・IT導入・住まいの点検）すべてに向きます。<br>🚨 士業・保険の広告は<b>煽らないこと</b>。「今すぐ動かないと損をします」と書かないでください。<br>🚨 数字・年数はすべて架空です。法律上の判断ではない旨の注記を消さないでください。<br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/checklist/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'tel' => [
                    'label' => '電話でかんたん相談',
                    'templates' => [
                        [
                            'name' => '電話相談ページ 01 かける前に知りたいこと',
                            'description' => '【型L9：かける前の不安が主役】<b>このページだけフォームが主役ではありません。</b>水漏れ・鍵・害虫のような困りごとは、フォームに書いている余裕がなく電話が正解になります。だから「いくらか・いつ来るか・追加でいくら要るか」を先に全部出し、<b>作業 × 時間帯の料金表</b>と<b>24時間の受付表</b>を置いています。<br>水まわりの緊急対応を例にしていますが、鍵開け・害虫駆除・ガラス・レッカー・葬儀にも向きます。<br>🚨 電話番号（000-0000-0000）は見本です。<b>必ずご自分の番号に差し替えてください。</b><br>🚨 金額・時間はすべて架空です。「追加になることがあるもの」を消さないでください。<br>🚨 急がない相談のための小さなフォームも1つ入っています。',
                            'preview_url' => '',
                            'path' => 'page_template/tel/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'freetrial' => [
                    'label' => '無料トライアル',
                    'templates' => [
                        [
                            'name' => '無料トライアルページ 01 始め方と、やめ方',
                            'description' => '【型L10：始め方と、やめ方が主役】無料トライアルで止まるのは「始める瞬間」ではなく<b>「あとで解約できるか分からない」</b>ところです。だからこのページは<b>やめ方を1つの帯として本文の大きさで</b>書いています。始めるのに要らないもの・14日の使い方・終わったらどうなるか、の順です。<br>クラウドの業務ツールを例にしていますが、会員制サービス・オンライン学習・アプリにも向きます。<br>⚠️ 業種セットの「SaaS・IT」にも体験ページがありますが、あちらは<b>入口を並べる形</b>で骨格が違います。<br>🚨 料金・日数・機能はすべて架空です。<b>「クレジットカードは要りません」と書くなら、必ずそのとおりに。</b><br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/freetrial/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
                'waitlist' => [
                    'label' => '先行案内・キャンセル待ち',
                    'templates' => [
                        [
                            'name' => '先行案内・キャンセル待ちページ 01 待つ理由',
                            'description' => '【型L11：待つ理由が主役】満席のページは、たいてい「満席です」で終わり、そこで人が消えます。このページは<b>いま何人待っていて、次はいつで、登録すると何が起きるか</b>を数字で出し、<b>増やせない理由</b>（作業台が6つしかない）まで書いています。<br>少人数のレザークラフト教室を例にしていますが、<b>席や数に限りがある商売</b>（人気サロンのキャンセル待ち・限定商品の入荷案内・満席の講座）に向きます。<br>🚨🚨 <b>作った締切・作った品切れを書かないでください。</b>希少性は本当に希少なときだけ効きます。<br>🚨 人数・回数・日程はすべて架空です。<br>🚨 <b>送信できるお問い合わせフォームが入っています。</b>中身は 管理画面の「Lwお問い合わせ」から変えられます（このテンプレートでは変えられません）。フォームを1つも作っていないサイトでも、お名前／メールアドレス／お問合せ内容 の3つが既定で出ます。',
                            'preview_url' => '',
                            'path' => 'page_template/waitlist/ptn_1.php',
                            'public' => false,
                        ],
                    ]
                ],
            ]
        ],
        'industry' => [
            'label' => '業種別テンプレート',
            'items' => [
                'realestate' => [
                    'label' => '不動産（物件紹介）',
                    'templates' => [
                        [
                            'name' => '不動産 トップページ',
                            'description' => '【型N：探す入口が主役】地域密着の不動産会社（賃貸＋売買）のトップページ。ヘッダーを内蔵した全画面のファーストビュー→<b>用途で選ぶ3つの入口（借りる・買う・売る）</b>→新着の物件6件（写真カード）→エリアから探す（写真タイル4枚）→選ばれる理由→お部屋探しの流れ6段→お客様の声4件→お知らせ→会社案内と<b>宅地建物取引業免許番号</b>→来店のご案内。不動産サイトに来た人が最初にするのは「読む」ことではなく「探す」ことなので、<b>上から3段めまでを全部“探す入口”</b>にして、信用（理由・声・免許）はその下に置いています。賃貸仲介・売買仲介のほか、管理会社・リフォーム兼業の店にもそのまま使えます。🚨 <b>このページを貼ったら、ページ設定の「ヘッダー」を「非表示」にしてください。</b>ファーストビューがロゴ・メニュー・ボタンを自分で持っているため、そのままだとヘッダーが二重に出ます。🚨 <b>宅地建物取引業免許番号は宅建業法で表示が義務</b>です（会社案内の段に欄を用意してあります）。自社の免許番号に必ず差し替えてください。色はページの「カラー設定」に追従します。物件・写真・電話番号はすべて差し替えてください。',
                            'preview_url' => 'https://lite-word.com/fudosan-top/',
                            'path' => 'page_template/fudosan/top_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '不動産 物件を探すページ',
                            'description' => '【型A：表が主役／2ページ目用】不動産会社の「物件を探す」ページ。下層用の見出し帯→探し方の3つの入口→<b>取り扱い中の物件（子ページを自動で並べる）</b>→<b>間取りと広さの読み替え表</b>→<b>駅までの徒歩◯分の数え方</b>→写真では分からないこと→内見の流れ4段→ご予約への導線。物件情報は毎日入れ替わるのでテンプレートには焼き込まず、「変わらないもの（用語・数字の読み方・見に行くときの注意）」だけを置いています。🚨 <b>物件一覧は「このページの子ページ」を自動で並べます。</b>物件ごとに固定ページを作り、「ページ属性」の親を このページ にしてください。ブロックの設定で親ページIDと表示件数を変えられます。<b>子ページがまだ1枚も無いあいだは「該当するページがありません。」と表示されます</b>（不具合ではありません）。賃貸・売買のほか、中古車・機械・区画など「1件ずつページを作って並べたい」商材にも使えます。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/fudosan-bukken/',
                            'path' => 'page_template/fudosan/bukken_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '不動産 はじめての方へページ',
                            'description' => '【型B：説明が主役】はじめてお部屋を借りる方に向けた説明ページ。下層用の見出し帯→<b>初期費用の内訳（家賃8万円の部屋を例に1項目ずつ）</b>→<b>よく使う言葉（押すと開く用語6つ）</b>→内見のときに見るところ→ご用意いただく書類→ご相談への導線。はじめての方がいちばん不安に思う「結局いくら要るのか」と「言葉の意味が分からない」の2つに絞り、写真を使わずに答える作りです。賃貸仲介のほか、はじめての方への説明が要る業種（保険・士業・教習所・介護）にも転用できます。🚨 <b>金額はすべて例です。</b> 自社の地域の相場に必ず書き換えてください。（敷金・礼金の慣習は地域差が大きく、関西では「保証金・敷引き」など呼び方も変わります）✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/fudosan-hajimete/',
                            'path' => 'page_template/fudosan/hajimete_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '不動産 売却・査定ページ',
                            'description' => '【型J：不安の解消が主役】不動産会社の「売却・査定」ページ。下層用の見出し帯→<b>ご相談前によく聞かれる心配5つ</b>→2つの査定の違い→査定から引き渡しまで6段→<b>売却の実例3件（写真と文章が左右交互）</b>→よくある質問8問→ご相談への導線。売る側のお客様は「まだ売ると決めていない」段階の方が大半なので、<b>売り込む段を1つも置かず</b>、相談をためらう理由（しつこく営業されそう・相場だけ知りたい・家族がまだ決めていない）を先に全部つぶす作りにしました。不動産のほか、査定や見積りから始まる業種（car買取・遺品整理・M&A仲介）にも転用できます。🚨 <b>金額と期間はすべて例です。</b>地域の相場に必ず書き換えてください。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/fudosan-baikyaku/',
                            'path' => 'page_template/fudosan/baikyaku_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '不動産 会社案内ページ',
                            'description' => '【型F：人が主役／2ページ目用】不動産会社の「会社案内」ページ。下層用の見出し帯→<b>代表のごあいさつ（縦長写真＋長文）</b>→担当者3人→会社の歩み（年表4つ）→<b>宅地建物取引業免許と加盟団体</b>→会社概要の表→地図の置き場→ご来店への導線。不動産は同じ物件をどの会社からでも紹介してもらえる商売なので、最後は「この人に任せるか」で決まります。そのため会社概要の表を最後に回し、<b>人</b>から先に見せる並びにしました。🚨 <b>宅地建物取引業免許番号は宅建業法で表示が義務</b>です。免許の段と会社概要の表の2か所にありますので、必ず自社のものに差し替えてください。🚨 地図は<b>空の枠</b>にしてあります。Google マップの埋め込みコードを貼ってください（他社の座標が初期値で入っていると、消し忘れたまま公開されてしまうためです）。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/fudosan-company/',
                            'path' => 'page_template/fudosan/company_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '不動産 お問い合わせ・来店予約ページ',
                            'description' => '【型I：導線が主役／2ページ目用】不動産会社の「お問い合わせ・来店予約」ページ。下層用の見出し帯→<b>来店とオンラインの2択（背景写真つきの大きなカード）</b>→お問い合わせフォーム→<b>送ったあとどうなるか</b>→お電話の窓口→ご来店の前に→無理にお勧めしないことのお約束。売り込む段は1つもありません。不動産は「まず店に行かないといけないのか」が最初のためらいになるので、<b>来店とオンラインを同じ大きさで並べて</b>先に外しています。🚨 <b>フォームは Lwお問い合わせ の番号（formId）を自分のものに変えてください。</b>そのままだと1番のフォームが出ます。電話番号・受付時間も差し替えてください。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/fudosan-contact/',
                            'path' => 'page_template/fudosan/contact_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'affiliate' => [
                    'label' => 'アフィリエイト・比較サイト',
                    'templates' => [
                        [
                            'name' => 'コスメ比較・レビューサイト トップページ',
                            'description' => '【型O：くらべるが主役】コスメ・スキンケアの比較／レビューサイトのトップページ。<b>PR表記の帯（ステマ規制対応）</b>→左に文・右に写真のファーストビュー→こんな悩みはありませんか→<b>5つを横に比べる表</b>→実際に使ってみた（丸い写真3枚）→選び方のQ&A（キャラつきの対話）→新着の記事（自動）→運営者のプロフィール→まとめ記事への導線。比較サイトに来た人は「読みたい」のではなく「どれを買えばいいか早く知りたい」ので、長い前置きを置かず、<b>表をページの真ん中に</b>置いています。コスメのほか、サブスク・家電・食品・保険など「並べて比べる」サイトにそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください。</b> 2023年10月から、広告であることを隠して商品を勧めると景品表示法違反（ステマ規制）になります。アフィリエイトリンクを1つでも置くなら、この表示が要ります。🚨 <b>このセットだけ色を固定しています</b>（淡いピンク）。見出しブロックの仕様上、サイト色に追従させると見出しが消えてしまうためです。色を変えるときは各ブロックの設定から変えてください。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-top/',
                            'path' => 'page_template/cosme/top_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'コスメ比較・レビューサイト ランキングページ',
                            'description' => '【型A：表が主役／3ページ目用】比較サイトの「ランキング」ページ。<b>PR表記の帯</b>→下層用の見出し帯→順位の決め方（測った条件を先に出す）→<b>1位〜3位を1つずつ（写真＋スペックの表＋正直な短評）</b>→迷ったときの決め方→よくある質問→まとめ記事への導線。トップの比較表が「5つを横に並べて選ばせる」表なのに対し、こちらは「1つずつ縦に読ませる」表です。同じ型でも表の向きを変えると別のページになります。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>順位の根拠を先に書く欄</b>を用意してあります。「何を・何回・どのくらいの期間ためしたか」を必ず埋めてください。ここが空のランキングは、読む人にも検索にも信用されません。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-ranking/',
                            'path' => 'page_template/cosme/ranking_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'コスメ比較・レビューサイト 商品レビューページ',
                            'description' => '【型P：正直さが主役】1つの商品を深く書くレビューページ。<b>PR表記の帯</b>→下層用の見出し帯→<b>結論（先に書く）</b>→<b>動かして見比べる写真（8週間の変化）</b>→合わなかった点→良かった点→値段と解約の条件→向いている人・向かない人→まとめ。<b>合わなかった点を、良かった点より先に置いてあります。</b>良いことしか書いていないページは読む人にすぐ分かるので、「何が良くなかったか」を書ける形をテンプレート側で用意しました。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>化粧品・医薬部外品には薬機法の制限があります。</b>「シミが消える」「治る」など効果を断定する書き方はできません。このテンプレートの文章は「私の場合はこうだった」という体験の形にそろえてあるので、書き換えるときもその形を崩さないでください。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-review/',
                            'path' => 'page_template/cosme/review_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'コスメ比較・レビューサイト 記事一覧ページ',
                            'description' => '【型C：写真が主役／3ページ目用】比較サイトの「記事一覧」ページ。<b>PR表記の帯</b>→下層用の見出し帯→<b>カテゴリの写真タイル3枚</b>→新着の記事（自動）→<b>このサイトの書き方の決まり</b>→はじめての方へのおすすめ3本→ランキングへの導線。記事一覧は「ただ並べるだけ」になりがちなので、先にカテゴリで道を分け、最後に「どう書いているか」を出して記事の信用を作る形にしました。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>記事一覧は投稿を自動で並べます。</b>投稿がまだ1件も無いサイトでは何も出ません（不具合ではありません）。カテゴリのタイルは、リンク先を自分のカテゴリページのURLに書き換えてください。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-blog/',
                            'path' => 'page_template/cosme/blog_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'コスメ比較・レビューサイト 運営者情報ページ',
                            'description' => '【型F：人が主役／3ページ目用】比較サイトの「運営者情報」ページ。<b>PR表記の帯</b>→下層用の見出し帯→<b>書いている人（丸い写真＋自己紹介）</b>→このサイトを作った理由→<b>どうやって記事を書いているか</b>→運営者の情報（表）→ご連絡先→記事への導線。比較サイトは「書いている人が見えないと信用されない」ので、顔・経歴・記事の書き方・連絡先の4つをそろえる形にしました。コスメのほか、どのジャンルのアフィリエイトサイト・個人ブログにもそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>特定商取引法の表示は、物を売っていないアフィリエイトサイトには義務ではありません。</b>ただし有料の商品（note・講座など）を自分で売るなら別途必要です。その場合はセクションテンプレートの「特定商取引法に基づく表記」を足してください。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-about/',
                            'path' => 'page_template/cosme/about_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'コスメ比較・レビューサイト 広告について＋プライバシーポリシー',
                            'description' => '【型B：説明が主役／3ページ目用】アフィリエイトサイトに<b>必要な表示をまとめたページ</b>。<b>PR表記の帯</b>→下層用の見出し帯→<b>広告について（ステマ規制の対応）</b>→参加しているプログラム→順位の決め方→<b>個人情報の取り扱い</b>→アクセス解析と Cookie →免責事項→著作権→お問い合わせ。このセットでいちばん大事なページです。アフィリエイトサイトには ①ステマ規制（景品表示法・2023年10月〜）②個人情報保護法 ③各アフィリエイトプログラムの規約 の3つで決まっている表示があり、どれも「知らなかった」では済みません。<b>貼るだけで形になる状態</b>にしてあります。🚨🚨 <b>ここに書いてある文言はひな形です。</b>参加しているプログラム名・連絡先・解析ツールは自分のものに必ず書き換えてください。Amazon アソシエイトなどは<b>規約で文言が指定されている</b>ことがあります。🚨 有料の商品をご自身で売る場合は、別途「特定商取引法に基づく表記」が必要です（セクションテンプレートに用意してあります）。🚨 <b>貼ったあと、ページ設定の「カラー設定」でピンク（#e07fa4）を選んでください。</b>リストの番号や記号など、<b>属性では色を変えられない部分</b>がテーマの色を見ているため、ここを変えないと一部だけ紺のまま残ります。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/cosme-ad/',
                            'path' => 'page_template/cosme/ad_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト トップページ',
                            'description' => '【型S：条件でしぼるのが主役】格安SIM・スマホ料金の比較サイトのトップページ。ヘッダーを内蔵した全画面のファーストビュー→<b>PR表記の帯</b>→<b>「実質0円」の読み方（打消し表示）</b>→<b>使い方で4つにしぼる</b>→今月のおすすめ3社（順位・評価・良い点／気になる点・公式ボタン）→順位の決め方→月額のめやす→選ぶときの物差し4つ→乗り換えの流れ3段→よくある質問→締めのCTA。比較サイトはいきなり10社の表を出して読む人を止めてしまいがちなので、<b>上から順に候補が減っていく</b>作りにしてあります。全社の比較表は「料金をくらべる」ページに置いています。格安SIMのほか、<b>電気・ガス／ネット回線／動画配信／クレジットカード／ウォーターサーバー</b>など「毎月お金がかかるサービスを比べる」サイトにそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください。</b>広告であることを隠して商品を勧めると景品表示法（ステマ規制）違反になります。🚨🚨 <b>「実質0円」の読み方の帯も消さないでください。</b>「実質」「最安」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>「1位」「おすすめ」の根拠を必ず書いてください。</b>「No.1」「最安」は客観的な根拠が要ります。「順位の決め方」の段に、何をどれだけ調べて決めたかを書く欄を用意してあります。🚨 <b>会社名は A社・B社…にしてあります。</b>実在の通信会社名で料金表を作ると金額がすぐ古くなるので、書き換えるときは「いつ時点の料金か」も必ず添えてください。🚨 <b>このページを貼ったら、ページ設定の「ヘッダー」を「非表示」にしてください。</b>ファーストビューがロゴ・メニュー・ボタンを自分で持っているため、そのままだとヘッダーが二重に出ます。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>リストの記号など、属性では色を変えられない部分がテーマの色を見ています。ファーストビューのお知らせ欄は初期状態で非表示にしてあります（設定から出せます）。色・写真・会社名・金額はすべて差し替えてください。🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-top/',
                            'path' => 'page_template/sim/top_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト 料金をくらべるページ',
                            'description' => '【型T：打消し表示が主役】★新しい型 — 比較サイトの「料金」ページ。下層用の見出し帯→<b>PR表記</b>→<b>広告の「実質0円」は条件つきだという説明</b>→<b>「※」の読み方（よくある条件・見落としやすい条件）</b>→5社の比較表→使い方ごとの目安4つ（3GB／20GB／通話／家族）→この表で分からないこと→締めのCTA。料金の比較ページは表を大きく出すことだけを考えて作られがちですが、読む人が損をするのは<b>表の下の小さな米印</b>のところです。そこで、<b>表より先に「※の読み方」を置き、条件を本文と同じ大きさで書く</b>作りにしました。🚨🚨 <b>「※」の読み方の帯と、表の下の注記を消さないでください。</b>「実質0円」「最安」のような強調表示には、その条件（打消し表示）を<b>一体で・近接して・同じくらいの大きさで</b>書く必要があります。小さな薄い文字にすると有利誤認になり得ます（景品表示法）。🚨 <b>比較表は必ず「いつ時点の金額か」を書き添えてください。</b>料金は毎月変わるので、日付の無い比較表はそれだけで誤解のもとになります。🚨 <b>会社名は A社〜E社にしてあります。</b>実在の会社名に書き換えるときは、公式サイトの料金表を見て金額と日付を必ず取り直してください。🚨 比較表は横に長いので、スマホでは横スクロールになります（スクロールの案内を出す設定にしてあります）。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>見出しの帯は #gb3 / #gb20 / #tel / #family というリンクの飛び先になっています（トップページから飛んできます）。🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-plan/',
                            'path' => 'page_template/sim/plan_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト レビューページ',
                            'description' => '【型P：正直さが主役／2ページ目用】比較サイトの「1社を実際に使ってみた」ページ。下層用の見出し帯→<b>PR表記</b>→<b>測り方の条件</b>→先に結論（吹き出し）→<b>良い点と気になる点（同じ大きさで左右に）</b>→3か月の記録→測った数字→<b>向いていない人を先に、向いている人をあとに</b>→いっしょに買った端末（商品リンク）→締めのCTA。レビュー記事は良いことばかり書くと読む人にすぐ伝わってしまうので、<b>悪い点を良い点と同じ大きさで置き、「向かない人」を先に書く</b>作りにしています。🚨🚨 <b>「気になる点」を空にしないでください。</b>このページの値打ちはそこにあります。書けない商品なら、そもそも紹介しないほうが読む人のためになります。🚨🚨 <b>数字を出すときは、測り方の条件を同じ大きさで添えてください。</b>「速い」「安い」だけを強調して条件を小さく書くと、有利誤認になり得ます（景品表示法）。🚨 <b>商品の写真は自分で撮ったものか、使用許諾のあるものだけを使ってください。</b>Amazon・楽天の商品画像を保存して貼るのは規約違反です（リンクツール経由なら可）。🚨 <b>価格を書いたら「掲載時点のものです」の注記を消さないでください。</b>🚨 商品リンクの「Yahoo!で見る」はURLを空にしてあります。<b>URLが空のボタンは表示されません</b>ので、使う分だけ入れてください。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-review/',
                            'path' => 'page_template/sim/review_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト 乗り換えの手順ページ',
                            'description' => '【型B：説明が主役／5ページ目用】比較サイトの「乗り換えの手順」ページ。下層用の見出し帯→<b>PR表記</b>→用意するもの4つ→<b>手順6段（かかる時間つき）</b>→<b>つまずくところ3つ（吹き出し）</b>→うまくいかないとき（開閉するQ&A 6問）→締めのCTA。格安SIMを止めるのは料金ではなく「手続きが分からない」ことなので、<b>売り込みの段を1つも作らず、やることの順番とつまずく場所だけ</b>を書いています。手順を説明するページなので、<b>引っ越し・入会・申請・予約</b>など「はじめての人が順番どおりに手を動かす」どの業種にもそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>手順の中の日数・期限（MNP予約番号の15日など）は必ず確かめて書き換えてください。</b>制度は変わります。古い日数が書いてあると、読んだ人が手続きに失敗します。🚨 開閉するQ&Aは <b>質問文を14文字まで</b>にしてください。15文字からスマホで2行になり、最後の1〜2文字だけが次の行に落ちます。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-mnp/',
                            'path' => 'page_template/sim/mnp_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト はじめての方へ（用語とQ&A）ページ',
                            'description' => '【型J：不安の解消が主役／2ページ目用】比較サイトの「はじめての方へ」ページ。下層用の見出し帯→<b>PR表記</b>→<b>よく聞かれる心配6つ（いちばん上に置く）</b>→<b>用語6つ（押すと開くアコーディオン）</b>→決めなくてもかまいません→締めの案内。このページには<b>広告のボタンを1つも置いていません</b>。不安で止まっている人に売り込むと逆効果なので、答えることと「やめてもかまわない」と書くことだけをしています。<b>保険・査定・買取・士業への相談</b>など、「怖くて動けない人」に先に説明が要る業種にそのまま使えます。🚨🚨 <b>用語のアコーディオンの下にある「分からない言葉が出てきたら」の見出しを消さないでください。</b>このブロックは<b>自分より後ろの内容を、次の同じ見出しに当たるまで畳み込む</b>作りなので、この見出しが無いと下にあるものが全部いちばん上の用語の中に隠れてしまいます。用語を増やすときは、この見出しより<b>上</b>に足してください。🚨 <b>いちばん上の「PR」の帯は消さないでください</b>（ステマ規制）。広告のボタンが無いページでも、サイト全体に広告がある以上は表示が要ります。🚨 解約金・最低利用期間の有無は制度が変わります。<b>日付とセットで書き換えてください。</b>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-faq/',
                            'path' => 'page_template/sim/faq_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '格安SIM比較サイト 運営者情報・広告についてページ',
                            'description' => '【型F：人が主役／4ページ目用】比較サイトの「運営者情報」と「広告について」を1枚にまとめたページ。下層用の見出し帯→<b>PR表記</b>→運営者（写真＋測り方）→<b>順位の決め方</b>→<b>広告について（ステマ規制の説明）</b>→やらないと決めていること→サイトの情報→締めの案内。比較サイトはいくらでも順位を操作できてしまうので、<b>決め方と、決め方に入れていないもの（広告の報酬額）を先に出す</b>作りにしています。コスメ比較セットでは運営者情報と広告についてを2枚に分けていますが、読む人にとってこの2つは同じ問い（この人を信じていいか）なので、こちらは1枚にまとめました。🚨🚨 <b>「広告について」の節を消さないでください。</b>アフィリエイトリンクを置くサイトには、広告であることが分かる表示が要ります（景品表示法・ステマ規制）。🚨🚨 <b>「順位の決め方」を必ず自分の言葉に書き換えてください。</b>「最安」「No.1」のような表示には客観的な根拠が要ります。ここが空欄のまま順位を出すと、根拠のない優良誤認になり得ます。🚨 <b>連絡先は必ず本物にしてください。</b>返事のできない連絡先を置くと、問い合わせが届かないだけでなく、サイトの信用そのものを落とします。🚨 運営者の写真は正方形（900×900px程度）で用意してください。丸く切り抜かれます。顔写真でなくてもかまいません（このサンプルは机の写真にしています）。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#16305c）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/sim-about/',
                            'path' => 'page_template/sim/about_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト トップページ',
                            'description' => '【型S：条件でしぼるのが主役】クレジットカード比較サイトのトップページ。ヘッダーを内蔵した全画面のファーストビュー→<b>PR表記の帯</b>→<b>「実質年会費無料」の読み方（打消し表示）</b>→<b>重視ポイントで4つにしぼる</b>→今月のおすすめ3枚（順位・評価・良い点／気になる点・公式ボタン）→順位の決め方→年会費・還元率のめやす→選ぶときの物差し4つ→申し込みの流れ3段→よくある質問→締めのCTA。比較サイトはいきなり10枚の表を出して読む人を止めてしまいがちなので、<b>上から順に候補が減っていく</b>作りにしてあります。全枚数の比較表は「くらべる」ページに置いています。クレジットカードのほか、<b>電気・ガス／ネット回線／動画配信／格安SIM／保険</b>など「毎月・毎年お金がかかるサービスを比べる」サイトにそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください。</b>広告であることを隠して商品を勧めると景品表示法（ステマ規制）違反になります。🚨🚨 <b>「実質年会費無料」の読み方の帯も消さないでください。</b>「最大」「実質無料」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>「1位」「おすすめ」の根拠を必ず書いてください。</b>「No.1」「最強」は客観的な根拠が要ります。🚨 <b>カード名は A〜Eカードにしてあります。</b>実在のカード名で年会費・還元率を作ると制度変更ですぐ古くなるので、書き換えるときは「いつ時点の情報か」も必ず添えてください。🚨 <b>このページを貼ったら、ページ設定の「ヘッダー」を「非表示」にしてください。</b>ファーストビューがロゴ・メニュー・ボタンを自分で持っているため、そのままだとヘッダーが二重に出ます。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>リストの記号など、属性では色を変えられない部分がテーマの色を見ています。色・写真・カード名・年会費はすべて差し替えてください。🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-top/',
                            'path' => 'page_template/creditcard/top_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト 年会費・還元率をくらべるページ',
                            'description' => '【型T：打消し表示が主役】比較サイトの「年会費・還元率」ページ。下層用の見出し帯→<b>PR表記</b>→<b>「実質年会費無料」は条件つきだという説明</b>→<b>「※」の読み方（よくある条件・見落としやすい条件）</b>→5枚の比較表→重視ポイントごとの目安4つ（年会費／ポイント／旅行／はじめての1枚）→この表で分からないこと→締めのCTA。年会費・還元率の比較ページは表を大きく出すことだけを考えて作られがちですが、読む人が損をするのは<b>表の下の小さな注意書き</b>のところです。そこで、<b>表より先に「※の読み方」を置き、条件を本文と同じ大きさで書く</b>作りにしました。🚨🚨 <b>「※」の読み方の帯と、表の下の注記を消さないでください。</b>「実質無料」「最大◯%」のような強調表示には、その条件（打消し表示）を<b>一体で・近接して・同じくらいの大きさで</b>書く必要があります。小さな薄い文字にすると有利誤認になり得ます（景品表示法）。🚨 <b>比較表は必ず「いつ時点の情報か」を書き添えてください。</b>年会費・還元率は改定されるので、日付の無い比較表はそれだけで誤解のもとになります。🚨 <b>カード名は A〜Eカードにしてあります。</b>実在のカード名に書き換えるときは、公式サイトの規約ページを見て条件と日付を必ず取り直してください。🚨 比較表は横に長いので、スマホでは横スクロールになります（スクロールの案内を出す設定にしてあります）。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>見出しの帯は #muryo / #point / #travel / #hajime というリンクの飛び先になっています（トップページから飛んできます）。🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-hikaku/',
                            'path' => 'page_template/creditcard/hikaku_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト レビューページ',
                            'description' => '【型P：正直さが主役／2ページ目用】比較サイトの「1枚を実際に使ってみた」ページ。下層用の見出し帯→<b>PR表記</b>→<b>測り方の条件</b>→先に結論（吹き出し）→<b>良い点と気になる点（同じ大きさで左右に）</b>→半年の記録→測った数字→<b>向いていない人を先に、向いている人をあとに</b>→いっしょに使っている財布（商品リンク）→締めのCTA。レビュー記事は良いことばかり書くと読む人にすぐ伝わってしまうので、<b>悪い点を良い点と同じ大きさで置き、「向かない人」を先に書く</b>作りにしています。🚨🚨 <b>「気になる点」を空にしないでください。</b>このページの値打ちはそこにあります。書けないカードなら、そもそも紹介しないほうが読む人のためになります。🚨🚨 <b>数字を出すときは、測り方の条件を同じ大きさで添えてください。</b>「貯まる」「お得」だけを強調して条件を小さく書くと、有利誤認になり得ます（景品表示法）。🚨 <b>商品の写真は自分で撮ったものか、使用許諾のあるものだけを使ってください。</b>Amazon・楽天の商品画像を保存して貼るのは規約違反です（リンクツール経由なら可）。🚨 <b>価格を書いたら「掲載時点のものです」の注記を消さないでください。</b>🚨 商品リンクの「Yahoo!で見る」はURLを空にしてあります。<b>URLが空のボタンは表示されません</b>ので、使う分だけ入れてください。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-review/',
                            'path' => 'page_template/creditcard/review_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト 申し込みから発行までの流れページ',
                            'description' => '【型B：説明が主役／5ページ目用】比較サイトの「申し込みの流れ」ページ。下層用の見出し帯→<b>PR表記</b>→用意するもの4つ→<b>手順6段（かかる時間つき）</b>→<b>つまずくところ3つ（吹き出し）</b>→うまくいかないとき（開閉するQ&A 6問）→締めのCTA。クレジットカードを止めるのは年会費ではなく「審査が通るか分からず動けない」ことなので、<b>売り込みの段を1つも作らず、やることの順番とつまずく場所だけ</b>を書いています。手順を説明するページなので、<b>入会・入居・開業・保険の加入</b>など「はじめての人が順番どおりに手を動かす」どの業種にもそのまま使えます。🚨🚨 <b>いちばん上の「PR」の帯を消さないでください</b>（ステマ規制）。🚨 <b>審査にかかる日数・受け取り方法は必ず確かめて書き換えてください。</b>制度は変わります。古い日数が書いてあると、読んだ人が計画を誤ります。🚨 開閉するQ&Aは<b>質問文を14文字まで</b>にしてください。15文字からスマホで2行になり、最後の1〜2文字だけが次の行に落ちます。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-shinsa/',
                            'path' => 'page_template/creditcard/shinsa_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト はじめての方へ（用語とよくある心配）ページ',
                            'description' => '【型J：不安の解消が主役／2ページ目用】比較サイトの「はじめての方へ」ページ。下層用の見出し帯→<b>PR表記</b>→<b>よく聞かれる心配6つ（いちばん上に置く）</b>→<b>用語6つ（押すと開くアコーディオン）</b>→いま決めなくてもかまいません→締めの案内。このページには<b>広告のボタンを1つも置いていません</b>。不安で止まっている人に売り込むと逆効果なので、答えることと「持たなくてもかまわない」と書くことだけをしています。<b>保険・査定・買取・ローン・士業への相談</b>など、「お金がからむと怖くて動けない人」に先に説明が要る業種にそのまま使えます。🚨🚨 <b>用語のアコーディオンの下にある「分からない言葉が出てきたら」の見出しを消さないでください。</b>このブロックは<b>自分より後ろの内容を、次の同じ見出しに当たるまで畳み込む</b>作りなので、この見出しが無いと下にあるものが全部いちばん上の用語の中に隠れてしまいます。用語を増やすときは、この見出しより<b>上</b>に足してください。🚨 <b>いちばん上の「PR」の帯は消さないでください</b>（ステマ規制）。広告のボタンが無いページでも、サイト全体に広告がある以上は表示が要ります。🚨 年会費・審査の基準は制度が変わります。<b>日付とセットで書き換えてください。</b>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-fuan/',
                            'path' => 'page_template/creditcard/fuan_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クレジットカード比較サイト 運営者情報・広告についてページ',
                            'description' => '【型F：人が主役／4ページ目用】比較サイトの「運営者情報」と「広告について」を1枚にまとめたページ。下層用の見出し帯→<b>PR表記</b>→運営者（写真＋測り方）→<b>順位の決め方</b>→<b>広告について（ステマ規制の説明）</b>→やらないと決めていること→サイトの情報→締めの案内。比較サイトはいくらでも順位を操作できてしまうので、<b>決め方と、決め方に入れていないもの（広告の報酬額）を先に出す</b>作りにしています。🚨🚨 <b>「広告について」の節を消さないでください。</b>アフィリエイトリンクを置くサイトには、広告であることが分かる表示が要ります（景品表示法・ステマ規制）。🚨🚨 <b>「順位の決め方」を必ず自分の言葉に書き換えてください。</b>「最強」「No.1」のような表示には客観的な根拠が要ります。ここが空欄のまま順位を出すと、根拠のない優良誤認になり得ます。🚨 <b>連絡先は必ず本物にしてください。</b>返事のできない連絡先を置くと、問い合わせが届かないだけでなく、サイトの信用そのものを落とします。🚨 運営者の写真は正方形（900×900px程度）で用意してください。丸く切り抜かれます。顔写真でなくてもかまいません（このサンプルは机の写真にしています）。✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。🚨 <b>貼ったあと、ページ設定の「カラー設定」で濃紺（#14264a）を選んでください。</b>🚨 <b>テーマのカスタマイザーで「PR表記（広告・アフィリエイト）」をオンにしている場合は、このページ内の「PR」の帯と二重になります。</b>その場合はどちらか一方にしてください。この機能は初期状態ではオフなので、何も設定していなければ二重にはなりません。',
                            'preview_url' => 'https://lite-word.com/cc-about/',
                            'path' => 'page_template/creditcard/about_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'beauty' => [
                    'label' => '美容・エステ',
                    'templates' => [
                        [
                            'name' => 'エステサロン メニューページ（フェイシャル）',
                            'description' => 'エステサロンのメニューページ<b>【型C：写真が主役】</b>。<br>お悩み6つ→できること写真カード3枚→ご予約前のご確認→料金表→写真つきステップ6段→お持ちいただくもの→Q&amp;A→お客様の声（写真）→ほかのメニュー→CTA。<br>施術中の手元と仕上がりで見せる、いちばん基本の型です。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-facial/',
                            'path' => 'page_template/esthe/menu_facial_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ（痩身・ボディ）',
                            'description' => 'エステサロンのメニューページ<b>【型C：写真が主役／2ページ目用】</b>。<br>お悩みリスト→<b>数値の変化カード3枚</b>（見出しに「ウエスト 平均 -4.2cm」のように数字を出す）→ご予約前のご確認→料金表→写真つきステップ6段→当日のご準備→Q&amp;A→お客様の声（写真）→ほかのメニュー→CTA。<br>結果を数字で見せたいメニュー向けです。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-body/',
                            'path' => 'page_template/esthe/menu_body_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ（脱毛）',
                            'description' => 'エステサロンのメニューページ<b>【型A：表が主役】</b>。<br>お悩みリスト→<b>部位×回数の表</b>→ご予約前のご確認→<b>部位×コースの料金表</b>→ステップ4段→当日のご準備→Q&amp;A→お客様の声→ほかのメニュー→CTA。<br>表を2枚使うので<b>写真は2枚だけ</b>。素材が少なくても作れます。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-datsumo/',
                            'path' => 'page_template/esthe/menu_datsumo_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ（ブライダル）',
                            'description' => 'エステサロンのメニューページ<b>【型B：説明が主役】</b>。<br>お悩みリスト→<b>挙式日から逆算する3段</b>（6か月前／3か月前／1か月前・料金表へ飛ぶボタンつき）→ご予約前のご確認→料金表→ご相談から当日までのステップ4段→お持ちいただくもの→Q&amp;A→お受けいただいた方の声（写真）→ほかのメニュー→CTA。<br>期日から逆算して選んでもらうメニュー向けです。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-bridal/',
                            'path' => 'page_template/esthe/menu_bridal_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ（リンパ・ヘッドスパ）',
                            'description' => 'エステサロンのメニューページ<b>【型C：写真が主役／3ページ目用】</b>。<br>お悩みリスト→写真カード3枚→帯つきのご確認事項→料金表（所要時間つき）→ステップ3段→当日のご準備→Q&amp;A→お客様の声（写真）→ほかのメニュー（ボタンつきカード）→CTA。<br>効果より「心地よさ」で選ばれるメニュー向けです。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-lymph/',
                            'path' => 'page_template/esthe/menu_lymph_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ（ハーブピーリング）',
                            'description' => 'エステサロンのメニューページ<b>【型B：説明が主役／2ページ目用】</b>。<br>帯つきお悩みリスト→<b>仕組みの説明3段</b>（料金表へ飛ぶボタンつき）→ご予約前のご確認→料金表→<b>施術後5日間の経過表</b>→Q&amp;A→お受けいただいた方の声（写真）→ほかのメニュー→CTA。<br>ダウンタイムのあるメニューを、先に正直に説明する構成です。',
                            'preview_url' => 'https://lite-word.com/esthe-menu-herb/',
                            'path' => 'page_template/esthe/menu_herb_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（フェイシャル）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠1】</b>。<br>見出しはすべて<b>明朝体・中央寄せ</b>、色は<b>墨＋金</b>、余白はゴシック版の1.7倍。本文はゴシックのまま読みやすさを保っています。<br>お悩み（1列カード）→できること（縦長写真3枚）→ご予約前のご確認→料金表→当日の流れ（縦カード）→お持ちいただくもの→Q&amp;A（開閉なし）→お客様の声→ほかのメニュー→CTA（電話＋メール）。<br>落ち着いた大人向けサロン向けの、明朝パックの基本の型です。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-facial/',
                            'path' => 'page_template/esthe2/menu_facial_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（痩身・ボディ）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠2】</b>。<br>お悩み（チェック2列）→<b>数値の変化カード3枚</b>（見出しに「ウエスト 平均 -4.2cm」のように数字を出す）→ご予約前のご確認→料金表→当日の流れ（番号つき）→当日のご準備→Q&amp;A（アコーディオン）→お客様の声→ほかのメニュー→CTA。<br>枠1とは本文6枠すべてが違うので、同じサロン内の2ページ目に並べても同じ顔になりません。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-body/',
                            'path' => 'page_template/esthe2/menu_body_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（脱毛）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠3・表が2つ】</b>。<br>お悩み（番号2列）→<b>部位×回数の表</b>→ご予約前のご確認→<b>部位×コースの料金表</b>→当日の流れ（帯）→当日のご準備→Q&amp;A（アコーディオン）→お客様の声→ほかのメニュー→CTA。<br>表を2枚使うので<b>写真は2枚だけ</b>。素材が少なくても作れます。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-datsumo/',
                            'path' => 'page_template/esthe2/menu_datsumo_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（ブライダル）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠2】</b>。<br>お悩み（チェック2列）→<b>挙式日から逆算する3段</b>（6か月前／3か月前／1か月前）→ご予約前のご確認→料金表→ご相談から当日までの流れ（番号つき）→お持ちいただくもの→Q&amp;A（アコーディオン）→お受けいただいた方の声→ほかのメニュー→CTA。<br>期日から逆算して選んでもらうメニュー向けです。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-bridal/',
                            'path' => 'page_template/esthe2/menu_bridal_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（リンパ・ヘッドスパ）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠3】</b>。<br>お悩み（番号2列）→できること（縦長写真3枚）→ご予約前のご確認→料金表（所要時間つき）→当日の流れ（帯）→当日のご準備→Q&amp;A（アコーディオン）→お客様の声→ほかのメニュー→CTA。<br>効果より「心地よさ」で選ばれるメニュー向け。明朝と広い余白がいちばん効く型です。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-lymph/',
                            'path' => 'page_template/esthe2/menu_lymph_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'エステサロン メニューページ 明朝（ハーブピーリング）',
                            'description' => 'エステサロンのメニューページ<b>【明朝・上品／枠1・説明が主役】</b>。<br>お悩み（1列カード）→<b>仕組みの説明3段</b>（画像なし・料金表へ飛ぶボタンつき）→ご予約前のご確認→料金表→<b>施術後5日間の経過表</b>→Q&amp;A（開閉なし）→お受けいただいた方の声→ほかのメニュー→CTA。<br>ダウンタイムのあるメニューを、先に正直に説明する構成です。',
                            'preview_url' => 'https://lite-word.com/esthe2-menu-herb/',
                            'path' => 'page_template/esthe2/menu_herb_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'professional' => [
                    'label' => '士業（弁護士・税理士・行政書士）',
                    'templates' => [
                        [
                            'name' => '行政書士事務所 トップページ',
                            'description' => '許認可・相続・会社設立の相談を受ける行政書士事務所向け。<br>お悩み6つ／選ばれる6つの理由／解決事例3件／代表あいさつ／お知らせ／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-top/',
                            'path' => 'page_template/gyoseishoshi/top_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 取扱業務の一覧',
                            'description' => '行政書士事務所の下層ページ。取扱業務を一覧で見せる。<br>ページ見出し／業務カード9枚（在留資格・産廃・建設業・相続・会社設立・営業許可・補助金・自動車・その他）／こんなときはご相談ください／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-gyomu/',
                            'path' => 'page_template/gyoseishoshi/gyomu_list_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（在留資格・ビザ）',
                            'description' => '行政書士事務所の業務ページ<b>【型A：表が主役／2ページ目用】</b>。<br>番号つき対象リスト→在留資格の一覧表→帯つき注意点→料金表→ステップ→手続きの種類→Q&amp;A→お客様の声→関連業務→CTA。<br>写真を1枚も使わないので、素材が無くても作れます。',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-zairyu/',
                            'path' => 'page_template/gyoseishoshi/gyomu_zairyu_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（産業廃棄物収集運搬業許可）',
                            'description' => '行政書士事務所の業務ページ<b>【型B：説明が主役】</b>。<br>帯つきの対象リスト→説明カード3枚→注意点→料金表→ステップ→期間の表→Q&amp;A→代表メッセージ→関連業務カード→CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-sanpai/',
                            'path' => 'page_template/gyoseishoshi/gyomu_sanpai_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（建設業許可）',
                            'description' => '行政書士事務所の業務ページ<b>【型B：説明が主役／2ページ目用】</b>。<br>番号つき対象リスト→説明カード4枚→要件→料金表→ステップ→許可後にやること→Q&amp;A→代表メッセージ→関連業務カード→CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-kensetsu/',
                            'path' => 'page_template/gyoseishoshi/gyomu_kensetsu_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（相続・遺言）',
                            'description' => '行政書士事務所の業務ページ<b>【型C：写真が主役／3ページ目用】</b>。<br>対象リスト→写真カード3枚→帯つき注意点→料金表→ステップ→遺言書の種類→Q&amp;A→お客様の声（写真）→関連業務→CTA。<br>写真は6枚だけで、流れと関連業務は文字で見せます。',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-souzoku/',
                            'path' => 'page_template/gyoseishoshi/gyomu_souzoku_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（会社設立）',
                            'description' => '行政書士事務所の業務ページ<b>【型A：表が主役／3ページ目用】</b>。<br>対象リスト→会社の種類の表→決めておくこと→料金表→帯つきステップ→先に決めること→Q&amp;A→お客様の声→関連業務→CTA。<br>写真を1枚も使わないので、素材が無くても作れます。',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-setsuritsu/',
                            'path' => 'page_template/gyoseishoshi/gyomu_setsuritsu_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（営業許可）',
                            'description' => '行政書士事務所の業務ページ<b>【型C：写真が主役】</b>。<br>番号つき対象リスト→写真カード3枚→注意点→料金表→写真つきステップ5段→帯つき期間リスト→Q&amp;A→お客様の声（写真）→関連業務カード→CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-eigyo/',
                            'path' => 'page_template/gyoseishoshi/gyomu_eigyo_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（補助金・助成金）',
                            'description' => '行政書士事務所の業務ページ<b>【型A：表が主役】</b>。<br>対象リスト→比較表→注意点→料金表→ステップ→期間の表→Q&amp;A→お客様の声→関連業務→CTA。<br>写真を1枚も使わないので、素材が無くても作れます。',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-hojokin/',
                            'path' => 'page_template/gyoseishoshi/gyomu_hojokin_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 業務ページ（自動車登録・車庫証明）',
                            'description' => '行政書士事務所の業務ページ<b>【型C：写真が主役／2ページ目用】</b>。<br>営業許可と同じ型ですが、リスト・注意点・期間・Q&amp;Aの4か所を別のブロックに替えてあります。<br>同じ型を2ページ使うときの見本になります。',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-jidosha/',
                            'path' => 'page_template/gyoseishoshi/gyomu_jidosha_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 料金・費用',
                            'description' => '行政書士事務所の料金ページ。<br>料金についてのお約束6項目／業務ごとの料金の目安（8業務）／お支払いについて／実費として別に頂くもの／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-ryokin/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_ryokin_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 ご依頼の流れ',
                            'description' => '行政書士事務所の流れページ。<br>5段のステップ（番号つき）／各段でお願いすること／お願いしたいこと5項目／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-nagare/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_nagare_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 事務所概要・アクセス',
                            'description' => '行政書士事務所の概要ページ。<br>事務所概要9項目（会社概要ブロック）／アクセスの表／ご来所の前に4項目／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-about/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_gaiyo_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 代表あいさつ',
                            'description' => '行政書士事務所の代表あいさつページ。<br>あいさつ文＋写真（メッセージブロック）／経歴の表／資格・対応の表／CTA',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-message/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_aisatsu_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 お問い合わせ',
                            'description' => '行政書士事務所のお問い合わせページ。<br>ご連絡の方法の表／お伝えいただけると早いこと5項目／メールフォーム／CTA<br>※フォームは挿入後にご自身のフォームを選び直してください',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-contact/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_contact_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '行政書士事務所 プライバシーポリシー',
                            'description' => '行政書士事務所の規約ページ。<br>前文＋第1条〜第9条（利用目的・第三者提供・安全管理・開示請求・守秘義務・窓口ほか）<br>※そのまま使わず、必ず内容をご確認のうえ書き換えてください',
                            'preview_url' => 'https://lite-word.com/gyoseishoshi-privacy/',
                            'path' => 'page_template/gyoseishoshi/kyotsu_privacy_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'medical' => [
                    'label' => '医療・クリニック',
                    'templates' => [
                        [
                            'name' => 'クリニック トップページ',
                            'description' => 'かかりつけ医・内科クリニック向けのトップページ<b>【型G：案内が主役】</b>。<br>ファーストビュー→<b>案内タイル4枚</b>（初めての方・診療時間・アクセス・ご予約）→当院について→診療案内カード4枚→はじめての方へ（4ステップ）→診療時間・アクセスの表→患者さんの声→お知らせ→CTA。<br>売り込みより先に「今日やっているか・どこにあるか・初めてでも大丈夫か」に答える構成です。<br>🚨 <b>このページを使うときは、ページの「ヘッダー設定」を「非表示」にしてください。</b>ファーストビューがロゴとメニューを含んでいるため、既定のままだとヘッダーが二重になります。',
                            'preview_url' => 'https://lite-word.com/clinic-top/',
                            'path' => 'page_template/clinic/top_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => 'クリニック 院長紹介ページ',
                            'description' => 'クリニックの院長紹介ページ<b>【型F：人が主役】</b>。<br>ページ見出し→<b>院長より</b>（顔写真＋本人の言葉・署名つき）→経歴・資格の表2枚→スタッフ紹介3名→院内のご案内（写真6枚）→CTA。<br>経歴を先に出すと履歴書になるので、<b>本人の言葉を先に置いています</b>。医院のほか、士業・教室・サロンなど「資格と経歴が意味を持つ」業種にも使えます。',
                            'preview_url' => 'https://lite-word.com/clinic-doctor/',
                            'path' => 'page_template/clinic/doctor_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'construction' => [
                    'label' => '建築・工務店・リフォーム',
                    'templates' => [
                        [
                            'name' => '工務店・リフォーム トップページ',
                            'description' => '地元の工務店・リフォーム会社向けのトップページ<b>【型H：現場が主役】</b>。<br>'
                                . '全画面のファーストビュー（ロゴ・メニュー・ボタン2つを内蔵）→お困りごと→<b>対応する工事4種</b>（横にめくれるカード）'
                                . '→<b>施工前と施工後</b>→施工例（大小のモザイク3枚）→数字で見る→<b>お見積りの例6件</b>'
                                . '→ご相談から完了までの流れ5段→対応エリア→保証とアフター→お客様の声→現地調査への導線。<br>'
                                . '「いくらかかるか」「どんな順番で進むか」「終わったあとどうしてくれるのか」に先に答える構成です。'
                                . 'リフォーム・外構・水まわり専門店・塗装店にも使えます。<br>'
                                . '🚨 <b>このページを使うときは、ページの「ヘッダー設定」を「非表示」にしてください。</b>'
                                . 'ファーストビューがロゴ・メニュー・ボタンを含んでいるため、既定のままだとヘッダーが二重になります。<br>'
                                . 'メニューの行き先はこのページ内の見出し（#service など）です。ページを分けたら書き換えてください。'
                                . '色はページの「カラー設定」に追従します。写真・金額・エリア・社名はすべて差し替えてください。',
                            'preview_url' => 'https://lite-word.com/koumuten-top/',
                            'path' => 'page_template/koumuten/top_1/index.php',
                            'public' => false,
                        ],
                        [
                            'name' => '工務店・リフォーム 対応する工事ページ',
                            'description' => '工務店・リフォームの「対応する工事」ページ<b>【型B：説明が主役】</b>。<br>下層用の見出し帯→よくあるご依頼3枚（写真バナー）→<b>工事の内容4種</b>（左に写真・右に説明の横長カード）→お受けできること／できないこと→<b>よくあるご質問</b>（吹き出しの対話4件）→現地調査への導線。<br>トップの「対応する工事」の先で、何をどこまでやるのか・できないことは何かまで書くページです。「できないこと」を先に出すと、現地に行ってからのお断りが減ります。リフォーム・外構・水まわり専門店・塗装店に。<br>✅ このページはトップと違い、<b>テーマのヘッダーを表示したまま</b>使います（ヘッダー設定はそのままで結構です）。色はページの「カラー設定」に追従します。写真・工事の内容はすべて差し替えてください。',
                            'preview_url' => 'https://lite-word.com/koumuten-service/',
                            'path' => 'page_template/koumuten/service_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '工務店・リフォーム 施工例ページ',
                            'description' => '工務店・リフォームの「施工例」ページ<b>【型C：写真が主役】</b>。<br>下層用の見出し帯→<b>横にスワイプする写真6枚</b>→施工例カード3枚（写真＋名前板）→1件を最後まで（大きな写真＋工事の内訳＋お客様の言葉）→写真の見かた→現地調査への導線。<br>「たくさん見る」→「3件から選ぶ」→「1件を読み切る」の3段にしてあります。工務店・リフォーム・外構・造園・内装業に。<br>🚨 <b>横にスワイプする写真は1枚が約320×200pxでしか出ません。</b>引きの写真だと何が写っているか分からなくなるので、<b>寄った写真</b>（1200×750px程度）に差し替えてください。8枚まで入ります。<br>🚨 施工例カードは<b>写真の左下に名前板が重なります。</b>主役が写真の下半分にある写真は避けてください。<br>✅ このページはトップと違い、テーマのヘッダーを表示したまま使います。',
                            'preview_url' => 'https://lite-word.com/koumuten-works/',
                            'path' => 'page_template/koumuten/works_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '工務店・リフォーム 費用の目安ページ',
                            'description' => '工務店・リフォームの「費用の目安」ページ<b>【型A：表が主役】</b>。<br>下層用の見出し帯→<b>工事別の費用の幅と工期の表</b>→お見積りに含まれるもの／含まれないもの→<b>使える補助金</b>（資料ダウンロードのボタンつき）→お支払い方法（分割・ローンを含む）→お金まわりのよくあるご質問7件→現地調査への導線。<br><b>写真を1枚も使いません。</b>素材写真が少ない会社でもそのまま出せます。リフォーム・外構・塗装・水まわり専門店のほか、「幅で答えるしかない」業種（修理・整備・士業）にも使えます。<br>🚨 <b>金額は必ず自社のものに差し替えてください。</b>そのままでは景品表示法の問題になります。補助金の名前・金額・期限は年度で変わるので、必ずその年のものをご確認ください。<br>✅ 表はスマホでは横にスクロールします（それが正常な作りです）。このページはトップと違い、テーマのヘッダーを表示したまま使います。',
                            'preview_url' => 'https://lite-word.com/koumuten-price/',
                            'path' => 'page_template/koumuten/price_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '工務店・リフォーム 会社概要ページ',
                            'description' => '工務店・リフォームの「会社概要」ページ<b>【型F：人が主役】</b>。<br>下層用の見出し帯→<b>代表のごあいさつ</b>（縦長写真＋2段組の本文）→会社概要の表→<b>会社の歩み</b>（沿革5年ぶん）→現場に来る3人（丸いアバターの吹き出し）→資格と許可→会社の場所と行き方→現地調査への導線。<br><b>経歴や資本金を先に置くと履歴書になる</b>ので、代表の言葉を先に出しています。工務店のほか、士業・治療院・教室など「誰がやるのか」で選ばれる業種に使えます。<br>🚨 <b>顔写真は正方形（900×900px程度）で差し替えてください。</b>丸く切り抜かれる場所があるので、顔を中心に置いた写真にしてください。アバターの下の名前は幅が狭いので、<b>肩書きを入れず名前だけ</b>にしてください。<br>🚨 建設業の許可番号・資格の名前は必ず自社のものに書き換えてください。地図は入れていません（実在しない住所のため）。必要なら Google マップの埋め込みブロックを足してください。<br>✅ このページはトップと違い、テーマのヘッダーを表示したまま使います。',
                            'preview_url' => 'https://lite-word.com/koumuten-company/',
                            'path' => 'page_template/koumuten/company_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => '工務店・リフォーム お問い合わせページ',
                            'description' => 'お問い合わせページ<b>【型I：導線が主役】</b>。<br>下層用の見出し帯→<b>ご連絡の方法3つ</b>（格子に並ぶボタン）→ご連絡のあとの流れ3段（写真つき）→お問い合わせフォーム→お電話の方へ（電話ボタン・受付時間）→お聞きすること／お預かりした情報の扱い→お急ぎの方への電話導線。<br><b>売り込む段が1つもありません。</b>ここに来た人はもう決めているので、「どう連絡するか」「送ったあと何が起きるか」「何を聞かれるか」だけを書いています。<b>業種を問わず使えます。</b><br>🚨 <b>フォームは Contact Form 7 の番号（formId）を自社のものに変えてください。</b>そのままだと既定のフォームが出ます。電話番号・受付時間・住所も差し替えてください。<br>✅ このページはトップと違い、テーマのヘッダーを表示したまま使います。',
                            'preview_url' => 'https://lite-word.com/koumuten-contact/',
                            'path' => 'page_template/koumuten/contact_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'school' => [
                    'label' => 'スクール・教室',
                    'templates' => [
                        [
                            'name' => 'スクール・教室 トップページ',
                            'description' => '【型M：通いはじめるまでが主役】ピアノ・音楽教室のトップページ。写真3枚の背景スライダー→通っている方の悩み→コース4つ（写真カード）→教室の様子（写真8枚）→<b>レッスンできる曜日と時間</b>→<b>月謝のめやす</b>→講師→体験レッスンの流れ3段→生徒さんの声（スライダー）→よくある質問→体験レッスンへの導線。「上手くないと恥ずかしい」「続くか分からない」「いくらかかるか」「その曜日に空きがあるか」に問い合わせる前に答える並びにしてあります。ピアノ・音楽教室のほか、そろばん・書道・英会話・バレエ・ヨガ・学習塾など「通って習う」業種にそのまま使えます。<br>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います（ヘッダー設定はそのままで結構です）。色はページの「カラー設定」に追従します。<br>🚨 月謝・時間割・教室名・写真はすべて自分のものに差し替えてください。',
                            'preview_url' => 'https://lite-word.com/school-top/',
                            'path' => 'page_template/school/top_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'スクール・教室 コース紹介ページ',
                            'description' => '【型B：説明が主役】教室の「コース紹介」ページ。下層用の見出し帯→コース4つを1つずつ（写真と文が左右交互）→<b>レッスン1回の使い方</b>（番号つき5段）→発表会→教材と費用→体験レッスンへの導線。トップのカードでは書ききれない「対象・時間・回数・月謝・どんな方に向くか」を1コースずつ最後まで書くページです。ピアノ教室のほか、そろばん・書道・英会話・バレエ・学習塾のコース紹介にそのまま使えます。<br>🚨 <b>写真は正方形に切り抜かれます</b>（1辺1000px以上の写真をご用意ください）。<br>🚨 金額・回数・教材名は必ず自分のものに差し替えてください。<br>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。色はページの「カラー設定」に追従します。',
                            'preview_url' => 'https://lite-word.com/school-course/',
                            'path' => 'page_template/school/course_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'スクール・教室 時間割・月謝ページ',
                            'description' => '【型A：表が主役】教室の「時間割と月謝」ページ。下層用の見出し帯→<b>曜日と時間にどのコースが入るかの表</b>→今月の空き枠→<b>月謝の表</b>→月謝以外にかかるもの（入会金・教材費・発表会費）→振替と退会のきまり→体験レッスンへの導線。<b>写真を1枚も使いません。</b>素材写真が少ない教室でもそのまま出せます。教室のほか、時間帯で予約が埋まる業種（治療院・サロン・パーソナルジム）にも使えます。<br>🚨 <b>金額は必ず自分のものに差し替えてください。</b>そのままでは景品表示法の問題になります。<br>🚨 空き状況は月ごとに変わります。<b>更新できない場合は「お問い合わせください」に書き換えてください。</b><br>✅ 表はスマホでは横にスクロールします（それが正常な作りです）。このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/school-schedule/',
                            'path' => 'page_template/school/schedule_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'スクール・教室 講師紹介ページ',
                            'description' => '【型F：人が主役】教室の「講師紹介」ページ。下層用の見出し帯→<b>代表のことば</b>（全幅の吹き出し）→講師3人のプロフィール→レッスンで大事にしている4つ→講師の交代について→体験レッスンへの導線。教室は「誰に習うか」で選ばれるので、経歴より先に<b>その人の考え方</b>を出しています。教室のほか、治療院・サロン・士業など「担当者で選ばれる」業種に使えます。<br>🚨 <b>顔写真は正方形（900×900px程度）で差し替えてください。</b>丸く切り抜かれるので、顔を中心に置いた写真にしてください。<br>🚨 出身校・資格は必ず自分のものに書き換えてください。<br>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/school-teacher/',
                            'path' => 'page_template/school/teacher_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'スクール・教室 教室案内・アクセスページ',
                            'description' => '【型C：写真が主役】教室の「ご案内とアクセス」ページ。下層用の見出し帯→<b>教室の中（写真3枚）</b>→設備とできること→<b>駅からの道順</b>（4段）→教室の概要（住所・時間・定休日の表）→送迎と待合について→体験レッスンへの導線。「行ける場所か」「子どもを待たせられるか」「自転車を停められるか」に答えるページです。教室のほか、治療院・サロン・クリニック・小さな店舗の「アクセス」ページに使えます。<br>🚨 <b>地図は入れていません</b>（架空の住所のため）。Google マップの埋め込みブロックを足してください。<br>🚨 住所・電話番号・道順は必ず自分のものに差し替えてください。<br>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/school-access/',
                            'path' => 'page_template/school/access_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'スクール・教室 体験レッスン申し込みページ',
                            'description' => '【型I：導線が主役】教室の「体験レッスンのお申し込み」ページ。下層用の見出し帯→<b>当日やること3つ（写真つき）</b>→申し込みから当日までの4段→<b>お申し込みフォーム</b>→お電話の方へ→持ち物とお願い→最後の一押し。<b>売り込む段が1つもありません。</b>ここに来た人はもう決めているので、「何をするか」「何を持っていくか」「送ったあと何が起きるか」だけを書いています。教室のほか、体験・見学・無料相談を入り口にする業種（治療院・ジム・塾）にそのまま使えます。<br>🚨 <b>フォームは Lwお問い合わせ の番号（formId）を自分のものに変えてください。</b>そのままだと1番のフォームが出ます。電話番号・受付時間も差し替えてください。<br>✅ このページは<b>テーマのヘッダーを表示したまま</b>使います。',
                            'preview_url' => 'https://lite-word.com/school-trial/',
                            'path' => 'page_template/school/trial_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'saas' => [
                    'label' => 'SaaS・IT',
                    'templates' => [
                        [
                            'name' => 'SaaS・クラウドサービス トップページ',
                            'description' => '【型U：はじめる手間の少なさが主役】クラウドの業務ツール（SaaS）を売るサイトのトップページ。全画面のファーストビュー→<b>はじめる手間の少なさ3つ（初期費用・登録時間・やめ方）</b>→<b>料金の条件（打消し表示）</b>→こんな手作業ありませんか（上下2段のチェックリスト）→できること→ページの入口4つ→使いはじめるまでの4段→料金のめやす（3プランの表）→使っているお店の話（吹き出し2つ）→よくある質問→締めの2択（ためす／資料をもらう）。SaaS のサイトは機能を先に並べがちですが、小さなお店・事務所の方が最初に知りたいのは<b>「いくらか」「どれくらいで始まるか」「やめられるか」</b>なので、<b>その3つをファーストビューのすぐ下に置いて</b>います。クラウドの業務ツールのほか、<b>会計ソフト／予約システム／POSレジ／勤怠管理／オンライン学習</b>など「月額で使ってもらうサービス」のサイトにそのまま使えます。🚨 <b>「1位」「最も選ばれている」と書くときは根拠を必ず添えてください。</b>客観的な調査がないまま No.1 と書くと景品表示法の問題になります。🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>リストの記号など、属性では色を変えられない部分がテーマの色を見ています。',
                            'preview_url' => 'https://lite-word.com/saas-top/',
                            'path' => 'page_template/saas/top_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'SaaS・クラウドサービス できること（機能紹介）ページ',
                            'description' => '【型V：使っている画面が主役】クラウドの業務ツールの機能紹介ページ。下層ページの見出し帯→<b>朝・日中・夜の3つに分けて「いまこうしている／これを使うとこうなる」を並べ、それぞれに実際の画面を1枚ずつ置く</b>→機能の一覧表→<b>向いている使い方と向かない使い方</b>→いま使っているものとの付き合い方→締めの2択。機能紹介ページは「◯◯機能」と名前を並べて終わりがちですが、買う側は名前を読んでも自分の1日がどう変わるか分からないので、<b>時間帯ごとの動きと画面</b>を先に出し、名前の一覧は下の表に畳んでいます。<b>「向いていません」の欄を消さないでください。</b>できないことが書いていないページは、読む人にすぐ分かります。🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>',
                            'preview_url' => 'https://lite-word.com/saas-kinou/',
                            'path' => 'page_template/saas/kinou_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'SaaS・クラウドサービス 料金プランページ',
                            'description' => '【型A：表が主役／2ページ目用】クラウドの業務ツールの料金ページ。下層ページの見出し帯→3プランの比較表（11行）→<b>月額の外でかかるお金（打消し表示）</b>→どれを選べばいいか3枚→<b>人数で変わる目安の表（セルの統合ができる表）</b>→料金についてよくある誤解5つ→資料のダウンロード→締めの2択。料金ページは表を1つ置いて終わりがちですが、<b>①どう選ぶか ②月額の外に何が乗るか ③よくある誤解</b>まで書いて初めて問い合わせの前に判断してもらえます。🚨🚨 <b>「月額の外でかかるお金」の帯を消さないでください。</b>「初期費用0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>「業界最安」「他社より安い」と書くときは、比べた相手・時点・条件を必ず添えてください。</b>🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>',
                            'preview_url' => 'https://lite-word.com/saas-price/',
                            'path' => 'page_template/saas/price_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'SaaS・クラウドサービス 導入したお店（事例）ページ',
                            'description' => '【型W：ビフォーアフターが主役】クラウドの業務ツールの導入事例ページ。下層ページの見出し帯→<b>事例2軒を「入れる前／入れたあと」の写真で見せる</b>（机の写真・棚の写真）→変わったところを数字で3つ→ほかのお店のカードスライダー→手伝ったスタッフの言葉→締めの2択。事例ページは「◯◯様の声」を並べて終わりがちですが、買う側が知りたいのは感想ではなく<b>自分の机がどう変わるか</b>なので、<b>写真の前後を先に出して</b>います。<b>うまくいかなかったところも書いてあります</b>（二重管理の2週間・回数券は手計算のまま）。よいことしか書いていない事例は、読む人にすぐ分かります。🚨🚨 <b>「架空の事例です」の一文と、数字の下の注意書きを消さないでください。</b>体験談として実在するように見せると景品表示法の問題になります。実際のお客様の事例に差し替えるときは、<b>必ずご本人の掲載許可を取り</b>、<b>「効果には個人差があります」にあたる注意書きを残して</b>ください。🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>',
                            'preview_url' => 'https://lite-word.com/saas-jirei/',
                            'path' => 'page_template/saas/jirei_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'SaaS・クラウドサービス 安心のために（データとよくある質問）ページ',
                            'description' => '【型J：不安の解消が主役／2ページ目用】クラウドの業務ツールの「安心のために」ページ。下層ページの見出し帯→<b>いちばん上によく聞かれる心配ごと4つ</b>→データの置き場所と守り方7項目→<b>やめたいと思ったときの4段</b>→サポートの受付表（曜日ごと）→そのほかのよくある質問→締めの2択（聞く／資料をもらう）。<b>売り込む段を1つも作っていません。</b>SaaS で契約の前にいちばん止まるのは機能でも料金でもなく<b>「うちのお客様の情報をよその会社に置いて大丈夫か」</b>なので、そこに正面から答える作りです。🚨🚨 <b>「絶対に漏れません」「100%安全」と書かないでください。</b>実態と合わない断定は景品表示法の問題になります。<b>何をしているか</b>と<b>もし起きたら何をするか</b>を書いてください。🚨 <b>解約の手順とデータの持ち出しの欄を消さないでください。</b>ここが書いていないサービスは、それだけで候補から外されます。🚨 <b>データセンターの場所・バックアップ・削除までの日数は、ご自身のサービスの実際に合わせてください。</b>書いてあるとおりにしていない場合、それ自体が問題になります。🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>',
                            'preview_url' => 'https://lite-word.com/saas-security/',
                            'path' => 'page_template/saas/security_1/index.php',
                            'public' => false,
                        ],

                        [
                            'name' => 'SaaS・クラウドサービス はじめる（無料お試し・資料請求）ページ',
                            'description' => '【型I：導線が主役／2ページ目用】クラウドの業務ツールの申し込みページ。下層ページの見出し帯→<b>入口4つ（ためす／資料／オンライン相談／電話）の2×2の格子</b>→<b>申し込んだあと何が起きるか3段</b>→お試し中にかかるお金の条件→お問い合わせフォーム→資料に書いてあること・書いていないこと→オンライン相談の中身→ほかのページへの入口の帯。申し込みページは説明を先に置きがちですが、ここに来た人はもう「知りたい」か「始めたい」のどちらかなので、<b>いちばん上を入口にして</b>います。<b>このページだけ締めのCTAを置いていません</b>（ページ全体が申し込みの導線のため）。🚨 <b>「登録したあと何が起きるか」の3段を消さないでください。</b>「登録したら営業の電話がかかってくるのでは」で止まる方が多く、ここが書いてあるかどうかで申し込みの数が変わります。🚨🚨 <b>お試し中の料金についての帯を消さないでください。</b>「無料」と書いたら、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。🚨 <b>フォームの項目は、管理画面の「Lwお問い合わせ」で作ります。</b>ブロックの設定では変えられません。送信先のメールアドレスも必ず設定してください（未設定だとWordPressの管理者アドレスに届きます）。🚨 <b>サービス名（シゴトバコ）・料金・機能・事例はすべて架空です。</b>実在のサービスとは関係がありません。<b>ご自身のサービスの内容に必ず書き換えてください。</b>🚨 <b>「初期費用0円」「解約金なし」の条件を書いた帯を消さないでください。</b>「無料」「0円」のような強調表示には、その条件を<b>本文と同じ大きさで</b>近くに書く必要があります（打消し表示）。小さな注意書きにすると有利誤認になり得ます。🚨 <b>画面の写真は、ご自身のサービスの実際の画面に差し替えてください。</b>見本の画面はこのテンプレート用に作った架空のものです。🚨 <b>貼ったあと、ページ設定の「カラー設定」で深い青緑（#0e5c55）を選んでください。</b>',
                            'preview_url' => 'https://lite-word.com/saas-trial/',
                            'path' => 'page_template/saas/trial_1/index.php',
                            'public' => false,
                        ],
                    ]
                ],
                'ec' => [
                    'label' => 'ECサイト',
                    'templates' => []
                ],
            ]
        ],
        'campaign' => [
            'label' => 'キャンペーン型',
            'items' => [
                'limited-offer' => [
                    'label' => '期間限定オファー',
                    'templates' => []
                ],
                'countdown' => [
                    'label' => 'カウントダウン付',
                    'templates' => []
                ],
                'early-discount' => [
                    'label' => '早期割引',
                    'templates' => []
                ],
                'seasonal' => [
                    'label' => '季節イベント',
                    'templates' => []
                ],
                'launch' => [
                    'label' => 'プロダクトローンチ',
                    'templates' => []
                ],
            ]
        ],
    ];
}

/**
 * 現在選択されているテンプレートを取得
 */
function lw_get_current_templates() {
    $configs = lw_get_integrated_template_configs();
    $category = isset($_GET['lw_category']) ? sanitize_text_field($_GET['lw_category']) : '';
    $item = isset($_GET['lw_item']) ? sanitize_text_field($_GET['lw_item']) : '';
    
    if (empty($category) || empty($item)) {
        foreach ($configs as $cat_key => $cat_data) {
            foreach ($cat_data['items'] as $item_key => $item_data) {
                if (!empty($item_data['templates'])) {
                    return $item_data['templates'];
                }
            }
        }
        return [];
    }
    
    if (isset($configs[$category]['items'][$item]['templates'])) {
        return $configs[$category]['items'][$item]['templates'];
    }
    
    return [];
}

/**
 * テンプレートファイル取得エンドポイント
 */

function lw_replace_content_with_preview($content) {
    global $lw_preview_content;
    if (!empty($lw_preview_content)) {
        return do_blocks($lw_preview_content);
    }
    return $content;
}

/**
 * Ajax: ページ作成処理
 */
add_action('wp_ajax_lw_create_page_from_template', 'lw_create_page_from_template');

function lw_create_page_from_template() {
    if (!current_user_can('edit_pages')) {
        wp_die('権限がありません');
    }
    
    check_ajax_referer('lw_template_nonce', 'nonce');
    
    $template_path = sanitize_text_field($_POST['template_path']);
    $template_name = sanitize_text_field($_POST['template_name']);
    
    $has_subscription = defined('LW_HAS_SUBSCRIPTION') ? LW_HAS_SUBSCRIPTION : false;
    
    if (!$has_subscription) {
        $configs = lw_get_integrated_template_configs();
        $is_public = false;
        
        foreach ($configs as $category) {
            foreach ($category['items'] as $item) {
                foreach ($item['templates'] as $template) {
                    if ($template['path'] === $template_path) {
                        $is_public = isset($template['public']) && $template['public'] === true;
                        break 3;
                    }
                }
            }
        }
        
        if (!$is_public) {
            wp_send_json_error('このテンプレートはプレミアムプラン限定です');
            return;
        }
    }
    
    $template_path = str_replace('..', '', $template_path);
    $file_path = get_template_directory() . '/' . $template_path;
    
    if (!file_exists($file_path)) {
        wp_send_json_error('テンプレートファイルが見つかりません');
        return;
    }
    
    $content = file_get_contents($file_path);
    
    if ($content === false) {
        wp_send_json_error('ファイルの読み込みに失敗しました');
        return;
    }
    
    $title = $template_name . ' - ' . date('Y/m/d H:i');
    
    global $wpdb;
    
    $post_data = array(
        'post_author' => get_current_user_id(),
        'post_date' => current_time('mysql'),
        'post_date_gmt' => current_time('mysql', 1),
        'post_content' => $content,
        'post_title' => $title,
        'post_status' => 'draft',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
        'post_name' => sanitize_title($title),
        'post_modified' => current_time('mysql'),
        'post_modified_gmt' => current_time('mysql', 1),
        'post_type' => 'page'
    );
    
    $wpdb->insert($wpdb->posts, $post_data);
    $page_id = $wpdb->insert_id;
    
    if ($page_id) {
        update_post_meta($page_id, '_lw_template_source', $template_name);
        update_post_meta($page_id, '_lw_template_path', $template_path);
        
        wp_send_json_success(array(
            'page_id' => $page_id,
            'title' => $title,
            'edit_link' => admin_url('post.php?post=' . $page_id . '&action=edit')
        ));
    } else {
        wp_send_json_error('ページの作成に失敗しました');
    }
}

/**
 * サイドナビゲーション生成
 */
function lw_template_side_nav() {
    $configs = lw_get_integrated_template_configs();
    $current_category = isset($_GET['lw_category']) ? sanitize_text_field($_GET['lw_category']) : '';
    $current_item = isset($_GET['lw_item']) ? sanitize_text_field($_GET['lw_item']) : '';
    
    ?>
    <div class="lw-template-side-nav">
        <ul>
            <?php foreach ($configs as $category_key => $category) : 
                $has_templates_in_category = false;
                foreach ($category['items'] as $item) {
                    if (!empty($item['templates'])) {
                        $has_templates_in_category = true;
                        break;
                    }
                }
                
                if (!$has_templates_in_category) {
                    continue;
                }
            ?>
                <li>
                    <div class="a"><?php echo esc_html($category['label']); ?></div>
                    <ul>
                        <?php foreach ($category['items'] as $item_key => $item) : 
                            if (empty($item['templates'])) {
                                continue;
                            }
                            
                            $url = admin_url('admin.php?page=lw_page_template_insert&lw_category=' . $category_key . '&lw_item=' . $item_key);
                            $is_active = ($current_category === $category_key && $current_item === $item_key);
                            $template_count = count($item['templates']);
                            $count_display = ' (' . $template_count . ')';
                        ?>
                            <li>
                                <a href="<?php echo esc_url($url); ?>" 
                                   class="<?php echo $is_active ? 'active' : ''; ?>">
                                    <?php echo esc_html($item['label'] . $count_display); ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php
}

/**
 * 管理画面ページ
 */
function lw_page_template_insert_page() {
    $templates = lw_get_current_templates();
    $nonce = wp_create_nonce('lw_template_nonce');
    $rest_nonce = wp_create_nonce('wp_rest');
    $has_subscription = defined('LW_HAS_SUBSCRIPTION') ? LW_HAS_SUBSCRIPTION : false;
    ?>
    <?php
    /* 🚨 CSSにバージョンを付ける（2026-09-01）。
       これまで ?ver= が無かったので、CSSを直しても**利用者のブラウザは古いものを使い続けた**
       （説明ボタンを足した日に、手元で実際に古い見た目のまま出た）。
       ファイルの更新時刻を付けて、直したときだけ取り直させる。 */
    $lw_ti_css = '/functions/lw_page_template_insert/style.css';
    $lw_ti_ver = @filemtime(get_template_directory() . $lw_ti_css) ?: null;
    ?>
    <link rel="stylesheet" href="<?php echo esc_url(add_query_arg('ver', $lw_ti_ver, get_template_directory_uri() . $lw_ti_css)); ?>">
    <?=lw_template_side_nav()?>
    <div class="wrap lw-template-wrapper">
        <div class="none_plugin_message"></div>

        <!-- ===== テンプレート一覧（2026-09-06・Ryuichi 指示で全面差し替え） ==========
             > Ryuichi「この見せ方自体無くして良いんですよ。見にくいから。
             >   もちろん新規制作のボタンでページが挿入されるようにはしたいですよ」
             > Ryuichi「スクロールしたら、一気にしたのスクロールするという動き方が
             >   やりにくいんですよね。イライラする」

             ここまでは 1テンプレ＝1画面 の縦送りで、ホイールを乗っ取って1画面ぶん飛ばし、
             そのあと 800ms 操作を止めていた（少し回しただけで画面ごと飛ぶ）。
             Desktop 1400px と Mobile 375px を小さく2枚並べる見せ方も一緒にやめて、
             **分類の中を全部まとめて並べた一覧**にした。

             🚨 スクロールには一切手を出さない。ふつうの縦スクロールのまま。
             🚨 1枚ごとに「新規ページを作成」を置く（ページを作る道はここだけ）。 -->
        <div class="lw-grid-bar" id="lw-grid-bar">
            <span class="ttl"></span>
            <span class="grp"><b>幅</b>
                <button type="button" class="w is_on" data-w="1400">PC</button>
                <button type="button" class="w" data-w="375">スマホ</button>
            </span>
            <span class="grp"><b>大きさ</b>
                <button type="button" class="z" data-z="0">小</button>
                <button type="button" class="z is_on" data-z="1">中</button>
                <button type="button" class="z" data-z="2">大</button>
                <button type="button" class="z" data-z="3">特大</button>
            </span>
            <span class="grp"><b>高さ</b>
                <button type="button" class="h is_on" data-h="0">上だけ</button>
                <button type="button" class="h" data-h="1">ページ全部</button>
            </span>
        </div>

        <div class="main-container" id="lw-grid"></div>

        <div class="lw-popup-overlay" id="lw-loading-popup">
            <div class="lw-popup-box">
                <div class="lw-popup-spinner"></div>
                <h3>処理中...</h3>
                <p>しばらくお待ちください</p>
            </div>
        </div>
        
        <div class="lw-popup-overlay" id="lw-success-popup">
            <div class="lw-popup-box lw-success">
                <div class="lw-popup-icon">✓</div>
                <h3>作成完了！</h3>
                <p id="lw-success-message"></p>
                <div class="lw-popup-actions">
                    <button class="lw-btn lw-btn-primary" id="lw-edit-page">
                        編集画面を開く
                    </button>
                    <button class="lw-btn lw-btn-secondary" onclick="closePopup('lw-success-popup')">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
        
        <div class="lw-popup-overlay" id="lw-error-popup">
            <div class="lw-popup-box lw-error">
                <div class="lw-popup-icon">✕</div>
                <h3>エラー</h3>
                <p id="lw-error-message"></p>
                <div class="lw-popup-actions">
                    <button class="lw-btn lw-btn-primary" onclick="closePopup('lw-error-popup')">
                        閉じる
                    </button>
                </div>
            </div>
        </div>

        <!-- テンプレートの説明（本文には出さず、押したときだけここに出す） -->
        <div class="lw-popup-overlay" id="lw-desc-popup">
            <div class="lw-popup-box lw-desc">
                <h3 id="lw-desc-title"></h3>
                <div class="lw-desc-body" id="lw-desc-body"></div>
                <div class="lw-popup-actions">
                    <button class="lw-btn lw-btn-primary" onclick="closePopup('lw-desc-popup')">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    </div>
    <style>
        .lw-admin-notice-info{
            display: none;
        }
    </style>
    
    <script>
        function closePopup(popupId) {
            document.getElementById(popupId).classList.remove('show');
        }
        
        jQuery(document).ready(function($) {
            const templates = <?php echo json_encode($templates); ?>;
            const ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
            const restUrl = '<?php echo get_rest_url(null, 'lw-template/v1/get-template'); ?>';
            const restRenderUrl = '<?php echo get_rest_url(null, 'lw-template/v1/render-template'); ?>';
            const nonce = '<?php echo $nonce; ?>';
            const restNonce = '<?php echo $rest_nonce; ?>';
            const previewNonce = '<?php echo wp_create_nonce('lw_template_preview'); ?>';
            const siteUrl = '<?php echo home_url(); ?>';
            const hasSubscription = <?php echo $has_subscription ? 'true' : 'false'; ?>;
            
            const isBlockEditor = typeof wp !== 'undefined' && wp.blocks;
            const currentUrl = window.location.href;
            const isNewPage = currentUrl.includes('post-new.php') && currentUrl.includes('post_type=page');

            /* テンプレートの説明をポップアップで出す（2026-09-01 Ryuichi 依頼）
               🚨 本文に出すと、説明の長いテンプレートでプレビューと「新規ページを作成」が
                  画面の下へ押し出され、背の低いノートPCでボタンに届かなくなる。
               🚨 説明には <b> や <br> が入っているので html() で入れる。
                  中身は theme 内の PHP 配列（利用者の入力ではない）ので、そのまま入れてよい。 */
            $(document).on('click', '.lw-desc-open', function () {
                const t = templates[parseInt($(this).data('index'), 10)];
                if (!t) { return; }
                $('#lw-desc-title').text(t.name);
                $('#lw-desc-body').html(t.description || '');
                $('#lw-desc-popup').addClass('show');
            });
            /* 背景を押しても閉じる（説明は縦に長いので、閉じるボタンまで戻らなくて済むように） */
            $(document).on('click', '#lw-desc-popup', function (e) {
                if (e.target === this) { closePopup('lw-desc-popup'); }
            });
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape') { closePopup('lw-desc-popup'); }
            });
            
            function setupTemplateButtons() {
                $('.use-template-button').on('click', function() {
                    const templatePath = $(this).data('path');
                    const templateName = $(this).data('name');
                    const $btn = $(this);
                    
                    $btn.prop('disabled', true).text('処理中...');
                    $('#lw-loading-popup').addClass('show');
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'lw_create_page_from_template',
                            template_path: templatePath,
                            template_name: templateName,
                            nonce: nonce
                        },
                        success: function(response) {
                            $('#lw-loading-popup').removeClass('show');
                            
                            if (response.success) {
                                $('#lw-success-message').html(`
                                    タイトル: <strong>${response.data.title}</strong>
                                `);
                                $('#lw-edit-page').off('click').on('click', function() {
                                    window.location.href = response.data.edit_link;
                                });
                                $('#lw-success-popup').addClass('show');
                            } else {
                                $('#lw-error-message').text(response.data || 'エラーが発生しました');
                                $('#lw-error-popup').addClass('show');
                            }
                            
                            $btn.prop('disabled', false).text('新規ページを作成');
                        },
                        error: function(xhr, status, error) {
                            $('#lw-loading-popup').removeClass('show');
                            $('#lw-error-message').text('通信エラー: ' + error);
                            $('#lw-error-popup').addClass('show');
                            $btn.prop('disabled', false).text('新規ページを作成');
                        }
                    });
                });
                
                $('.insert-template-button').on('click', function() {
                    const templatePath = $(this).data('path');
                    const templateName = $(this).data('name');
                    const $btn = $(this);
                    
                    $btn.prop('disabled', true).text('取得中...');
                    
                    fetch(restUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': restNonce
                        },
                        body: JSON.stringify({
                            template_path: templatePath
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            insertIntoBlockEditor(data.content);
                            showNotification('テンプレートを挿入しました', 'success');
                        } else {
                            showNotification('テンプレートの取得に失敗しました', 'error');
                        }
                        $btn.prop('disabled', false).text('エディタに挿入');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('エラーが発生しました', 'error');
                        $btn.prop('disabled', false).text('エディタに挿入');
                    });
                });
            }

            /* ===== テンプレート一覧（2026-09-06・Ryuichi 指示で全面差し替え） ==========
               分類の中のテンプレートを**全部まとめて並べる**。1枚ごとに
               「新規ページを作成」「エディタに挿入」「説明を見る」「フルサイトを開く」。

               捨てたもの（Ryuichi「イライラする」）:
                 ・wheel を preventDefault して1画面ぶん scrollTo し、800ms 操作を止める仕掛け
                 ・1テンプレ＝1画面の縦送り／進捗バー／右のドット
                 ・Desktop 1400px と Mobile 375px を小さく2枚並べる見せ方
               🚨 スクロールには一切手を出さない。触るのは iframe の縮尺だけ。

               🚨🚨 遅延読み込みは自前でやる。1本ごとに WordPress を起動して do_blocks() する
                  重い画面なので、19本の分類で全部いっぺんに投げると管理画面が固まる。
                  loading="lazy" は当てにしない（2026-09-06 に横並びで実測。19/19 読み込まれた）。
               ⚠️ IntersectionObserver も requestAnimationFrame も使わない。
                  **タブが裏に回っている間は一度も呼ばれない**（同日実測）。間引きは setTimeout。 */
            function setupGrid() {
                const bar = document.getElementById('lw-grid-bar');
                const grid = document.getElementById('lw-grid');
                if (!bar || !grid) { return; }

                /* 大きさ＝1枚の目安の横幅（px）。CSS の grid が入るだけ横に詰めるので、
                   画面が広ければ勝手に列が増える。幅（PC/スマホ）で見え方が変わるので別に持つ */
                const CARD_PC = [260, 340, 460, 700];
                const CARD_SP = [150, 200, 270, 380];
                /* 「上だけ」で見せるページの高さ（縮める前の実寸 px）。
                   capVh() が 100vh のファーストビューを 820px で止めるので、
                   PC は FV ＋ 次の段の頭、スマホは FV ＋少しが入る */
                const CROP_PC = 1200;
                const CROP_SP = 900;

                let gw = 1400;      /* iframe に渡す画面幅 */
                let gz = 1;         /* 大きさ（上の配列の何番目か） */
                let gfull = false;  /* 「ページ全部」か */

                function cropH() { return 375 === gw ? CROP_SP : CROP_PC; }
                function cardW() { return (375 === gw ? CARD_SP : CARD_PC)[gz]; }

                /* 見出しは左のメニューで選ばれている項目から取る（PHP を触らずに済む） */
                const navOn = document.querySelector('.lw-template-side-nav a.active');
                const gTitle = navOn ? navOn.textContent.trim().replace(/\s*\(\d+\)\s*$/, '') : 'テンプレート';
                bar.querySelector('.ttl').textContent = gTitle + '（' + templates.length + '本）';

                /**
                 * 🚨🚨 画面いっぱい（100vh）のファーストビューを、ふつうの画面の高さで止める。
                 * iframe の中では「100vh ＝ iframe の高さ」になる。「ページ全部」では iframe を
                 * ページ全体の高さ（1万px超）にするので、FV だけがそこまで伸びて
                 * 1枚が真っ平らな色の柱になる（2026-09-06 にサンプル一覧で実際にそうなった）。
                 */
                function capVh(d) {
                    try {
                        if (!d || !d.head || d.getElementById('lw-grid-capvh')) { return; }
                        const st = d.createElement('style');
                        st.id = 'lw-grid-capvh';
                        st.textContent = '[class*="100vh"]{min-height:820px !important;height:auto !important;}';
                        d.head.appendChild(st);
                    } catch (e) { /* 同じドメインなので普通は起きない */ }
                }

                /** 1枚ぶんの大きさを当て直す（読み込みの前でも後でも呼べる） */
                function gridFit(card) {
                    const clip = card.querySelector('.g_clip');
                    const ifr = card.querySelector('iframe');
                    if (!clip || !ifr) { return; }
                    const w = clip.clientWidth;
                    if (!w) { return; }
                    const k = w / gw;

                    let frameH = cropH();
                    if (gfull) {
                        /* 同じドメインなので実際の高さが読める。読めないうちは切り抜きのままにする */
                        let real = 0;
                        try {
                            const d = ifr.contentDocument;
                            if (d && d.documentElement) {
                                real = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
                            }
                        } catch (e) { /* 起きない想定 */ }
                        if (real) { frameH = real; }
                    }

                    ifr.style.width = gw + 'px';
                    ifr.style.height = frameH + 'px';
                    ifr.style.transform = 'scale(' + k + ')';
                    clip.style.height = Math.round(frameH * k) + 'px';
                }

                function gridFitAll() {
                    grid.style.setProperty('--lw-card', cardW() + 'px');
                    grid.querySelectorAll('.g_card').forEach(gridFit);
                    gridLoad();
                }

                /**
                 * 見えている範囲（＋上400px／下200px）に入ったものだけ src を入れる。
                 * 🚨🚨 **同時に読み込むのは4本まで。** 1本が WordPress 1回ぶん
                 *    （起動 → do_blocks()）なので、まとめて投げると利用者のサーバーを
                 *    分類を開くたびに十数回叩くことになる（2026-09-06 実測。
                 *    先読み900pxだと19本の分類で開いた瞬間に16本が走った）。
                 *    1本終わるたびに自分で次を1本始める。
                 */
                const MAX_LOADING = 4;
                let loadingNow = 0;

                function gridLoad() {
                    const vh = window.innerHeight || 800;
                    const cards = grid.querySelectorAll('.g_card');
                    for (let i = 0; i < cards.length; i++) {
                        if (loadingNow >= MAX_LOADING) { return; }
                        const card = cards[i];
                        const ifr = card.querySelector('iframe');
                        if (!ifr || ifr.getAttribute('src')) { continue; }
                        const r = card.getBoundingClientRect();
                        if (r.bottom < -400) { continue; }
                        if (r.top > vh + 200) { continue; }

                        const wait = card.querySelector('.g_wait');
                        if (wait) { wait.textContent = '読み込み中…'; }

                        /* 🚨 load が来ないまま止まると次が永久に始まらないので、時間でも必ず解放する */
                        loadingNow++;
                        let freed = false;
                        const free = function () {
                            if (freed) { return; }
                            freed = true;
                            loadingNow--;
                            gridLoad();
                        };
                        ifr.addEventListener('load', free);
                        ifr.addEventListener('error', free);
                        setTimeout(free, 15000);

                        ifr.src = ifr.dataset.src;
                    }
                }

                function build() {
                    grid.innerHTML = '';

                    templates.forEach(function (t, index) {
                        const locked = !hasSubscription && t.public === false;
                        const canUse = hasSubscription || t.public !== false;
                        const hasSite = t.preview_url && '' !== String(t.preview_url).trim();

                        const card = document.createElement('div');
                        card.className = 'g_card' + (locked ? ' is_locked' : '');

                        const clip = document.createElement('div');
                        clip.className = 'g_clip';
                        /* まだ読み込んでいない枠の案内。iframe が乗ると隠れる */
                        const wait = document.createElement('span');
                        wait.className = 'g_wait';
                        wait.textContent = 'スクロールすると読み込みます';
                        clip.appendChild(wait);

                        const ifr = document.createElement('iframe');
                        ifr.setAttribute('title', t.name);
                        ifr.setAttribute('scrolling', 'no');
                        ifr.setAttribute('tabindex', '-1');
                        ifr.setAttribute('frameborder', '0');
                        ifr.addEventListener('load', function () {
                            capVh(ifr.contentDocument);
                            gridFit(card);
                            /* 画像・Webフォントが遅れて入ると高さが変わるので、少しあとにもう一度当てる */
                            setTimeout(function () { capVh(ifr.contentDocument); gridFit(card); }, 900);
                            setTimeout(function () { capVh(ifr.contentDocument); gridFit(card); }, 2600);
                        });
                        /* 🚨 ここでは src を入れない。gridLoad() が見に来たときだけ入れる */
                        ifr.dataset.src = siteUrl + '/?lw_template_preview=1&template_path='
                            + encodeURIComponent(t.path) + '&_wpnonce=' + previewNonce;
                        clip.appendChild(ifr);

                        const foot = document.createElement('div');
                        foot.className = 'g_foot';

                        const name = document.createElement('div');
                        name.className = 'g_name';
                        name.textContent = (locked ? '🔒 ' : '') + t.name;
                        foot.appendChild(name);

                        const btns = document.createElement('div');
                        btns.className = 'g_btns';

                        /* いちばん大事なボタン。1枚ごとに置く（Ryuichi 指示） */
                        if (canUse) {
                            const use = document.createElement('button');
                            use.type = 'button';
                            use.className = 'use-template-button new-page';
                            use.dataset.path = t.path;
                            use.dataset.name = t.name;
                            use.textContent = '新規ページを作成';
                            btns.appendChild(use);
                        } else {
                            const lock = document.createElement('button');
                            lock.type = 'button';
                            lock.className = 'premium-locked-button';
                            lock.disabled = true;
                            lock.textContent = '🔒 プレミアムプラン限定';
                            btns.appendChild(lock);
                        }

                        /* 新規固定ページの編集画面から開いているときだけ出る（従来どおり） */
                        if (isNewPage && isBlockEditor && canUse) {
                            const ins = document.createElement('button');
                            ins.type = 'button';
                            ins.className = 'insert-template-button g_sub';
                            ins.dataset.path = t.path;
                            ins.dataset.name = t.name;
                            ins.textContent = 'エディタに挿入';
                            btns.appendChild(ins);
                        }

                        /* 説明は押したときだけポップアップで出す（2026-09-01 Ryuichi 依頼のまま）。
                           .lw-desc-open の受け口は $(document).on(...) なので、後から作っても効く */
                        if (t.description) {
                            const desc = document.createElement('button');
                            desc.type = 'button';
                            desc.className = 'lw-desc-open g_sub';
                            desc.dataset.index = index;
                            desc.textContent = '説明を見る';
                            btns.appendChild(desc);
                        }

                        if (hasSite) {
                            const site = document.createElement('button');
                            site.type = 'button';
                            site.className = 'open-site-button g_sub';
                            site.textContent = 'フルサイトを開く';
                            site.addEventListener('click', function () {
                                window.open(t.preview_url, '_blank');
                            });
                            btns.appendChild(site);
                        }

                        foot.appendChild(btns);
                        card.appendChild(clip);
                        card.appendChild(foot);
                        grid.appendChild(card);
                    });

                    setupTemplateButtons();
                }

                /** 上のバーのボタン。同じ組の中で1つだけ光らせて、当て直す */
                function gridSwitch(sel, fn) {
                    bar.querySelectorAll(sel).forEach(function (b) {
                        b.addEventListener('click', function () {
                            bar.querySelectorAll(sel).forEach(function (o) {
                                o.classList.toggle('is_on', o === b);
                            });
                            fn(b);
                            gridFitAll();
                        });
                    });
                }
                gridSwitch('.w', function (b) { gw = parseInt(b.dataset.w, 10) || 1400; });
                gridSwitch('.z', function (b) { gz = parseInt(b.dataset.z, 10) || 0; });
                gridSwitch('.h', function (b) { gfull = '1' === b.dataset.h; });

                /* 🚨 requestAnimationFrame を使ってはいけない。**タブが裏に回っている間は
                      一度も呼ばれない**（2026-09-06 実測。document.visibilityState が hidden の
                      とき rAF も scroll も止まる）。IntersectionObserver を避けているのと同じ理由。 */
                let gTimer = null;
                function gridWatch() {
                    if (gTimer) { return; }
                    gTimer = setTimeout(function () { gTimer = null; gridLoad(); }, 80);
                }
                window.addEventListener('scroll', gridWatch, { passive: true });
                window.addEventListener('resize', function () { gridFitAll(); });

                build();
                gridFitAll();
            }

            function insertIntoBlockEditor(content) {
                if (!wp || !wp.blocks || !wp.data) {
                    alert('ブロックエディタが利用できません');
                    return;
                }
                
                const { resetBlocks, insertBlocks } = wp.data.dispatch('core/block-editor');
                const blocks = wp.blocks.parse(content);
                const currentBlocks = wp.data.select('core/block-editor').getBlocks();
                
                if (currentBlocks.length > 0) {
                    if (window.confirm('現在の内容を置き換えますか？\n（「キャンセル」で追加挿入）')) {
                        resetBlocks(blocks);
                    } else {
                        insertBlocks(blocks);
                    }
                } else {
                    insertBlocks(blocks);
                }
            }
            
            function showNotification(message, type = 'info') {
                if (wp && wp.data && wp.data.dispatch('core/notices')) {
                    wp.data.dispatch('core/notices').createNotice(
                        type,
                        message,
                        {
                            isDismissible: true,
                            type: 'snackbar'
                        }
                    );
                } else {
                    alert(message);
                }
            }
            
            if (templates.length > 0) {
                setupGrid();
            } else {
                $('#lw-grid').html('<p class="lw-grid-empty">このカテゴリーにはテンプレートがまだ登録されていません。</p>');
                $('#lw-grid-bar').hide();
            }
        });
    </script>
    <?php
}