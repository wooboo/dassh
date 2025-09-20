/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/**/tests/**/*.(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**'
  ],
  moduleNameMapping: {
    '^@dassh/ui(.*)$': '<rootDir>/packages/ui/src$1',
    '^@dassh/shared(.*)$': '<rootDir>/packages/shared/src$1',
    '^@dassh/widgets(.*)$': '<rootDir>/packages/widgets/src$1',
    '^@dassh/config(.*)$': '<rootDir>/packages/config/src$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  testTimeout: 30000,
  verbose: true
};