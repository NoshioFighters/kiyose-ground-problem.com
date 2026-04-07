"use client";

import { useState } from "react";

export type SupportRowClient = {
  id: string;
  message: string;
  name: string;
  email: string;
  showOnLP: boolean;
  createdAtIso: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ja-JP", {
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

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

export function SupportApprovalTable({
  initialRows,
}: {
  initialRows: SupportRowClient[];
}) {
  const [rows, setRows] = useState(initialRows);

  async function onToggle(id: string, next: boolean, previous: boolean) {
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, showOnLP: next } : row))
    );
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnLP: next }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        throw new Error("patch failed");
      }
    } catch {
      setRows((r) =>
        r.map((row) => (row.id === id ? { ...row, showOnLP: previous } : row))
      );
    }
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        応援メッセージはまだありません。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
              受信日時
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              名前
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              メールアドレス
            </th>
            <th scope="col" className="min-w-[180px] px-4 py-3 font-semibold">
              応援メッセージ
            </th>
            <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
              LPに反映
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100 align-top last:border-0 odd:bg-white even:bg-slate-50/50"
            >
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDate(row.createdAtIso)}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {row.name}
              </td>
              <td className="break-all px-4 py-3 text-slate-600">
                {row.email || "—"}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-700">
                <p
                  className="line-clamp-3 whitespace-pre-wrap break-words"
                  title={row.message}
                >
                  {truncate(row.message, 120)}
                </p>
              </td>
              <td className="px-4 py-3">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                    checked={row.showOnLP}
                    onChange={(e) =>
                      onToggle(row.id, e.target.checked, row.showOnLP)
                    }
                    aria-label={`${row.name} のメッセージをLPに表示`}
                  />
                  <span className="text-xs text-slate-600">
                    {row.showOnLP ? "表示中" : "非表示"}
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
