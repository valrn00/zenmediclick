export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test-setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'pages/**/*.js',
    '!src/**/*.test.js',
    '!tests/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '@/(.*)': '<rootDir>/src/$1',
    '@tests/(.*)': '<rootDir>/tests/$1'
  }
};