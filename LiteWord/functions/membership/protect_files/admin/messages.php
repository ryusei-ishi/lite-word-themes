<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 管理画面に出す文章
 * =============================================================== */

/**
 * 使えない・書けなかった理由
 *
 * @param string $code
 * @return string
 */
function lw_member_files_error_text( $code ) {
	$texts = [
		'multisite'              => 'マルチサイトでは使えません。',
		'uploads_error'          => 'メディアの置き場所（wp-content/uploads）を確かめられませんでした。',
		'uploads_other_host'     => 'メディアのファイルが別のドメイン（CDN・外部のストレージなど）から配られているため、守れません。',
		'uploads_outside_home'   => 'メディアの置き場所がサイトのフォルダの外にあるため、守れません。',
		'unusual_path'           => 'サイトやメディアのフォルダの名前・場所が標準と違うため、ルールを書けません。',
		'htaccess_not_writable'  => '.htaccess に書き込めませんでした（ファイルの権限）。この画面の「手で書くときのルール」を、.htaccess の「# BEGIN WordPress」より上に書き足すと使えます。',
		'htaccess_remove_failed' => '.htaccess からルールを消せませんでした。「# BEGIN LiteWord Member Files」から「# END LiteWord Member Files」までを手で消してください（目印は消したので、残っていてもファイルの表示には影響しません）。',
	];
	return isset( $texts[ $code ] ) ? $texts[ $code ] : $code;
}

/**
 * 点検の結果
 *
 * @param string $result
 * @return array{0:string,1:string} [ notice の種類, 文章 ]
 */
function lw_member_files_check_text( $result ) {
	$texts = [
		'ok'             => [ 'success', '守れています（ログインしていない状態で、点検用のファイルが開けないことを確かめました）。' ],
		'leak'           => [ 'error', '守れていません。ログインしていない人でもファイルを開けます。このサーバーでは .htaccess のルールが使われていないか、別の仕組みがファイルを先に返しています。' ],
		'broken'         => [ 'error', 'ファイルは開けませんでしたが、LiteWord の窓口が返事をしていません。会員にもファイルが表示されない可能性があります。' ],
		'members_broken' => [ 'error', '見る権限のある人（点検した管理者）にも、ファイルが表示されていません。' ],
		'public_broken'  => [ 'error', '守る必要のないファイルまで WordPress を通っています。公開ページの画像が遅くなったり、表示されなくなったりしている可能性があります。' ],
		'offloaded'      => [ 'error', 'メディアの URL が、このサイトの uploads ではない場所（CDN・外部のストレージなど）になっています。ファイルがそちらから配られていると守れません。' ],
		'unknown'        => [ 'warning', '点検できませんでした（サーバーが自分自身へのアクセスを止めている、サイトにパスワードをかけている など）。下の手順で、自分の目で確かめてください。' ],
		'cannot_write'   => [ 'warning', '点検用のファイルを置けませんでした（メディアの置き場所の権限）。下の手順で、自分の目で確かめてください。' ],
		'unsupported'    => [ 'error', 'このサイトの構成では使えません。' ],
	];
	return isset( $texts[ $result ] ) ? $texts[ $result ] : [ 'warning', (string) $result ];
}

/**
 * 公開の場所の名前とリンク
 *
 * @param string $label 'post:12' 'menu:34' 'thumbnail:12' 'theme_mod' 'site_icon' 'widget'
 * @return array{0:string,1:string} [ 名前, URL ]
 */
function lw_member_files_place_text( $label ) {
	if ( preg_match( '~^(post|thumbnail|ogp):(\d+)$~', $label, $hit ) ) {
		$title = get_the_title( (int) $hit[2] );
		$title = $title !== '' ? $title : '（タイトルなし）';
		$names = [
			'post'      => '公開中の「' . $title . '」',
			'thumbnail' => '「' . $title . '」のアイキャッチ画像（一覧に出ます）',
			'ogp'       => '「' . $title . '」の OGP 画像（SNS のカードに出ます）',
		];
		return [ $names[ $hit[1] ], (string) get_edit_post_link( (int) $hit[2], 'raw' ) ];
	}
	if ( strpos( $label, 'menu:' ) === 0 ) {
		return [ 'メニュー', admin_url( 'nav-menus.php' ) ];
	}
	$places = [
		'theme_mod'   => [ 'テーマの設定（ロゴ・カスタマイザーの画像など）', admin_url( 'customize.php' ) ],
		'seo_setting' => [ 'OGP の既定画像・トップページの OGP 画像', '' ],
		'category'    => [ 'カテゴリーの画像', admin_url( 'edit-tags.php?taxonomy=category' ) ],
		'site_icon'   => [ 'サイトアイコン', admin_url( 'options-general.php' ) ],
		'widget'      => [ 'ウィジェット', admin_url( 'widgets.php' ) ],
	];
	return isset( $places[ $label ] ) ? $places[ $label ] : [ $label, '' ];
}

/**
 * 機能しないサーバー・場合（画面と仕様書で同じことを書く）
 *
 * @return string[]
 */
function lw_member_files_limitations() {
	return [
		'.htaccess が使えないサーバー（nginx だけで動くサーバー、.htaccess の書き換えルールを止めているサーバーなど）。',
		'サーバーの高速化機能や CDN（Cloudflare など）が、以前に配ったファイルの写しを返す場合。ON にしたら、CDN のキャッシュを削除してください。CDN で「すべてキャッシュする」ような設定にしていると、会員に渡したファイルまで保存されて誰でも開けるようになります。',
		'ON にする前にダウンロード・保存されたファイルは取り戻せません（URL は変わらないので、ON にした後は、その URL では開けなくなります）。',
		'画像を WebP などに変換して別のファイルとして配るプラグインを使っている場合、変換後のファイルは守られないことがあります。',
		'メディアを CDN や外部のストレージから配るプラグイン（WP Offload Media など）を使っている場合は守れません。',
		'他のプラグインが uploads や wp-content の中に .htaccess の書き換えルールを置いている場合、このルールが使われないことがあります。',
		'別のテーマに切り替えるときは、先にこの設定を OFF にしてください。外観 > テーマ から切り替えれば自動で片付きますが、カスタマイザーのライブプレビューから切り替えたり、テーマのフォルダを消したりすると、守っていたファイルが誰にも開けなくなります。',
		'公開の場所でも使っているファイル・アイキャッチ画像は守りません（守ると公開ページで表示されなくなるため）。他のプラグインの設定やテーマのファイルに直接書いた画像は、公開の場所として判定できません。',
	];
}
