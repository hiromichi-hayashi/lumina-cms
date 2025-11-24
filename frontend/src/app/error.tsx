'use client';

/**
 * グローバルエラーバウンダリ
 *
 * アプリケーション全体で発生したエラーをキャッチして表示
 * Next.js 15 App Routerの推奨ファイル
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログを記録（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">エラーが発生しました</CardTitle>
          <CardDescription>申し訳ございません。予期しないエラーが発生しました。</CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-mono text-red-800">{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs text-red-600">Error ID: {error.digest}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="default">
            再試行
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            ホームに戻る
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
