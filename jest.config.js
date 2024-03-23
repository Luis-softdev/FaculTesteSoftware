module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    collectCoverage: true,
    coverageReporters: ["json", "lcov", "text", "clover"],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };