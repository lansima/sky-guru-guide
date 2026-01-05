import {
  Activity,
  CloudSun,
  Compass,
  Headphones,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const resources = [
  {
    title: "Meteorology",
    description: "Weather theory & reports",
    icon: CloudSun,
  },
  {
    title: "Air Law & Regulations",
    description: "ICAO & local rules",
    icon: ShieldCheck,
  },
  {
    title: "Navigation & Flight Planning",
    description: "Charting & GPS",
    icon: Compass,
  },
  {
    title: "Human Performance",
    description: "Physiology & CRM",
    icon: Activity,
  },
  {
    title: "Principles of Flight",
    description: "Aerodynamics",
    icon: Wind,
  },
  {
    title: "Radio Communications",
    description: "ATC phraseology",
    icon: Headphones,
  },
] as const;

export default function PilotResources() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
            <p className="text-sm font-medium">
              Notice: All materials are for training purposes only and are not
              official operational documents.
            </p>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Pilot Resources</h1>
            <p className="mt-2 text-muted-foreground">
              Study materials covering core flight academy subjects.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {resource.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
