const xProfile = process.env.NEXT_PUBLIC_X_PROFILE_URL?.trim();

export function Footer() {
  return (
    <footer className="bg-hero px-4 py-12 text-slate-300">
      <div className="mx-auto max-w-4xl text-center text-sm leading-relaxed">
        <p className="font-semibold text-white">
          清瀬市グランド問題を考える保護者・指導者の会
        </p>
        <p className="mt-4">
          <a
            href="mailto:voice@kiyose-ground-problem.com"
            className="text-accent underline-offset-2 hover:underline"
          >
            voice@kiyose-ground-problem.com
          </a>
        </p>
        <p className="mt-3">
          {xProfile ? (
            <a
              href={xProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 underline-offset-2 hover:underline"
            >
              公式X
            </a>
          ) : (
            <span className="text-slate-400">
              公式X（アカウント確定後に更新）
            </span>
          )}
        </p>
        <p className="mt-8 text-xs text-slate-500">
          © 2026 清瀬市学童野球チーム一同
        </p>
      </div>
    </footer>
  );
}
