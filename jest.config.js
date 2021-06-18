/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  verbose: true,
  clearMocks: true,
  errorOnDeprecated: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/index.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'json-summary', 'html'],
  coverageThreshold: {
    global: {
      functions: 0,
      branches: 0,
      lines: 0,
      statements: 0,
    },
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
