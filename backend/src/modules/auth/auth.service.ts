import { Injectable, Logger } from '@nestjs/common';
import { SessionRepository } from './repositories/session.repository';
import { VerificationTokenRepository } from './repositories/verification-token.repository';

/**
 * 認証ヘルパーサービス
 *
 * Better Authが認証処理を担当し、このサービスはユーティリティ機能のみを提供します:
 * - セッションのハウスキーピング（期限切れセッションの削除）
 * - 検証トークンのクリーンアップ
 * - その他のメンテナンスタスク
 *
 * NOTE: Cronジョブは@nestjs/scheduleパッケージをインストール後に有効化できます
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly verificationTokenRepository: VerificationTokenRepository,
  ) {
    this.logger.log('AuthService initialized (Helper mode with Better Auth)');
  }

  /**
   * 期限切れセッション削除（ハウスキーピング）
   * 手動実行またはCronジョブとして設定可能
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const deletedCount = await this.sessionRepository.deleteExpired();

      if (deletedCount > 0) {
        this.logger.log(`🧹 Cleaned up ${deletedCount} expired sessions`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', error);
      throw error;
    }
  }

  /**
   * 期限切れ検証トークン削除
   * 手動実行またはCronジョブとして設定可能
   */
  async cleanupExpiredVerificationTokens(): Promise<number> {
    try {
      const deletedCount = await this.verificationTokenRepository.deleteExpired();

      if (deletedCount > 0) {
        this.logger.log(`🧹 Cleaned up ${deletedCount} expired verification tokens`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error('Failed to cleanup expired verification tokens', error);
      throw error;
    }
  }

  /**
   * 統計情報取得
   * アクティブセッション数を取得
   */
  async getActiveSessionsCount(): Promise<number> {
    try {
      return await this.sessionRepository.countActive();
    } catch (error) {
      this.logger.error('Failed to get active sessions count', error);
      return 0;
    }
  }
}
