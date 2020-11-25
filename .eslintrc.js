module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-node',
  ],
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin-node/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-plugin-import/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
};