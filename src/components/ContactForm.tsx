"use client";

import { useState } from "react";
import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
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

  return (
    <LandingSection tone="white" aria-labelledby="contact-heading">
      <div className="mx-auto w-full min-w-0 max-w-lg">
        <h2 id="contact-heading" className={lpSectionTitleClass}>
          ご意見をお寄せください
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          いただいた内容は関係者のみが確認します。
        </p>

        {status === "ok" ? (
          <p
            className="mt-8 rounded-lg border border-border bg-surface p-6 text-center text-sm font-medium text-body"
            role="status"
          >
            ありがとうございます。メッセージを受け取りました。
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-body"
              >
                お名前
                <span className="text-accent">（必須）</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-body"
              >
                メールアドレス（任意）
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-body"
              >
                メッセージ
                <span className="text-accent">（必須）</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
              />
            </div>
            {status === "err" && errMsg && (
              <p className="text-sm text-accent" role="alert">
                {errMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-body py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {status === "sending" ? "送信中…" : "送る"}
            </button>
          </form>
        )}
      </div>
    </LandingSection>
  );
}
