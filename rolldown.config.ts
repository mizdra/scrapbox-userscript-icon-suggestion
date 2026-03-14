import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  platform: 'browser',
  output: {
    minify: true,
  },
});
