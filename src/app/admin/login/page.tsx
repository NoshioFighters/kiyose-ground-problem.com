type Props = {
  searchParams: { error?: string };
};

export default function AdminLoginPage({ searchParams }: Props) {
  const showError = searchParams.error === "auth";
  const showServerError = searchParams.error === "server";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-md">
        <h1 className="text-center text-lg font-bold text-slate-900">
          管理画面ログイン
        </h1>
        <p className="mt-2 text-center text-xs text-slate-500">
          パスワードを入力してください
        </p>

        {showError && (
          <p
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700"
            role="alert"
          >
            パスワードが違います
          </p>
        )}
        {showServerError && (
          <p
            className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-900"
            role="alert"
          >
            サーバー設定を確認してください（ADMIN_PASSWORD）
          </p>
        )}

        <form
          action="/api/admin-login"
          method="POST"
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="admin-password" className="sr-only">
              パスワード
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-500 focus:ring-2"
              placeholder="パスワード"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
