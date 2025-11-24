import { Module } from '@nestjs/common';
import { AuthController } from './controller';
import { AuthService } from './service';
import { AuthGuard } from '../../common/guards/auth';
import { UserRepository, SessionRepository, VerificationTokenRepository } from './repositories';

/**
 * AuthModule - 認証モジュール
 *
 * 認証関連のエンドポイントとビジネスロジックを提供します。
 * BETTER_AUTH インスタンスはCoreModuleで提供されるため、ここでは定義していません。
 */
@Module({
  controllers: [AuthController],
  providers: [
    // Repositories - 認証データアクセス層
    UserRepository,
    SessionRepository,
    VerificationTokenRepository,

    // Services - 認証ビジネスロジック
    AuthService,

    // Guards - 認証ガード
    AuthGuard,
  ],
  exports: [
    // Repositories - 他のモジュールで使用可能
    UserRepository,
    SessionRepository,
    VerificationTokenRepository,

    // Services
    AuthService,

    // Guards
    AuthGuard,
  ],
})
export class AuthModule {}
