/**
 * Jest設定
 *
 * Next.js + TypeScript + React Testing Libraryのテスト環境
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.jsとテスト環境を読み込むためのNext.jsアプリのパスを提供
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // テストファイルのセットアップ
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // テスト環境
  testEnvironment: 'jsdom',

  // モジュール名マッピング（tsconfig.jsonのpathsに対応）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // テストカバレッジ
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],

  // テストマッチパターン
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // カバレッジ閾値
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// createJestConfigをエクスポート（Next.jsのasync設定を許可）
module.exports = createJestConfig(customJestConfig);
