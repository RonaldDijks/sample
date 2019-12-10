/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "development",
    entry: "./src/main.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }]
        }
      ]
    },
    output: {
      path: __dirname + "/dist",
      filename: "main.js"
    }
  },
  {
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "development",
    entry: "./src/renderer.ts",
    target: "electron-renderer",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: "ts-loader" }]
        }
      ]
    },
    output: {
      path: __dirname + "/dist",
      filename: "renderer.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ]
  },
];
