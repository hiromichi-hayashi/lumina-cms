import { Suspense } from 'react';
import { DashboardStats } from './components/DashboardStats';
import { RecentPosts } from './components/RecentPosts';
import { QuickActions } from './components/QuickActions';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * ダッシュボードページ
 *
 * 認証必須 - middlewareで保護
 * 管理画面のメインページ
 *
 * 表示内容:
 * - 統計情報カード（総記事数、総閲覧数、執筆者数）
 * - 最近の記事一覧（最新5件）
 * - クイックアクション（新規記事作成）
 */
const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* ヘッダーセクション */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">概要</h1>
          <p className="text-muted-foreground">コンテンツの統計情報</p>
        </div>
        <QuickActions />
      </div>

      {/* 統計情報カード */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* 最近の記事 */}
      <Suspense fallback={<RecentPostsSkeleton />}>
        <RecentPosts />
      </Suspense>
    </div>
  );
};

export default DashboardPage;

/**
 * 統計情報カードのスケルトンローダー
 */
const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
};

/**
 * 最近の記事のスケルトンローダー
 */
const RecentPostsSkeleton = () => {
  return <Skeleton className="h-96" />;
};
