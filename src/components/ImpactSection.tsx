const items = [
  {
    icon: "🛡️",
    title: "低学年の安全な送迎が難しくなる",
  },
  {
    icon: "📉",
    title: "試合経験が減り、成長の機会が失われる",
  },
  {
    icon: "👥",
    title: "地域のボランティアスタッフが参加しにくくなる",
  },
  {
    icon: "💸",
    title: "保護者のコインパーキング代などの負担が増える",
  },
  {
    icon: "🏃",
    title: "新しい子が市外のチームへ流れてしまう",
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
