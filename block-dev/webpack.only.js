// 指定したブロックだけをビルドする（webpack.config.js の blockDirs を絞っただけ）。
//   set ONLY=paid-block-fv-9,paid-block-fv-11 && npx webpack --config webpack.only.js
// 🚨 全ブロックを毎回ビルドすると 144 個の出力が全部書き換わって、
//    本番に何を送ったのか分からなくなる。触ったブロックだけを出すためのもの。
const base = require('./webpack.config.js');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const only = (process.env.ONLY || '').split(',').map(s => s.trim()).filter(Boolean);
if (!only.length) { console.error('ONLY にブロック名を渡してください'); process.exit(1); }

const entry = {};
only.forEach((dir) => { entry[dir] = `./src/${dir}/index.js`; });

module.exports = {
  ...base,
  entry,
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name]/[name].css' }),
    new CopyWebpackPlugin({
      patterns: only.map((dir) => ([
        { from: `./src/${dir}/style.css`,  to: `${dir}/style.css`,  noErrorOnMissing: true },
        { from: `./src/${dir}/editor.css`, to: `${dir}/editor.css`, noErrorOnMissing: true },
        { from: `./src/${dir}/block.json`, to: `${dir}/block.json`, noErrorOnMissing: true },
        { from: `./src/${dir}/*.webp`,     to: `${dir}/[name][ext]`, noErrorOnMissing: true },
        { from: `./src/${dir}/render.php`, to: `${dir}/render.php`, noErrorOnMissing: true },
        { from: `./src/${dir}/view.js`,    to: `${dir}/view.js`,    noErrorOnMissing: true },
      ])).flat(),
    }),
    new DependencyExtractionWebpackPlugin(),
  ],
};
