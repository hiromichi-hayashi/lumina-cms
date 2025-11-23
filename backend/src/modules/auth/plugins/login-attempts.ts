import { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../../../db/drizzle.service';
import { SecurityConfig } from '../../../config/security';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * ログイン試行回数管理プラグイン
 *
 * Better Authのafterフックを使用してログイン失敗を検出し、
 * ログイン試行回数を管理します。
 *
 * 機能:
 * - ログイン失敗時に試行回数をインクリメント
 * - 5回失敗でアカウントを30分間ロック
 * - ログイン成功時にリセット (already implemented in factory.ts after hook)
 *
 * 制限事項:
 * - Better Authのパスワード検証は内部で行われるため、
 *   afterフックでエラーレスポンスをチェックして失敗を検出します
 * - この方法は完璧ではありませんが、Better Authの制約内での最善の解決策です
 */
export const loginAttemptsPlugin = (
  drizzleService: DrizzleService,
  configService: ConfigService,
): BetterAuthPlugin => {
  const securityConfig = configService.get<SecurityConfig>('security');

  return {
    id: 'login-attempts',
    hooks: {
      after: [
        {
          matcher: (context) => {
            // sign-in/emailエンドポイントのみ対象
            return context.path === '/sign-in/email';
          },
          handler: createAuthMiddleware(async (ctx) => {
            try {
              // レスポンスを確認してログイン失敗を検出
              const response = ctx.context.returned as any;

              // ログイン失敗の場合（エラーレスポンス）
              if (response && response.error) {
                const body = ctx.body as { email?: string };
                const email = body?.email;

                if (!email) {
                  return; // メールアドレスがない場合はスキップ
                }

                // ユーザー検索
                const [user] = await drizzleService.db
                  .select()
                  .from(users)
                  .where(eq(users.email, email))
                  .limit(1);

                if (!user) {
                  return; // ユーザーが存在しない場合はスキップ
                }

                // アカウントロック中の場合は試行回数をインクリメントしない
                if (user.lockedUntil && user.lockedUntil > new Date()) {
                  return;
                }

                // 試行回数をインクリメント
                const newAttempts = (user.loginAttempts ?? 0) + 1;

                // 最大試行回数を超えた場合ロック
                if (newAttempts >= securityConfig.accountLock.maxLoginAttempts) {
                  const lockDuration = securityConfig.accountLock.lockDurationMinutes * 60 * 1000;
                  const lockedUntil = new Date(Date.now() + lockDuration);

                  await drizzleService.db
                    .update(users)
                    .set({
                      loginAttempts: newAttempts,
                      lockedUntil,
                      updatedAt: new Date(),
                    })
                    .where(eq(users.id, user.id));

                  console.log(
                    `[LoginAttempts] User ${email} locked until ${lockedUntil.toISOString()}`,
                  );
                } else {
                  // 試行回数のみ更新
                  await drizzleService.db
                    .update(users)
                    .set({
                      loginAttempts: newAttempts,
                      updatedAt: new Date(),
                    })
                    .where(eq(users.id, user.id));

                  console.log(
                    `[LoginAttempts] User ${email} login attempts: ${newAttempts}/${securityConfig.accountLock.maxLoginAttempts}`,
                  );
                }
              }

              // レスポンスはそのまま返す
              return;
            } catch (error) {
              // エラーが発生してもログイン処理自体には影響させない
              console.error('[LoginAttempts] Error tracking login attempts:', error);
              return;
            }
          }),
        },
      ],
    },
  };
};
