import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";

const rows = [
  { name: "清瀬市", game: "❌ 禁止", parking: "❌ 1台のみ", highlight: true },
  { name: "東久留米市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
  { name: "東村山市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
  { name: "西東京市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
  { name: "小平市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
  { name: "所沢市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
  { name: "新座市", game: "✅ 可能", parking: "✅ 制限なし", highlight: false },
];

export function CityComparison() {
  return (
    <LandingSection tone="surface" aria-labelledby="compare-heading">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <h2 id="compare-heading" className={lpSectionTitleClass}>
          近隣市の状況
        </h2>
        <div className="mt-10 min-w-0 overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="px-4 py-3 font-semibold text-body">
                  自治体
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-body">
                  対外試合
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-body">
                  駐車場制限
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className={
                    row.highlight
                      ? "bg-slate-100"
                      : "border-t border-border odd:bg-white even:bg-slate-50/50"
                  }
                >
                  <th scope="row" className="px-4 py-3 font-medium text-body">
                    {row.name}
                  </th>
                  <td className="px-4 py-3 text-muted">{row.game}</td>
                  <td className="px-4 py-3 text-muted">{row.parking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-muted sm:text-sm">
          都内多摩地域において同様のルールを設けている市は確認されていません
        </p>
        <p className="mt-2 text-center text-xs text-muted">
          ※ 各市のHP等調査の結果
        </p>
      </div>
    </LandingSection>
  );
}
