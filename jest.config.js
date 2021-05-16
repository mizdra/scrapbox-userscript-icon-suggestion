// @ts-check
/* eslint-env node */

/** @type import('@jest/types').Config.InitialOptions */
const SHARED_CONFIG = {
  roots: ['<rootDir>/test'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^react-dom$': 'preact/compat',
    '^react$': 'preact/compat',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  projects: [
    {
      ...SHARED_CONFIG,
      displayName: 'unit-test',
      testEnvironment: 'jsdom',
      testMatch: ['**/*.test.(ts|tsx)', '!**/e2e/**'],
      setupFilesAfterEnv: ['./test/setup/jest.setup.ts'],
    },
    {
      ...SHARED_CONFIG,
      displayName: 'e2e-test',
      preset: 'jest-playwright-preset',
      testMatch: ['**/e2e/*.test.(ts|tsx)'],
    },
  ],
};
