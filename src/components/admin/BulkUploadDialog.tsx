import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, FileUp, Loader2, X, Check, AlertCircle, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAircraft } from "@/hooks/useAircraft";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DOCUMENT_CATEGORIES = [
  "manual",
  "quick_reference",
  "systems",
  "checklist",
  "training",
  "other",
];

interface BulkFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "analyzing" | "ready" | "error";
  error?: string;
  pdfUrl?: string;
  title: string;
  category: string;
  aircraft_id: string;
  page_count: string;
}

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const { data: aircraft } = useAircraft();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaultAircraftId, setDefaultAircraftId] = useState<string>("__none__");

  const processFile = async (bulkFile: BulkFile): Promise<BulkFile> => {
    try {
      // Upload
      setBulkFiles((prev) =>
        prev.map((f) => (f.id === bulkFile.id ? { ...f, status: "uploading" } : f))
      );

      const fileName = `${Date.now()}-${bulkFile.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, bulkFile.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(fileName);

      // Analyze
      setBulkFiles((prev) =>
        prev.map((f) => (f.id === bulkFile.id ? { ...f, status: "analyzing", pdfUrl: publicUrl } : f))
      );

      let title = bulkFile.file.name.replace(/\.pdf$/i, "");
      let category = "manual";
      let aircraft_id = "";

      try {
        const { data, error } = await supabase.functions.invoke("analyze-document", {
          body: { fileName: bulkFile.file.name },
        });

        if (!error && data) {
          if (data.title) title = data.title;
          if (data.category && DOCUMENT_CATEGORIES.includes(data.category)) {
            category = data.category;
          }
          if (data.manufacturer && data.model && aircraft) {
            const matched = aircraft.find(
              (a) =>
                a.manufacturer.toLowerCase().includes(data.manufacturer.toLowerCase()) &&
                a.model.toLowerCase().includes(data.model.toLowerCase())
            );
            if (matched) aircraft_id = matched.id;
          }
        }
      } catch (analysisError) {
        console.error("Analysis error:", analysisError);
        // Continue without AI results
      }

      return {
        ...bulkFile,
        status: "ready",
        pdfUrl: publicUrl,
        title,
        category,
        aircraft_id,
      };
    } catch (error: any) {
      return {
        ...bulkFile,
        status: "error",
        error: error.message,
      };
    }
  };

  const addFiles = async (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter((f) => f.type === "application/pdf");

    if (pdfFiles.length === 0) {
      toast({
        title: "No valid PDFs",
        description: "Please select PDF files only.",
        variant: "destructive",
      });
      return;
    }

    const newBulkFiles: BulkFile[] = pdfFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: "pending" as const,
      title: file.name.replace(/\.pdf$/i, ""),
      category: "manual",
      aircraft_id: defaultAircraftId === "__none__" ? "" : defaultAircraftId,
      page_count: "",
    }));

    setBulkFiles((prev) => [...prev, ...newBulkFiles]);

    // Process files sequentially to avoid rate limits
    for (const bulkFile of newBulkFiles) {
      const result = await processFile(bulkFile);
      setBulkFiles((prev) =>
        prev.map((f) => (f.id === result.id ? result : f))
      );
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    await addFiles(e.dataTransfer.files);
  }, [aircraft, defaultAircraftId]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFiles(e.target.files);
      e.target.value = ""; // Reset for re-upload
    }
  };

  const removeFile = (id: string) => {
    setBulkFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<BulkFile>) => {
    setBulkFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleSaveAll = async () => {
    const readyFiles = bulkFiles.filter((f) => f.status === "ready" && f.pdfUrl);
    if (readyFiles.length === 0) {
      toast({
        title: "No files ready",
        description: "Wait for files to finish processing or add more PDFs.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const documents = readyFiles.map((f) => ({
        title: f.title,
        aircraft_id: f.aircraft_id === "__none__" || !f.aircraft_id ? null : f.aircraft_id,
        category: f.category,
        pdf_url: f.pdfUrl!,
        page_count: f.page_count ? parseInt(f.page_count) : null,
        description: null,
      }));

      const { error } = await supabase.from("documents").insert(documents);
      if (error) throw error;

      toast({
        title: "Documents saved",
        description: `Successfully added ${documents.length} document(s).`,
      });

      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setBulkFiles([]);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const readyCount = bulkFiles.filter((f) => f.status === "ready").length;
  const processingCount = bulkFiles.filter(
    (f) => f.status === "uploading" || f.status === "analyzing" || f.status === "pending"
  ).length;
  const progress = bulkFiles.length > 0 ? ((readyCount + bulkFiles.filter(f => f.status === "error").length) / bulkFiles.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Upload Documents
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Default Aircraft Selector */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30">
            <Plane className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <label className="text-sm font-medium">Default Aircraft</label>
              <p className="text-xs text-muted-foreground">Pre-select aircraft for all uploaded files</p>
            </div>
            <Select
              value={defaultAircraftId}
              onValueChange={setDefaultAircraftId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select aircraft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None (Auto-detect)</SelectItem>
                {aircraft?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.manufacturer} {a.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => document.getElementById("bulk_pdf_upload")?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop multiple PDFs here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Each file will be uploaded and analyzed with AI
              </p>
            </div>
            <Input
              id="bulk_pdf_upload"
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Progress */}
          {bulkFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {readyCount} of {bulkFiles.length} ready
                  {processingCount > 0 && ` (${processingCount} processing...)`}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Files Table */}
          {bulkFiles.length > 0 && (
            <ScrollArea className="flex-1 border border-border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-40">Aircraft</TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-16 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkFiles.map((bf) => (
                    <TableRow key={bf.id}>
                      <TableCell>
                        {bf.status === "pending" && (
                          <Loader2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        {bf.status === "uploading" && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {bf.status === "analyzing" && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {bf.status === "ready" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {bf.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === bf.id ? (
                          <Input
                            value={bf.title}
                            onChange={(e) => updateFile(bf.id, { title: e.target.value })}
                            onBlur={() => setEditingId(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <span
                            className="cursor-pointer hover:underline truncate block max-w-xs"
                            onClick={() => bf.status === "ready" && setEditingId(bf.id)}
                            title={bf.title}
                          >
                            {bf.title}
                          </span>
                        )}
                        {bf.status === "error" && (
                          <p className="text-xs text-destructive">{bf.error}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={bf.aircraft_id || "__none__"}
                          onValueChange={(value) => updateFile(bf.id, { aircraft_id: value })}
                          disabled={bf.status !== "ready"}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">None</SelectItem>
                            {aircraft?.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.manufacturer} {a.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={bf.category}
                          onValueChange={(value) => updateFile(bf.id, { category: value })}
                          disabled={bf.status !== "ready"}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {formatCategory(cat)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFile(bf.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={readyCount === 0 || isSaving || processingCount > 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                `Save All (${readyCount})`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
