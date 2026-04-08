import { getShareIntentUrl } from "@/lib/share";

export function Hero() {
  const shareUrl = getShareIntentUrl();

  return (
    <section
      className="relative min-w-0 overflow-hidden bg-hero px-4 pb-16 pt-12 text-white sm:pb-20 sm:pt-16 md:pt-20"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto w-full min-w-0 max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium text-slate-300">
          子どもたちのスポーツ環境について、市民の声を届けたい
        </p>
        <h1
          id="hero-heading"
          className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl"
        >
          清瀬の子どもたちに、
          <span className="text-accent">野球を続けさせてあげたい。</span>
        </h1>
        <p className="mx-auto mt-6 w-full min-w-0 max-w-2xl text-pretty text-left text-sm leading-relaxed text-slate-300 sm:text-center sm:text-base">
          2026年2月、清瀬市教育委員会は市内小中学校での対外試合を禁止し、
          駐車場の利用を1台のみに制限しました。
          <br />
          7チーム・団体、1,042名が声を上げています。
        </p>
        <div className="mt-10 flex min-w-0 flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Xでこの問題を広める
          </a>
          <a
            href="#problem"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            詳しく読む
          </a>
        </div>
      </div>
    </section>
  );
}
