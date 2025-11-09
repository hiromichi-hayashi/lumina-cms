import { All, Controller, Req, Res, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Better Authの全てのエンドポイントをハンドル
   *
   * Better Authは以下のエンドポイントを自動的に生成します:
   * - POST /auth/sign-in/email - メール/パスワードログイン
   * - POST /auth/sign-up/email - メール/パスワード登録
   * - POST /auth/sign-out - ログアウト
   * - GET /auth/session - セッション取得
   * - POST /auth/two-factor/enable - 2FA有効化
   * - POST /auth/two-factor/verify - 2FA検証
   * - POST /auth/sign-in/social - ソーシャルログイン
   *
   * その他の詳細は Better Auth ドキュメントを参照:
   * https://www.better-auth.com/docs/concepts/authentication
   */
  @All('*')
  @ApiOperation({
    summary: 'Better Auth エンドポイント',
    description: '認証関連の全てのエンドポイントを処理します',
  })
  @ApiResponse({
    status: 200,
    description: 'リクエストが正常に処理されました',
  })
  @ApiResponse({
    status: 401,
    description: '認証に失敗しました',
  })
  @ApiResponse({
    status: 500,
    description: 'サーバーエラー',
  })
  async handleAuth(@Req() request: Request, @Res() response: Response) {
    try {
      // Better Authのハンドラーを使用してリクエストを処理
      const handler = this.authService.getHandler();

      // Fetch API Request形式に変換
      const url = new URL(request.originalUrl, `${request.protocol}://${request.get('host')}`);

      const fetchRequest = new Request(url, {
        method: request.method,
        headers: request.headers as HeadersInit,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : JSON.stringify(request.body),
      });

      // Better Authでリクエストを処理
      const fetchResponse = await handler(fetchRequest);

      // レスポンスヘッダーをコピー
      fetchResponse.headers.forEach((value, key) => {
        response.setHeader(key, value);
      });

      // ステータスコードを設定
      response.status(fetchResponse.status);

      // レスポンスボディを送信
      const responseBody = await fetchResponse.text();
      response.send(responseBody);
    } catch (error) {
      this.logger.error('Auth handler error', error);
      response.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while processing the authentication request',
      });
    }
  }
}
