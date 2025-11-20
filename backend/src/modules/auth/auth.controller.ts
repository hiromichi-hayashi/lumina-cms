import { All, Controller, Req, Res, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

/**
 * Better Auth統合コントローラー
 *
 * すべての認証リクエスト (/api/auth/*) をBetter Authのハンドラーに委譲します。
 * カスタムビジネスロジック（アカウントロック、ログイン試行管理等）は
 * better-auth.config.tsのフック機能で実装されています。
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject('BETTER_AUTH') private readonly auth: any) {
    this.logger.log('Better Auth handler initialized');
  }

  /**
   * すべての認証リクエストをBetter Authに転送
   *
   * Better Authがサポートするエンドポイント:
   * - POST /api/auth/sign-in/email - メール+パスワードでサインイン
   * - POST /api/auth/sign-up/email - メール+パスワードで新規登録
   * - POST /api/auth/sign-out - サインアウト
   * - GET  /api/auth/session - セッション取得
   * - POST /api/auth/callback/google - Google OAuthコールバック
   * - POST /api/auth/callback/github - GitHub OAuthコールバック
   * - その他Better Authが提供するすべてのエンドポイント
   */
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.auth.handler(req, res);
  }
}
