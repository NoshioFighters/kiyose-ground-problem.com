"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-body">
      <h1 className="text-center text-lg font-bold text-slate-900">
        管理画面の表示中にエラーが発生しました
      </h1>
      <p className="max-w-md text-center text-sm text-slate-600">
        開発サーバーの場合はターミナルのログを確認し、
        <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">
          npm run dev:clean
        </code>
        でキャッシュ削除後に再起動してください。
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="max-h-40 max-w-full overflow-auto rounded-lg bg-white p-3 text-left text-xs text-red-800 ring-1 ring-slate-200">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        再試行
      </button>
    </div>
  );
}
