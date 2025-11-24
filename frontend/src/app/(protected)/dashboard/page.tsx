/**
 * ダッシュボードページ
 *
 * 認証必須 - middlewareで保護
 * 管理画面のメインページ
 */

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      <p className="mt-4 text-gray-600">Lumina CMS 管理画面へようこそ</p>
    </div>
  );
}
