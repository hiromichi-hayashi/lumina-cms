/**
 * ナビゲーション設定
 *
 * サイドバーやヘッダーのナビゲーションメニュー設定
 */

import { PROTECTED_ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

/**
 * 管理画面サイドバーナビゲーション
 */
export const adminNavigation: NavItem[] = [
  {
    label: 'ダッシュボード',
    href: PROTECTED_ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'コンテンツ管理',
    href: '#',
    icon: 'content',
    children: [
      {
        label: 'ブログ記事',
        href: PROTECTED_ROUTES.POSTS.LIST,
      },
      {
        label: 'カテゴリ',
        href: PROTECTED_ROUTES.CATEGORIES.LIST,
      },
      {
        label: 'ラベル',
        href: PROTECTED_ROUTES.LABELS.LIST,
      },
    ],
  },
  {
    label: 'ユーザー管理',
    href: PROTECTED_ROUTES.USERS.LIST,
    icon: 'users',
  },
  {
    label: 'お問い合わせ',
    href: PROTECTED_ROUTES.CONTACTS.LIST,
    icon: 'mail',
  },
  {
    label: '設定',
    href: PROTECTED_ROUTES.SETTINGS.PROFILE,
    icon: 'settings',
  },
];

/**
 * 公開サイトヘッダーナビゲーション
 */
export const publicNavigation: NavItem[] = [
  {
    label: 'ホーム',
    href: '/',
  },
  {
    label: 'ブログ',
    href: '/blog',
  },
  {
    label: 'お問い合わせ',
    href: '/contact',
  },
];
