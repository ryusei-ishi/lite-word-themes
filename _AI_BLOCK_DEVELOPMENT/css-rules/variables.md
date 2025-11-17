# LiteWord CSS変数リファレンス

このドキュメントは、LiteWordテーマで利用可能な`:root`レベルのCSS変数を一覧化しています。
ブロック開発時にこれらの変数を利用することで、サイト全体の統一感を保つことができます。

> **注意**: ブロック固有のCSS変数は、必ずインラインスタイル（`style` prop）で定義し、サイト全体を汚染しないようにしてください。

---

## 1. レイアウト関連

### コンテンツ幅
```css
--max-width-clm-1: 1120px  /* デフォルト */
```
- カスタマイザーまたはページ個別設定で変更可能
- コンテンツの最大幅を制御

---

## 2. カラー関連

### 基本カラー（固定）
```css
--color-black: #060606
--color-blue: #4a90e2
--color-red: #d34a4a
--color-yellow: #f9d648
```

### サイトカラー（カスタマイズ可能）
```css
--color-main: #1a72ad         /* メインカラー（デフォルト） */
--color-sub: #0e1013          /* サブカラー（デフォルト） */
--color-accent: #d34a4a       /* アクセントカラー（デフォルト） */
```
- カスタマイザーで変更可能
- ページ個別設定でも上書き可能（`color_main`メタフィールド）

### 追加カラー（1-3）
```css
--color-1: var(--color-main)  /* デフォルトはメインカラー */
--color-2: var(--color-main)
--color-3: var(--color-main)
```
- 用途に応じて個別に設定可能

### 背景カラー
```css
--color-background-all: #f4f4f4          /* サイト全体の背景色 */
--color-page-bg-pc: #ffffff              /* ページ背景（PC） */
--color-page-bg-sp: #ffffff              /* ページ背景（SP） */
--color-content-bg-pc: #ffffff           /* コンテンツ背景（PC） */
--color-content-bg-sp: var(--color-content-bg-pc)  /* コンテンツ背景（SP、PCにフォールバック） */
```

### テキストカラー
```css
--color-text: #060606         /* 基本の文字色 */
--color-link: #1b1bff         /* リンクの色 */
```

---

## 3. フォント関連

### フォントファミリー
```css
--font-family-gothic: "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", "ＭＳ ゴシック", "MS Gothic", sans-serif

--font-family-gothic_Arial: "Arial", "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", "ＭＳ ゴシック", "MS Gothic", sans-serif

--font-family-mincho: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "游明朝", "ＭＳ 明朝", "MS Mincho", serif
```

### フォントサイズ（投稿・ページ）
```css
--font-size-post-df_pc: 17px  /* デフォルト PC */
--font-size-post-df_tb: 16px  /* デフォルト Tablet */
--font-size-post-df_sp: 16px  /* デフォルト Smartphone */
```
- ページ/投稿個別で設定可能（`font_size_pc`メタフィールド）

---

## 4. レスポンシブブレークポイント

LiteWordテーマで使用される標準的なブレークポイント:

### Media Queries
```css
@media (max-width: 900px) { /* Tablet */ }
@media (max-width: 600px) { /* Smartphone */ }
```

### Container Queries（併用推奨）
```css
@container (max-width: 800px) { /* Tablet */ }
@container (max-width: 500px) { /* Smartphone */ }
```

> **重要**: Media QueriesとContainer Queriesを**必ず併用**してください。
> これにより、親要素のサイズに応じた柔軟なレスポンシブデザインが実現できます。

---

## 5. ブロック開発での使い方

### 既存のCSS変数を利用する場合

```jsx
// index.js (JSX)
const blockProps = useBlockProps();

return (
  <div {...blockProps} style={{
    color: 'var(--color-main)',
    backgroundColor: 'var(--color-page-bg-pc)',
    fontFamily: 'var(--font-family-gothic)',
  }}>
    {/* コンテンツ */}
  </div>
);
```

```css
/* style.css */
.wp-block-wdl-my-custom-block {
  color: var(--color-text);
  background-color: var(--color-page-bg-pc);
  font-family: var(--font-family-gothic);
}

@media (max-width: 600px) {
  .wp-block-wdl-my-custom-block {
    background-color: var(--color-page-bg-sp);
  }
}
```

### ブロック固有のCSS変数を定義する場合（推奨）

**必ずインラインスタイルで定義してください！**

```jsx
// index.js (JSX)
const customStyles = {
  '--my-block-color-pc': colorPc,
  '--my-block-color-tb': colorTb || colorPc,
  '--my-block-color-sp': colorSp || colorTb || colorPc,
  '--my-block-spacing': '20px',
};

return (
  <div {...blockProps} style={customStyles}>
    <div className="my-block-inner">
      {/* この子要素でvar(--my-block-color-pc)が使える */}
    </div>
  </div>
);
```

```css
/* style.css */
.wp-block-wdl-my-custom-block .my-block-inner {
  color: var(--my-block-color-pc);
  padding: var(--my-block-spacing);
}

@media (max-width: 900px) {
  .wp-block-wdl-my-custom-block .my-block-inner {
    color: var(--my-block-color-tb);
  }
}

@media (max-width: 600px) {
  .wp-block-wdl-my-custom-block .my-block-inner {
    color: var(--my-block-color-sp);
  }
}
```

---

## 6. ❌ やってはいけないこと

### 1. サイト全体のCSS変数を上書き
```css
/* ❌ ダメな例 */
:root {
  --color-main: #ff0000; /* サイト全体のメインカラーを上書きしてしまう */
}
```

### 2. ブロック固有のCSS変数を:rootに定義
```css
/* ❌ ダメな例 */
:root {
  --my-block-color: #ff0000; /* サイト全体を汚染してしまう */
}
```

### 3. インラインスタイルを使わずにCSS変数を定義
```css
/* ❌ ダメな例 */
.wp-block-wdl-my-custom-block {
  --my-block-color: #ff0000; /* CSSファイルで定義するのは非推奨 */
}
```
> CSS変数の値がJSXのattributesに依存する場合、必ずインラインスタイルで定義してください。

---

## 7. CSS変数の命名規則（ブロック固有）

### 推奨パターン
```
--lw-[block-name]-[property]-[device]
```

### 例
```css
--lw-pr-button-1-bg-color-pc       /* lw-pr-button-1の背景色（PC） */
--lw-pr-button-1-bg-color-tb       /* lw-pr-button-1の背景色（Tablet） */
--lw-pr-button-1-bg-color-sp       /* lw-pr-button-1の背景色（Smartphone） */
--lw-bg-1-opacity-pc               /* lw-bg-1の透明度（PC） */
```

### デバイス接尾辞
- `-pc` : PC用（900px以上）
- `-tb` : Tablet用（600-900px）
- `-sp` : Smartphone用（600px未満）

---

## 8. 参考: 既存ブロックでの使用例

### lw-bg-1 でのCSS変数定義パターン
```jsx
const filterStyle = {
  '--lw-bg-color-filter-pc': getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
  '--lw-bg-opacity-pc': opacityPc,
  '--lw-bg-color-filter-tb': getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
  '--lw-bg-opacity-tb': opacityTb || opacityPc,
  '--lw-bg-color-filter-sp': getFilterStyle(filterTypeSp, filterColorSp, filterGradientSp) || getFilterStyle(filterTypeTb, filterColorTb, filterGradientTb) || getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
  '--lw-bg-opacity-sp': opacitySp || opacityTb || opacityPc,
};

const backgroundStyle = {
  '--lw-bg-image-pc': bgImagePc ? `url(${bgImagePc})` : 'none',
  '--lw-bg-image-tb': bgImageTb ? `url(${bgImageTb})` : (bgImagePc ? `url(${bgImagePc})` : 'none'),
  '--lw-bg-image-sp': bgImageSp ? `url(${bgImageSp})` : (bgImageTb ? `url(${bgImageTb})` : (bgImagePc ? `url(${bgImagePc})` : 'none')),
};

<div style={{ ...filterStyle, ...backgroundStyle }}>
```

このパターンを参考に、各ブロックのCSS変数を定義してください。

---

**最終更新**: 2025-11-17
**出典**: `LiteWord/functions/css_js_set/index.php` (lines 33-150)
