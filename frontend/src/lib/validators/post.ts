/**
 * ブログ記事関連バリデーション
 *
 * Zodスキーマを使用した記事フォームのバリデーション
 */

import { z } from 'zod';

/**
 * 記事作成・編集フォームスキーマ
 */
export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(200, 'タイトルは200文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグを入力してください')
    .max(200, 'スラッグは200文字以内で入力してください')
    .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます'),
  content: z.string().min(1, '本文を入力してください'),
  excerpt: z.string().max(500, '抜粋は500文字以内で入力してください').optional(),
  categoryId: z.string().min(1, 'カテゴリを選択してください'),
  labelIds: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.date().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

/**
 * カテゴリフォームスキーマ
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名を入力してください')
    .max(100, 'カテゴリ名は100文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグを入力してください')
    .max(100, 'スラッグは100文字以内で入力してください')
    .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/**
 * ラベルフォームスキーマ
 */
export const labelSchema = z.object({
  name: z
    .string()
    .min(1, 'ラベル名を入力してください')
    .max(100, 'ラベル名は100文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグを入力してください')
    .max(100, 'スラッグは100文字以内で入力してください')
    .regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '有効なカラーコードを入力してください')
    .optional(),
});

export type LabelInput = z.infer<typeof labelSchema>;
