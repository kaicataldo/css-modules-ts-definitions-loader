module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true
  },
  plugins: ['node'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier']
};
