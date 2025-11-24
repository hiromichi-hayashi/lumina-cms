/**
 * 認証ガードコンポーネント
 *
 * 認証済みユーザーのみアクセス可能なページで使用
 * 未認証の場合はログイン画面へリダイレクト
 * ロール指定時は権限チェックも実施
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/lib/auth/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }

    // ロールチェック
    // TODO: Better Authのバックエンド実装でroleを含める必要があります
    if (!loading && user && requiredRole) {
      const userWithRole = user as { role?: UserRole };
      if (userWithRole.role !== requiredRole) {
        router.push('/dashboard'); // 権限不足時のリダイレクト
      }
    }
  }, [user, loading, requiredRole, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="sr-only">読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // リダイレクト中
  }

  // ロールチェック
  if (requiredRole) {
    const userWithRole = user as { role?: UserRole };
    if (userWithRole.role !== requiredRole) {
      return null; // リダイレクト中
    }
  }

  return <>{children}</>;
}
