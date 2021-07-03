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
    // コーディング途中に未使用変数が登場することは多々あり、error だと煩すぎる。
    // しかし未使用変数をそのままコード中に残してほしくないので、warn にしておく。
    '@typescript-eslint/no-unused-vars': 1,
    // error だと未定義関数を呼び出した際に、実引数の部分まで赤く線が引かれて煩すぎる。
    // callee だけ赤く染まれば十分なので、このルールは off にしておく。
    '@typescript-eslint/no-unsafe-assignment': 0,
    // @typescript-eslint/no-explicit-any さえあれば十分なので off にしておく。
    '@typescript-eslint/no-unsafe-member-access': 0,
    // 今の所有用な場面に遭遇したことがないので off にしておく。
    '@typescript-eslint/no-unsafe-call': 0,
    'react/react-in-jsx-scope': 0,
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.src.json', './tsconfig.test.json', './tsconfig.bin.json'],
      },
    },
    {
      files: ['test/**/*'],
      env: {
        jest: true,
      },
    },
  ],
};
