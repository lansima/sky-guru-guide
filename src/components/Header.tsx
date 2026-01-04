import { Plane, BookOpen, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">AeroTech Library</span>
            <span className="text-xs text-muted-foreground">Technical Documentation</span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Library
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Brain className="h-4 w-4" />
            AI Instructor
          </div>
        </nav>
      </div>
    </header>
  );
}
