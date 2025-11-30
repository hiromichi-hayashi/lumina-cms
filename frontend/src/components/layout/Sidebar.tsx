/**
 * サイドバーコンポーネント
 *
 * 管理画面で使用されるナビゲーションサイドバー
 */

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <nav>
        <ul className="space-y-2">
          {/* サイドバーメニュー項目（将来実装） */}
          <li className="text-sm text-gray-600">ダッシュボード</li>
          <li className="text-sm text-gray-600">記事管理</li>
          <li className="text-sm text-gray-600">カテゴリ管理</li>
          <li className="text-sm text-gray-600">ユーザー管理</li>
        </ul>
      </nav>
    </aside>
  );
};
