import mizdraFmt from '@mizdra/oxfmt-config';
import mizdraLint from '@mizdra/oxlint-config';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [preact()],
  test: {
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  pack: {
    entry: ['src/index.ts'],
    platform: 'browser',
    target: false,
    minify: true,
    deps: { alwaysBundle: [/.*/u], onlyBundle: false },
    outputOptions: { comments: { annotation: false } },
  },
  fmt: mizdraFmt,
  lint: {
    extends: [mizdraLint.base, mizdraLint.typescript, mizdraLint.node, mizdraLint.react],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: {
      'no-console': 'off',
      // React Compiler を使わないので、React Compiler ベースのルールは無効化する
      'react/error-boundaries': 'off',
      'react/globals': 'off',
      'react/immutability': 'off',
      'react/incompatible-library': 'off',
      'react/preserve-manual-memoization': 'off',
      'react/purity': 'off',
      'react/refs': 'off',
      'react/set-state-in-effect': 'off',
      'react/set-state-in-render': 'off',
      'react/static-components': 'off',
      'react/use-memo': 'off',
      'react/void-use-memo': 'off',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: { typeAware: true, typeCheck: true },
  },
});
