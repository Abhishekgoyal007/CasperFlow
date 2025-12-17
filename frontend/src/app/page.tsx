import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  UseCasesSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
