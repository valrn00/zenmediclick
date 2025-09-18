// Configuración específica para el directorio tests
export default {
  displayName: 'ZenMediClick Tests',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  collectCoverageFrom: [
    '../../src/**/*.js',
    '../../pages/**/*.js',
    '../../assets/**/*.js'
  ]
};
