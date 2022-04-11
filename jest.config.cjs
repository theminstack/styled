/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  verbose: true,
  clearMocks: true,
  errorOnDeprecated: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/index.{ts,tsx}', '!**/_*', '!**/_*/**'],
  coverageDirectory: '<rootDir>/out/coverage',
  coverageReporters: ['text-summary', 'json-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      functions: 85,
      branches: 85,
      lines: 85,
      statements: 85,
    },
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
