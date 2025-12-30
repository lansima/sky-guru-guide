import { FileText, BookOpen, Wrench, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/hooks/useDocuments";

interface DocumentListProps {
  documents: Document[];
  aircraftId: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  manual: <BookOpen className="h-4 w-4" />,
  "quick-reference": <FileText className="h-4 w-4" />,
  systems: <Wrench className="h-4 w-4" />,
  emergency: <AlertCircle className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  manual: "bg-primary/10 text-primary border-primary/20",
  "quick-reference": "bg-green-500/10 text-green-400 border-green-500/20",
  systems: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  emergency: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function DocumentList({ documents, aircraftId }: DocumentListProps) {
  if (!documents.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No documents available for this aircraft.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <Link key={doc.id} to={`/document/${doc.id}`}>
          <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${categoryColors[doc.category] || categoryColors.manual}`}>
                  {categoryIcons[doc.category] || <FileText className="h-4 w-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {doc.title}
                  </h4>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {doc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {doc.category.replace("-", " ")}
                    </Badge>
                    {doc.page_count && (
                      <span className="text-xs text-muted-foreground">
                        {doc.page_count} pages
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
