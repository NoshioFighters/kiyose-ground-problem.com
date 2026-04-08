export default function AdminLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-100 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-700">管理画面を読み込み中…</p>
      <p className="max-w-sm text-center text-xs text-slate-500">
        Firestore への接続に時間がかかっている場合があります。
      </p>
    </div>
  );
}
