/* eslint-env node */

/// <reference types="jest-playwright-preset" />

import '@testing-library/jest-dom';
import '../mocks/resize-observer';
import '../mocks/ScrapboxContext';

import faker from 'faker';
import { enableFetchMocks } from 'jest-fetch-mock';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

faker.locale = 'ja';
const seed = process.env.FAKER_SEED ? +process.env.FAKER_SEED : getRandomInt(0, 0xffffff);
faker.seed(seed);
console.log(`faker's seed is \`${seed}\``);

enableFetchMocks();
