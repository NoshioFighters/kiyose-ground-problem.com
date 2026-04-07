import { listContacts } from "@/lib/firestore";

export const dynamic = "force-dynamic";

function formatDate(ts: { toDate: () => Date } | null): string {
  if (!ts) return "—";
  try {
    return ts.toDate().toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default async function AdminPage() {
  const contacts = await listContacts(100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            応援メッセージ・ご意見一覧
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            新着順・最大100件まで表示（{contacts.length} 件を表示）
          </p>
        </div>
        <form action="/api/admin-logout" method="POST">
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ログアウト
          </button>
        </form>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                受信日時
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                お名前
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                メールアドレス
              </th>
              <th scope="col" className="min-w-[200px] px-4 py-3 font-semibold">
                メッセージ
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  まだメッセージはありません。
                </td>
              </tr>
            ) : (
              contacts.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 align-top last:border-0 odd:bg-white even:bg-slate-50/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="break-all px-4 py-3 text-slate-600">
                    {row.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <p className="whitespace-pre-wrap break-words">{row.message}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
