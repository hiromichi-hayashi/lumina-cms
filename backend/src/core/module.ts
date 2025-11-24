import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleModule } from '../db/drizzle.module';
import { DrizzleService } from '../db/drizzle.service';
import { createBetterAuthConfig } from '../modules/auth/config/factory';

/**
 * CoreModule - アプリケーション基盤サービス
 *
 * アプリケーション全体で使用される基盤サービスをグローバルに提供します:
 * - Better Auth認証インスタンス
 * - その他の共通基盤サービス（将来追加予定）
 *
 * @Global デコレーターにより、このモジュールで提供されるプロバイダーは
 * 他のモジュールで明示的にインポートしなくても使用できます。
 */
@Global()
@Module({
  imports: [ConfigModule, DrizzleModule],
  providers: [
    // Better Auth DI設定
    {
      provide: 'BETTER_AUTH',
      useFactory: (drizzleService: DrizzleService, configService: ConfigService) => {
        return createBetterAuthConfig(drizzleService, configService);
      },
      inject: [DrizzleService, ConfigService],
    },
  ],
  exports: ['BETTER_AUTH'],
})
export class CoreModule {}
