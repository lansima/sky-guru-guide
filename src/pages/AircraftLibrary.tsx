import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAircraft, Aircraft } from "@/hooks/useAircraft";
import { useManufacturerLogos } from "@/hooks/useManufacturerLogos";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane } from "lucide-react";

export default function AircraftLibrary() {
  const { data: aircraft, isLoading: isLoadingAircraft } = useAircraft();
  const { data: logos, isLoading: isLoadingLogos } = useManufacturerLogos();

  // Create a map of manufacturer logos
  const logoMap = useMemo(() => {
    return new Map(logos?.map((l) => [l.manufacturer, l.logo_url]) || []);
  }, [logos]);

  // Group aircraft by manufacturer
  const groupedAircraft = useMemo(() => {
    if (!aircraft) return {};
    
    return aircraft.reduce((acc, item) => {
      const manufacturer = item.manufacturer;
      if (!acc[manufacturer]) {
        acc[manufacturer] = [];
      }
      acc[manufacturer].push(item);
      return acc;
    }, {} as Record<string, Aircraft[]>);
  }, [aircraft]);

  const manufacturers = Object.keys(groupedAircraft).sort();
  const isLoading = isLoadingAircraft || isLoadingLogos;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Aircraft</h1>
            <p className="text-muted-foreground mt-1">Browse aircraft by manufacturer</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">My Aircraft</span>
          </div>
        </div>

        {/* Aircraft List */}
        <div className="space-y-1">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 p-4 border-b border-border">
                <Skeleton className="w-24 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            ))
          ) : manufacturers.length === 0 ? (
            <div className="text-center py-12">
              <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No aircraft found</p>
            </div>
          ) : (
            manufacturers.map((manufacturer) => (
              <ManufacturerRow
                key={manufacturer}
                manufacturer={manufacturer}
                aircraft={groupedAircraft[manufacturer]}
                logoUrl={logoMap.get(manufacturer)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

interface ManufacturerRowProps {
  manufacturer: string;
  aircraft: Aircraft[];
  logoUrl?: string;
}

function ManufacturerRow({ manufacturer, aircraft, logoUrl }: ManufacturerRowProps) {
  return (
    <div className="flex items-start gap-6 p-4 border-b border-border hover:bg-muted/30 transition-colors">
      {/* Manufacturer Logo/Image */}
      <div className="w-28 flex-shrink-0 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={manufacturer}
            className="max-h-12 max-w-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-12 w-full bg-muted rounded">
            <Plane className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Manufacturer Name and Models */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-foreground mb-2">{manufacturer.toUpperCase()}</h2>
        <div className="flex flex-wrap gap-x-1 gap-y-1">
          {aircraft.map((item, index) => (
            <span key={item.id} className="inline-flex items-center">
              <Link
                to={`/aircraft/${item.id}`}
                className="text-primary hover:text-primary/80 hover:underline text-sm transition-colors"
              >
                {item.model}
              </Link>
              {index < aircraft.length - 1 && (
                <span className="text-muted-foreground mx-1">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
