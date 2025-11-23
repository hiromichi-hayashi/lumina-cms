import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CommonModule } from './common/common.module';
import { DrizzleModule } from './db/drizzle.module';
import { AuthModule } from './modules/auth/module';
import appConfig from './config/app';
import databaseConfig from './config/database';
import authConfig from './config/auth';
import serverConfig from './config/server';
import throttleConfig from './config/throttle';
import securityConfig from './config/security';
import { validationSchema } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, serverConfig, throttleConfig, securityConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttl'),
          limit: config.get<number>('throttle.limit'),
        },
      ],
    }),
    CoreModule, // アプリケーション基盤サービス（Better Auth等）
    CommonModule,
    DrizzleModule,
    AuthModule,
  ],
})
export class AppModule {}
