import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [resolve(), typescript()],
};
