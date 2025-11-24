import { registerAs } from '@nestjs/config';

/**
 * レート制限設定インターフェース
 */
export interface ThrottleConfig {
  /**
   * タイムウィンドウ（ミリ秒）
   * デフォルト: 60000 (60秒)
   */
  ttl: number;

  /**
   * タイムウィンドウ内の最大リクエスト数
   * デフォルト: 100
   */
  limit: number;
}

/**
 * レート制限設定
 * API呼び出しの頻度制限を設定
 */
export default registerAs('throttle', (): ThrottleConfig => {
  return {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) * 1000 || 60000, // 秒→ミリ秒に変換
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  };
});
