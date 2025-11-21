/**
 * Next.js Middleware
 *
 * 認証状態をチェックし、保護されたルートへのアクセスを制御します。
 * Better AuthのセッションCookieを確認して認証を判定します。
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 認証が必要なパス
 */
const protectedPaths = ['/dashboard', '/admin', '/profile', '/settings', '/posts'];

/**
 * 認証済みユーザーがアクセスできないパス（ログイン画面など）
 */
const authPaths = ['/login', '/register'];

/**
 * Middleware関数
 *
 * リクエストごとに実行され、認証状態に基づいてリダイレクトを行います。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better Authのセッショントークン確認
  const session = request.cookies.get('lumina.session_token');
  const isAuthenticated = !!session;

  // 保護されたパスへの未認証アクセス
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーが認証ページへアクセス
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware設定
 *
 * 以下のパスを除外してMiddlewareを実行:
 * - /api (APIルート)
 * - /_next/static (静的ファイル)
 * - /_next/image (画像最適化)
 * - /favicon.ico (ファビコン)
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
