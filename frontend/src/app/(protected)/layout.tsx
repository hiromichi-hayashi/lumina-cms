'use client';

import { UserDropdownMenu } from '@/components/auth/UserDropdownMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Tags, UserCog, BarChart3, Mail, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * 認証必須ページ用レイアウト
 *
 * ログイン済みユーザーのみアクセス可能なページで使用
 * Route Group: (protected)
 *
 * middlewareで認証チェックが行われる
 * サイドバーナビゲーション付きの管理画面レイアウト
 */
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            {/* コンテンツ管理 */}
            <SidebarGroup>
              <SidebarGroupLabel>コンテンツ管理</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/dashboard')}
                      isActive={pathname === '/dashboard'}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>ダッシュボード</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/posts')}
                      isActive={pathname?.startsWith('/admin/posts')}
                    >
                      <FileText className="w-4 h-4" />
                      <span>記事管理</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/categories')}
                      isActive={pathname?.startsWith('/admin/categories')}
                    >
                      <Tags className="w-4 h-4" />
                      <span>カテゴリ・ラベル</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* ユーザー管理 */}
            <SidebarGroup>
              <SidebarGroupLabel>ユーザー管理</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/users')}
                      isActive={pathname?.startsWith('/admin/users')}
                    >
                      <UserCog className="w-4 h-4" />
                      <span>ユーザー管理</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* 分析・統計 */}
            <SidebarGroup>
              <SidebarGroupLabel>分析・統計</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/ranking')}
                      isActive={pathname?.startsWith('/admin/ranking')}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>閲覧ランキング</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/contacts')}
                      isActive={pathname?.startsWith('/admin/contacts')}
                    >
                      <Mail className="w-4 h-4" />
                      <span>お問い合わせ</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* その他 */}
            <SidebarGroup>
              <SidebarGroupLabel>その他</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push('/admin/settings')}
                      isActive={pathname?.startsWith('/admin/settings')}
                    >
                      <Settings className="w-4 h-4" />
                      <span>設定</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-bold">Lumina CMS</h1>
              <UserDropdownMenu />
            </div>
          </header>
          <main className="p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
