import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DrizzleService.name);
  private client: postgres.Sql;
  public db: PostgresJsDatabase<typeof schema>;

  constructor(private configService: ConfigService) {
    // NODE_ENVに基づいてプレフィックスを切り替え
    const isTest = process.env.NODE_ENV === 'test';
    const prefix = isTest ? 'TEST_DB_' : 'DB_';

    const dbHost = this.configService.get<string>(`${prefix}HOST`, 'localhost');
    const dbPort = this.configService.get<number>(`${prefix}PORT`, isTest ? 5433 : 5432);
    const dbDatabase = this.configService.get<string>(
      `${prefix}DATABASE`,
      isTest ? 'lumina_cms_test' : 'lumina_cms',
    );
    const dbUsername = this.configService.get<string>(
      `${prefix}USERNAME`,
      isTest ? 'test_user' : 'lumina',
    );
    const dbPassword = this.configService.get<string>(
      `${prefix}PASSWORD`,
      isTest ? 'test_password' : 'lumina_dev',
    );

    const connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;

    this.client = postgres(connectionString, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 2,
    });

    this.db = drizzle(this.client, {
      schema,
      logger: process.env.NODE_ENV === 'development',
    });

    // 接続情報をログ出力（パスワードは隠す）
    this.logger.log(
      `Database connection: ${dbHost}:${dbPort}/${dbDatabase} (${isTest ? 'TEST' : 'DEV'})`,
    );
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
