import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";

const items = [
  { icon: "🛡️", title: "低学年の安全な送迎が難しくなる" },
  { icon: "📉", title: "試合経験が減り、成長の機会が失われる" },
  { icon: "👥", title: "地域のボランティアスタッフが参加しにくくなる" },
  { icon: "💸", title: "保護者のコインパーキング代などの負担が増える" },
];

export function ImpactSection() {
  return (
    <LandingSection tone="surface" aria-labelledby="impact-heading">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <h2 id="impact-heading" className={lpSectionTitleClass}>
          子どもたちへの影響
        </h2>
        <ul className="mt-10 space-y-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex min-w-0 gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-xl"
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="min-w-0 text-sm font-medium leading-relaxed text-body sm:text-base">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
