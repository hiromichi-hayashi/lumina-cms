/**
 * アプリケーション定数
 *
 * アプリ全体で使用される定数を一元管理
 */

export const APP_NAME = 'Lumina CMS' as const;
export const APP_DESCRIPTION = 'Enterprise Content Management System' as const;
export const APP_VERSION = '1.0.0' as const;

/**
 * API関連定数
 */
export const API = {
  VERSION: 'v1',
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30秒
} as const;

/**
 * ページネーション関連定数
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * ファイルアップロード関連定数
 */
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

/**
 * ローカルストレージキー
 */
export const STORAGE_KEYS = {
  THEME: 'lumina-cms-theme',
  LANGUAGE: 'lumina-cms-language',
} as const;
