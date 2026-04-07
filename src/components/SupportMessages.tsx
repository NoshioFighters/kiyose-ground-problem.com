import { listApprovedSupportMessages } from "@/lib/firestore";

function formatShort(ts: { toDate: () => Date } | null): string {
  if (!ts) return "";
  try {
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

export async function SupportMessages() {
  const items = await listApprovedSupportMessages(50);
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="border-b border-border bg-surface px-4 py-14 sm:py-16"
      aria-labelledby="support-messages-heading"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="support-messages-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          みんなの応援メッセージ
        </h2>
        <div className="mt-8 h-[400px] overflow-y-auto rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
          <ul className="space-y-4">
            {items.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-border bg-surface/80 p-4 shadow-sm"
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">
                  {row.message}
                </p>
                <div className="mt-3 flex flex-col items-end gap-0.5 text-right">
                  <span className="text-sm font-medium text-body">{row.name}</span>
                  <time
                    className="text-xs text-muted"
                    dateTime={
                      row.createdAt
                        ? row.createdAt.toDate().toISOString()
                        : undefined
                    }
                  >
                    {formatShort(row.createdAt)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
