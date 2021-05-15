// @ts-check
/* eslint-env node */

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['./test/setup/jest.setup.ts'],
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
