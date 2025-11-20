import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

// 必要に応じて.envファイルを読み込み（CLI実行時用）
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
}

/**
 * データベース接続情報インターフェース
 */
export interface DatabaseCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/**
 * 環境変数からデータベース接続情報を取得
 *
 * すべてのデータベース接続設定（drizzle.config.ts, drizzle.service.ts, seeds）
 * で共通のロジックを使用し、デフォルト値の一貫性を保証します。
 *
 * @param isTest テスト環境かどうか
 * @returns データベース接続情報
 */
export function getDatabaseCredentials(
  isTest: boolean = false,
): DatabaseCredentials {
  const prefix = isTest ? 'TEST_DB_' : 'DB_';

  return {
    host: process.env[`${prefix}HOST`] || 'localhost',
    port: parseInt(
      process.env[`${prefix}PORT`] || (isTest ? '5433' : '5432'),
      10,
    ),
    database:
      process.env[`${prefix}DATABASE`] ||
      (isTest ? 'lumina_cms_test' : 'lumina_cms'),
    username:
      process.env[`${prefix}USERNAME`] ||
      (isTest ? 'test_developer' : 'developer'),
    password: process.env[`${prefix}PASSWORD`] || '',
  };
}

/**
 * PostgreSQL接続文字列を生成
 *
 * @param isTest テスト環境かどうか
 * @returns PostgreSQL接続文字列
 */
export function getDatabaseConnectionString(
  isTest: boolean = false,
): string {
  const { host, port, database, username, password } =
    getDatabaseCredentials(isTest);
  return `postgres://${username}:${password}@${host}:${port}/${database}`;
}

/**
 * NestJS ConfigModule用のデータベース設定
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export default registerAs('database', (): DatabaseConfig => {
  const isTest = process.env.NODE_ENV === 'test';
  return getDatabaseCredentials(isTest);
});
