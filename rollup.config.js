/* eslint-env node */

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'es',
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
    typescript({ tsconfig: 'tsconfig.src.json', sourceMap: false }),
    !!process.env.ANALYZE && visualizer({ template: 'treemap' }),
  ],
};
