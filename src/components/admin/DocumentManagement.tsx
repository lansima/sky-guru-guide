import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAircraft } from "@/hooks/useAircraft";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DOCUMENT_CATEGORIES = [
  "manual",
  "quick_reference",
  "systems",
  "checklist",
  "training",
  "other",
];

interface DocumentFormData {
  title: string;
  aircraft_id: string;
  category: string;
  description: string;
  pdf_url: string;
  page_count: string;
}

const emptyFormData: DocumentFormData = {
  title: "",
  aircraft_id: "",
  category: "manual",
  description: "",
  pdf_url: "",
  page_count: "",
};

export default function DocumentManagement() {
  const { data: documents, isLoading: documentsLoading } = useDocuments();
  const { data: aircraft, isLoading: aircraftLoading } = useAircraft();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const openAddDialog = () => {
    setEditingDocument(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (doc: Document) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      aircraft_id: doc.aircraft_id || "",
      category: doc.category,
      description: doc.description || "",
      pdf_url: doc.pdf_url,
      page_count: doc.page_count?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (doc: Document) => {
    setDeletingDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      setFormData({ ...formData, pdf_url: publicUrl });
      toast({ title: "File uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const aircraftId = formData.aircraft_id === "__none__" ? null : formData.aircraft_id || null;
      const documentData = {
        title: formData.title,
        aircraft_id: aircraftId,
        category: formData.category,
        description: formData.description || null,
        pdf_url: formData.pdf_url,
        page_count: formData.page_count ? parseInt(formData.page_count) : null,
      };

      if (editingDocument) {
        const { error } = await supabase
          .from("documents")
          .update(documentData)
          .eq("id", editingDocument.id);

        if (error) throw error;
        toast({ title: "Document updated successfully" });
      } else {
        const { error } = await supabase.from("documents").insert(documentData);

        if (error) throw error;
        toast({ title: "Document added successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDocument) return;

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", deletingDocument.id);

      if (error) throw error;
      toast({ title: "Document deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingDocument(null);
    }
  };

  const getAircraftName = (aircraftId: string | null) => {
    if (!aircraftId || !aircraft) return "—";
    const found = aircraft.find((a) => a.id === aircraftId);
    return found ? `${found.manufacturer} ${found.model}` : "Unknown";
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const isLoading = documentsLoading || aircraftLoading;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingDocument ? "Edit Document" : "Add New Document"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., A320 Flight Crew Operating Manual"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aircraft">Aircraft (optional)</Label>
                <Select
                  value={formData.aircraft_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, aircraft_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft..." />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf">PDF File</Label>
                <div className="flex gap-2">
                  <Input
                    id="pdf_url"
                    value={formData.pdf_url}
                    onChange={(e) =>
                      setFormData({ ...formData, pdf_url: e.target.value })
                    }
                    placeholder="PDF URL or upload a file"
                    required
                  />
                  <Label
                    htmlFor="pdf_upload"
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingFile ? "Uploading..." : "Upload"}
                  </Label>
                  <Input
                    id="pdf_upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="page_count">Page Count (optional)</Label>
                <Input
                  id="page_count"
                  type="number"
                  value={formData.page_count}
                  onChange={(e) =>
                    setFormData({ ...formData, page_count: e.target.value })
                  }
                  placeholder="e.g., 150"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the document..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || uploadingFile}>
                  {isSubmitting
                    ? "Saving..."
                    : editingDocument
                    ? "Update"
                    : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading documents...
          </div>
        ) : !documents?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No documents found. Add one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {doc.title}
                    </TableCell>
                    <TableCell>{getAircraftName(doc.aircraft_id)}</TableCell>
                    <TableCell>{formatCategory(doc.category)}</TableCell>
                    <TableCell>{doc.page_count || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(doc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(doc)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDocument?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
