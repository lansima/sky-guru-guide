import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Plane } from "lucide-react";
import { Header } from "@/components/Header";
import { DocumentList } from "@/components/DocumentList";
import { useAircraftById } from "@/hooks/useAircraft";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AircraftDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: aircraft, isLoading: isLoadingAircraft } = useAircraftById(id);
  const { data: documents, isLoading: isLoadingDocuments } = useDocuments(id);

  if (isLoadingAircraft) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-8 w-3/4 mt-4" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <Plane className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Aircraft Not Found</h1>
          <p className="text-muted-foreground mt-2">The aircraft you're looking for doesn't exist.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to Library</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Back button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Library
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Aircraft Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-video rounded-lg overflow-hidden bg-secondary mb-4">
                {aircraft.image_url ? (
                  <img
                    src={aircraft.image_url}
                    alt={`${aircraft.manufacturer} ${aircraft.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Plane className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{aircraft.manufacturer}</Badge>
                  <Badge variant="outline" className="capitalize">{aircraft.type}</Badge>
                </div>
                
                <h1 className="text-2xl font-bold text-foreground">
                  {aircraft.manufacturer} {aircraft.model}
                </h1>
                
                {aircraft.description && (
                  <p className="text-muted-foreground">{aircraft.description}</p>
                )}

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {documents?.length || 0} document{documents?.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Technical Documentation
            </h2>
            
            {isLoadingDocuments ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <DocumentList documents={documents || []} aircraftId={id!} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
