# LiteWord カスタムブロック開発 - 学習履歴

## 最新の学習パターン（更新順）

### 2025-11-17: 初期セットアップと既存ブロック分析

#### ✅ 成功パターン

**1. lw-bg-1のサイドバー構造（優秀なパターン）**
- PC/Tablet/Smartphone を `<hr />` で明確に分離
- 各デバイスで継承オプションを提供
- 構造例:
```jsx
<PanelBody title="背景色の設定">
  <h3>PC</h3>
  <SelectControl label="タイプ" ... />
  {filterTypePc === 'solid' ? (
    <ColorPalette ... />
  ) : (
    <GradientPicker ... />
  )}

  <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

  <h3>タブレット</h3>
  <SelectControl label="PCと同じ / 個別設定" ... />
  {/* タブレット設定 */}

  <hr />

  <h3>スマホ</h3>
  {/* スマホ設定 */}
</PanelBody>
```

**2. CSS変数のインライン定義パターン**
- 複数のスタイルオブジェクトを結合して使用
```jsx
const filterStyle = {
  '--lw-bg-color-filter-pc': getFilterStyle(filterTypePc, filterColorPc, filterGradientPc),
  '--lw-bg-opacity-pc': opacityPc,
  '--lw-bg-color-filter-tb': getFilterStyle(filterTypeTb, ...) || getFilterStyle(filterTypePc, ...),
  '--lw-bg-color-filter-sp': getFilterStyle(filterTypeSp, ...) || getFilterStyle(filterTypeTb, ...) || getFilterStyle(filterTypePc, ...)
};

const backgroundStyle = {
  '--lw-bg-image-pc': bgImagePc ? `url(${bgImagePc})` : 'none',
  // ...
};

<div style={{ ...filterStyle, ...backgroundStyle, ...alignmentStyle }}>
```

**3. レスポンシブ継承の実装パターン**
```jsx
'--my-value-sp': valueSp || valueTb || valuePc
```
- 優先順位: SP → TB → PC（フォールバック）
- undefinedや空文字列を考慮

**4. WordPress設定の取得**
```jsx
import { useSettings } from '@wordpress/block-editor';
const [gradients, colors] = useSettings('color.gradients', 'color.palette');
```

**5. 共通関数の活用（utils.js）**
- `minHeightPcClassOptionArr()` - 高さオプション配列
- `fontOptionsArr()` - フォントオプション（基本フォント10種類）
- `fontWeightOptionsArr()` - フォント太さオプション（100-900）
- `ButtonBackgroundOptionsArr()` - グラデーション30+種類
- SVGアイコン配列（サービスアイコン、矢印アイコンなど）

**6. フォント動的読み込みシステム**
- `data-lw_font_set="フォント名"` をHTML要素に付与
- font_cdn.js が LW_fontCDNs マッピングを保持（プレミアムフォント含む40+種類）
- font_set.js（エディタ）と font.js（フロント）が自動的にGoogle Fonts CDNを読み込み
- 重複防止: window.LW_loadedFonts で管理
```jsx
// サイドバーでフォント選択
import { fontOptionsArr } from '../utils';
<SelectControl
  label="フォント"
  value={fontPc}
  onChange={(newValue) => setAttributes({ fontPc: newValue })}
  options={fontOptionsArr()}
/>

// 要素にdata-lw_font_set属性を付与（CDN自動読み込み）
<h2
  data-lw_font_set={fontPc}
  style={{
    fontFamily: fontPc ? (fontPc === 'mincho' ? 'var(--font-family-mincho)' : fontPc === 'gothic' ? 'var(--font-family-gothic)' : `'${fontPc}', sans-serif`) : 'inherit',
    fontWeight: fontWeightPc || '400'
  }}
>
  タイトル
</h2>
```

#### ⚠️ 注意すべきポイント

**1. ブロック登録の条件**
- プレミアムブロック（lw-pr-*）は `LW_HAS_SUBSCRIPTION === true` の時のみ登録
- register-wdl-block.php の line 166-193 で制御
- 新規ブロック追加時は、このarray_push()にブロック名を追加する必要がある

**2. レスポンシブ実装の必須要件**
- Media Queries: `@media (max-width: 900px)`, `@media (max-width: 600px)`
- Container Queries: `@container (max-width: 800px)`, `@container (max-width: 500px)`
- 両方を併用すること

**3. CSS変数の命名規則**
- ブロック固有の変数は `--lw-[block-name]-[property]-[device]` 形式
- 例: `--lw-bg-color-filter-pc`, `--lw-bg-opacity-sp`
- デバイス接尾辞: `-pc`, `-tb`, `-sp`

**4. グラデーション実装のベストプラクティス**
- Solid/Gradientの切り替えを必ず実装
```jsx
{filterType === 'solid' ? (
  <ColorPalette value={color} onChange={setColor} colors={colors} />
) : (
  <GradientPicker value={gradient} onChange={setGradient} gradients={gradients} />
)}
```

#### 📝 今後検証すべきこと

1. InnerBlocksの使い方（lw-bg-1で使用されている）
2. FocalPointPickerの実装パターン（背景画像の位置調整）
3. カスタムアイコンの登録方法
4. ブロックカテゴリの設定（block_category_set.php）

---

## エラー頻発箇所（記録用）

### グラデーション関連
- [ ] まだエラー記録なし

### CSS変数関連
- [ ] まだエラー記録なし

### レスポンシブ関連
- [ ] まだエラー記録なし

---

## 成功パターンのクイックリファレンス

### 1. 基本的なブロック構造
```jsx
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';

registerBlockType('wdl/lw-pr-example-1', {
  title: 'Example Block',
  category: 'liteword-other',
  attributes: {
    // PC/TB/SP 全てに対応
    valuePc: { type: 'string', default: '' },
    valueTb: { type: 'string', default: '' },
    valueSp: { type: 'string', default: '' },
  },
  edit: ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const [gradients, colors] = useSettings('color.gradients', 'color.palette');

    const { valuePc, valueTb, valueSp } = attributes;

    const customStyles = {
      '--custom-value-pc': valuePc,
      '--custom-value-tb': valueTb || valuePc,
      '--custom-value-sp': valueSp || valueTb || valuePc,
    };

    return (
      <>
        <InspectorControls>
          <PanelBody title="設定">
            <h3>PC</h3>
            {/* PC設定 */}
            <hr />
            <h3>タブレット</h3>
            {/* TB設定 */}
            <hr />
            <h3>スマホ</h3>
            {/* SP設定 */}
          </PanelBody>
        </InspectorControls>

        <div {...blockProps} style={customStyles}>
          {/* コンテンツ */}
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const blockProps = useBlockProps.save();
    const { valuePc, valueTb, valueSp } = attributes;

    const customStyles = {
      '--custom-value-pc': valuePc,
      '--custom-value-tb': valueTb || valuePc,
      '--custom-value-sp': valueSp || valueTb || valuePc,
    };

    return (
      <div {...blockProps} style={customStyles}>
        {/* コンテンツ */}
      </div>
    );
  },
});
```

### 2. レスポンシブCSS（style.cssパターン）
```css
.wp-block-wdl-lw-pr-example-1 {
  /* PC */
  color: var(--custom-value-pc);
}

@media (max-width: 900px) {
  .wp-block-wdl-lw-pr-example-1 {
    /* Tablet */
    color: var(--custom-value-tb);
  }
}

@container (max-width: 800px) {
  .wp-block-wdl-lw-pr-example-1 {
    /* Tablet (Container Query) */
    color: var(--custom-value-tb);
  }
}

@media (max-width: 600px) {
  .wp-block-wdl-lw-pr-example-1 {
    /* Smartphone */
    color: var(--custom-value-sp);
  }
}

@container (max-width: 500px) {
  .wp-block-wdl-lw-pr-example-1 {
    /* Smartphone (Container Query) */
    color: var(--custom-value-sp);
  }
}
```

---

**次回更新**: ブロック実装後にエラー/成功パターンを追記
