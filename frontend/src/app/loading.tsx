/**
 * グローバルローディングUI
 *
 * ページ遷移時やSuspense境界で表示されるローディング状態
 * Next.js 15 App Routerの推奨ファイル
 */
const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
};

export default Loading;
