import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * アカウント設定ページ
 *
 * ユーザーのアカウント情報を管理するページ
 * 将来的に以下の機能を実装予定:
 * - プロフィール編集
 * - パスワード変更
 * - メール設定
 * - セキュリティ設定
 */
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ヘッダーセクション */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">設定</h1>
        <p className="text-muted-foreground">アカウント情報とシステム設定を管理</p>
      </div>

      {/* プロフィール設定 */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
          <CardDescription>プロフィール情報の編集は後続のタスクで実装予定です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            プロフィール編集機能は準備中です
          </div>
        </CardContent>
      </Card>

      {/* セキュリティ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>セキュリティ</CardTitle>
          <CardDescription>
            パスワード変更やセキュリティ設定は後続のタスクで実装予定です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            セキュリティ設定機能は準備中です
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
