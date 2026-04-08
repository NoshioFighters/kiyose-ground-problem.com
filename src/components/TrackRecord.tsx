import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";

const SIGNATURES = 1042;
const GROUPS = 7;

export function TrackRecord() {
  return (
    <LandingSection tone="white" aria-labelledby="track-heading">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <h2 id="track-heading" className={lpSectionTitleClass}>
          みなさんの声が集まっています
        </h2>
        <div className="mt-12 grid min-w-0 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold tabular-nums text-accent sm:text-5xl">
              {SIGNATURES.toLocaleString("ja-JP")}
            </p>
            <p className="mt-2 text-sm font-medium text-body">名の署名</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold tabular-nums text-body sm:text-5xl">
              {GROUPS}
            </p>
            <p className="mt-2 text-sm font-medium text-body">チーム・団体が賛同</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold leading-snug text-body sm:text-xl">
              2026年3月25日
            </p>
            <p className="mt-2 text-sm font-medium text-body">市長へ要望書を提出</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-900 ring-1 ring-orange-200">
            現在、市からの回答を待っています
          </span>
        </div>
      </div>
    </LandingSection>
  );
}
