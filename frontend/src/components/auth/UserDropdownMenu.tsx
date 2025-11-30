/**
 * ユーザードロップダウンメニューコンポーネント
 *
 * ヘッダーに表示するユーザー情報とアクションメニュー
 * - ユーザーアバター + 名前を表示
 * - アカウント設定へのリンク
 * - ログアウト機能
 */

'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/lib/auth/client';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * ユーザー名からイニシャルを取得
 *
 * @param name - ユーザー名
 * @returns イニシャル（最大2文字）
 */
const getInitials = (name: string | null | undefined): string => {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const UserDropdownMenu = () => {
  const router = useRouter();
  const { signOut, loading: authLoading } = useAuth();
  const { data: session, isPending } = useSession();

  // セッション読み込み中
  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  // セッションがない場合は何も表示しない
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2"
          aria-label="ユーザーメニュー"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name || 'ユーザー'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium">
            {user.name || 'ユーザー'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || 'ユーザー'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>アカウント設定</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={signOut}
          disabled={authLoading}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
