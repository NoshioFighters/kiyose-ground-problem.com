"use client";

import { lpRootMainClass } from "@/lib/lp-layout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className={`${lpRootMainClass} flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-body`}
    >
      <h1 className="text-center text-lg font-bold text-body">
        表示中にエラーが発生しました
      </h1>
      <p className="max-w-md text-center text-sm text-muted">
        一時的な不具合の可能性があります。再読み込みするか、しばらくしてからお試しください。
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="max-h-40 max-w-full overflow-auto rounded-lg bg-slate-100 p-3 text-left text-xs text-slate-800">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-body px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        再試行
      </button>
    </main>
  );
}
