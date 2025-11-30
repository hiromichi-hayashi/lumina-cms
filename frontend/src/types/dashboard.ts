/**
 * ダッシュボード関連の型定義
 */

/**
 * ダッシュボード統計情報
 */
export type DashboardStats = {
  /** 総記事数 */
  totalPosts: number;
  /** 公開記事数 */
  publishedPosts: number;
  /** 下書き記事数 */
  draftPosts: number;
  /** 総閲覧数 */
  totalViews: number;
  /** 閲覧数の先月比増減率 (%) */
  viewsGrowth: number;
  /** 執筆者数（アクティブなライター） */
  totalAuthors: number;
};

/**
 * 最近の記事
 */
export type RecentPost = {
  /** 記事ID */
  id: string;
  /** 記事タイトル */
  title: string;
  /** 公開状態 */
  published: boolean;
  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
  /** 執筆者情報 */
  author: {
    /** 執筆者ID */
    id: string;
    /** 執筆者名 */
    name: string;
  };
};
