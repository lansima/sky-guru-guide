import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCards } from "@/components/FeatureCards";
import { AIInstructorSection } from "@/components/AIInstructorSection";
import { AircraftGrid } from "@/components/AircraftGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeatureCards />
        <section id="models" className="py-16 bg-white">
          <AircraftGrid searchQuery="" />
        </section>
        <AIInstructorSection />
      </main>
    </div>
  );
};

export default Index;
