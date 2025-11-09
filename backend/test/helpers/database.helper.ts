import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from '../../src/db/schema';

/**
 * テスト用データベースヘルパー
 *
 * E2Eテストで使用するDB接続とクリーンアップ機能を提供します
 */
export class DatabaseTestHelper {
  private client: postgres.Sql | null = null;
  public db: PostgresJsDatabase<typeof schema> | null = null;

  /**
   * テスト用DBに接続
   */
  async connect(): Promise<void> {
    const connectionString = `postgres://${process.env.TEST_DB_USERNAME}:${process.env.TEST_DB_PASSWORD}@${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}/${process.env.TEST_DB_DATABASE}`;

    this.client = postgres(connectionString, {
      max: 1, // テスト用なので接続数を制限
    });

    this.db = drizzle(this.client, { schema });

    // 接続確認
    try {
      await this.client`SELECT 1`;
      console.log(
        `✅ テスト用DB接続成功: ${process.env.TEST_DB_DATABASE}@${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}`,
      );
    } catch (error) {
      console.error('❌ テスト用DB接続失敗:', error);
      throw error;
    }
  }

  /**
   * 全テーブルのデータをクリーンアップ
   */
  async cleanup(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      // 外部キー制約を一時的に無効化
      await this.client!`SET session_replication_role = 'replica'`;

      // 各テーブルのデータを削除
      await this.db.delete(schema.sessions);
      await this.db.delete(schema.accounts);
      await this.db.delete(schema.users);
      await this.db.delete(schema.verificationTokens);

      // 外部キー制約を再度有効化
      await this.client!`SET session_replication_role = 'origin'`;

      console.log('🧹 テスト用DBをクリーンアップしました');
    } catch (error) {
      console.error('❌ クリーンアップ失敗:', error);
      throw error;
    }
  }

  /**
   * DB接続をクローズ
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
      this.db = null;
      console.log('👋 テスト用DB接続をクローズしました');
    }
  }

  /**
   * DBをリセット（クリーンアップ + 必要に応じてシードデータ投入）
   */
  async reset(): Promise<void> {
    await this.cleanup();
    // 必要に応じてシードデータを投入
    // await this.seed();
  }

  /**
   * シードデータ投入（オプション）
   */
  async seed(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    // テスト用のシードデータを投入
    // 例: テストユーザーの作成など
  }
}

/**
 * グローバルに使用可能なテストDBヘルパーインスタンス
 */
export const testDb = new DatabaseTestHelper();
