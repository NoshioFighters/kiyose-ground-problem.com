import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { ImpactSection } from "@/components/ImpactSection";
import { LegalSection } from "@/components/LegalSection";
import { CityComparison } from "@/components/CityComparison";
import { TrackRecord } from "@/components/TrackRecord";
import { TweetFeed } from "@/components/TweetFeed";
import { ShareSection } from "@/components/ShareSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ImpactSection />
      <LegalSection />
      <CityComparison />
      <TrackRecord />
      <TweetFeed />
      <ShareSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
