import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HomeAIChat } from "@/components/HomeAIChat";
import { HomeDocumentUpload } from "@/components/HomeDocumentUpload";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HomeAIChat />
        <HomeDocumentUpload />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
