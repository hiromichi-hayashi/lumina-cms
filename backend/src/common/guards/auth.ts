import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import type { betterAuth } from 'better-auth';

/**
 * Better Auth統合 認証ガード
 *
 * Better AuthのセッションAPIを使用してリクエストを認証します。
 * Cookie (lumina.session_token) からセッション情報を取得し、
 * 有効なセッションの場合のみリクエストを許可します。
 *
 * 使用例:
 * ```typescript
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   // req.user にBetter Authのユーザー情報が含まれます
 *   return req.user;
 * }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(@Inject('BETTER_AUTH') private readonly auth: ReturnType<typeof betterAuth>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      // Better AuthのセッションAPIを使用してセッションを取得
      // Better Authは自動的にCookieからセッショントークンを読み取ります
      // IncomingHttpHeadersをHeaders形式に変換
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, Array.isArray(value) ? value[0] : value);
        }
      });

      const session = await this.auth.api.getSession({
        headers,
      });

      if (!session || !session.user) {
        this.logger.debug('No valid session found');
        throw new UnauthorizedException('認証が必要です');
      }

      // リクエストオブジェクトにユーザー情報を追加
      // Better Authのユーザーオブジェクトをそのまま使用
      // 型定義は /src/types/express.d.ts を参照
      request.user = session.user;
      request.session = session.session;

      this.logger.debug(`User ${session.user.id} authenticated via Better Auth`);

      return true;
    } catch (error) {
      this.logger.debug('Authentication failed', error);
      throw new UnauthorizedException('認証が必要です');
    }
  }
}
