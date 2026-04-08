import { lpRootMainClass } from "@/lib/lp-layout";

/** 動的ルートの RSC 待ちのあいだ、真っ白にならないようにする */
export default function RootLoading() {
  return (
    <main
      className={`${lpRootMainClass} flex min-h-[50vh] flex-col items-center justify-center bg-white px-4 text-muted`}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden
      />
      <p className="mt-4 text-sm">読み込み中…</p>
    </main>
  );
}
