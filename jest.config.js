/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  bail: true,
  // Use ts-jest for transforming TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    '^.+\\.jsx?$': 'babel-jest', // Add this line to handle ESM
  },

  // Explicitly tell Jest to process ES Modules in node_modules, like "sst"
  transformIgnorePatterns: [
    '/node_modules/(?!sst)', // If there are other packages with ES modules, add them here
  ],

  preset: 'ts-jest',

  setupFiles: ['<rootDir>/jest.setup.ts'],

  // Mapping module paths for cleaner imports
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },

  // File extensions that Jest will process
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Match test files
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

  // Collect coverage from all files except e2e tests
  collectCoverageFrom: ['src/**/*.(t|j)s', '!**/*.e2e.spec.(t|j)s', '!**/*.spec.(t|j)s'],

  // Output directory for coverage reports
  coverageDirectory: './coverage',
}
