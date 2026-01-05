import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">AeroTech Library</p>
            <p className="text-sm text-muted-foreground">
              Community-powered aviation documents and study materials.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Explore</p>
            <div className="flex flex-col gap-1 text-sm">
              <Link to="/aircraft" className="text-muted-foreground hover:text-foreground">
                My Aircraft
              </Link>
              <Link
                to="/knowledge-base"
                className="text-muted-foreground hover:text-foreground"
              >
                Pilot Resources
              </Link>
              <a href="/#upload" className="text-muted-foreground hover:text-foreground">
                Upload PDF
              </a>
              <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">
                Disclaimer
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Note</p>
            <p className="text-sm text-muted-foreground">
              For training only. Not official operational documentation.
            </p>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} AeroTech Library</span>
          <span>
            Built for study and training use.{" "}
            <Link to="/disclaimer" className="underline underline-offset-4 hover:text-foreground">
              Read disclaimer
            </Link>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}

