'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * クイックアクションボタン
 *
 * 新規記事作成などのクイックアクションを提供
 */
export const QuickActions = () => {
  const router = useRouter();

  return (
    <Button size="lg" onClick={() => router.push('/admin/posts/new')}>
      <Plus className="h-5 w-5 mr-2" />
      新規記事
    </Button>
  );
};
