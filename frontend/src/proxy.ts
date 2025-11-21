import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なパスのリスト
const protectedPaths = ['/dashboard', '/admin', '/profile', '/settings'];

// 認証済みユーザーがアクセスできないパス（ログイン、登録ページなど）
const authPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // セッションCookieの確認
  // Better Authの設定で cookiePrefix: 'lumina' を使用しているため、
  // Cookie名は 'lumina.session_token' になります
  const session = request.cookies.get('lumina.session_token');
  const isAuthenticated = !!session;

  // 保護されたパスへのアクセス
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // 認証パスへのアクセス
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // 未認証ユーザーが保護されたパスにアクセスしようとした場合
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 認証済みユーザーが認証パスにアクセスしようとした場合
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
