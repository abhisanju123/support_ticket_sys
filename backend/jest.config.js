/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  setupFiles: ['<rootDir>/src/tests/setup/env.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/integration/'],
  clearMocks: true,
  passWithNoTests: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**', '!src/index.ts'],
  coverageDirectory: 'coverage',
};
