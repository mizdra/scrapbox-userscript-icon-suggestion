/* eslint-env node */

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ],
    }),
    // process.env.NODE_ENV === 'production' && terser({ mangle: false, keep_fnames: true, format: null }),
    !!process.env.ANALYZE && visualizer({ template: 'treemap' }),
  ],
};
