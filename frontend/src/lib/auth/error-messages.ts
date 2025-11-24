/**
 * Better Auth エラーメッセージの日本語マッピング
 *
 * Better Authはデフォルトで英語のエラーメッセージを返すため、
 * エラーコードを日本語メッセージにマッピングします。
 *
 * 参考: https://www.better-auth.com/docs/concepts/error-handling
 */

import { authClient } from './client';

/**
 * エラーコードと日本語メッセージのマッピング型
 */
type ErrorMessages = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;

/**
 * Better Authエラーコードの日本語メッセージマップ
 *
 * Better Auth公式のBASE_ERROR_CODESに存在するエラーコードのみを定義
 * @see node_modules/@better-auth/core/src/error/codes.ts
 */
export const errorMessages: ErrorMessages = {
  // 認証エラー
  INVALID_EMAIL_OR_PASSWORD: 'メールアドレスまたはパスワードが正しくありません',
  INVALID_PASSWORD: 'パスワードが正しくありません',
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  CREDENTIAL_ACCOUNT_NOT_FOUND: '認証情報が見つかりません',

  // ユーザー管理エラー
  USER_ALREADY_EXISTS: 'このメールアドレスは既に登録されています',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    'このメールアドレスは既に使用されています。別のメールアドレスをお試しください',
  USER_NOT_FOUND: 'ユーザーが見つかりません',
  USER_EMAIL_NOT_FOUND: 'このメールアドレスに紐づくユーザーが見つかりません',
  USER_ALREADY_HAS_PASSWORD: 'このユーザーは既にパスワードが設定されています',
  FAILED_TO_CREATE_USER: 'ユーザーの作成に失敗しました',
  FAILED_TO_UPDATE_USER: 'ユーザー情報の更新に失敗しました',
  EMAIL_CAN_NOT_BE_UPDATED: 'メールアドレスは変更できません',

  // セッションエラー
  SESSION_EXPIRED: 'セッションの有効期限が切れました。再度ログインしてください',
  FAILED_TO_CREATE_SESSION: 'セッションの作成に失敗しました',
  FAILED_TO_GET_SESSION: 'セッション情報の取得に失敗しました',

  // アカウント管理エラー
  ACCOUNT_NOT_FOUND: 'アカウントが見つかりません',
  FAILED_TO_UNLINK_LAST_ACCOUNT: '最後のアカウントのリンク解除はできません',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'このソーシャルアカウントは既に別のユーザーにリンクされています',

  // プロバイダーエラー
  PROVIDER_NOT_FOUND: '認証プロバイダーが見つかりません',
  FAILED_TO_GET_USER_INFO: 'ユーザー情報の取得に失敗しました',
  ID_TOKEN_NOT_SUPPORTED: 'IDトークンはサポートされていません',

  // トークンエラー
  INVALID_TOKEN: '無効なトークンです',

  // メール検証エラー
  EMAIL_NOT_VERIFIED: 'メールアドレスが未確認です。確認メールをご確認ください',

  // パスワードバリデーションエラー
  PASSWORD_TOO_SHORT: 'パスワードは8文字以上で入力してください',
  PASSWORD_TOO_LONG: 'パスワードが長すぎます（最大128文字）',
};

/**
 * エラーコードから日本語メッセージを取得
 *
 * @param code - Better Authエラーコード
 * @param fallbackMessage - コードが見つからない場合のデフォルトメッセージ
 * @returns 日本語エラーメッセージ
 *
 * @example
 * ```ts
 * const message = getErrorMessage('INVALID_EMAIL_OR_PASSWORD');
 * // => 'メールアドレスまたはパスワードが正しくありません'
 * ```
 */
export function getErrorMessage(
  code?: string,
  fallbackMessage: string = 'エラーが発生しました',
): string {
  if (!code) {
    return fallbackMessage;
  }

  // エラーコードが登録されている場合は日本語メッセージを返す
  if (code in errorMessages) {
    return errorMessages[code as keyof typeof errorMessages] || fallbackMessage;
  }

  // 登録されていないエラーコードの場合はフォールバックメッセージを返す
  return fallbackMessage;
}
