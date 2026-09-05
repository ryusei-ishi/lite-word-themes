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
                    ]
                ],
                'pricing' => [
                    'label' => '料金表',
                    'templates' => []
                ],
                'cases' => [
                    'label' => '実績・事例',
                    'templates' => []
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
                    'templates' => []
                ],
                'story' => [
                    'label' => 'ストーリー型（起承転結）',
                    'templates' => []
                ],
                'comparison' => [
                    'label' => '比較表メイン',
                    'templates' => []
                ],
                'faq' => [
                    'label' => 'FAQ中心型',
                    'templates' => []
                ],
                'testimonial' => [
                    'label' => 'お客様の声メイン',
                    'templates' => []
                ],
                'before-after' => [
                    'label' => 'ビフォーアフター型',
                    'templates' => []
                ],
            ]
        ],
        'lead-generation' => [
            'label' => 'リード獲得特化',
            'items' => [
                'whitepaper' => [
                    'label' => 'ホワイトペーパーDL',
                    'templates' => []
                ],
                'webinar' => [
                    'label' => 'ウェビナー登録',
                    'templates' => []
                ],
                'consultation' => [
                    'label' => '無料相談予約',
                    'templates' => []
                ],
                'document' => [
                    'label' => '資料請求',
                    'templates' => []
                ],
                'newsletter' => [
                    'label' => 'メルマガ登録',
                    'templates' => []
                ],
                'assessment' => [
                    'label' => '無料診断・査定',
                    'templates' => []
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
                    'templates' => []
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

        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>

        <div class="site-navigation">
            <div class="nav-dots"></div>
        </div>

        <div class="main-container"></div>
        
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
            
            class TemplateManager {
                constructor() {
                    this.currentTemplate = 0;
                    this.isScrolling = false;
                    this.container = document.querySelector('.main-container');
                    this.progressBar = document.querySelector('.progress-fill');
                    this.navDots = document.querySelector('.nav-dots');
                    
                    this.init();
                }
                
                init() {
                    this.createTemplateSections();
                    this.createNavigation();
                    this.setupEventListeners();
                    this.setupIntersectionObserver();
                    this.showTemplate(0);
                }
                
                createTemplateSections() {
                    templates.forEach((template, index) => {
                        const isAccessible = hasSubscription || template.public !== false;
                        const isPremiumOnly = !hasSubscription && template.public === false;
                        const hasPreviewUrl = template.preview_url && template.preview_url.trim() !== '';
                        // preview_url は「フルサイトを開く」ボタンにだけ使う。
                        // iframe には使わない：lite-word.com は X-Frame-Options: SAMEORIGIN なので
                        // 別ドメイン（利用者のサイト）の管理画面では真っ白になるため。
                        
                        // 🚨 説明は本文に出さず、押したときだけポップアップで見せる（2026-09-01 Ryuichi 依頼）
                        //   > Ryuichi「この説明はほぼ要らない。理由は縦幅の小さいPCではボタンを押せない」
                        //   >         「もし説明を入れるなら、クリックしてポップアップで説明する感じにするべき」
                        //   説明は5〜10行あるものがあり、そのぶんプレビューと「新規ページを作成」が
                        //   画面の下へ押し出されて、背の低いノートPCではボタンに届かなくなっていた。
                        const sectionHTML = `
                            <div class="site-section ${isPremiumOnly ? 'premium-only' : ''}" data-index="${index}">
                                <div class="site-info">
                                    <h2>${template.name}</h2>
                                    ${template.description ? `<button type="button" class="lw-desc-open" data-index="${index}">このテンプレートの説明を見る</button>` : ''}
                                    ${isPremiumOnly ? '<p class="premium-badge">🔒 プレミアムプラン限定</p>' : ''}
                                </div>
                                <div class="preview-container">
                                    <div class="device-preview desktop-preview">
                                        <div class="device-header">
                                            <span class="device-label">Desktop (1400px)</span>
                                        </div>
                                        <div class="thumbnail-preview">
                                            <div class="loading-state">
                                                <div class="spinner"></div>
                                                <p>Loading...</p>
                                            </div>
                                            ${`<iframe data-path="${template.path}" data-type="render" frameborder="0" style="display: none;"></iframe>`}
                                        </div>
                                    </div>
                                    <div class="device-preview mobile-preview">
                                        <div class="device-header">
                                            <span class="device-label">Mobile (375px)</span>
                                        </div>
                                        <div class="phone-frame">
                                            <div class="phone-screen">
                                                <div class="loading-state">
                                                    <div class="spinner"></div>
                                                    <p>Loading...</p>
                                                </div>
                                                ${`<iframe data-path="${template.path}" data-type="render" frameborder="0" style="display: none;"></iframe>`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="action-buttons">
                                    ${hasPreviewUrl ? `
                                        <button class="open-site-button" onclick="window.open('${template.preview_url}', '_blank')">
                                            フルサイトを開く
                                        </button>
                                    ` : ''}
                                    ${isNewPage && isBlockEditor && isAccessible ? `
                                        <button class="insert-template-button" 
                                                data-path="${template.path}" 
                                                data-name="${template.name}">
                                            エディタに挿入
                                        </button>
                                    ` : ''}
                                    ${isAccessible ? `
                                        <button class="use-template-button new-page" 
                                                data-path="${template.path}" 
                                                data-name="${template.name}">
                                            新規ページを作成
                                        </button>
                                    ` : `
                                        <button class="premium-locked-button" disabled>
                                            🔒 プレミアムプラン限定
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                        this.container.innerHTML += sectionHTML;
                    });
                    
                    this.setupTemplateButtons();
                }
                
                setupTemplateButtons() {
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
                
                createNavigation() {
                    templates.forEach((_, index) => {
                        const dot = document.createElement('div');
                        dot.className = 'nav-dot';
                        dot.addEventListener('click', () => this.goToTemplate(index));
                        this.navDots.appendChild(dot);
                    });
                }
                
                setupEventListeners() {
                    this.container.addEventListener('wheel', (e) => {
                        e.preventDefault();
                        
                        if (this.isScrolling) return;
                        
                        const delta = e.deltaY;
                        if (delta > 0 && this.currentTemplate < templates.length - 1) {
                            this.nextTemplate();
                        } else if (delta < 0 && this.currentTemplate > 0) {
                            this.prevTemplate();
                        }
                    });
                    
                    document.addEventListener('keydown', (e) => {
                        if (this.isScrolling) return;
                        
                        switch(e.key) {
                            case 'ArrowDown':
                            case 'PageDown':
                                e.preventDefault();
                                this.nextTemplate();
                                break;
                            case 'ArrowUp':
                            case 'PageUp':
                                e.preventDefault();
                                this.prevTemplate();
                                break;
                        }
                    });
                    
                    let startY = 0;
                    this.container.addEventListener('touchstart', (e) => {
                        startY = e.touches[0].clientY;
                    });
                    
                    this.container.addEventListener('touchend', (e) => {
                        if (this.isScrolling) return;
                        
                        const endY = e.changedTouches[0].clientY;
                        const diff = startY - endY;
                        
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) {
                                this.nextTemplate();
                            } else {
                                this.prevTemplate();
                            }
                        }
                    });
                }
                
                setupIntersectionObserver() {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const index = parseInt(entry.target.dataset.index);
                                this.loadTemplateContent(index);
                                entry.target.classList.add('visible');
                            }
                        });
                    }, {
                        threshold: 0.5
                    });
                    
                    document.querySelectorAll('.site-section').forEach(section => {
                        observer.observe(section);
                    });
                }
                
                loadTemplateContent(index) {
                    const section = document.querySelector(`[data-index="${index}"]`);
                    const iframes = section.querySelectorAll('iframe[data-src], iframe[data-path]');

                    iframes.forEach(iframe => {
                        if (iframe.src) return;

                        const type = iframe.dataset.type;

                        if (type === 'url') {
                            iframe.src = iframe.dataset.src;
                            iframe.onload = () => {
                                iframe.style.display = 'block';
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.style.display = 'none';
                                }
                            };
                        } else if (type === 'render') {
                            const templatePath = iframe.dataset.path;
                            // srcdocではなくURLで直接読み込む
                            const previewUrl = `${siteUrl}/?lw_template_preview=1&template_path=${encodeURIComponent(templatePath)}&_wpnonce=${previewNonce}`;
                            iframe.src = previewUrl;
                            iframe.onload = () => {
                                iframe.style.display = 'block';
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.style.display = 'none';
                                }
                            };
                            iframe.onerror = () => {
                                console.error('テンプレートの読み込みに失敗しました');
                                const loadingState = iframe.parentElement.querySelector('.loading-state');
                                if (loadingState) {
                                    loadingState.innerHTML = '<p style="color: red;">読み込みエラー</p>';
                                }
                            };
                        }
                    });
                }
                
                nextTemplate() {
                    if (this.currentTemplate < templates.length - 1) {
                        this.showTemplate(this.currentTemplate + 1);
                    }
                }
                
                prevTemplate() {
                    if (this.currentTemplate > 0) {
                        this.showTemplate(this.currentTemplate - 1);
                    }
                }
                
                goToTemplate(index) {
                    if (index >= 0 && index < templates.length && index !== this.currentTemplate) {
                        this.showTemplate(index);
                    }
                }
                
                showTemplate(index) {
                    this.isScrolling = true;
                    this.currentTemplate = index;
                    
                    const targetY = index * window.innerHeight;
                    
                    this.container.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                    
                    const progress = (index / (templates.length - 1)) * 100;
                    this.progressBar.style.width = progress + '%';
                    
                    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                    
                    document.querySelectorAll('.site-section').forEach((section, i) => {
                        section.classList.toggle('active', i === index);
                    });
                    
                    setTimeout(() => {
                        this.isScrolling = false;
                    }, 800);
                    
                    this.loadTemplateContent(index);
                }
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
                new TemplateManager();
            } else {
                $('.main-container').html('<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 18px; color: #999;">このカテゴリーにはテンプレートがまだ登録されていません。</div>');
                $('.progress-bar, .site-navigation').hide();
            }
        });
    </script>
    <?php
}