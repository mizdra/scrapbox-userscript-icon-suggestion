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
      tsconfig: '<rootDir>/tsconfig.src.json',
      isolatedModules: true,
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
  ],
};
