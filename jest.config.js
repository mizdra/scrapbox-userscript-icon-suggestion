// @ts-check
/* eslint-env node */

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
