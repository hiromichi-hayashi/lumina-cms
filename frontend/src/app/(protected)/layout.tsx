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
      {/* 将来的にサイドバー、ナビゲーション等を追加 */}
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
