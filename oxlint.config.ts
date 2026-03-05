import { defineConfig } from 'oxlint';
import mizdra from '@mizdra/oxlint-config';

export default defineConfig({
  extends: [mizdra.base, mizdra.typescript, mizdra.node, mizdra.react],
  rules: {
    'no-console': 'off',
  },
});
