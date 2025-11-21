import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';
import { getDatabaseConnectionString } from '../config/database';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DrizzleService.name);
  private client: postgres.Sql;
  public db: PostgresJsDatabase<typeof schema>;

  constructor(private configService: ConfigService) {
    // NODE_ENVに基づいて接続文字列を取得
    const isTest = this.configService.get<string>('app.nodeEnv') === 'test';
    const connectionString = getDatabaseConnectionString(isTest);

    this.client = postgres(connectionString, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 2,
    });

    this.db = drizzle(this.client, {
      schema,
      logger: this.configService.get<string>('app.nodeEnv') === 'development',
    });

    // 接続情報をログ出力（パスワードは隠す）
    const connInfo = connectionString.replace(/:[^:@]+@/, ':****@');
    this.logger.log(`Database connection: ${connInfo} (${isTest ? 'TEST' : 'DEV'})`);
  }

  async onModuleInit() {
    try {
      await this.client`SELECT 1`;
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.end();
    this.logger.log('Database disconnected');
  }

  async transaction<T>(fn: (tx: PostgresJsDatabase<typeof schema>) => Promise<T>): Promise<T> {
    return this.db.transaction(fn);
  }
}
