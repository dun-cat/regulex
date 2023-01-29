import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';

const WebpackShellPlugin = require('webpack-shell-plugin-next');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const _DEV_ = (process.env.NODE_ENV || '').toLowerCase().startsWith('dev');

const WEB_SRC_PATH = path.join(__dirname, 'src/web');
const WEB_OUTPUT_PATH = path.join(__dirname, 'dist');

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(WEB_SRC_PATH, 'index.html'),
    inlineSource: '.(js|css)$',
    filename: 'index.html'
  }),

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
    filename: '[name].css'
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
            exportLocalsConvention: 'camelCase'
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
    filename: 'main.js',
  },
  externals: {
    raphael: "raphael"
  },
  devtool: _DEV_ ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
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
  optimization: {},
  devServer: {
    static: WEB_SRC_PATH,
    hot: true,
    client: {
      overlay: { errors: true, warnings: false }
    },
  },
  plugins
};

export default config;
