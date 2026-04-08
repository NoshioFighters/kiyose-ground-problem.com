export const dynamic = "force-dynamic";

type SearchParamsInput = Record<string, string | string[] | undefined>;

function pickParam(
  sp: SearchParamsInput | undefined,
  key: string
): string | undefined {
  if (!sp || typeof sp !== "object") return undefined;
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

function isAdminPasswordConfigured(): boolean {
  const v = process.env.ADMIN_PASSWORD;
  return typeof v === "string" && v.length > 0;
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const err = pickParam(searchParams, "error");
  const showAuthError = err === "auth";
  const passwordConfigured = isAdminPasswordConfigured();
  const showConfigError =
    !passwordConfigured || err === "server";

  return (
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center px-4">
      <div className="w-full min-w-0 max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-md">
        <h1 className="text-center text-lg font-bold text-slate-900">
          管理画面ログイン
        </h1>
        <p className="mt-2 text-center text-xs text-slate-500">
          サイト管理者用のパスワードでログインしてください。
        </p>

        {showConfigError && (
          <p
            className="mt-4 break-words rounded-lg bg-amber-50 px-3 py-2 text-left text-xs leading-relaxed text-amber-950 ring-1 ring-amber-200"
            role="alert"
          >
            環境変数{" "}
            <code className="break-all rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[0.7rem]">
              ADMIN_PASSWORD
            </code>{" "}
            がサーバーに設定されていません。Firebase App Hosting /
            ホスティングの環境変数、またはローカルの{" "}
            <code className="break-all rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[0.7rem]">
              .env.local
            </code>{" "}
            を確認し、開発サーバーを再起動してください。
          </p>
        )}

        {showAuthError && (
          <p
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700"
            role="alert"
          >
            パスワードが違います
          </p>
        )}

        <form
          action="/api/admin-login"
          method="POST"
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              パスワード
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={!passwordConfigured}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400/30 focus:border-slate-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={!passwordConfigured}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
