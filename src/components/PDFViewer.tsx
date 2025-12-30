import { useState } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Page 1 of 1</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h4 className="text-sm font-medium text-foreground truncate max-w-[300px]">
          {title}
        </h4>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Maximize2 className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={pdfUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4 bg-secondary/30">
        <div 
          className="mx-auto bg-card rounded-lg shadow-lg overflow-hidden border border-border"
          style={{ 
            width: `${zoom}%`,
            maxWidth: '100%',
            minWidth: '50%'
          }}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-[calc(100vh-200px)]"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
