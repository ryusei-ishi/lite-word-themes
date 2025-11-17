# LiteWord カスタムブロック自動生成システム - AI開発ガイド

このディレクトリは、AIがLiteWordカスタムブロックを自動生成する際の学習・記録用です。
**このディレクトリ内のファイルはテーマに含まれません（.gitignoreで除外済み）**

## ディレクトリ構造

```
_AI_BLOCK_DEVELOPMENT/
├── README.md                      # このファイル
├── history/                       # 開発履歴とlearnings
│   └── learnings.md              # エラー・成功パターンの蓄積
├── errors/                        # エラーケースの詳細記録
│   └── YYYYMMDD_block-name.md    # 個別エラー詳細
├── successes/                     # 成功ケースの詳細記録
│   └── YYYYMMDD_block-name.md    # 個別成功パターン
├── css-rules/                     # CSS関連ルール
│   └── variables.md              # CSS変数一覧と使い方
└── jsx-patterns/                  # JSXパターン集
    └── best-practices.md         # ベストプラクティス
```

## 絶対に守るべき原則

### 1. ファイル配置ルール
- **JSX開発ファイル**: `block-dev/src/` に配置
- **ビルド出力**: `LiteWord/my-blocks/build/` に自動出力
- **履歴・メモ**: `_AI_BLOCK_DEVELOPMENT/` に配置（テーマ内に絶対にメモを残さない）

### 2. CSS変数のスコープルール
- CSS変数は**必ずインラインスタイルで定義**
- サイト全体を汚染しない（子要素のみに影響）
```jsx
const myStyles = {
  '--my-custom-color': '#ff0000',
  '--my-spacing': '20px'
};
<div style={myStyles}>
  {/* 子要素でvar(--my-custom-color)が使える */}
</div>
```

### 3. レスポンシブ対応必須
- PC（900px以上）/ Tablet（600-900px）/ Smartphone（600px未満）の3段階
- Media Queries + Container Queries の併用
- 継承ルール: `valueSp || valueTb || valuePc`

### 4. ネスト記法でCSS記述
- Sassライクなネスト記法を使用
- BEMなどの命名規則よりもネストを優先

### 5. グラデーション・カラー系は要注意
- 最もエラーが発生しやすい箇所
- `useSettings('color.gradients', 'color.palette')` を活用
- GradientPickerとColorPaletteの使い分けを正確に

## 開発プロセス（Phase 0-6）

### Phase 0: 事前準備
- `history/learnings.md` を確認
- `errors/` と `successes/` から過去の教訓を学習
- `css-rules/variables.md` でCSS変数を確認
- `jsx-patterns/best-practices.md` でパターンを確認

### Phase 1: 要件確認
- ブロック名（例: lw-pr-card-1）
- ブロックID（例: lw-pr-card-1）
- 機能概要
- サイドバー設定項目

### Phase 2: 設計
- 既存の類似ブロックを分析
- JSX構造設計
- CSS変数設計
- レスポンシブ戦略
- Ryuichiの承認を得る

### Phase 3: 実装
- JSX作成
- CSS（ネスト記法）
- サイドバーUI（PC/TB/SP分離）
- レスポンシブ実装

### Phase 4: 自己チェック
- CSS変数がインラインで定義されているか
- レスポンシブが3段階で動作するか
- グラデーション/カラーが正しく動作するか
- サイトに配布しても問題ない品質か

### Phase 5: 完成報告
- ファイルパスを報告
- ビルドはRyuichiが手動実行（`npm run build`）

### Phase 6: フィードバック対応と履歴記録
- エラーがあれば修正
- `history/learnings.md` に記録
- `errors/` または `successes/` に詳細記録

## 重要なパス

| 用途 | パス |
|------|------|
| JSX開発 | `C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\block-dev\src\` |
| ビルド出力 | `C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\LiteWord\my-blocks\build\` |
| CSS変数定義 | `C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\LiteWord\functions\css_js_set\index.php` |
| ブロック登録 | `C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\LiteWord\my-blocks\block-registration\register-wdl-block.php` |
| 共通関数 | `C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\block-dev\src\utils.js` |

## ブロック命名規則

- `lw-pr-*` : プレミアムプラン専用（メイン対象）
  - 登録条件: `LW_HAS_SUBSCRIPTION === true`
- `paid-block-*` : 買い切り型
  - 登録条件: サブスクリプション契約 または 試用期間中
- `shin-*` : 特殊プロジェクト
- `lw-*` : 標準ブロック（常に利用可能）

## 継続的改善サイクル

- **毎回**: エラー/成功を履歴に記録
- **5ブロックごと**: learnings.mdを見直し、パターンを抽出
- **10ブロックごと**: ガイド全体を見直し、ルールを更新
- **目標**: 3回目以降はバグゼロ

## 参照優先度

1. `history/learnings.md` - 最新の学習内容
2. `jsx-patterns/best-practices.md` - 実装パターン
3. `css-rules/variables.md` - CSS変数リファレンス
4. 既存ブロック（特にlw-pr-*系）

---

**最終更新**: 2025-11-17
**対象ユーザー**: 500+ LiteWordユーザー
**品質基準**: バグゼロ（プレミアム配布のため）
