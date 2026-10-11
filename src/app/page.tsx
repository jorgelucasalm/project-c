import { HomeHeader } from "@/components/public/home/home-header";
import { HeroSection } from "@/components/public/home/hero-section";
import { PlatformSummary } from "@/components/public/home/platform-summary";
import { FeaturesSection } from "@/components/public/home/features-section";
import { EarningsSection } from "@/components/public/home/earnings-section";
import { HowItWorksSection } from "@/components/public/home/how-it-works-section";
import { FaqSection } from "@/components/public/home/faq-section";
import { GetStartedSection } from "@/components/public/home/get-started-section";
import { HomeFooter } from "@/components/public/home/home-footer";

export const metadata = {
  title: "Teach With Us — English Academy",
  description: "Own your teaching business. Manage your schedule, students and lessons with English Academy.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <HomeHeader />
      <main>
        <HeroSection />
        <PlatformSummary />
        <FeaturesSection />
        <EarningsSection />
        <HowItWorksSection />
        <FaqSection />
        <GetStartedSection />
      </main>
      <HomeFooter />
    </div>
  );
}
