import { useParams, Link } from "react-router-dom";
import { ChevronLeft, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { PDFViewer } from "@/components/PDFViewer";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { useDocumentById } from "@/hooks/useDocuments";
import { useAircraftById } from "@/hooks/useAircraft";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function DocumentViewer() {
  const { id } = useParams<{ id: string }>();
  const { data: document, isLoading: isLoadingDocument } = useDocumentById(id);
  const { data: aircraft } = useAircraftById(document?.aircraft_id || undefined);

  if (isLoadingDocument) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-[calc(100vh-64px)] flex">
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="w-[400px] border-l border-border p-4">
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-[calc(100%-100px)] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Document Not Found</h1>
          <p className="text-muted-foreground mt-2">The document you're looking for doesn't exist.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to Library</Link>
          </Button>
        </main>
      </div>
    );
  }

  const documentContext = {
    title: document.title,
    aircraft: aircraft ? `${aircraft.manufacturer} ${aircraft.model}` : "Unknown",
    category: document.category,
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/50 flex-shrink-0">
        <div className="container py-3 flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Library
          </Link>
          <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
          {aircraft && (
            <>
              <Link 
                to={`/aircraft/${aircraft.id}`} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {aircraft.manufacturer} {aircraft.model}
              </Link>
              <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
            </>
          )}
          <span className="text-foreground truncate max-w-[300px]">{document.title}</span>
        </div>
      </div>

      {/* Split view - fills remaining height */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* PDF Viewer */}
          <ResizablePanel defaultSize={65} minSize={40}>
            <div className="h-full overflow-hidden">
              <PDFViewer pdfUrl={document.pdf_url} title={document.title} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />

          {/* AI Chat Sidebar */}
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-full overflow-hidden">
              <AIChatSidebar documentContext={documentContext} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
