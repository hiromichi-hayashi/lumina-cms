import { All, Controller, Req, Res, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import type { betterAuth } from 'better-auth';

/**
 * Better Auth統合コントローラー
 *
 * すべての認証リクエスト (/api/auth/*) をBetter Authのハンドラーに委譲します。
 * カスタムビジネスロジック（アカウントロック、ログイン試行管理等）は
 * factory.tsのフック機能で実装されています。
 *
 * NOTE: NestJSの@Controller('auth')とグローバルプレフィックス'/api'により、
 * このコントローラーは /api/auth/* でアクセス可能になります。
 * Better AuthのbaseURLは http://localhost:3001 でbasePathは /api/auth です。
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly handler: ReturnType<typeof toNodeHandler>;

  constructor(@Inject('BETTER_AUTH') private readonly auth: ReturnType<typeof betterAuth>) {
    this.logger.log('Better Auth handler initialized');
    // Better AuthのtoNodeHandlerを使用してExpressハンドラーを作成
    this.handler = toNodeHandler(this.auth);
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
   *
   * NOTE: toNodeHandler()を使用してExpressミドルウェアとして統合
   * これにより、Better Authが適切にリクエスト/レスポンスを処理できます
   */
  @All('*')
  async handleAuth(@Req() req: Request, @Res({ passthrough: false }) res: Response) {
    // toNodeHandlerがレスポンス処理を完全に制御するため、passthroughをfalseに設定
    // これによりNestJSはレスポンス処理に介入しません
    await this.handler(req, res);
    // 明示的にreturnしない（voidを返す）ことで、NestJSにレスポンスが完了したことを伝える
  }
}
