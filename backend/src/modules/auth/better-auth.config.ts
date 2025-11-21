import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { customSession } from 'better-auth/plugins';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../../db/drizzle.service';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { Logger } from '@nestjs/common';
import { loginAttemptsPlugin } from './plugins/login-attempts.plugin';
import { AuthConfig } from '../../config/auth';
import { ServerConfig } from '../../config/server';
import { SecurityConfig } from '../../config/security';

const logger = new Logger('BetterAuthConfig');

/**
 * Better Auth設定を作成
 *
 * カスタムビジネスロジック（アカウントロック、ログイン試行管理等）は
 * Better Authのフック機能で実装しています。
 */
export function createBetterAuthConfig(
  drizzleService: DrizzleService,
  configService: ConfigService,
) {
  // Namespace経由でconfig設定を取得
  const authConfig = configService.get<AuthConfig>('auth');
  const serverConfig = configService.get<ServerConfig>('server');
  const securityConfig = configService.get<SecurityConfig>('security');

  if (!authConfig?.betterAuthSecret) {
    throw new Error('BETTER_AUTH_SECRET environment variable is required');
  }

  // Better Auth設定オプション（型推論用に分離）
  const options = {
    database: drizzleAdapter(drizzleService.db, {
      provider: 'pg',
      schema: {
        // better-authのテーブル名をカスタマイズ
        user: 'm_users',
        session: 's_sessions',
        account: 's_accounts',
        verification: 's_verification_tokens',
      },
    }),

    // ユーザースキーマ拡張
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: true,
          defaultValue: 'member',
          input: false, // ユーザーがサインアップ時にroleを設定できないようにする
        },
        isActive: {
          type: 'boolean',
          required: true,
          defaultValue: true,
          input: false,
        },
        loginAttempts: {
          type: 'number',
          required: true,
          defaultValue: 0,
          input: false,
        },
        lockedUntil: {
          type: 'date',
          required: false,
          input: false,
        },
        lastLoginAt: {
          type: 'date',
          required: false,
          input: false,
        },
      },
    },

    // メール・パスワード認証
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // 後で有効化可能
    },

    session: {
      expiresIn: securityConfig.session.expiresInSeconds,
      updateAge: securityConfig.session.updateAgeSeconds,
      cookieCache: {
        enabled: true,
        maxAge: securityConfig.session.cookieCacheMaxAgeSeconds,
      },
    },

    // ソーシャルログインプロバイダー（オプション）
    socialProviders: {
      google: {
        clientId: authConfig.google.clientId,
        clientSecret: authConfig.google.clientSecret,
        enabled: authConfig.google.enabled,
      },
      github: {
        clientId: authConfig.github.clientId,
        clientSecret: authConfig.github.clientSecret,
        enabled: authConfig.github.enabled,
      },
    },

    // プラグイン設定
    plugins: [
      // ログイン試行回数管理プラグイン
      loginAttemptsPlugin(drizzleService, configService),
    ],

    // カスタムフック - ビジネスロジックの実装
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // サインイン前: アカウントロックチェック
        if (ctx.path !== '/sign-in/email') {
          return;
        }

        const { email } = ctx.body as { email: string };

        const [user] = await drizzleService.db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          // ユーザーが存在しない場合は次の処理へ
          return;
        }

        // アカウント有効性チェック
        if (!user.isActive) {
          throw new APIError('UNAUTHORIZED', {
            message: 'このアカウントは無効です',
          });
        }

        // アカウントロックチェック
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const lockMessage = `一定回数以上ログインに失敗したためロックされています（解除: ${user.lockedUntil.toLocaleString('ja-JP')})`;
          logger.warn(`Login attempt for locked account: ${user.id}`);
          throw new APIError('UNAUTHORIZED', {
            message: lockMessage,
          });
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        // サインイン成功後: ログイン成功処理
        if (ctx.path !== '/sign-in/email') {
          return;
        }

        const returned = ctx.context.returned as any;
        const user = returned?.user;

        if (user?.id) {
          // ログイン試行回数リセット、最終ログイン時刻更新
          await drizzleService.db
            .update(users)
            .set({
              loginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

          logger.log(`User ${user.id} logged in successfully`);
        }
      }),
    },

    // データベースフック - エラー時のログイン試行回数管理
    databaseHooks: {
      user: {
        update: {
          before: async (user) => {
            // Better Authがサインイン失敗時にユーザーを更新する場合のフック
            // ここでは特に処理しない
            return { data: user };
          },
        },
      },
    },

    // APIエラーハンドリング
    onAPIError: {
      throw: false,
      onError: (error: any) => {
        // エラーログ
        logger.error(`Better Auth API Error: ${error?.message || 'Unknown error'}`);
      },
    },

    // セキュリティ設定
    advanced: {
      generateId: false, // Drizzleのdefault random UUIDを使用
      cookiePrefix: 'lumina',
      useSecureCookies: configService.get<string>('app.nodeEnv') === 'production',
      crossSubDomainCookies: {
        enabled: false,
      },
    },

    // ベースURL
    baseURL: authConfig.betterAuthUrl,
    basePath: authConfig.betterAuthBasePath,
    secret: authConfig.betterAuthSecret,

    // トラストプロキシ（リバースプロキシ使用時）
    trustedOrigins: [serverConfig.frontendUrl, ...serverConfig.cors.allowedOrigins],
  } satisfies BetterAuthOptions;

  // betterAuthインスタンス作成（customSessionプラグインを追加）
  return betterAuth({
    ...options,
    plugins: [
      ...(options.plugins ?? []),
      // カスタムセッション: roleフィールドをセッションレスポンスに含める
      customSession(async ({ user, session }) => {
        return {
          user: {
            ...user,
            role: user.role as 'admin' | 'editor' | 'member',
          },
          session,
        };
      }, options),
    ],
  });
}
