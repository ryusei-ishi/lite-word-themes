// ブロックを1つだけビルドする（他のブロックの出力に触らないため）
//   使い方: LW_BLOCK=fv-4 node ./node_modules/webpack/bin/webpack.js --config webpack.one.js
// 全部まとめてビルドすると build 配下の全ファイルが書き換わり、
// 直していないブロックまで差分が出て本番へ出すものが分からなくなる。
const base = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const dir = process.env.LW_BLOCK;
if (!dir) { console.error('LW_BLOCK にブロック名を入れてください（例 LW_BLOCK=fv-4）'); process.exit(1); }
module.exports = {
  ...base,
  entry: { [dir]: `./src/${dir}/index.js` },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name]/[name].css' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `./src/${dir}/style.css`, to: `${dir}/style.css`, noErrorOnMissing: true },
        { from: `./src/${dir}/editor.css`, to: `${dir}/editor.css`, noErrorOnMissing: true },
        { from: `./src/${dir}/block.json`, to: `${dir}/block.json`, noErrorOnMissing: true },
        { from: `./src/${dir}/render.php`, to: `${dir}/render.php`, noErrorOnMissing: true },
        { from: `./src/${dir}/view.js`, to: `${dir}/view.js`, noErrorOnMissing: true },
        { from: `./src/${dir}/*.webp`, to: `${dir}/[name][ext]`, noErrorOnMissing: true },
      ],
    }),
    new DependencyExtractionWebpackPlugin(),
  ],
};
// ⚠️ ビルドすると build/style-<ブロック名>/ という使わないフォルダも出る。消してよい。
