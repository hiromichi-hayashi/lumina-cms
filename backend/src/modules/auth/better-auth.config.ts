import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../../db/drizzle.service';

/**
 * Better Auth設定を作成
 */
export function createBetterAuthConfig(
  drizzleService: DrizzleService,
  configService: ConfigService,
) {
  const baseUrl = configService.get<string>('BETTER_AUTH_URL', 'http://localhost:3001');
  const secret = configService.get<string>('BETTER_AUTH_SECRET');
  const basePath = configService.get<string>('BETTER_AUTH_BASE_PATH', '/api/auth');

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET environment variable is required');
  }

  return betterAuth({
    database: drizzleAdapter(drizzleService.db, {
      provider: 'pg',
      schema: {
        // better-authのテーブル名をカスタマイズ
        user: 'users',
        session: 'sessions',
        account: 'accounts',
        verification: 'verification_tokens',
      },
    }),

    // メール・パスワード認証
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // 後で有効化可能
    },

    // セッション設定
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7日間
      updateAge: 60 * 60 * 24, // 1日
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5分
      },
    },

    // ソーシャルログインプロバイダー（オプション）
    socialProviders: {
      google: {
        clientId: configService.get<string>('GOOGLE_CLIENT_ID', ''),
        clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
        enabled: !!configService.get<string>('GOOGLE_CLIENT_ID'),
      },
      github: {
        clientId: configService.get<string>('GITHUB_CLIENT_ID', ''),
        clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', ''),
        enabled: !!configService.get<string>('GITHUB_CLIENT_ID'),
      },
    },

    // プラグイン設定（必要に応じて追加）
    plugins: [],

    // セキュリティ設定
    advanced: {
      generateId: false, // Drizzleのdefault random UUIDを使用
      cookiePrefix: 'lumina',
      useSecureCookies: configService.get<string>('NODE_ENV') === 'production',
      crossSubDomainCookies: {
        enabled: false,
      },
    },

    // ベースURL
    baseURL: baseUrl,
    basePath: basePath,

    // トラストプロキシ（リバースプロキシ使用時）
    trustedOrigins: [
      configService.get<string>('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
      ...configService.get<string>('ALLOWED_ORIGINS', '').split(',').filter(Boolean),
    ],
  });
}
