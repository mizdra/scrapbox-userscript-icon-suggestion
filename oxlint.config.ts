import mizdra from '@mizdra/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [mizdra.base, mizdra.typescript, mizdra.node, mizdra.react],
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
  },
});
