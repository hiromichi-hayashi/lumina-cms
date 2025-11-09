import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DrizzleService } from '../../db/drizzle.service';
import { createBetterAuthConfig } from './better-auth.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  public readonly auth: ReturnType<typeof createBetterAuthConfig>;

  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly configService: ConfigService,
  ) {
    // Better Auth設定を初期化
    this.auth = createBetterAuthConfig(drizzleService, configService);
    this.logger.log('Better Auth initialized successfully');
  }

  /**
   * Better Authのハンドラーを取得
   */
  getHandler() {
    return this.auth.handler;
  }

  /**
   * セッションからユーザー情報を取得
   */
  async getSession(request: Request) {
    try {
      const session = await this.auth.api.getSession({
        headers: request.headers,
      });
      return session;
    } catch (error) {
      this.logger.error('Failed to get session', error);
      return null;
    }
  }

  /**
   * ユーザーをIDで取得
   * Better AuthのAPIには getUser() が存在しないため、Drizzle ORMで直接クエリ
   */
  async getUserById(userId: string) {
    try {
      const user = await this.drizzleService.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });
      return user;
    } catch (error) {
      this.logger.error(`Failed to get user ${userId}`, error);
      return null;
    }
  }

  /**
   * セッションを無効化（ログアウト）
   */
  async invalidateSession(sessionToken: string) {
    try {
      await this.auth.api.signOut({
        headers: {
          cookie: `lumina.session_token=${sessionToken}`,
        },
      });
      return true;
    } catch (error) {
      this.logger.error('Failed to invalidate session', error);
      return false;
    }
  }
}
