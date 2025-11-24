import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';

/**
 * シーダー関数の型定義
 */
export type SeederFunction = (
  db: PostgresJsDatabase<typeof schema>,
  ...args: unknown[]
) => Promise<void>;

/**
 * データベースインスタンスの型
 */
export type DatabaseInstance = PostgresJsDatabase<typeof schema>;
