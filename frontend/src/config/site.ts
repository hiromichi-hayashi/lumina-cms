/**
 * サイト設定
 *
 * メタデータやSEO関連の設定を一元管理
 */

import { APP_NAME, APP_DESCRIPTION } from './constants';

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',

  /**
   * メタデータ
   */
  metadata: {
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    keywords: ['CMS', 'Content Management System', 'Blog', 'Next.js', 'TypeScript'],
  },

  /**
   * SNSリンク
   */
  links: {
    github: 'https://github.com/yourusername/lumina-cms',
    twitter: 'https://twitter.com/luminacms',
  },
} as const;
