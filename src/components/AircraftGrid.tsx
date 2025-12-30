import { useAircraft } from "@/hooks/useAircraft";
import { useDocuments } from "@/hooks/useDocuments";
import { AircraftCard } from "./AircraftCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane } from "lucide-react";

interface AircraftGridProps {
  searchQuery: string;
}

export function AircraftGrid({ searchQuery }: AircraftGridProps) {
  const { data: aircraft, isLoading: isLoadingAircraft } = useAircraft(searchQuery);
  const { data: documents } = useDocuments();

  // Count documents per aircraft
  const documentCounts = documents?.reduce((acc, doc) => {
    if (doc.aircraft_id) {
      acc[doc.aircraft_id] = (acc[doc.aircraft_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  if (isLoadingAircraft) {
    return (
      <section className="container py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-lg" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!aircraft?.length) {
    return (
      <section className="container py-20">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Plane className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No aircraft found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery 
              ? `No aircraft match "${searchQuery}". Try a different search term.`
              : "No aircraft are available in the library yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {searchQuery ? `Results for "${searchQuery}"` : "Aircraft Library"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {aircraft.length} aircraft type{aircraft.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {aircraft.map((item, index) => (
          <div 
            key={item.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AircraftCard 
              aircraft={item} 
              documentCount={documentCounts[item.id] || 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
