const items = [
  {
    icon: "🛡",
    title: "低学年児童の安全確保が困難に（送迎・駐車が必要）",
  },
  {
    icon: "📉",
    title: "対外試合減少による競争力・モチベーションの低下",
  },
  {
    icon: "👥",
    title: "地域コミュニティの弱体化（ボランティアスタッフの参加困難）",
  },
  {
    icon: "💸",
    title: "保護者の金銭的負担増大（コインパーキング代）",
  },
  {
    icon: "🏃",
    title: "新規加入者が市外チームへ流出する懸念",
  },
];

export function ImpactSection() {
  return (
    <section
      className="border-b border-border bg-surface px-4 py-14 sm:py-16"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="impact-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          子どもたちへの影響
        </h2>
        <ul className="mt-10 space-y-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-xl"
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium leading-relaxed text-body sm:text-base">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
