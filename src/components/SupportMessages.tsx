import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";
import {
  getApprovedSupportMessagesCached,
  getSupportMessagesTotalCountCached,
} from "@/lib/support-cache";
import type { Timestamp } from "firebase-admin/firestore";

function formatShort(ts: Timestamp | null): string {
  if (!ts) return "";
  try {
    if (typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function toIsoSafe(ts: Timestamp | null): string | undefined {
  if (!ts) return undefined;
  try {
    if (typeof ts.toDate !== "function") return undefined;
    return ts.toDate().toISOString();
  } catch {
    return undefined;
  }
}

export async function SupportMessages() {
  let items: Awaited<
    ReturnType<typeof getApprovedSupportMessagesCached>
  > = [];
  let totalRegistered = 0;
  try {
    [items, totalRegistered] = await Promise.all([
      getApprovedSupportMessagesCached(),
      getSupportMessagesTotalCountCached(),
    ]);
  } catch (err) {
    console.error("[SupportMessages]", err);
    return null;
  }

  if (totalRegistered === 0) {
    return null;
  }

  return (
    <LandingSection tone="surface" aria-labelledby="support-messages-heading">
      <div className="mx-auto w-full min-w-0 max-w-2xl">
        <h2 id="support-messages-heading" className={lpSectionTitleClass}>
          みんなの応援メッセージ
        </h2>
        <div className="mt-6 flex justify-center">
          <div
            className="inline-flex min-w-[10rem] flex-col items-center justify-center rounded-full border-2 border-accent bg-white px-10 py-5 shadow-md ring-4 ring-accent/10 sm:min-w-[12rem] sm:px-12 sm:py-6"
            aria-label={`登録されている応援メッセージは全${totalRegistered.toLocaleString("ja-JP")}件です`}
          >
            <span className="text-xs font-semibold tracking-wide text-muted sm:text-sm">
              登録された応援（全件）
            </span>
            <span className="mt-1 text-4xl font-bold tabular-nums leading-none text-accent sm:text-5xl">
              {totalRegistered.toLocaleString("ja-JP")}
            </span>
            <span className="mt-1 text-sm font-medium text-body">件</span>
          </div>
        </div>
        <div className="mt-8 h-[400px] min-w-0 overflow-y-auto overflow-x-clip overscroll-contain rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          {items.length > 0 ? (
            <ul className="space-y-4">
              {items.map((row) => (
                <li
                  key={row.id}
                  className="min-w-0 rounded-lg border border-border bg-surface/80 p-4 shadow-sm"
                >
                  <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-relaxed text-body">
                    {row.message}
                  </p>
                  <div className="mt-3 flex w-full min-w-0 flex-col items-end gap-0.5 text-right">
                    <span className="max-w-full break-words text-sm font-medium text-body">
                      {row.name}
                    </span>
                    <time
                      className="text-xs text-muted"
                      dateTime={toIsoSafe(row.createdAt)}
                    >
                      {formatShort(row.createdAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm leading-relaxed text-muted">
              現在、ここに表示できる承認済みのメッセージはありません。いただいた応援は順次確認しています。
            </p>
          )}
        </div>
      </div>
    </LandingSection>
  );
}
