const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: "development",
    entry: './src/index.ts',
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      modules: [
        path.resolve(__dirname, 'src'),
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
              // fallback to style-loader in development
              isProduction ? MiniCssExtractPlugin.loader : "style-loader",
              "css-loader",
              "sass-loader"
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html"
      }),
      new MiniCssExtractPlugin({})
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
  }
};
