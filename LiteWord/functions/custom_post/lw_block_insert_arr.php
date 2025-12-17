<?php
if ( !defined( 'ABSPATH' ) ) exit;
// ファイルの先頭に変数を定義
$lw_custom_blocks_url = get_template_directory_uri() . '/my-blocks/block_sample_list/';
$lw_custom_blocks_css = get_template_directory_uri() . '/my-blocks/build/';

// インスタンスを作成
$lw_block_system = new LwBlockInsertSystem();

// リンクボタンブロックを登録
$lw_block_system->register_block_type('button', [
    'button_text' => '+ リンクボタンを挿入',
    'button_id' => 'lw-custom-insert-block',
    'base_url' => get_template_directory_uri() . '/my-blocks/block_sample_list/',
    'css_url' => get_template_directory_uri() . '/my-blocks/build/',
    'blocks' => [
     [
        "name" => "lw-button-1",
        "premium" => false,
        "file" => $lw_custom_blocks_url . 'lw-button-1.php',
        'css' => $lw_custom_blocks_css . 'lw-button-1/style.css',
    ],
     [
        "name" => "lw-button-2",
        "premium" => false,
        "file" => $lw_custom_blocks_url . 'lw-button-2.php',
    ],
     [
        "name" => "lw-button-3",
        "premium" => false,
        "file" => $lw_custom_blocks_url . 'lw-button-3.php',
         'class' => '',
    ],
     [
        "name" => "paid-block-lw-button-4",
        "premium" => true,  // ★premiumをtrueに変更（名前から判断）
        "file" => $lw_custom_blocks_url . 'lw-button-4.php',
        'css' => $lw_custom_blocks_css . 'paid-block-lw-button-4/style.css',
         'class' => '',
    ],
    [
        "name" => "paid-block-lw-button-5",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-button-5.php',
        'css' => $lw_custom_blocks_css . 'paid-block-lw-button-5/style.css',
        'class' => 'clm_2', 
    ],
    [
        "name" => "paid-block-lw-button-5",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-button-5-2.php',
        'css' => $lw_custom_blocks_css . 'paid-block-lw-button-5/style.css',
        'class' => 'clm_2', 
    ],
    [
        "name" => "lw-pr-button-1",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-1.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-1/style.css',
    ],
    [
        "name" => "lw-pr-button-1",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-1-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-1/style.css',
    ],
    [
        "name" => "lw-pr-button-2",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-2/style.css',
    ],
    [
        "name" => "lw-pr-button-2",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-2-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-2/style.css',
    ],
    [
        "name" => "lw-pr-button-3",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-3.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-3/style.css',
        'class' => 'zoom_09 h_auto',
    ],
    [
        "name" => "lw-pr-button-3",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-3-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-3/style.css',
        'class' => 'zoom_09 h_auto',
    ],
    [
        "name" => "lw-pr-button-4",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-4.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-4/style.css',
        'class' => 'zoom_09 h_auto',
    ],
     [
        "name" => "lw-pr-button-4",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-4-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-4/style.css',
        'class' => 'zoom_09 h_auto',
    ],
    [
        "name" => "lw-pr-button-5",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-5.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-5/style.css',
    ],
    [
        "name" => "lw-pr-button-5",
        "premium" => true,
        "file" => $lw_custom_blocks_url . 'lw-pr-button-5-2.php',
        'css' => $lw_custom_blocks_css . 'lw-pr-button-5/style.css',
    ],
        // 他のボタンも同様に...
    ]
]);

// 見出しブロックを登録
$lw_block_system->register_block_type('heading', [
    'button_text' => '+ 見出しを挿入',
    'button_id' => 'lw-heading-insert-block',
    'base_url' => get_template_directory_uri() . '/my-blocks/block_sample_list/',
    'css_url' => get_template_directory_uri() . '/my-blocks/build/',
    'blocks' => [
        [
            "name" => "custom-title-1",
            "premium" => false,
            "file" => "custom-title-1.php",
            'css' => "custom-title-1/style.css",
        ],
        [
            "name" => "custom-title-4",
            "premium" => false,
            "file" => "custom-title-4.php",
            'css' => "custom-title-4/style.css",
        ],
        [
            "name" => "custom-title-5",
            "premium" => false,
            "file" => "custom-title-5.php",
            'css' => "custom-title-5/style.css",
        ],
        [
            "name" => "custom-title-6",
            "premium" => false,
            "file" => "custom-title-6.php",
            'css' => "custom-title-6/style.css",
        ],
        [
            "name" => "custom-title-3",
            "premium" => false,
            "file" => "custom-title-3.php",
            'css' => "custom-title-3/style.css",
        ],
        [
            "name" => "custom-title-2",
            "premium" => false,
            "file" => "custom-title-2.php",
            'css' => "custom-title-2/style.css",
        ],
        [
            "name" => "paid-block-custom-title-7",
            "premium" => true,
            "file" => "custom-title-7.php",
            'css' => "paid-block-custom-title-7/style.css",
        ],
        [
            "name" => "paid-block-custom-title-8",
            "premium" => true,
            "file" => "custom-title-8.php",
            'css' => "paid-block-custom-title-8/style.css",
        ],
        [
            "name" => "paid-block-custom-title-9",
            "premium" => true,
            "file" => "custom-title-9.php",
            'css' => "paid-block-custom-title-9/style.css",
        ],
        [
            "name" => "paid-block-custom-title-10",
            "premium" => true,
            "file" => "custom-title-10.php",
            'css' => "paid-block-custom-title-10/style.css",
        ],
        [
            "name" => "paid-block-custom-title-11",
            "premium" => true,
            "file" => "custom-title-11.php",
            'css' => "lw-pr-custom-title-11/style.css",
        ],
        [
            "name" => "paid-block-custom-title-11-2",
            "premium" => true,
            "file" => "custom-title-11-2.php",
            'css' => "lw-pr-custom-title-11/style.css",
        ],
        [
            "name" => "paid-block-custom-title-12",
            "premium" => true,
            "file" => "custom-title-12.php",
            'css' => "lw-pr-custom-title-12/style.css",
        ],
         [
            "name" => "paid-block-custom-title-12-2",
            "premium" => true,
            "file" => "custom-title-12-2.php",
            'css' => "lw-pr-custom-title-12/style.css",
        ],
        [
            "name" => "paid-block-custom-title-13",
            "premium" => true,
            "file" => "custom-title-13.php",
            'css' => "lw-pr-custom-title-13/style.css",
        ],
        [
            "name" => "paid-block-custom-title-13-2",
            "premium" => true,
            "file" => "custom-title-13-2.php",
            'css' => "lw-pr-custom-title-13/style.css",
        ],
        [
            "name" => "paid-block-custom-title-14",
            "premium" => true,
            "file" => "custom-title-14.php",
            'css' => "lw-pr-custom-title-14/style.css",
        ],
        [
            "name" => "paid-block-custom-title-14-2",
            "premium" => true,
            "file" => "custom-title-14-2.php",
            'css' => "lw-pr-custom-title-14/style.css",
        ],
        

    ]
]);
// セットパターンブロックを登録
// $lw_block_system->register_block_type('set-pattern', [
//     'button_text' => '+ セットパターンを挿入',
//     'button_id' => 'lw-set-pattern-insert-block',
//     'base_url' => get_template_directory_uri() . '/my-blocks/set_ptn/',
//     'css_url' => get_template_directory_uri() . '/my-blocks/build/',
//     'blocks' => [
//         [
//             "name" => "qa-set-1",
//             "premium" => false,
//             "file" => "qa/1.php",
//             'css' => [
//                 "custom-title-4/style.css",  // タイトルのCSS
//                 "lw-qa-1/style.css",         // QAのCSS
//             ],
//             'class' => 'as_1_06 max_h_50', 
//             'size' => 'half',
//         ],
//         [
//             "name" => "content-set-1",
//             "premium" => false,
//             "file" => "content/1.php",
//             "image" => 'content/1.webp',
//             'class' => 'max_h_50 h_auto', 
//         ],
//         [
//             "name" => "fv-set-1",
//             "premium" => true,
//             "file" => "fv/1.php",
//             "image" => 'fv/1.webp',
//             'class' => 'max_h_50 h_auto', 
//         ],
//         [
//             "name" => "post_list-set-1",
//             "premium" => false,
//             "file" => "post_list/1.php",
//             "image" => 'post_list/1.webp',
//             'class' => 'max_h_50 h_auto', 
//         ],
//         [
//             "name" => "content-set-2",
//             "premium" => true,
//             "file" => "content/2.php",
//             "image" => 'content/2.webp',
//             'class' => 'max_h_50 h_auto', 
//         ],
//         [
//             "name" => "content-set-3",
//             "premium" => true,
//             "file" => "content/3.php",
//             "image" => 'content/3.webp',
//             'class' => 'max_h_50 h_auto', 
//         ],
//         [
//             "name" => "content-set-4",
//             "premium" => true,
//             "file" => "content/4.php",
//             "image" => 'content/4.webp',
//             'class' => 'max_h_50 h_auto',
//         ],
//         [
//             "name" => "voice-set-1",
//             "premium" => true,
//             "file" => "voice/1.php",
//             "image" => 'voice/1.webp',
//             'class' => 'max_h_50 h_auto',
//         ],
//     ]
// ]);
// HTMLコメント：さらに別のブロックタイプを追加する場合
// $lw_block_system->register_block_type('table', [
//     'button_text' => '+ テーブルを挿入',
//     'button_id' => 'lw-table-insert-block',
//     'base_url' => get_template_directory_uri() . '/my-blocks/table_list/',
//     'css_url' => get_template_directory_uri() . '/my-blocks/build/table/',
//     'blocks' => [ /* テーブルブロック配列 */ ]
// ]);

// システムをレンダリング
$lw_block_system->render();
