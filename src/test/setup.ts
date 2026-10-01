import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/preact';
import { afterEach } from 'vite-plus/test';

window.scrapbox = {
  Layout: 'page',
  Project: {
    name: 'project',
  },
  addListener: () => window.scrapbox,
  removeListener: () => window.scrapbox,
};

afterEach(() => {
  cleanup();
});
