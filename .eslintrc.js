'use strict';

module.exports = {
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
