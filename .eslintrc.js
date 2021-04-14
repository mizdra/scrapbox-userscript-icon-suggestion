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
    'react/react-in-jsx-scope': 0,
  },
};
