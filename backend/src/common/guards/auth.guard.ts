import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

/**
 * 認証ガード
 *
 * リクエストにセッションが含まれているかをチェックし、
 * 認証されていない場合はUnauthorizedExceptionをスローします。
 *
 * 使用例:
 * ```typescript
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // セッションを取得
      const session = await this.authService.getSession(request);

      if (!session || !session.user) {
        throw new UnauthorizedException('認証が必要です');
      }

      // リクエストオブジェクトにユーザー情報を追加
      request.user = session.user;
      request.session = session.session;

      return true;
    } catch (error) {
      this.logger.debug('Authentication failed', error);
      throw new UnauthorizedException('認証が必要です');
    }
  }
}
