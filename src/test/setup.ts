import '@testing-library/jest-dom/vitest';
import './mocks/scrapbox';
import { cleanup } from '@testing-library/preact';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
