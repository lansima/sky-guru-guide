import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Aircraft {
  id: string;
  manufacturer: string;
  model: string;
  type: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useAircraft(searchQuery?: string) {
  return useQuery({
    queryKey: ["aircraft", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("aircraft")
        .select("*")
        .order("manufacturer", { ascending: true });

      if (searchQuery && searchQuery.trim()) {
        const search = searchQuery.trim().toLowerCase();
        query = query.or(
          `manufacturer.ilike.%${search}%,model.ilike.%${search}%,type.ilike.%${search}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching aircraft:", error);
        throw error;
      }

      return data as Aircraft[];
    },
  });
}

export function useAircraftById(id: string | undefined) {
  return useQuery({
    queryKey: ["aircraft", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("aircraft")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching aircraft:", error);
        throw error;
      }

      return data as Aircraft;
    },
    enabled: !!id,
  });
}
