/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/__tests__/**/*.spec.{ts,tsx}"],
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage/",
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
    coveragePathIgnorePatterns: ["/__tests__/"],
  };
  