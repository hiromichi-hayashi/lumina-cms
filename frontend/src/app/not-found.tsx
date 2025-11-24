/**
 * 404 Not Foundページ
 *
 * 存在しないページにアクセスした際に表示
 * Next.js 15 App Routerの推奨ファイル
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <span className="text-4xl font-bold text-gray-400">404</span>
          </div>
          <CardTitle>ページが見つかりません</CardTitle>
          <CardDescription>
            お探しのページは存在しないか、移動または削除された可能性があります。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            URLが正しいか確認するか、ホームページから目的のページを探してください。
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
