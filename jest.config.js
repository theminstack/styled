/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  verbose: true,
  clearMocks: true,
  errorOnDeprecated: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/index.{ts,tsx}', '!**/types/**', '!**/benchmark/**', '!**/constants.*', '!**/_**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'json-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      functions: 95,
      branches: 80,
      lines: 95,
      statements: 95,
    },
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
