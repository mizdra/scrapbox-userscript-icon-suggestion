// @ts-check
/* eslint-env node */

/** @type import('@jest/types').Config.InitialOptions */
const SHARED_CONFIG = {
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
      displayName: 'unit',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/**/*.test.(ts|tsx)'],
      setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ts'],
    },
    {
      ...SHARED_CONFIG,
      displayName: 'e2e',
      preset: 'jest-playwright-preset',
      testEnvironmentOptions: {
        'jest-playwright': {
          // launchType: 'LAUNCH',
          // launchOptions: { headless: false, slowMo: 1000 },
          launchOptions: { slowMo: 500 },
        },
      },
      testMatch: ['<rootDir>/e2e-test/**/*.test.(ts|tsx)'],
    },
  ],
};
