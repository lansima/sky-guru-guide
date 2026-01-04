import { useState } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAircraft } from "@/hooks/useAircraft";
import { useManufacturerLogos, useUpsertManufacturerLogo, useDeleteManufacturerLogo } from "@/hooks/useManufacturerLogos";

export function LogoManagement() {
  const { data: aircraft, isLoading: isLoadingAircraft } = useAircraft();
  const { data: logos, isLoading: isLoadingLogos } = useManufacturerLogos();
  const upsertLogo = useUpsertManufacturerLogo();
  const deleteLogo = useDeleteManufacturerLogo();

  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Get unique manufacturers from aircraft
  const manufacturers = [...new Set(aircraft?.map((a) => a.manufacturer) || [])].sort();

  // Create a map of existing logos
  const logoMap = new Map(logos?.map((l) => [l.manufacturer, l]) || []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedManufacturer) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB for logos)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file must be less than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      // Create a safe filename
      const ext = file.name.split(".").pop();
      const fileName = `${selectedManufacturer.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("manufacturer-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("manufacturer-logos")
        .getPublicUrl(fileName);

      // Save to database
      await upsertLogo.mutateAsync({
        manufacturer: selectedManufacturer,
        logo_url: urlData.publicUrl,
      });

      toast.success(`Logo uploaded for ${selectedManufacturer}`);
      setSelectedManufacturer("");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteLogo.mutateAsync(deleteId);
      toast.success("Logo deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete logo");
    } finally {
      setDeleteId(null);
    }
  };

  const isLoading = isLoadingAircraft || isLoadingLogos;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Manufacturer Logos
        </CardTitle>
        <CardDescription>
          Upload logos for manufacturers to display in the Aircraft Library
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg border border-dashed border-border">
          <Select
            value={selectedManufacturer}
            onValueChange={setSelectedManufacturer}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                  {logoMap.has(manufacturer) && " ✓"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={!selectedManufacturer || isUploading}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button
                asChild
                disabled={!selectedManufacturer || isUploading}
                className="w-full sm:w-auto cursor-pointer"
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Logo"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Logos Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Logo</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logos?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No logos uploaded yet
                  </TableCell>
                </TableRow>
              ) : (
                logos?.map((logo) => (
                  <TableRow key={logo.id}>
                    <TableCell>
                      <img
                        src={logo.logo_url}
                        alt={logo.manufacturer}
                        className="h-10 max-w-[100px] object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{logo.manufacturer}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(logo.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Logo</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this manufacturer logo? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
