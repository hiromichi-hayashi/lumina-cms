/**
 * ログインページ
 *
 * Lumina CMS管理画面へのログイン
 */

import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'ログイン | Lumina CMS',
  description: 'Lumina CMS管理画面へのログイン',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Lumina CMS</h1>
          <p className="mt-2 text-sm text-muted-foreground">管理画面にログイン</p>
        </div>

        {/* ログインフォーム */}
        <LoginForm />

        {/* フッター */}
        <p className="text-center text-xs text-muted-foreground">
          パスワードをお忘れの場合は、管理者にお問い合わせください
        </p>
      </div>
    </div>
  );
}
