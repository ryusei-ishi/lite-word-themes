# LiteWord カスタムブロック - JSXベストプラクティス

このドキュメントは、LiteWordカスタムブロック開発における推奨パターンとベストプラクティスをまとめたものです。

---

## 1. 基本構造

### 最小構成のブロック
```jsx
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('wdl/lw-pr-example-1', {
  title: 'Example Block',
  category: 'liteword-other',
  icon: 'admin-customizer',

  attributes: {
    content: {
      type: 'string',
      default: '',
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const { content } = attributes;

    return (
      <div {...blockProps}>
        {content || 'コンテンツを入力してください'}
      </div>
    );
  },

  save: ({ attributes }) => {
    const blockProps = useBlockProps.save();
    const { content } = attributes;

    return (
      <div {...blockProps}>
        {content}
      </div>
    );
  },
});
```

---

## 2. サイドバー（InspectorControls）の推奨構造

### PC/Tablet/Smartphone分離パターン（推奨）

```jsx
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ColorPalette } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';

edit: ({ attributes, setAttributes }) => {
  const [gradients, colors] = useSettings('color.gradients', 'color.palette');
  const { valuePc, valueTb, valueSp } = attributes;

  return (
    <>
      <InspectorControls>
        <PanelBody title="設定項目1" initialOpen={true}>
          <h3>PC</h3>
          <SelectControl
            label="値を選択"
            value={valuePc}
            onChange={(newValue) => setAttributes({ valuePc: newValue })}
            options={[
              { label: 'オプション1', value: 'option1' },
              { label: 'オプション2', value: 'option2' },
            ]}
          />

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

          <h3>タブレット</h3>
          <SelectControl
            label="PCと同じ / 個別設定"
            value={valueTb}
            onChange={(newValue) => setAttributes({ valueTb: newValue })}
            options={[
              { label: 'PCと同じ', value: '' },
              { label: 'オプション1', value: 'option1' },
              { label: 'オプション2', value: 'option2' },
            ]}
          />

          <hr />

          <h3>スマホ</h3>
          <SelectControl
            label="タブレットと同じ / 個別設定"
            value={valueSp}
            onChange={(newValue) => setAttributes({ valueSp: newValue })}
            options={[
              { label: 'タブレットと同じ', value: '' },
              { label: 'オプション1', value: 'option1' },
              { label: 'オプション2', value: 'option2' },
            ]}
          />
        </PanelBody>
      </InspectorControls>

      <div {...useBlockProps()}>
        {/* コンテンツ */}
      </div>
    </>
  );
}
```

### 区切り線（`<hr />`）のスタイル
```jsx
<hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />
```
- PC/Tablet/Smartphoneの各セクションを明確に分離
- 視覚的に見やすいUI

---

## 3. カラー・グラデーション設定

### Solid / Gradient 切り替えパターン

```jsx
import { ColorPalette, GradientPicker } from '@wordpress/block-editor';
import { useSettings } from '@wordpress/block-editor';

edit: ({ attributes, setAttributes }) => {
  const [gradients, colors] = useSettings('color.gradients', 'color.palette');
  const { filterTypePc, filterColorPc, filterGradientPc } = attributes;

  return (
    <PanelBody title="背景色の設定">
      <h3>PC</h3>
      <SelectControl
        label="タイプ"
        value={filterTypePc}
        onChange={(newValue) => setAttributes({ filterTypePc: newValue })}
        options={[
          { label: '単色', value: 'solid' },
          { label: 'グラデーション', value: 'gradient' },
        ]}
      />

      {filterTypePc === 'solid' ? (
        <ColorPalette
          label="カラー"
          value={filterColorPc}
          onChange={(newColor) => setAttributes({ filterColorPc: newColor })}
          colors={colors}
        />
      ) : (
        <GradientPicker
          label="グラデーション"
          value={filterGradientPc}
          onChange={(newGradient) => setAttributes({ filterGradientPc: newGradient })}
          gradients={gradients}
        />
      )}

      <RangeControl
        label="透明度"
        value={parseFloat(opacityPc) || 1}
        onChange={(newOpacity) => setAttributes({ opacityPc: newOpacity })}
        min={0}
        max={1}
        step={0.01}
      />
    </PanelBody>
  );
}
```

### ヘルパー関数（lw-bg-1パターン）
```jsx
const getFilterStyle = (type, color, gradient) => {
  if (type === 'solid') {
    return color || '#000000';
  } else if (type === 'gradient') {
    return gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
  return 'transparent';
};
```

---

## 4. CSS変数の定義パターン

### レスポンシブ対応のCSS変数
```jsx
edit: ({ attributes, setAttributes }) => {
  const { valuePc, valueTb, valueSp, opacityPc, opacityTb, opacitySp } = attributes;

  const customStyles = {
    // 基本値
    '--my-block-value-pc': valuePc,
    '--my-block-value-tb': valueTb || valuePc,  // フォールバック
    '--my-block-value-sp': valueSp || valueTb || valuePc,  // 多段フォールバック

    // 数値系
    '--my-block-opacity-pc': opacityPc,
    '--my-block-opacity-tb': opacityTb || opacityPc,
    '--my-block-opacity-sp': opacitySp || opacityTb || opacityPc,
  };

  return (
    <div {...useBlockProps()} style={customStyles}>
      <div className="my-block-inner">
        {/* 子要素でvar(--my-block-value-pc)が使える */}
      </div>
    </div>
  );
}
```

### 複数のスタイルオブジェクトを結合
```jsx
const filterStyle = {
  '--lw-bg-color-filter-pc': getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
  '--lw-bg-opacity-pc': opacityPc,
};

const backgroundStyle = {
  '--lw-bg-image-pc': bgImagePc ? `url(${bgImagePc})` : 'none',
  '--lw-bg-position-pc': `${focalPointPc?.x * 100}% ${focalPointPc?.y * 100}%`,
};

const alignmentStyle = {
  '--lw-bg-wrap-centering-pc': contentAlignHorizontalPc,
};

return (
  <div style={{ ...filterStyle, ...backgroundStyle, ...alignmentStyle }}>
    {/* コンテンツ */}
  </div>
);
```

---

## 5. 共通関数の活用（utils.js）

### インポート
```jsx
import {
  minHeightPcClassOptionArr,
  minHeightTbClassOptionArr,
  minHeightSpClassOptionArr,
  fontOptionsArr,
  fontWeightClassOptionArr,
  ButtonBackgroundOptionsArr,
  rightButtonIconSvgArr,
  leftButtonIconSvgArr,
  serviceInfoIconSvgArr
} from '../utils';
```

### 使用例: 高さオプション
```jsx
<SelectControl
  label="高さ（PC）"
  value={minHeightPc}
  onChange={(newValue) => setAttributes({ minHeightPc: newValue })}
  options={minHeightPcClassOptionArr()}
/>
```

### 使用例: フォント
```jsx
<SelectControl
  label="フォント（PC）"
  value={fontPc}
  onChange={(newValue) => setAttributes({ fontPc: newValue })}
  options={fontOptionsArr()}
/>
```

### 使用例: グラデーション背景
```jsx
<SelectControl
  label="ボタン背景グラデーション"
  value={buttonBg}
  onChange={(newValue) => setAttributes({ buttonBg: newValue })}
  options={ButtonBackgroundOptionsArr()}
/>
```

### 使用例: SVGアイコン
```jsx
const iconArray = rightButtonIconSvgArr();
const selectedIcon = iconArray.find(item => item.value === iconType);

<div dangerouslySetInnerHTML={{ __html: selectedIcon?.svg || '' }} />
```

---

## 6. フォント設定（動的CDN読み込み）

LiteWordテーマには、フォントを動的に読み込むシステムが組み込まれています。
`data-lw_font_set` 属性を付与するだけで、Google Fonts CDNが自動的に読み込まれます。

### 基本パターン

```jsx
import { SelectControl } from '@wordpress/components';
import { fontOptionsArr, fontWeightOptionsArr } from '../utils';

attributes: {
  // PC/TB/SPでフォントを分ける場合
  fontPc: { type: 'string', default: '' },
  fontTb: { type: 'string', default: '' },
  fontSp: { type: 'string', default: '' },
  fontWeightPc: { type: 'string', default: '400' },
  fontWeightTb: { type: 'string', default: '' },
  fontWeightSp: { type: 'string', default: '' },
}

edit: ({ attributes, setAttributes }) => {
  const { fontPc, fontTb, fontSp, fontWeightPc, fontWeightTb, fontWeightSp } = attributes;

  // フォント名からfontFamilyを生成するヘルパー関数
  const getFontFamily = (fontName) => {
    if (!fontName) return 'inherit';
    if (fontName === 'mincho') return 'var(--font-family-mincho)';
    if (fontName === 'gothic') return 'var(--font-family-gothic)';
    return `'${fontName}', sans-serif`;
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title="フォント設定">
          <h3>PC</h3>
          <SelectControl
            label="フォント"
            value={fontPc}
            onChange={(newValue) => setAttributes({ fontPc: newValue })}
            options={fontOptionsArr()}
          />
          <SelectControl
            label="フォント太さ"
            value={fontWeightPc}
            onChange={(newValue) => setAttributes({ fontWeightPc: newValue })}
            options={fontWeightOptionsArr()}
          />

          <hr />

          <h3>タブレット</h3>
          <SelectControl
            label="フォント"
            value={fontTb}
            onChange={(newValue) => setAttributes({ fontTb: newValue })}
            options={[
              { label: 'PCと同じ', value: '' },
              ...fontOptionsArr().slice(1) // '未選択'を除く
            ]}
          />
          <SelectControl
            label="フォント太さ"
            value={fontWeightTb}
            onChange={(newValue) => setAttributes({ fontWeightTb: newValue })}
            options={[
              { label: 'PCと同じ', value: '' },
              ...fontWeightOptionsArr().slice(1)
            ]}
          />

          <hr />

          <h3>スマホ</h3>
          <SelectControl
            label="フォント"
            value={fontSp}
            onChange={(newValue) => setAttributes({ fontSp: newValue })}
            options={[
              { label: 'タブレットと同じ', value: '' },
              ...fontOptionsArr().slice(1)
            ]}
          />
          <SelectControl
            label="フォント太さ"
            value={fontWeightSp}
            onChange={(newValue) => setAttributes({ fontWeightSp: newValue })}
            options={[
              { label: 'タブレットと同じ', value: '' },
              ...fontWeightOptionsArr().slice(1)
            ]}
          />
        </PanelBody>
      </InspectorControls>

      <h2
        data-lw_font_set={fontPc}
        style={{
          fontFamily: getFontFamily(fontPc),
          fontWeight: fontWeightPc || '400'
        }}
      >
        タイトル
      </h2>
    </>
  );
}

save: ({ attributes }) => {
  const { fontPc, fontTb, fontSp, fontWeightPc, fontWeightTb, fontWeightSp } = attributes;

  const getFontFamily = (fontName) => {
    if (!fontName) return 'inherit';
    if (fontName === 'mincho') return 'var(--font-family-mincho)';
    if (fontName === 'gothic') return 'var(--font-family-gothic)';
    return `'${fontName}', sans-serif`;
  };

  return (
    <h2
      data-lw_font_set={fontPc}
      style={{
        fontFamily: getFontFamily(fontPc),
        fontWeight: fontWeightPc || '400'
      }}
    >
      タイトル
    </h2>
  );
}
```

### CSS変数でレスポンシブ対応する場合

フォントをCSS変数に格納してレスポンシブ対応する場合：

```jsx
edit: ({ attributes }) => {
  const { fontPc, fontTb, fontSp, fontWeightPc, fontWeightTb, fontWeightSp } = attributes;

  const getFontFamily = (fontName) => {
    if (!fontName) return 'inherit';
    if (fontName === 'mincho') return 'var(--font-family-mincho)';
    if (fontName === 'gothic') return 'var(--font-family-gothic)';
    return `'${fontName}', sans-serif`;
  };

  const fontStyles = {
    '--my-block-font-family-pc': getFontFamily(fontPc),
    '--my-block-font-family-tb': getFontFamily(fontTb || fontPc),
    '--my-block-font-family-sp': getFontFamily(fontSp || fontTb || fontPc),
    '--my-block-font-weight-pc': fontWeightPc || '400',
    '--my-block-font-weight-tb': fontWeightTb || fontWeightPc || '400',
    '--my-block-font-weight-sp': fontWeightSp || fontWeightTb || fontWeightPc || '400',
  };

  return (
    <div {...useBlockProps()} style={fontStyles}>
      <h2
        data-lw_font_set={fontPc}
        className="my-block-title"
      >
        タイトル
      </h2>
    </div>
  );
}
```

```css
/* style.css */
.my-block-title {
  font-family: var(--my-block-font-family-pc);
  font-weight: var(--my-block-font-weight-pc);
}

@media (max-width: 900px) {
  .my-block-title {
    font-family: var(--my-block-font-family-tb);
    font-weight: var(--my-block-font-weight-tb);
  }
}

@media (max-width: 600px) {
  .my-block-title {
    font-family: var(--my-block-font-family-sp);
    font-weight: var(--my-block-font-weight-sp);
  }
}
```

### 重要: data-lw_font_set の仕組み

1. **font_cdn.js** に40+種類のフォントとCDN URLがマッピング済み
2. **font_set.js**（エディタ）と **font.js**（フロント）が `data-lw_font_set` 属性を監視
3. 属性値に基づいて自動的にGoogle Fonts CDNを `<link>` タグで読み込み
4. 重複防止のため `window.LW_loadedFonts` で管理

```jsx
// この属性を付与するだけでCDNが自動読み込みされる
<h2 data-lw_font_set="Noto Sans JP">...</h2>
<h2 data-lw_font_set="Roboto">...</h2>
```

### 利用可能なフォント（fontOptionsArr）

- 未選択（デフォルト）
- mincho（明朝体）- システムフォント
- gothic（ゴシック）- システムフォント
- Noto Sans JP
- Noto Serif JP
- M PLUS Rounded 1c
- Kosugi Maru
- Sawarabi Mincho
- Sawarabi Gothic
- Murecho
- IBM Plex Sans JP
- BIZ UDPGothic
- Roboto
- sora
- Lato
- Josefin Sans

**プレミアムフォント**（font_cdn.jsに定義済み、fontOptionsArrには未登録）:
- Zen Maru Gothic, Dela Gothic One, Shippori Mincho, Zen Old Mincho など20+種類

### 注意点

1. **必ず `data-lw_font_set` 属性を付与する**
   - これがないとCDNが読み込まれず、フォントが適用されない

2. **mincho / gothic は特別扱い**
   - システムフォントなのでCDN不要
   - `var(--font-family-mincho)` または `var(--font-family-gothic)` を使用

3. **fontFamily と data-lw_font_set は両方必要**
   - `data-lw_font_set`: CDN読み込みトリガー
   - `fontFamily`: 実際のCSS適用

---

## 7. InnerBlocks（子ブロックを受け入れる）

### 基本的な使い方
```jsx
import { InnerBlocks } from '@wordpress/block-editor';

edit: () => {
  return (
    <div {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={['core/paragraph', 'core/heading', 'core/image']}
        template={[
          ['core/heading', { level: 2, placeholder: 'タイトルを入力...' }],
          ['core/paragraph', { placeholder: '本文を入力...' }],
        ]}
      />
    </div>
  );
}

save: () => {
  return (
    <div {...useBlockProps.save()}>
      <InnerBlocks.Content />
    </div>
  );
}
```

### lw-bg-1での使用例
```jsx
<InnerBlocks />  // すべてのブロックを許可
```

---

## 8. RichText（インラインテキスト編集）

### 基本パターン
```jsx
import { RichText } from '@wordpress/block-editor';

attributes: {
  title: {
    type: 'string',
    default: '',
  },
}

edit: ({ attributes, setAttributes }) => {
  return (
    <RichText
      tagName="h2"
      value={attributes.title}
      onChange={(newTitle) => setAttributes({ title: newTitle })}
      placeholder="タイトルを入力..."
      className="my-block-title"
    />
  );
}

save: ({ attributes }) => {
  return (
    <RichText.Content
      tagName="h2"
      value={attributes.title}
      className="my-block-title"
    />
  );
}
```

---

## 9. FocalPointPicker（画像位置調整）

```jsx
import { FocalPointPicker } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';

attributes: {
  bgImagePc: { type: 'string', default: '' },
  focalPointPc: { type: 'object', default: { x: 0.5, y: 0.5 } },
}

edit: ({ attributes, setAttributes }) => {
  const { bgImagePc, focalPointPc } = attributes;

  return (
    <PanelBody title="背景画像">
      <MediaUpload
        onSelect={(media) => setAttributes({ bgImagePc: media.url })}
        allowedTypes={['image']}
        render={({ open }) => (
          <button onClick={open}>画像を選択</button>
        )}
      />

      {bgImagePc && (
        <FocalPointPicker
          url={bgImagePc}
          value={focalPointPc}
          onChange={(newFocalPoint) => setAttributes({ focalPointPc: newFocalPoint })}
        />
      )}
    </PanelBody>
  );
}
```

CSS変数での使用:
```jsx
const backgroundStyle = {
  '--lw-bg-image-pc': bgImagePc ? `url(${bgImagePc})` : 'none',
  '--lw-bg-position-pc': focalPointPc ? `${focalPointPc.x * 100}% ${focalPointPc.y * 100}%` : '50% 50%',
};
```

```css
.my-block {
  background-image: var(--lw-bg-image-pc);
  background-position: var(--lw-bg-position-pc);
  background-size: cover;
}
```

---

## 10. レスポンシブ実装の完全パターン

### JSX (index.js)
```jsx
attributes: {
  // PC
  heightPc: { type: 'string', default: '768px' },
  colorPc: { type: 'string', default: '#1a72ad' },
  // Tablet
  heightTb: { type: 'string', default: '' },
  colorTb: { type: 'string', default: '' },
  // Smartphone
  heightSp: { type: 'string', default: '' },
  colorSp: { type: 'string', default: '' },
}

edit: ({ attributes }) => {
  const { heightPc, heightTb, heightSp, colorPc, colorTb, colorSp } = attributes;

  const responsiveStyles = {
    '--my-block-height-pc': heightPc,
    '--my-block-height-tb': heightTb || heightPc,
    '--my-block-height-sp': heightSp || heightTb || heightPc,
    '--my-block-color-pc': colorPc,
    '--my-block-color-tb': colorTb || colorPc,
    '--my-block-color-sp': colorSp || colorTb || colorPc,
  };

  return (
    <div {...useBlockProps()} style={responsiveStyles}>
      {/* コンテンツ */}
    </div>
  );
}
```

### CSS (style.css)
```css
.wp-block-wdl-my-custom-block {
  /* PC */
  height: var(--my-block-height-pc);
  background-color: var(--my-block-color-pc);
}

/* Tablet */
@media (max-width: 900px) {
  .wp-block-wdl-my-custom-block {
    height: var(--my-block-height-tb);
    background-color: var(--my-block-color-tb);
  }
}

@container (max-width: 800px) {
  .wp-block-wdl-my-custom-block {
    height: var(--my-block-height-tb);
    background-color: var(--my-block-color-tb);
  }
}

/* Smartphone */
@media (max-width: 600px) {
  .wp-block-wdl-my-custom-block {
    height: var(--my-block-height-sp);
    background-color: var(--my-block-color-sp);
  }
}

@container (max-width: 500px) {
  .wp-block-wdl-my-custom-block {
    height: var(--my-block-height-sp);
    background-color: var(--my-block-color-sp);
  }
}
```

---

## 11. ブロックカテゴリ

利用可能なカテゴリ（`block_category_set.php`で定義）:
- `liteword-firstview` - LiteWord ファーストビュー
- `liteword-title` - LiteWord タイトル
- `liteword-other` - LiteWord ブロック
- `liteword-buttons` - LiteWord リンクボタン
- `liteword-banner` - LiteWord リンクバナー系
- `liteword-comment` - LiteWord 吹き出しコメント

```jsx
registerBlockType('wdl/lw-pr-button-1', {
  title: 'ボタン1',
  category: 'liteword-buttons',  // カテゴリを指定
  // ...
});
```

---

## 12. ❌ やってはいけないこと

### 1. CSS変数をCSSファイルで定義
```css
/* ❌ ダメ */
:root {
  --my-block-color: #ff0000;
}

.wp-block-wdl-my-block {
  --my-block-color: #ff0000;
}
```
→ **必ずJSXのインラインスタイルで定義**

### 2. デバイス別の値を条件分岐で切り替え
```jsx
/* ❌ ダメ */
const currentHeight = isTablet ? heightTb : (isSmartphone ? heightSp : heightPc);
```
→ **CSS変数とメディアクエリで制御**

### 3. フォールバックを忘れる
```jsx
/* ❌ ダメ */
'--my-block-height-sp': heightSp,
```
→ **`heightSp || heightTb || heightPc`でフォールバック**

### 4. レスポンシブブレークポイントが不統一
```css
/* ❌ ダメ */
@media (max-width: 768px) { /* 独自の値 */ }
```
→ **900px, 600pxを使用**

---

## 13. クイックチェックリスト

ブロック実装後、以下を確認してください:

- [ ] CSS変数はインラインスタイル（`style` prop）で定義されているか
- [ ] PC/Tablet/Smartphoneの3段階でレスポンシブ対応しているか
- [ ] フォールバック（`|| valueTb || valuePc`）が実装されているか
- [ ] Media Queries（900px, 600px）が実装されているか
- [ ] Container Queries（800px, 500px）が実装されているか
- [ ] サイドバーがPC/TB/SPで`<hr />`で分離されているか
- [ ] `useSettings('color.gradients', 'color.palette')`を使用しているか
- [ ] カラー/グラデーションの切り替えが実装されているか（必要な場合）
- [ ] utils.jsの共通関数を活用しているか（該当する場合）
- [ ] ブロックカテゴリが適切に設定されているか

---

**最終更新**: 2025-11-17
**参考ブロック**: lw-bg-1, lw-pr-button-1, lw-pr-custom-title-11
