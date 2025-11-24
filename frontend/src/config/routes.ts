/**
 * ルート定義
 *
 * アプリ全体で使用するルートパスを一元管理
 */

/**
 * 公開ページルート（認証不要）
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

/**
 * 認証必須ページルート
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',

  // ブログ記事管理
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts/new',
    EDIT: (id: string) => `/posts/${id}/edit`,
    DETAIL: (id: string) => `/posts/${id}`,
  },

  // カテゴリ管理
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories/new',
    EDIT: (id: string) => `/categories/${id}/edit`,
  },

  // ラベル管理
  LABELS: {
    LIST: '/labels',
    CREATE: '/labels/new',
    EDIT: (id: string) => `/labels/${id}/edit`,
  },

  // ユーザー管理
  USERS: {
    LIST: '/users',
    CREATE: '/users/new',
    EDIT: (id: string) => `/users/${id}/edit`,
    DETAIL: (id: string) => `/users/${id}`,
  },

  // お問い合わせ管理
  CONTACTS: {
    LIST: '/contacts',
    DETAIL: (id: string) => `/contacts/${id}`,
  },

  // 設定
  SETTINGS: {
    PROFILE: '/settings/profile',
    ACCOUNT: '/settings/account',
    SECURITY: '/settings/security',
  },
} as const;

/**
 * APIルート
 */
export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
  },
} as const;
