"use client";

import { useEffect, useState } from "react";
import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";
import { formatRelativeTimeJa } from "@/lib/time";

type Tweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics: { like_count: number; retweet_count: number };
};

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TweetFeed() {
  const [tweets, setTweets] = useState<Tweet[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/tweets");
        const data = (await res.json()) as { tweets?: Tweet[] };
        if (!cancelled) setTweets(data.tweets ?? []);
      } catch {
        if (!cancelled) setTweets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = tweets ?? [];
  const showPlaceholder = !loading && list.length === 0;

  return (
    <LandingSection tone="white" aria-labelledby="tweet-heading">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <h2 id="tweet-heading" className={lpSectionTitleClass}>
          最新の活動情報
        </h2>
        <p className="mx-auto mt-3 w-full min-w-0 max-w-2xl text-center text-sm text-muted">
          @kiyoseground の最新投稿（最大6件）
        </p>
        <p className="mx-auto mt-2 w-full min-w-0 max-w-2xl break-words text-pretty text-center text-sm font-medium leading-relaxed text-body">
          #監督野球ができるよう市長にお願いしてくる
        </p>

        <div className="mt-10 min-w-0">
          {loading && (
            <div
              className="rounded-xl border border-dashed border-border bg-white p-8 text-center shadow-sm"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded bg-slate-200" />
              <p className="text-sm font-medium text-muted">投稿を読み込んでいます…</p>
            </div>
          )}

          {showPlaceholder && (
            <article className="rounded-xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
              <XLogo className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-4 font-medium text-body">活動開始準備中</p>
              <p className="mt-2 text-sm text-muted">
                投稿が公開されると、ここに表示されます。
              </p>
            </article>
          )}

          {!loading && list.length > 0 && (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              {list.map((t) => (
                <article
                  key={t.id}
                  className="relative min-w-0 rounded-xl bg-white p-5 shadow-md ring-1 ring-border"
                >
                  <a
                    href={`https://x.com/i/web/status/${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-4 top-4 text-slate-400 transition hover:text-body"
                    aria-label="Xで開く"
                  >
                    <XLogo className="h-5 w-5" />
                  </a>
                  <p className="min-w-0 whitespace-pre-wrap break-words pr-10 text-sm leading-relaxed text-body">
                    {t.text}
                  </p>
                  <p className="mt-3 text-xs text-muted">
                    {formatRelativeTimeJa(t.created_at)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                    <span>いいね {t.public_metrics.like_count}</span>
                    <span>リポスト {t.public_metrics.retweet_count}</span>
                  </div>
                  <a
                    href={`https://x.com/i/web/status/${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    Xで見る
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </LandingSection>
  );
}
