<?php
if (!defined('ABSPATH')) exit;

add_action('admin_menu', 'Lw_add_page_setting_fields');
function Lw_add_page_setting_fields() {
    add_meta_box('page_setting_page_setting', 'ページ独自のデザイン設定', 'insert_page_setting_meta_fields', 'page');
}

/**------------------------
 * 入力エリア
--------------------------*/
function insert_page_setting_meta_fields() { 
    get_template_part('./functions/custom_post/lw_block_insert');
    get_template_part('./functions/custom_post/lw_block_insert_functions');
    get_template_part('./functions/custom_post/lw_block_insert_arr');
    ?>
    <input type="hidden" name="meta_nonce" id="meta_nonce" value="<?php echo wp_create_nonce('meta_nonce'); ?>" />
    <div class="Lw_edit_style_wrap">
        <div class="Lw_edit_style reset">
            <details>
                <summary>ヘッダーの設定</summary>
                <dl>
                    <dt class="left">ヘッダーパターンの選択</dt>
                    <dd><?= Lw_input_select("header_select", header_ptn_arr() , "Lw_input_select_switch") ?></dd>
                    <dt class="left">メニューの選択</dt>
                    <dd>
                        <?php
                        if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
                            $menus = wp_get_nav_menus();
                            
                            // メニューの配列を作成
                            $menu_options = array(
                                "" => "未選択"
                            );
                            
                            // 取得したメニューを配列に追加
                            if (!empty($menus)) {
                                foreach ($menus as $menu) {
                                    $menu_options[$menu->term_id] = $menu->name;
                                }
                            }
                            
                            // Lw_input_select関数でセレクトボックスを表示
                            echo Lw_input_select("header_menu_select", $menu_options);
                        }else{
                            echo '<p class="premium_message"><a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">LiteWordプレミアム限定機能</a></p>';
                        }
                        ?>
                    </dd>
                    <h2>ロゴの設定</h2>
                    <dt class="left">表示切替</dt>
                    <dd><?= Lw_input_select("logo_header_page_switch", [
                        "" => "未選択",
                        "logo_text" => "テキスト",
                        "logo_img" => "画像",
                    ]) ?></dd>
                    <dt class="left">ロゴテキストの設定</dt>
                    <dd><?= Lw_input_text("logo_header_page_text") ?></dd>
                    <dt class="left">フォントの種類</dt>
                    <dd><?= Lw_input_select("logo_text_font_family", ctm_font_family_arr()) ?></dd>
                    <dt class="left">フォントの太さ</dt>
                    <dd><?= Lw_input_select("logo_text_font_weight", ctm_font_weight_arr()) ?></dd>
                    <dt class="left">ロゴ画像の設定</dt>
                    <dd><?=Lw_input_media("logo_header_page_img")?></dd>
                    <dt class="left">ロゴPC時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_header_page_size_pc","","38")?></dd>
                    <dt class="left">ロゴタブレット時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_header_page_size_tb","","34")?></dd>
                    <dt class="left">ロゴスマホ時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_header_page_size_sp","","30")?></dd>
                    <dt class="left">URLの指定</dt>
                    <dd><?= Lw_input_text("logo_header_page_url") ?></dd>
                    <h2>その他の設定</h2>
                    <dt class="left">アクションボタンの色</dt>
                    <dd><?= Lw_input_color("header_page_cta_color_bg") ?></dd>
                    <dt class="left">ピックアップメニュー</dt>
                    <dd><?= Lw_input_select("page_pickup_menu_page_switch", ctm_switch_array_2()) ?></dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>ドロワーの設定</summary>
                <dl>
                    <dt class="left">パターンの選択</dt>
                    <dd><?= Lw_input_select("drawer_page_switch",drawer_ptn_arr()) ?></dd>
                    <dt class="left">メニューの選択</dt>
                    <dd>
                        <?php
                        if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
                            // ナビゲーションメニューの一覧を取得
                            $menus = wp_get_nav_menus();
                            
                            // 取得したメニューを配列に追加
                            $menu_options = array(
                                "" => "未選択"
                            );
                            
                            if (!empty($menus)) {
                                foreach ($menus as $menu) {
                                    $menu_options[$menu->term_id] = $menu->name;
                                }
                            }
                            
                            // Lw_input_select関数でセレクトボックスを表示
                            echo Lw_input_select("drawer_menu_select", $menu_options);
                        }else{
                            echo '<p class="premium_message"><a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">LiteWordプレミアム限定機能</a></p>';
                        }
                        ?>
                    </dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>フッターの設定</summary>
                <dl>
                    <dt class="left">フッターパターン</dt>
                    <dd><?= Lw_input_select("footer_select", footer_ptn_arr(), "Lw_input_select_switch") ?></dd>
                    <dt class="left">メニューの選択</dt>
                    <dd>
                        <?php
                        if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
                        // ナビゲーションメニューの一覧を取得
                        $menus = wp_get_nav_menus();
                        
                        // 取得したメニューを配列に追加
                        $menu_options = array(
                            "" => "未選択"
                        );
                        
                        if (!empty($menus)) {
                            foreach ($menus as $menu) {
                                $menu_options[$menu->term_id] = $menu->name;
                            }
                        }
                        
                        // Lw_input_select関数でセレクトボックスを表示
                        echo Lw_input_select("footer_menu_select", $menu_options);
                        }else{
                            echo '<p class="premium_message"><a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">LiteWordプレミアム限定機能</a></p>';
                        }
                        
                        ?>
                    </dd>
                    <h2>ロゴの設定</h2>
                    <dt class="left">表示切替</dt>
                    <dd><?= Lw_input_select("logo_footer_page_switch", [
                        "" => "未選択",
                        "logo_text" => "テキスト",
                        "logo_img" => "画像",
                    ]) ?></dd>
                    <dt class="left">ロゴテキストの設定</dt>
                    <dd><?= Lw_input_text("logo_footer_page_text") ?></dd>
                    <dt class="left">フォントの種類</dt>
                    <dd><?= Lw_input_select("logo_footer_text_font_family", ctm_font_family_arr()) ?></dd>
                    <dt class="left">フォントの太さ</dt>
                    <dd><?= Lw_input_select("logo_footer_text_font_weight", ctm_font_weight_arr()) ?></dd>
                    <dt class="left">ロゴ画像の設定</dt>
                    <dd><?=Lw_input_media("logo_footer_page_img")?></dd>
                    <dt class="left">ロゴPC時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_footer_page_size_pc","","38")?></dd>
                    <dt class="left">ロゴタブレット時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_footer_page_size_tb","","34")?></dd>
                    <dt class="left">ロゴスマホ時のサイズ</dt>
                    <dd><?=Lw_input_range("logo_footer_page_size_sp","","30")?></dd>
                     <dt class="left">ロゴURLの指定</dt>
                    <dd><?= Lw_input_text("logo_footer_page_url") ?></dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>追従CTA設定</summary>
                <dl>
                    <dt>フッター追従CTAパターンの選択</dt>
                    <dd><?= Lw_input_select("follow_bottom_cta_ptn",follow_bottom_cta_arr()) ?></dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>カラー設定</summary>
                <dl>
                    <dt class="left">メインカラー</dt>
                    <dd><?= Lw_input_color("color_main") ?></dd>
                    <dt class="left">アクセントカラー</dt>
                    <dd><?= Lw_input_color("color_accent") ?></dd>
                    <dt class="left">文字の色</dt>
                    <dd><?= Lw_input_color("color_text") ?></dd>
                    <dt class="left">リターンボタンの色</dt>
                    <dd><?= Lw_input_color("color_return_btn") ?></dd>
                    <dt class="left">カラー 01</dt>
                    <dd><?= Lw_input_color("color_1") ?></dd>
                    <dt class="left">カラー 02</dt>
                    <dd><?= Lw_input_color("color_2") ?></dd>
                    <dt class="left">カラー 03</dt>
                    <dd><?= Lw_input_color("color_3") ?></dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>フォント</summary>
                <dl>
                    <dt class="left">フォントの種類</dt>
                    <dd><?= Lw_input_select("font_body", ctm_font_family_arr()) ?></dd>
                    <dt class="left">フォントの太さ</dt>
                    <dd><?= Lw_input_select("font_body_weight", ctm_font_weight_arr()) ?></dd>
                    <dt class="left">文字サイズ（パソコンの時）</dt>
                    <dd><?= Lw_input_select("font_size_pc", ctm_font_size_arr()) ?></dd>
                    <dt class="left">文字サイズ（タブレットの時）</dt>
                    <dd><?= Lw_input_select("font_size_tb", ctm_font_size_arr()) ?></dd>
                    <dt class="left">文字サイズ（スマホの時）</dt>
                    <dd><?= Lw_input_select("font_size_sp", ctm_font_size_arr()) ?></dd>
            
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>レイアウト</summary>
                <dl>
                    <dt class="left">最大横幅</dt>
                    <dd><?= Lw_input_select("max_width_clm_1", ctm_max_width_arr()) ?></dd>     
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>ページ背景の設定</summary>
                <dl>
                    <dt class="left">ページ全体の背景色 PC</dt>
                    <dd><?= Lw_input_color("color_page_bg_pc") ?></dd>
                    <dt class="left">ページ全体の背景色 透明度</dt>
                    <dd><?= Lw_input_range("color_page_bg_pc_opacity", "0", "100", "100") ?></dd>
                    <dt class="left">ページ全体の背景色 スマホ</dt>
                    <dd><?= Lw_input_color("color_page_bg_sp") ?></dd>
                    <dt class="left">コンテンツ背景色 PC</dt>
                    <dd><?= Lw_input_color("color_content_bg_pc") ?></dd>
                    <dt class="left">コンテンツ背景色 スマホ</dt>
                    <dd><?= Lw_input_color("color_content_bg_sp") ?></dd>
                    <dt class="left">コンテンツの影</dt>
                    <dd><?= Lw_input_select("page_content_shadow", ctm_switch_array_2()) ?></dd>
                    <dt>ページ全体の背景画像 or 動画</dt>
                    <dd>
                        <?= Lw_input_media("lw_page_bg_img", "lw_page_bg_img") ?>
                    </dd>
                </dl>
            </details>
        </div>
        <div class="Lw_edit_style reset">
            <details>
                <summary>その他</summary>
                <dl>
                    <?php if(LW_EXPANSION_BASE):?>
                        <dt class="left">アニメーション ON / OFF</dt>
                        <dd><?= Lw_input_select("lw_page_animation_switch", ctm_switch_array()) ?></dd>
                    <?php endif; ?>
                    <dt class="left">ローディングアニメーション</dt>
                    <dd>
                        <?php
                        if(defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true){
                            echo Lw_input_select("loading_anime_page_switch", [
                                "" => "カスタマイザー設定を使用",
                                "off" => "このページで無効にする"
                            ]);
                        }else{
                            echo '<p class="premium_message"><a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">LiteWordプレミアム限定機能</a></p>';
                        }
                        ?>
                    </dd>
                    <dt class="left">このページへのコメント</dt>
                    <dd><?= Lw_input_textarea("page_comment","","","6") ?></dd>
                </dl>
            </details>
        </div>
  
        
    </div>
    <br><br><br>

    <!-- トップページ（フロントページ）設定 -->
    <button type="button" id="set-as-homepage-btn" style="background-color: #0073aa; color: #fff; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer;">
        このページをトップページに設定する
    </button>
    <?php $ajax_url = admin_url('admin-ajax.php');?>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const set_as_homepage_btn = document.getElementById('set-as-homepage-btn');
            if (set_as_homepage_btn) {
                set_as_homepage_btn.addEventListener('click', function () {
                    if (confirm('このページをトップページに設定しますか？')) {
                        fetch('<?php echo $ajax_url; ?>', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: 'action=set_homepage&page_id=<?php echo get_the_ID(); ?>'
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('トップページに設定しました');
                                location.reload();
                            } else {
                                alert('エラーが発生しました: ');
                            }
                        })
                        .catch(error => {
                            alert('通信中にエラーが発生しました');
                        });
                    }
                });
            }
        });
    </script>

    <?php
}

/**------------------------
 * 保存エリア
--------------------------*/
function Lw_save_page_setting_meta_fields( $post_id ) {

    /* ---------- いつもの基本チェック ---------- */
    if ( ! isset( $_POST['meta_nonce'] ) || ! wp_verify_nonce( $_POST['meta_nonce'], 'meta_nonce' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_page', $post_id ) ) {
        return;
    }

    /* ---------- メタキー一覧 ---------- */
    $input = [
        'header_select',
        'header_menu_select',
        'logo_header_page_switch',
        'logo_header_page_text',
        'logo_text_font_family',
        'logo_text_font_weight',
        'logo_header_page_img',
        'logo_header_page_size_pc',
        'logo_header_page_size_tb',
        'logo_header_page_size_sp',
        'logo_header_page_url',
        'header_page_cta_color_bg',
        'page_pickup_menu_page_switch',
        'drawer_page_switch',
        'drawer_menu_select',
        'footer_select',
        'footer_menu_select',
        'logo_footer_page_switch',
        'logo_footer_page_text',
        'logo_footer_text_font_family',
        'logo_footer_text_font_weight',
        'logo_footer_page_img',
        'logo_footer_page_size_pc',
        'logo_footer_page_size_tb',
        'logo_footer_page_size_sp',
        'logo_footer_page_url',
        'follow_bottom_cta_ptn',
        'color_main',
        'color_sub',
        'color_accent',
        'color_text',
        'color_return_btn',
        'color_1',
        'color_2',
        'color_3',
        'color_page_bg_pc',
        'color_page_bg_pc_opacity',
        'color_page_bg_sp',
        'color_content_bg_pc',
        'color_content_bg_sp',
        'page_content_shadow',
        'lw_page_bg_img',
        'font_body',
        'font_body_weight',
        'font_size_pc',
        'font_size_tb',
        'font_size_sp',
        'max_width_clm_1',
        'lw_page_animation_switch',
        'loading_anime_page_switch',
        'page_comment',
    ];

    /* ---------- HTML を許可したいメタキー ---------- */
    $html_fields = [ 'logo_header_page_text', 'logo_footer_page_text' ];

    /* ---------- 許可タグ（必要に応じて追加してください） ---------- */
    $allowed_tags = [
        'a'    => [ 'href' => [], 'title' => [], 'target' => [] ],
        'span' => [
            'class'            => [],
            'style'            => [],
            'data-lw_font_set' => [],   // ←★ これを追加
        ],
        'mark' => [ 'style' => [] ],
        'br'   => [],
        'b'    => [], 'strong' => [],
        'i'    => [], 'em'     => [],
        'u'    => [],
        'small'=> [],
        'sup'  => [], 'sub'    => [],
    ];

    /* ---------- 保存ループ ---------- */
    foreach ( $input as $field ) {

        if ( isset( $_POST[ $field ] ) ) {

            // HTML 可のフィールドだけ wp_kses() で許可タグを残す
            if ( in_array( $field, $html_fields, true ) ) {
                $value = wp_kses( wp_unslash( $_POST[ $field ] ), $allowed_tags );

            // それ以外は従来通りテキストとして保存
            } else {
                $value = sanitize_text_field( $_POST[ $field ] );
            }

            if ( $value !== '' && $value !== null ) {
                update_post_meta( $post_id, $field, $value );
            } else {
                delete_post_meta( $post_id, $field );
            }

        } else {
            delete_post_meta( $post_id, $field );
        }
    }
}
add_action( 'save_post', 'Lw_save_page_setting_meta_fields' );

