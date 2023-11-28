const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const threadLoader = require('thread-loader');

const smp = new SpeedMeasurePlugin();

const DESTINATION = path.resolve(__dirname, './build/');

const build = (env, args) => {
  const devMode = args.mode !== 'production';
  const measure = env.measure || false;
  const watch = env.watch || false;

  threadLoader.warmup({ poolTimeout: watch ? Infinity : 2000 }, ['babel-loader', '@babel/preset-env']);

  let modules = {
    entry: { 'plitzi-cli': './src/index.mjs' },
    output: {
      path: DESTINATION,
      filename: '[name].js',
      library: 'PlitziUiComponents',
      libraryTarget: 'umd',
      crossOriginLoading: 'anonymous',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      publicPath: 'auto'
    },
    watch,
    target: 'node',
    module: {
      rules: [
        {
          test: /(\.jsx|\.js|\.mjs)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'thread-loader',
              options: { poolTimeout: watch ? Infinity : 2000 }
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'].filter(Boolean)
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(es|pt|en).js/),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ],
    stats: {
      colors: true
    }
  };

  if (devMode) {
    modules.devtool = 'source-map';
  } else {
    modules.plugins.push(new CleanWebpackPlugin());
    modules.optimization = {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    };
  }

  if (measure) {
    modules = smp.wrap(modules);
  }

  return modules;
};

module.exports = [build];
