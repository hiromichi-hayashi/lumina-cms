/**
 * 公開ページ用レイアウト
 *
 * 認証不要なページ（ホーム、ログイン、登録等）で使用
 * Route Group: (public)
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 将来的にヘッダーやフッターを追加 */}
      <main>{children}</main>
    </div>
  );
}
