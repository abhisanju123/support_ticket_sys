/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('./jest.config.js'),
  testMatch: ['**/tests/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
};
