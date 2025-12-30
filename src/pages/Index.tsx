import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AircraftGrid } from "@/components/AircraftGrid";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onSearch={setSearchQuery} />
        <AircraftGrid searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Index;
