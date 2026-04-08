import {
  listContacts,
  listAllSupportMessages,
  type SupportMessageRow,
} from "@/lib/firestore";
import {
  SupportApprovalTable,
  type SupportRowClient,
} from "@/components/SupportApprovalTable";

export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 25_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

function supportRowToClient(r: SupportMessageRow): SupportRowClient {
  let createdAtIso: string | null = null;
  if (r.createdAt && typeof r.createdAt.toDate === "function") {
    try {
      createdAtIso = r.createdAt.toDate().toISOString();
    } catch {
      createdAtIso = null;
    }
  }
  return {
    id: r.id,
    message: r.message,
    name: r.name,
    email: r.email,
    showOnLP: r.showOnLP,
    createdAtIso,
    postedToX: Boolean(r.postedToXAt),
  };
}

function formatDate(ts: { toDate: () => Date } | null): string {
  if (!ts) return "—";
  try {
    if (typeof ts.toDate !== "function") return "—";
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
  let contacts: Awaited<ReturnType<typeof listContacts>> = [];
  let supportRows: SupportMessageRow[] = [];
  let loadError: string | null = null;

  try {
    const pair = await withTimeout(
      Promise.all([listContacts(100), listAllSupportMessages(200)]),
      FETCH_TIMEOUT_MS
    );
    contacts = pair[0];
    supportRows = pair[1];
  } catch (e) {
    loadError =
      e instanceof Error && e.message === "timeout"
        ? "データの取得がタイムアウトしました。Firestore のネットワーク・環境変数（FIREBASE_*）を確認し、開発サーバーを再起動してください。"
        : "データの読み込みに失敗しました。ターミナルのログを確認してください。";
  }

  const supportClientRows: SupportRowClient[] = supportRows.map(supportRowToClient);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 text-slate-900">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">管理画面</h1>
          <p className="mt-1 text-sm text-slate-600">
            お問い合わせと応援メッセージの確認・LP反映
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

      {loadError && (
        <div
          className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          {loadError}
        </div>
      )}

      <section className="mb-14" aria-labelledby="contacts-section">
        <h2
          id="contacts-section"
          className="mb-4 text-lg font-bold text-slate-900"
        >
          ご意見・お問い合わせ
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          新着順・最大100件まで表示（{contacts.length} 件を表示）
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 font-semibold"
                >
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
                      <p className="whitespace-pre-wrap break-words">
                        {row.message}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="support-section">
        <h2
          id="support-section"
          className="mb-4 text-lg font-bold text-slate-900"
        >
          応援メッセージ（LP への掲載承認）
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          「LPに反映」をオンにすると、トップページの「みんなの応援メッセージ」に表示されます（最大200件まで読み込み）。
          <br />
          「XへPost」は環境変数で設定したアカウント（例: @kiyoseground）から API
          投稿します。投稿後は同じ行では再投稿できません。
        </p>
        <SupportApprovalTable initialRows={supportClientRows} />
      </section>
    </div>
  );
}
