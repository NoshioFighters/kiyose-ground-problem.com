import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { SupportForm } from "@/components/SupportForm";
import { ProblemSection } from "@/components/ProblemSection";
import { ImpactSection } from "@/components/ImpactSection";
import { LegalSection } from "@/components/LegalSection";
import { CityComparison } from "@/components/CityComparison";
import { TrackRecord } from "@/components/TrackRecord";
import { SupportMessages } from "@/components/SupportMessages";
import { TweetFeed } from "@/components/TweetFeed";
import { ShareSection } from "@/components/ShareSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import {
  LandingSection,
  lpSectionTitleClass,
} from "@/components/layout/LandingSection";
import { lpRootMainClass } from "@/lib/lp-layout";

export const dynamic = "force-dynamic";

function SupportMessagesFallback() {
  return (
    <LandingSection
      tone="surface"
      aria-labelledby="support-messages-loading-heading"
    >
      <div className="mx-auto w-full min-w-0 max-w-2xl">
        <h2 id="support-messages-loading-heading" className={lpSectionTitleClass}>
          みんなの応援メッセージ
        </h2>
        <div
          className="mt-6 flex justify-center"
          aria-hidden
        >
          <div className="h-28 w-44 animate-pulse rounded-full bg-slate-200/90 sm:h-32 sm:w-52" />
        </div>
        <div
          className="mt-8 flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-white/90 p-8 shadow-sm"
          aria-busy
          aria-label="読み込み中"
        >
          <p className="text-sm text-muted">読み込み中…</p>
        </div>
      </div>
    </LandingSection>
  );
}

export default function HomePage() {
  return (
    <main className={lpRootMainClass}>
      <Hero />
      <SupportForm />
      <ProblemSection />
      <ImpactSection />
      <LegalSection />
      <CityComparison />
      <TrackRecord />
      <Suspense fallback={<SupportMessagesFallback />}>
        <SupportMessages />
      </Suspense>
      <TweetFeed />
      <ShareSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
