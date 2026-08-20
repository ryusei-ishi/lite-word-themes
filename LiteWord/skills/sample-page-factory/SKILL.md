---
name: sample-page-factory
description: LiteWord のページを AI（MCP / REST API / Claude in Chrome）から作る手順。業種別サンプルページの量産と、公開前の検品まで。
---

# LiteWord ページ量産スキル

既存の完成ページを**雛形**にして、テキストと画像だけ差し替えた新しいページを作る手順。
業種別サンプルページの量産を想定しているが、実案件のページ制作にもそのまま使える。

🚨 **このスキルの要点は「作り方」ではなく「壊れ方」。**
LiteWord のページはブロックの JSON 属性を含むため、素直に API へ投げると**黙って壊れる**。
下の「5つの罠」を読まずに書き込まないこと。

---

## 0. 全体像（5工程）

| 工程 | 手段 |
|---|---|
| 1. 画像を用意する | Gemini API で生成、または手持ちの写真 |
| 2. 画像を WordPress に入れる | **Claude in Chrome（管理画面のメディアライブラリ）** |
| 3. markup を組み立てる | 既存ページを雛形にテキスト・画像URLを置換 |
| 4. ページを作る／保存する | REST（作成・メタ）＋ **ブラウザ（本文）** |
| 5. アイキャッチ画像を設定する | ヘッドレス Chrome でページを撮影 → **ブラウザ（アップロード・紐付け）** |

---

## 1. 画像を用意する

Gemini の画像モデル（`gemini-3.1-flash-image` など）で生成できる。

```
POST https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent?key=<KEY>
body: {"contents":[{"parts":[{"text":"<プロンプト>"}]}]}
→ candidates[0].content.parts[].inlineData.data （base64）／ .mimeType
```

**プロンプトの型**（1枚 600〜800KB 程度になる）

```
<被写体と構図>. Photorealistic interior photography, soft natural daylight,
<配色>, minimal Japanese aesthetic, shallow depth of field.
Absolutely no people, no faces, no hands, no text, no letters, no logos, no watermarks.
```

- 🚨 **人物を出さない。** 実在の人に似る危険と、AIが描く文字が崩れる問題を同時に避けられる
- 🚨 **文字を出さない。** 生成画像内の文字はほぼ破綻する
- ページ全体で**配色を1つに揃える**と、別々に生成しても統一感が出る

## 2. 画像を WordPress に入れる

🚨 **REST の `files/write` では画像を送れない。** `file_put_contents($content)` を呼ぶだけで
base64 を解さず、JSON はバイナリを運べないため。

**Claude in Chrome を使う**（管理画面にログイン済みであること）:

1. `/wp-admin/media-new.php` を開く
2. `find` ツールで file input の ref を取る
3. `file_upload { paths:[絶対パス], ref, tabId }`
   - ⚠️ **file input をクリックしない。** OSのファイル選択ダイアログが開いて操作不能になる
   - ⚠️ 1回の合計は **10MB 未満**。超えるなら分割する
4. URL は `wp_posts` の `post_type='attachment'` の `guid` から取る

## 3. markup を組み立てる

🚨 **ゼロから書かない。** LiteWord のブロックは
`<!-- wp:wdl/xxx {JSON属性} -->` ＋ 描画済みHTML の対で保存されている。
片方だけ書き換えるとエディタで「ブロックが壊れています」になる。

**既存ページの markup を丸ごと取り、文字列置換で差し替える。**
同じ文言が JSON 属性側と HTML 側の両方にあるので、単純な全置換で両方いっぺんに直る。

置換の順番の鉄則:

- **長い文から先に置換する。** 短い語を先に当てると長い文が壊れる
- **部分一致に注意。** 例:「ラックスできる」を置換すると既に正しい「リラックスできる」が
  「リリラックス」になる。`(?<!リ)ラックスできる` のように前後を見る
- 置換後に**残骸検査**を必ず入れる（元の固有名詞・元の画像ファイル名・プレースホルダが残っていないか）

## 4. ページを作る／保存する

### 新規作成（REST）

```
POST /wp-json/lwrm/v1/wp/post
{ "title":"...", "slug":"...", "type":"page", "status":"draft", "parent":<親ID> }
```

🚨 **既定は `status=publish` / `type=post`。必ず両方を明示する。**

### 本文の保存 — ここが最重要

🚨 **本文だけは管理者としてブラウザから保存する。**

```
① REST の files/write で markup を wp-content/uploads/tmp-xxx.txt に置く（テキストなので安全）
② 管理画面を開いたブラウザで実行:
     const c = await (await fetch('/wp-content/uploads/tmp-xxx.txt?v='+Date.now())).text();
     await wp.apiFetch({path:'/wp/v2/pages/<ID>', method:'POST', data:{content:c}});
③ files/delete で一時ファイルを消す
④ DB の post_content と手元のファイルが完全一致するか検証する
```

---

## 5. アイキャッチ画像を設定する（いちばん忘れやすい）

**本文が完成しただけでは終わっていない。** サンプルページ一覧のカードは
REST の `_embed` で `wp:featuredmedia` を読んでいるので、アイキャッチが無いと
テーマの `assets/image/no_image/2.webp` にフォールバックし、**「No Image」のカードが1枚だけ並ぶ。**

アイキャッチの中身は「**完成したページ自身のスクリーンショット**」。ヘッドレス Chrome で撮れる。

```
chrome.exe --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1   --user-data-dir=<一時ディレクトリ> --window-size=1400,1212 --virtual-time-budget=12000   --screenshot=<絶対パス.png> "<公開URL>"
```

- 🚨 **`--screenshot` は絶対パスで渡す。** 相対パスだと「アクセスが拒否されました」で落ちる
- 🚨 **PC幅で撮る。** 1081px 未満だとタブレット表示になり、既存カードと見た目が揃わない
- 既存カードは **1000x866（横÷縦 = 1.1547）**。この比で撮ってから縮小する
  （`ffmpeg -i shot.png -vf "scale=1000:866:flags=lanczos" -c:v libwebp -quality 92 out.webp` で 90KB 前後）
- ファイル名は連番の続き（`sample_page_top_18.webp`）にすると一覧の並びと対応が取れる

**アップロードと紐付け**（画像は REST では送れない → 罠にある通りブラウザから）:

1. Claude in Chrome で `/wp-admin/media-new.php` を開き `file_upload` する
2. 管理者のブラウザから紐付ける
   ```js
   await wp.apiFetch({ path: '/wp/v2/media/<添付ID>', method: 'POST', data: { alt_text: '…' } });
   await wp.apiFetch({ path: '/wp/v2/pages/<ページID>', method: 'POST', data: { featured_media: <添付ID> } });
   ```
3. ⚠️ **この保存でも本文は保存フィルタを通る（罠3）。**
   実行の前後で `post_content` の**文字数と sha256 を比べ、一致することを確かめる。**
4. 確認は `GET /wp-json/wp/v2/pages/<ID>?_embed` で
   `_embedded['wp:featuredmedia'][0].source_url` が返ることを見る（一覧ページはこれを読んでいる）

---

## 🚨 5つの罠

### 罠1: バックスラッシュが1段剥がれる

ブロックの JSON 属性は `<span` のようにバックスラッシュを含む。
`wp_insert_post` / `wp_update_post` は**スラッシュ済みデータを期待**し内部で `wp_unslash()` を掛けるため、
そのまま送ると `u003cspan` になって属性が壊れる。

→ REST で本文を送るなら**事前にバックスラッシュを2倍**にする（`wp_slash` 相当）。

### 罠2: KSES が `<picture>` `<source>` `<svg>` `<iframe>` を削る（最重要）

REST を独自キーで叩くとログインユーザーが居ないので `unfiltered_html` が無く、KSES が走る。
実測で 19,629文字 → 18,540文字 になり、**地図の iframe・アイコンの svg・レスポンシブ画像の picture が消えた。**
`picture` が消えるとブロックの保存出力と食い違い、エディタで破損表示になる。

→ **本文はブラウザから保存する**（上の④）。

### 罠3: content を送らなくても本文が再保存される

`wp/post` に `{id, parent}` だけ投げても、`wp_update_post` は既存本文を保存フィルタに通す。
**メタや親を変えるだけのつもりで本文が壊れる。**

→ **メタ・親・スラッグを先に済ませ、本文の保存を最後にする。**

### 罠4: エディタを開いたまま裏で保存すると詰まる

`wp.apiFetch` で保存するとエディタの画面状態が古いままになる。
ナビゲーションが「Leave site?」で止まるので `navigate { force:true }` で破棄してから開き直す。
⚠️ **古い画面のまま「更新」を押すと、フィルタ済みの古い本文で上書きされる。**

### 罠5: ページ単位の色メタを雛形からコピーしない

`wp_postmeta` に入っている色の値と、**実際にページに適用される値は違う**。
雛形の `color_text` をそのままコピーしたら、背景と同じ色になって**文字が全部見えなくなった実例がある。**

→ **公開ページで CSS変数の実効値を測ってから決める。** → `verify-page.js`

---

## ✅ 公開前の検品（必須）

**「作れた」で終わらせない。** 見えない文字・切れた画像・置き忘れは、目視だけでは必ず漏れる。

公開ページ（または プレビュー）で `verify-page.js` を実行し、次の4点を確認する。

| 検査 | 合格条件 |
|---|---|
| 低コントラスト | 実害のある箇所が0件（※**写真の上の白文字は誤検知**。背景画像を持つ要素は除外して読む） |
| 画像切れ | 0件 |
| プレースホルダ残り | 0件（雛形の固有名詞・元の画像ファイル名・ダミー文言） |
| CSS変数の実効値 | `--color-text` と `--color-content-bg-pc` が**十分に違う色**であること |
| アイキャッチ画像 | 設定済み（一覧ページのカードが「No Image」になっていないこと） |

そのうえで、**ページを上から下までスクロールして目で見る。** 検品スクリプトは目の代わりではなく、目の補助。

---

## 参考: この手順で作った実例

`page-sample-list/sample_page_top_18/`（エステサロン）
— 美容室サンプルを雛形に、Gemini で15枚生成して差し替え。所要は調査込みで半日程度。

同じ雛形から作れる業種の例: ネイルサロン / まつげサロン / 整体 / 鍼灸 / ヨガ・ピアノ教室 /
訪問看護 / トリミングサロン など、**「予約制で、写真で雰囲気を伝える商売」**は美容室の雛形がそのまま使える。
