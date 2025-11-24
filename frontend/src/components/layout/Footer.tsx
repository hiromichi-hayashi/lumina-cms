/**
 * フッターコンポーネント
 *
 * サイト全体で使用されるグローバルフッター
 */

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Lumina CMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
