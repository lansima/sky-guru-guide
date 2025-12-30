import { useState } from "react";
import { Search, Plane, FileText, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const manufacturers = ["Boeing", "Airbus", "Bombardier", "Embraer"];

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleQuickFilter = (manufacturer: string) => {
    setSearchValue(manufacturer);
    onSearch(manufacturer);
  };

  return (
    <section className="relative overflow-hidden border-b border-border/50">
      {/* Background pattern */}
      <div className="absolute inset-0 aviation-grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-card" />
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary">
              <Brain className="h-3.5 w-3.5 mr-2" />
              AI-Powered Aviation Library
            </Badge>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Aviation</span>{" "}
              <span className="text-gradient">Technical Library</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Access aircraft manuals, systems documentation, and get instant answers 
              from your AI Flight Instructor.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search aircraft by manufacturer or model..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-1 pl-12 pr-4 h-14 bg-transparent border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                />
                <Button type="submit" size="lg" className="m-2 px-6">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Quick search:</span>
            {manufacturers.map((manufacturer) => (
              <Button
                key={manufacturer}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickFilter(manufacturer)}
                className="rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                {manufacturer}
              </Button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-8 border-t border-border/50">
            <div className="text-center">
              <Plane className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">6+</div>
              <div className="text-sm text-muted-foreground">Aircraft Types</div>
            </div>
            <div className="text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">18+</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">AI</div>
              <div className="text-sm text-muted-foreground">Instructor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
