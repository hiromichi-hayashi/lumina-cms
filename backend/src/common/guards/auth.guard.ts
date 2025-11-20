import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';

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

  constructor(@Inject('BETTER_AUTH') private readonly auth: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      // Better AuthのセッションAPIを使用してセッションを取得
      // Better Authは自動的にCookieからセッショントークンを読み取ります
      const session = await this.auth.api.getSession({
        headers: request.headers,
      });

      if (!session || !session.user) {
        this.logger.debug('No valid session found');
        throw new UnauthorizedException('認証が必要です');
      }

      // リクエストオブジェクトにユーザー情報を追加
      // Better Authのユーザーオブジェクトをそのまま使用
      (request as any).user = session.user;
      (request as any).session = session.session;

      this.logger.debug(`User ${session.user.id} authenticated via Better Auth`);

      return true;
    } catch (error) {
      this.logger.debug('Authentication failed', error);
      throw new UnauthorizedException('認証が必要です');
    }
  }
}
