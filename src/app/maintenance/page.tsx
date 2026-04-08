import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メンテナンス中 | 清瀬市グランド問題",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16 text-body">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-xl font-bold text-body sm:text-2xl">
          ただいまメンテナンス中です
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          サイトの公開を一時停止しています。しばらくしてから再度アクセスしてください。
        </p>
        <p className="mt-6 text-xs text-muted">
          清瀬市学校グランド問題に関する情報発信
        </p>
      </div>
    </main>
  );
}
