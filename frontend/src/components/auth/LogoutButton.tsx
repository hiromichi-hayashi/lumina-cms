/**
 * ログアウトボタンコンポーネント
 *
 * ログアウト機能を提供するボタン
 */

'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  const { signOut, loading } = useAuth();

  return (
    <Button variant="ghost" size="sm" onClick={signOut} disabled={loading} aria-label="ログアウト">
      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
      ログアウト
    </Button>
  );
};
