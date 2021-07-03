/* eslint-env node */

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';

// UserScript 本体である 'src/index.ts' と E2E テスト用の 'src/e2e.ts' を生成する config。
// 'src/e2e.ts' は playwright の Page#addScriptTag で埋め込む都合上、standalone である必要がある。
// 今の所 Rollup.js は複数の input/output を持つ時にそれぞれの output を standalone にするオプションが
// 存在しないため、ここでは multiple config によるハックを利用し、standalone な output を生成している。
// ref: https://github.com/rollup/rollup/issues/2756

function createConfig(input) {
  /** @type {import('rollup').RollupOptions} */
  const config = {
    input: input,
    output: {
      dir: 'dist',
      format: 'es',
      // Page#addScriptTag で差し込む都合上、bundle ファイルに sourcemap が埋め込まれている必要がある
      sourcemap: 'inline',
    },
    plugins: [
      alias({
        entries: [
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom', replacement: 'preact/compat' },
        ],
      }),
      resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.src.json',
        // ref: https://github.com/rollup/plugins/issues/260#issuecomment-601551228
        inlineSources: true,
      }),
      !!process.env.ANALYZE && visualizer({ template: 'treemap' }),
    ],
  };
  return config;
}

// eslint-disable-next-line import/no-default-export
export default [createConfig('src/index.ts'), createConfig('src/e2e.ts')];
