"use client";

import { useEffect, useState } from "react";
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

  const showPlaceholder =
    !loading && (!tweets || tweets.length === 0);

  return (
    <section
      className="border-b border-border bg-surface px-4 py-14 sm:py-16"
      aria-labelledby="tweet-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="tweet-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          最新の活動情報（X）
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted">
          公式アカウントの最新投稿を表示します（最大6件）
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-white shadow-md ring-1 ring-border"
              />
            ))}

          {showPlaceholder && (
            <article className="rounded-xl border border-dashed border-border bg-white p-8 text-center shadow-md sm:col-span-2">
              <XLogo className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-4 font-medium text-body">準備中</p>
              <p className="mt-2 text-sm text-muted">
                Xアカウントまたは API の設定が完了すると、ここに投稿が表示されます。
              </p>
            </article>
          )}

          {!loading &&
            tweets?.map((t) => (
              <article
                key={t.id}
                className="relative rounded-xl bg-white p-5 shadow-md ring-1 ring-border"
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
                <p className="whitespace-pre-wrap pr-10 text-sm leading-relaxed text-body">
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
      </div>
    </section>
  );
}
