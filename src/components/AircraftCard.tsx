import { Plane, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Aircraft } from "@/hooks/useAircraft";

interface AircraftCardProps {
  aircraft: Aircraft;
  documentCount?: number;
}

export function AircraftCard({ aircraft, documentCount = 0 }: AircraftCardProps) {
  return (
    <Link to={`/aircraft/${aircraft.id}`}>
      <Card className="group h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-secondary">
          {aircraft.image_url ? (
            <img
              src={aircraft.image_url}
              alt={`${aircraft.manufacturer} ${aircraft.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Plane className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
          
          {/* Manufacturer badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border-border/50"
          >
            {aircraft.manufacturer}
          </Badge>
        </div>

        <CardContent className="p-5">
          <div className="space-y-3">
            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {aircraft.model}
              </h3>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
            </div>

            {/* Description */}
            {aircraft.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {aircraft.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Badge variant="outline" className="text-xs">
                {aircraft.type}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>{documentCount} docs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
