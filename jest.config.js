/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  roots: ['src'],
  verbose: true,
  clearMocks: true,
  errorOnDeprecated: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/index.{ts,tsx}', '!**/types/**', '!**/benchmark/**', '!**/constants.*', '!**/_**'],
  coverageDirectory: '<rootDir>/out/coverage',
  coverageReporters: ['text-summary', 'json-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      functions: 90,
      branches: 85,
      lines: 95,
      statements: 95,
    },
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
