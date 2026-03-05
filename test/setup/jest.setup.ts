/* eslint-env node */

import '@testing-library/jest-dom';
import '../mocks/resize-observer';
import '../mocks/ScrapboxContext';

import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
