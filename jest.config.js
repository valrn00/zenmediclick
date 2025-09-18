module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test-setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'pages/**/*.js',
    'assets/**/*.js',
    '!src/**/*.test.js',
    '!tests/**/*',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '@/(.*)': '<rootDir>/src/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
    '@assets/(.*)': '<rootDir>/assets/$1',
    '@pages/(.*)': '<rootDir>/pages/$1'
  },
  testTimeout: 10000
};
