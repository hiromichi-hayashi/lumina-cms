/**
 * 認証関連バリデーション
 *
 * Zodスキーマを使用した認証フォームのバリデーション
 */

import { z } from 'zod';

/**
 * ログインフォームスキーマ
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(8, 'パスワードは8文字以上で入力してください'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * 会員登録フォームスキーマ
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, '名前を入力してください')
      .max(100, '名前は100文字以内で入力してください'),
    email: z
      .string()
      .min(1, 'メールアドレスを入力してください')
      .email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは英大文字、英小文字、数字を含む必要があります',
      ),
    passwordConfirm: z.string().min(1, 'パスワード（確認）を入力してください'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * パスワードリセットフォームスキーマ
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
