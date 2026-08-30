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
                    'templates' => []
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
                'school' => [
                    'label' => 'スクール・教室',
                    'templates' => []
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
    <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri() . '/functions/lw_page_template_insert/style.css'); ?>">
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
                        
                        const sectionHTML = `
                            <div class="site-section ${isPremiumOnly ? 'premium-only' : ''}" data-index="${index}">
                                <div class="site-info">
                                    <h2>${template.name}</h2>
                                    <p>${template.description}</p>
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