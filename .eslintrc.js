// @ts-check
/* eslint-env node */

/** @type import('eslint').Linter.BaseConfig */
module.exports = {
  root: true,
  extends: ['@mizdra/mizdra', '@mizdra/mizdra/+typescript', '@mizdra/mizdra/+react', '@mizdra/mizdra/+prettier'],
  env: {
    es6: true,
    browser: true,
  },
  rules: {
    // `@material-ui/{core,icons}` を直接 import するとビルドや tsserver の応答が遅くなるので,
    // `@material-ui/{core,icons}` の import を禁止する
    // ref: https://material-ui.com/guides/minimizing-bundle-size/#how-to-reduce-the-bundle-size
    'no-restricted-imports': ['error', { paths: ['@material-ui/core', '@material-ui/icons'] }],
  },
};
