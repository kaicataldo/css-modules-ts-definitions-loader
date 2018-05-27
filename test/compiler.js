'use strict';

const path = require('path');
const webpack = require('webpack');
const memoryfs = require('memory-fs');

module.exports = function(fixture, opts = {}) {
  const config = {
    context: __dirname,
    mode: 'production',
    entry: path.resolve(fixture),
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.css/,
          use: [
            path.resolve(__dirname, '../'),
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: opts.camelCase !== false
              }
            }
          ]
        }
      ]
    }
  };

  if (opts.cssLoaderOnly) {
    config.module.rules[0].use.shift();
  }

  const compiler = webpack(config);

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        reject(err);
      }

      resolve(stats);
    });
  });
};
