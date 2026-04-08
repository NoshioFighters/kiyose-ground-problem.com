"use client";

import { useState } from "react";
import { landingSectionFrame } from "@/components/layout/LandingSection";
import { cn } from "@/lib/cn";

const BG_IMAGE = "/support-form-bg.jpg";

function SupportSectionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative isolate min-w-0 overflow-hidden bg-surface",
        landingSectionFrame
      )}
      aria-labelledby="support-form-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/80"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrMsg("送信に失敗しました。");
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <SupportSectionShell>
        <div className="mx-auto w-full min-w-0 max-w-lg text-center">
          <h2
            id="support-form-heading"
            className="text-xl font-bold text-body sm:text-2xl"
          >
            この活動を応援する
          </h2>
          <p
            className="mt-6 rounded-lg border border-border bg-white/90 px-4 py-6 text-sm font-medium leading-relaxed text-body shadow-sm backdrop-blur-sm"
            role="status"
          >
            ありがとうございます！応援メッセージを受け取りました。
          </p>
        </div>
      </SupportSectionShell>
    );
  }

  return (
    <SupportSectionShell>
      <div className="mx-auto w-full min-w-0 max-w-lg">
        <h2
          id="support-form-heading"
          className="text-center text-xl font-bold text-body sm:text-2xl"
        >
          この活動を応援する
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          承認後、サイト上で紹介させていただく場合があります。
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-xl border border-border bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6"
        >
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
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
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
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
            />
          </div>
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
              className="mt-1 w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
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
    </SupportSectionShell>
  );
}
