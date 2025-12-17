const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// srcディレクトリ内のすべてのサブディレクトリを取得
const blockDirs = fs.readdirSync(path.join(__dirname, 'src')).filter((dir) => {
  return fs.statSync(path.join(__dirname, 'src', dir)).isDirectory();
});

// エントリーポイントを自動生成
const entry = {};
blockDirs.forEach((dir) => {
  entry[dir] = `./src/${dir}/index.js`;
});

module.exports = {
  ...defaultConfig,
  devtool: false, // ソースマップを生成しない（本番用）
  entry: entry,
  output: {
    path: path.join(__dirname, '../LiteWord/my-blocks/build'),
    filename: '[name]/[name].js', // 各ブロックのサブディレクトリ内に出力
    // clean は使用しない（.webp ファイルが削除されるため）
    // 代わりに clean-build.js で削除されたブロックのみクリーンアップ
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css', // 各ブロックのサブディレクトリ内に出力
    }),
    new CopyWebpackPlugin({
      patterns: blockDirs.map((dir) => {
        const patterns = [
          { from: `./src/${dir}/style.css`, to: `${dir}/style.css`, noErrorOnMissing: true },
          { from: `./src/${dir}/editor.css`, to: `${dir}/editor.css`, noErrorOnMissing: true },
          { from: `./src/${dir}/block.json`, to: `${dir}/block.json`, noErrorOnMissing: true },
          { from: `./src/${dir}/*.webp`, to: `${dir}/[name][ext]`, noErrorOnMissing: true }
        ];
        return patterns;
      }).flat(), // 各ブロックのスタイルファイルとblock.jsonとwebp画像をサブディレクトリにコピー
    }),
    new DependencyExtractionWebpackPlugin(),
  ],
};
