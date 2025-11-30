/**
 * ナビゲーションコンポーネント
 *
 * ページ内ナビゲーション用の汎用コンポーネント
 */

import Link from 'next/link';

interface NavigationItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation = ({ items }: NavigationProps) => {
  return (
    <nav>
      <ul className="flex gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
