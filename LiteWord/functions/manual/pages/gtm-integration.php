<!-- wp:paragraph -->
<p class="">LiteWordのお問い合わせフォームは、フォーム送信が完了したタイミングで自動的にイベントを発火します。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">このイベントをGoogleタグマネージャー（GTM）で受け取ることで、Google Analytics 4（GA4）やGoogle広告などでコンバージョン計測が可能になります。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">発火するイベント</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">フォーム送信が成功すると、以下のイベントが自動的に発火します：</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-p_02"} -->
<p class="is-style-p_02">イベント名：<strong>litewordFormSubmit</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">取得できる情報：</h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>formSetNo：フォームセット番号（どのフォームから送信されたか識別できます） </li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>postId：投稿ID（どのページから送信されたか識別できます）</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">GTMでの設定方法</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">ステップ1：トリガーの作成</h3>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>GTM管理画面にログインします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>左メニューから「トリガー」をクリックし、「新規」ボタンをクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>トリガーの設定をクリックして、以下のように設定します：<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>トリガーのタイプ：カスタムイベント</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>イベント名：litewordFormSubmit</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>このトリガーの発生場所：すべてのカスタムイベント</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>トリガー名をわかりやすく設定します（例：「LiteWord - フォーム送信完了」）</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>「保存」ボタンをクリックします</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">ステップ2-A：タグの作成（GA4の場合）</h3>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>左メニューから「タグ」をクリックし、「新規」ボタンをクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>タグの設定をクリックして、以下のように設定します：<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>タグタイプ：Google アナリティクス: GA4 イベント</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>設定タグ：お使いのGA4設定タグを選択</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>イベント名：form_submit（任意の名前でOKです）</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>トリガーの設定で、ステップ1で作成した「LiteWord - フォーム送信完了」を選択します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>タグ名をわかりやすく設定します（例：「GA4 - LiteWordフォーム送信」）</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>「保存」ボタンをクリックします</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">ステップ2-B：タグの作成（Google広告の場合）</h3>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>左メニューから「タグ」をクリックし、「新規」ボタンをクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>タグの設定をクリックして、以下のように設定します：<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>タグタイプ：Google 広告のコンバージョン トラッキング</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>コンバージョンID：Google広告で発行されたID</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>コンバージョンラベル：Google広告で発行されたラベル</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>トリガーの設定で、ステップ1で作成した「LiteWord - フォーム送信完了」を選択します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>タグ名をわかりやすく設定します（例：「Google広告 - LiteWordフォーム送信」）</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>「保存」ボタンをクリックします</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">ステップ3：変数の作成（オプション）</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">フォームセット番号や投稿IDを計測したい場合は、以下の手順で変数を作成します。</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>左メニューから「変数」をクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>「ユーザー定義変数」セクションで「新規」ボタンをクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>変数の設定をクリックして、以下のように設定します：<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>変数タイプ：データレイヤーの変数</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>データレイヤーの変数名：formSetNo（またはpostId）</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>データレイヤーのバージョン：バージョン2</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>変数名を設定します（例：「DLV - formSetNo」）</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>「保存」ボタンをクリックします</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p class="">※この変数は、GA4イベントのパラメータとして使用できます。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">ステップ4：プレビューで動作確認</h3>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>GTM管理画面右上の「プレビュー」ボタンをクリックします</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>サイトのURLを入力して接続します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>サイト上でフォームを送信して、イベントが正しく発火するか確認します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>GTMのプレビュー画面で「litewordFormSubmit」イベントが表示されていることを確認します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>問題なければ、GTM管理画面右上の「公開」ボタンをクリックして設定を反映させます</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">Contact Form 7からの移行</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">Contact Form 7を使用していた場合の比較です。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">Contact Form 7の場合</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">カスタムHTMLに以下のコードを追加する必要がありました： </p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;script> document.addEventListener('wpcf7mailsent', function(event){ dataLayer.push({'event':'cf7submit'}); }, false); &lt;/script></code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">LiteWordの場合</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">カスタムコードの追加は不要です。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">フォーム送信が成功すると自動的にイベントが発火するため、GTM側でトリガーとタグを設定するだけでOKです。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">高度な使い方</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">特定のフォームのみ計測したい場合</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">複数のフォームを使用していて、特定のフォームのみ計測したい場合は、GTMのトリガーで条件を追加します：</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>トリガー設定画面で「一部のカスタムイベント」を選択</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>条件を追加：<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>formSetNo - 等しい - 1（計測したいフォームセット番号を入力）</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">CustomEventを使った独自実装</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">より細かい制御が必要な場合は、カスタムHTMLに以下のコードを追加できます： </p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;script> document.addEventListener('litewordFormSubmit', function(event) { console.log('フォームセット番号:', event.detail.formSetNo); console.log('投稿ID:', event.detail.postId); // 独自の処理を追加 dataLayer.push({ 'event': 'custom_form_event', 'form_name': 'お問い合わせフォーム', 'form_id': event.detail.formSetNo }); }); &lt;/script></code></pre>
<!-- /wp:code -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">トラブルシューティング</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3,"className":"is-style-h_03"} -->
<h3 class="wp-block-heading is-style-h_03">イベントが発火しない場合</h3>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>GTMが正しく読み込まれているか確認<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>ページのソースコードでGTMのスニペットが存在するか確認</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>ブラウザの開発者ツール（Console）でエラーがないか確認</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>フォーム送信が成功しているか確認<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>イベントは送信成功時のみ発火します</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>メールが正しく送信されているか確認してください</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>GTMプレビューモードで確認<!-- wp:list -->
<ul style="list-style-type:undefined" class="wp-block-list"><!-- wp:list-item -->
<li>GTMのプレビューモードで「litewordFormSubmit」イベントが表示されるか確認</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>イベントの詳細情報（formSetNo、postId）が正しく取得されているか確認</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>ブラウザのConsoleで確認 フォーム送信後にConsoleで以下を実行： console.log(window.dataLayer); 「litewordFormSubmit」イベントが含まれているか確認してください</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">よくある質問</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">Q: Contact Form 7のプラグインは必要ですか？ A: いいえ、不要です。LiteWord独自のフォーム機能で動作します。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Q: 既存のGTM設定に影響はありますか？ A: ありません。新しいイベントが追加されるだけで、既存の設定には影響しません。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Q: サンクスページへのリダイレクト時も計測されますか？ A: はい、リダイレクト前にイベントが発火するため計測可能です。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">Q: 複数のフォームがある場合、どう区別しますか？ A: formSetNo変数を使用することで、どのフォームから送信されたか識別できます。</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"className":"is-style-h_02"} -->
<h2 class="wp-block-heading is-style-h_02">まとめ</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p class="">LiteWordのフォーム送信時のGTM連携機能により、以下が実現できます。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-p_02_2"} -->
<p class="is-style-p_02_2">✓ Google Analytics 4でのコンバージョン計測<br>✓ Google広告でのコンバージョン計測 <br>✓ Facebook Pixel、Yahoo!広告などのタグ発火 <br>✓ 複数フォームの個別計測 <br>✓ カスタムイベントによる柔軟な実装</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p class="">設定は簡単で、GTM側でトリガーとタグを設定するだけで完了します。カスタムコードの追加は不要です。</p>
<!-- /wp:paragraph -->