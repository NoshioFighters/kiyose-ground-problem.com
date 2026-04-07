import { getShareIntentUrl } from "@/lib/share";

export function Hero() {
  const shareUrl = getShareIntentUrl();

  return (
    <section
      className="relative overflow-hidden bg-hero px-4 pb-16 pt-12 text-white sm:pb-20 sm:pt-16 md:pt-20"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium text-red-200/90">
          清瀬市教育委員会の通達に抗議しています
        </p>
        <h1
          id="hero-heading"
          className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl"
        >
          清瀬の子どもたちから
          <br className="sm:hidden" />
          <span className="text-accent"> 野球を奪わないで。</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-left text-sm leading-relaxed text-slate-300 sm:text-center sm:text-base">
          清瀬市教育委員会は2026年2月、市内小中学校での対外試合を禁止し、
          駐車場利用を1台のみに制限しました。
          <br />
          7チーム・1,000名超の子どもたちの活動が危機に瀕しています。
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Xで問題を拡散する
          </a>
          <a
            href="#problem"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            詳細を読む
          </a>
        </div>
      </div>
    </section>
  );
}
