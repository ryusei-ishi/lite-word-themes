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
  entry: entry,
  output: {
    path: path.join(__dirname, '../LiteWord/my-blocks/build'),
    filename: '[name]/[name].js', // 各ブロックのサブディレクトリ内に出力
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
      patterns: blockDirs.map((dir) => [
        { from: `./src/${dir}/style.css`, to: `${dir}/style.css` },
        { from: `./src/${dir}/editor.css`, to: `${dir}/editor.css` }
      ]).flat(), // 各ブロックのスタイルファイルをサブディレクトリにコピー
    }),
    new DependencyExtractionWebpackPlugin(),
  ],
};
