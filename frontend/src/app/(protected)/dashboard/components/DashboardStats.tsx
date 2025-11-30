'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Users } from 'lucide-react';
import { fetchDashboardStats } from '@/lib/api/dashboard';
import type { DashboardStats as StatsType } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * ダッシュボード統計情報カード
 *
 * 総記事数、総閲覧数、執筆者数の3つの統計カードを表示
 */
export const DashboardStats = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardStats(controller.signal);
        if (!controller.signal.aborted) {
          setStats(data);
        }
      } catch (err) {
        // Ignore abort errors to prevent state updates after unmount
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : '統計情報の取得に失敗しました');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return <div className="text-destructive">{error || 'データが見つかりません'}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 総記事数カード */}
      <Card data-testid="stat-card-posts">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">総記事数</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{stats.totalPosts}</div>
          <p className="text-sm text-muted-foreground">
            公開: {stats.publishedPosts} / 下書き: {stats.draftPosts}
          </p>
        </CardContent>
      </Card>

      {/* 総閲覧数カード */}
      <Card data-testid="stat-card-views">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">総閲覧数</CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">
            先月比 {stats.viewsGrowth > 0 ? '+' : ''}
            {stats.viewsGrowth.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* 執筆者数カード */}
      <Card data-testid="stat-card-authors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">執筆者</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{stats.totalAuthors}</div>
          <p className="text-sm text-muted-foreground">アクティブなライター</p>
        </CardContent>
      </Card>
    </div>
  );
};
