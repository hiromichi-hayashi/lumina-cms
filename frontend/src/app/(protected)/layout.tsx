import { LogoutButton } from '@/components/auth/LogoutButton';

/**
 * 認証必須ページ用レイアウト
 *
 * ログイン済みユーザーのみアクセス可能なページで使用
 * Route Group: (protected)
 *
 * middlewareで認証チェックが行われる
 */

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Lumina CMS</h1>
          <LogoutButton />
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
