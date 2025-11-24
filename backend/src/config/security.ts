import { registerAs } from '@nestjs/config';

/**
 * パスワードポリシー設定
 */
export interface PasswordPolicyConfig {
  /**
   * パスワード最小文字数
   * デフォルト: 8
   */
  minLength: number;

  /**
   * bcryptのsaltラウンド数
   * デフォルト: 10
   */
  bcryptRounds: number;
}

/**
 * アカウントロック設定
 */
export interface AccountLockConfig {
  /**
   * 最大ログイン試行回数
   * デフォルト: 5
   */
  maxLoginAttempts: number;

  /**
   * アカウントロック時間（分）
   * デフォルト: 30
   */
  lockDurationMinutes: number;
}

/**
 * セッション設定
 */
export interface SessionConfig {
  /**
   * セッション有効期限（秒）
   * デフォルト: 172800 (2日)
   */
  expiresInSeconds: number;

  /**
   * セッション更新間隔（秒）
   * デフォルト: 86400 (1日)
   */
  updateAgeSeconds: number;

  /**
   * Cookieキャッシュ最大有効期限（秒）
   * デフォルト: 300 (5分)
   */
  cookieCacheMaxAgeSeconds: number;
}

/**
 * セキュリティ設定インターフェース
 */
export interface SecurityConfig {
  password: PasswordPolicyConfig;
  accountLock: AccountLockConfig;
  session: SessionConfig;
}

/**
 * セキュリティ設定
 * パスワードポリシー、アカウントロック、セッション設定を一元管理
 *
 * NOTE: これらの設定は環境変数ではなく定数として管理します。
 * 理由: ビジネスロジックに関わる設定であり、環境ごとに変更する必要がないため。
 */
export default registerAs('security', (): SecurityConfig => {
  return {
    // パスワードポリシー
    password: {
      minLength: 8,
      bcryptRounds: 10,
    },

    // アカウントロック
    accountLock: {
      maxLoginAttempts: 5,
      lockDurationMinutes: 3,
    },

    // セッション
    session: {
      expiresInSeconds: 172800, // 2日
      updateAgeSeconds: 86400, // 1日
      cookieCacheMaxAgeSeconds: 300, // 5分
    },
  };
});
