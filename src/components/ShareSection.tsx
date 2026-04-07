import { getShareIntentUrl } from "@/lib/share";

export function ShareSection() {
  const url = getShareIntentUrl();

  return (
    <section
      className="border-b border-border bg-hero px-4 py-14 text-white sm:py-16"
      aria-labelledby="share-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="share-heading"
          className="text-2xl font-bold sm:text-3xl"
        >
          この問題をもっと多くの人に伝えてください
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          清瀬市に住む子どもたちのために、声を広げてください。
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold shadow-lg transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Xでシェアする
        </a>
      </div>
    </section>
  );
}
