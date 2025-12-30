import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  aircraft_id: string | null;
  title: string;
  category: string;
  pdf_url: string;
  page_count: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useDocuments(aircraftId?: string) {
  return useQuery({
    queryKey: ["documents", aircraftId],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select("*")
        .order("category", { ascending: true });

      if (aircraftId) {
        query = query.eq("aircraft_id", aircraftId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }

      return data as Document[];
    },
  });
}

export function useDocumentById(id: string | undefined) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        throw error;
      }

      return data as Document;
    },
    enabled: !!id,
  });
}
