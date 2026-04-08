import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";
import { formatRelativeTimeJa } from "@/lib/time";
import { getTweetsForLp } from "@/lib/tweets-lp";

const X_PROFILE_URL = "https://x.com/kiyoseground";

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

export async function TweetFeed() {
  const { tweets, notice, degraded } = await getTweetsForLp();
  const list = tweets;
  const showPlaceholder = list.length === 0;
  const showDevNotice =
    process.env.NODE_ENV === "development" && Boolean(notice);

  return (
    <LandingSection tone="white" aria-labelledby="tweet-heading">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <h2 id="tweet-heading" className={lpSectionTitleClass}>
          最新の活動情報
        </h2>
        <p className="mx-auto mt-3 w-full min-w-0 max-w-2xl text-center text-sm text-muted">
          <a
            href={X_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            @kiyoseground
          </a>
          の最新投稿（最大6件）
        </p>
        <p className="mx-auto mt-2 w-full min-w-0 max-w-2xl break-words text-pretty text-center text-sm font-medium leading-relaxed text-body">
          #監督野球ができるよう市長にお願いしてくる
        </p>
        {degraded && !showPlaceholder && (
          <p
            className="mx-auto mt-3 max-w-2xl text-center text-xs text-amber-800"
            role="status"
          >
            一時的にキャッシュ済みの投稿を表示しています。
          </p>
        )}
        {showDevNotice && (
          <p
            className="mx-auto mt-3 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950"
            role="note"
          >
            {notice}
          </p>
        )}

        <div className="mt-10 min-w-0">
          {showPlaceholder && (
            <article className="rounded-xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
              <a
                href={X_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-slate-400 transition hover:text-body"
                aria-label="@kiyoseground を X で開く"
              >
                <XLogo className="mx-auto h-8 w-8" />
              </a>
              <p className="mt-4 font-medium text-body">活動開始準備中</p>
              <p className="mt-2 text-sm text-muted">
                投稿が公開されると、ここに表示されます。
              </p>
              <p className="mt-4 text-sm">
                <a
                  href={X_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  X で @kiyoseground をフォローする
                </a>
              </p>
            </article>
          )}

          {list.length > 0 && (
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
                    <span>いいね {t.public_metrics?.like_count ?? 0}</span>
                    <span>リポスト {t.public_metrics?.retweet_count ?? 0}</span>
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
