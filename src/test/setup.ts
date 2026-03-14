import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/preact';
import { afterEach } from 'vitest';
import { fakeScrapboxAPI } from './faker';

window.scrapbox = fakeScrapboxAPI();

afterEach(() => {
  cleanup();
});
