export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">Lumina CMS</h1>
        <p className="text-center text-gray-600">
          Enterprise Content Management System
        </p>
        <div className="flex gap-4">
          <a
            href="/api/docs"
            className="rounded-lg border border-gray-300 px-5 py-3 transition-colors hover:border-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Docs
          </a>
          <a
            href="/login"
            className="rounded-lg bg-blue-500 text-white px-5 py-3 transition-colors hover:bg-blue-600"
          >
            ログイン
          </a>
        </div>
      </div>
    </main>
  );
}
