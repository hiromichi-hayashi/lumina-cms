import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DrizzleModule } from '../../db/drizzle.module';
import { DrizzleService } from '../../db/drizzle.service';
import { createBetterAuthConfig } from './better-auth.config';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserRepository, SessionRepository, VerificationTokenRepository } from './repositories';

@Module({
  imports: [ConfigModule, DrizzleModule],
  controllers: [AuthController],
  providers: [
    // Repositories
    UserRepository,
    SessionRepository,
    VerificationTokenRepository,

    // Services
    AuthService,

    // Guards
    AuthGuard,

    // Better Auth
    {
      provide: 'BETTER_AUTH',
      useFactory: (drizzleService: DrizzleService, configService: ConfigService) => {
        return createBetterAuthConfig(drizzleService, configService);
      },
      inject: [DrizzleService, ConfigService],
    },
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

    // Better Auth
    'BETTER_AUTH',
  ],
})
export class AuthModule {}
