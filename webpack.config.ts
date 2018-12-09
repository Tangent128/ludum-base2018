import * as path from "path";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";

export default function config(env: {}, argv: { mode: string }): Configuration {
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
        },
        {
          test: /\.(ogg|png)$/,
          use: "file-loader"
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
}
