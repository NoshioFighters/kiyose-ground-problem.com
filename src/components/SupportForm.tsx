"use client";

import { useState } from "react";

export function SupportForm() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState("");

  const trimmedMessage = message.trim();
  const trimmedName = name.trim();
  const canSubmit =
    trimmedMessage.length > 0 && trimmedName.length > 0 && status !== "sending";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          name: trimmedName,
          email: email.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErrMsg(data.error ?? "送信に失敗しました。");
        setStatus("err");
        return;
      }
      setStatus("ok");
      setMessage("");
      setName("");
      setEmail("");
    } catch {
      setErrMsg("送信に失敗しました。");
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <section
        className="border-b border-border bg-white px-4 py-12 sm:py-14"
        aria-labelledby="support-form-heading"
      >
        <div className="mx-auto max-w-lg text-center">
          <h2
            id="support-form-heading"
            className="text-xl font-bold text-body sm:text-2xl"
          >
            この活動を応援する
          </h2>
          <p
            className="mt-6 rounded-lg border border-border bg-surface px-4 py-6 text-sm font-medium leading-relaxed text-body"
            role="status"
          >
            ありがとうございます！応援メッセージを受け取りました。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="border-b border-border bg-white px-4 py-12 sm:py-14"
      aria-labelledby="support-form-heading"
    >
      <div className="mx-auto max-w-lg">
        <h2
          id="support-form-heading"
          className="text-center text-xl font-bold text-body sm:text-2xl"
        >
          この活動を応援する
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          承認後、サイト上で紹介させていただく場合があります。
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="support-message"
              className="block text-sm font-medium text-body"
            >
              応援メッセージ
              <span className="text-accent">（必須）</span>
            </label>
            <textarea
              id="support-message"
              name="message"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="子どもたちへの応援メッセージをお書きください"
              className="mt-1 w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="support-name"
              className="block text-sm font-medium text-body"
            >
              名前
              <span className="text-accent">（必須）</span>
            </label>
            <input
              id="support-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前（例：山田太郎）"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="support-email"
              className="block text-sm font-medium text-body"
            >
              メールアドレス（任意）
            </label>
            <input
              id="support-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス（任意）"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
            />
          </div>
          {status === "err" && errMsg && (
            <p className="text-sm text-accent" role="alert">
              {errMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "送信中..." : "応援する"}
          </button>
        </form>
      </div>
    </section>
  );
}
