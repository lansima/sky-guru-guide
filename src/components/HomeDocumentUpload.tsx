import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function HomeDocumentUpload() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] || null;
    setFile(nextFile);
    setUploadedDocId(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isUploading) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `community-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      const effectiveTitle = file.name.replace(/\.pdf$/i, "");

      const { data: docData, error: insertError } = await supabase
        .from("documents")
        .insert({
          title: effectiveTitle,
          description: description.trim() || null,
          category: "training",
          pdf_url: urlData.publicUrl,
          aircraft_id: null,
          page_count: null,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      setUploadedDocId(docData.id);
      setDescription("");
      setFile(null);
      toast.success("Document uploaded. Thanks for sharing!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="upload" className="py-16">
      <div className="container">
        <div className="mx-auto mb-6 flex max-w-xl items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Upload manuals, study notes, or schematics so they can live in the
            AeroTech Library and be used with the AI Flight Instructor for guided
            study.
          </p>
        </div>
        <form
          onSubmit={handleUpload}
          className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
        >
          {uploadedDocId && (
            <div className="flex justify-end">
              <Button asChild size="sm" variant="outline">
                <a href={`/document/${uploadedDocId}`}>Open Upload</a>
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="upload_file">Upload PDF</Label>
            <input
              id="upload_file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload_description">Description (optional)</Label>
            <Textarea
              id="upload_description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What makes this useful for study?"
              disabled={isUploading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Update to Library"}
          </Button>
        </form>
      </div>
    </section>
  );
}
