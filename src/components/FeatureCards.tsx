import { FileText, Settings, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Aircraft Manuals",
    description: "Browse our extensive collection of operating manuals, checklists, and quick reference guides.",
    buttonText: "Browse Manuals",
    href: "/#manuals",
  },
  {
    icon: Settings,
    title: "Systems Documentation",
    description: "In-depth technical data on hydraulics, electrical, avionics, and more.",
    buttonText: "View Docs",
    href: "/#systems",
  },
  {
    icon: Monitor,
    title: "Aircraft Models",
    description: "Browse our extensive collection of operating manuals, checklists, and reference guides.",
    buttonText: "Browse Models",
    href: "/#models",
  },
];

export function FeatureCards() {
  return (
    <section id="manuals" className="py-20 bg-white">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-8"
            >
              {/* Icon */}
              <div className="mb-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                <feature.icon className="h-12 w-12 text-primary stroke-[1.5]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Button */}
              <Button asChild className="mt-auto">
                <a href={feature.href}>{feature.buttonText}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
