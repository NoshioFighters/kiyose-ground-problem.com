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

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SupportForm />
      <ProblemSection />
      <ImpactSection />
      <LegalSection />
      <CityComparison />
      <TrackRecord />
      <SupportMessages />
      <TweetFeed />
      <ShareSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
