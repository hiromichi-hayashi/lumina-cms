import type { DashboardStats, RecentPost } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * ダッシュボード統計情報を取得
 *
 * @param signal オプショナルなAbortSignal（fetch中止用）
 * @returns ダッシュボード統計情報
 * @throws APIエラー時にエラーをスロー
 */
export async function fetchDashboardStats(signal?: AbortSignal): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${res.statusText}`);
  }

  return res.json();
}

/**
 * 最近の記事を取得
 *
 * @param limit 取得件数（デフォルト: 5）
 * @returns 最近の記事一覧
 * @throws APIエラー時にエラーをスロー
 */
export async function fetchRecentPosts(limit: number = 5): Promise<RecentPost[]> {
  const res = await fetch(`${API_BASE_URL}/admin/posts?sort=recent&limit=${limit}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recent posts: ${res.statusText}`);
  }

  return res.json();
}
