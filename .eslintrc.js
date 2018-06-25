'use strict';

module.exports = {
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {
    es6: true,
    node: true
  },
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  rules: {
    strict: 'error',
    'node/no-unpublished-require': 'off'
  },
  overrides: [
    {
      files: 'test/**/*.js',
      env: {
        jest: true
      }
    }
  ]
};
