/**
 * Next.js Middleware
 *
 * 認証状態をチェックし、保護されたルートへのアクセスを制御します。
 * Better Auth公式推奨のgetSessionCookie()を使用して軽量かつ型安全に実装しています。
 *
 * セキュリティ注意:
 * このミドルウェアはセッションCookieの存在のみをチェックします。
 * 実際のセッション検証は各ページ/ルートで行う必要があります。
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * 認証が必要なパス
 */
const protectedPaths = ['/dashboard', '/admin', '/profile', '/settings', '/posts'];

/**
 * 認証済みユーザーがアクセスできないパス（ログイン画面など）
 */
const authPaths = ['/login', '/register'];

/**
 * 公開パス（認証不要）
 */
const publicPaths = ['/'];

/**
 * Middleware関数
 *
 * リクエストごとに実行され、認証状態に基づいてリダイレクトを行います。
 * Better Auth公式推奨パターン（getSessionCookie）を使用
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 公開パスは認証チェックをスキップ
  const isPublicPath = publicPaths.some((path) => pathname === path);
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Better Authの型安全なセッションCookie取得
  // Cookie名は /lib/auth/client.ts の設定と一致させる必要あり
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: 'lumina',
  });

  const isAuthenticated = !!sessionCookie;

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
