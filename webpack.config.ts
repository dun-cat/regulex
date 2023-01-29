import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';

const WebpackShellPlugin = require('webpack-shell-plugin-next');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


const _DEV_ = (process.env.NODE_ENV || '').toLowerCase().startsWith('dev');

const WEB_OUTPUT_PATH = path.join(__dirname, 'docs');
const WEB_SRC_PATH = path.join(__dirname, 'src/web');

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(WEB_SRC_PATH, 'index.html'),
    inlineSource: '.(js|css)$',
    filename: 'beta.html'
  }),
  // new HtmlWebpackInlineSourcePlugin(),

  // Generate TypeScript types for css modules
  new WebpackShellPlugin({
    onBuildStart: ['npm run cssd']
  }),
  {
    apply(compiler: webpack.Compiler) {
      compiler.hooks.afterEmit.tap('CleanInlinedFile', () => {
        let files = ['main.css', 'main.js'].map(f => path.join(WEB_OUTPUT_PATH, f));
        for (let f of files) {
          try {
            fs.unlinkSync(f);
          } catch (e) { }
        }
      });
    }
  },

  new webpack.WatchIgnorePlugin({ paths: [/css\.d\.ts$/] }),

  new MiniCssExtractPlugin({
    filename: 'main.css'
  })
];

function cssModules(regex: RegExp, mode: 'local' | 'global'): webpack.RuleSetRule {
  return {
    test: regex,
    include: WEB_SRC_PATH,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // hmr: false
        }
      },
      {
        loader: 'css-loader',
        options: {
          modules: {
            mode: mode,
            localIdentContext: WEB_SRC_PATH,
            localIdentName: '[local]-[hash:4]',
            exportLocalsConvention: "camelCase",
          },
          sourceMap: _DEV_
        }
      }
    ]
  };
}

const config = {
  mode: _DEV_ ? 'development' : 'production',
  entry: path.join(WEB_SRC_PATH, 'main.ts'),
  output: {
    path: WEB_OUTPUT_PATH,
    publicPath: '/',
    filename: 'main.js'
  },
  devtool: _DEV_ ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      cssModules(/\.local\.css$/, 'local'),
      cssModules(/(?<!\.local)\.css$/, 'global'),
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        include: WEB_SRC_PATH
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    static: WEB_OUTPUT_PATH,
  },
  plugins
};

export default config;
