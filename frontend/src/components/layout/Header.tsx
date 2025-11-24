/**
 * ヘッダーコンポーネント
 *
 * サイト全体で使用されるグローバルヘッダー
 */

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Lumina CMS</h1>
        </div>
        <nav>{/* ナビゲーションメニュー（将来実装） */}</nav>
      </div>
    </header>
  );
}
