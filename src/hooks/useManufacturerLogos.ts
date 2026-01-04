import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ManufacturerLogo {
  id: string;
  manufacturer: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export function useManufacturerLogos() {
  return useQuery({
    queryKey: ["manufacturer-logos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manufacturer_logos")
        .select("*")
        .order("manufacturer", { ascending: true });

      if (error) {
        console.error("Error fetching manufacturer logos:", error);
        throw error;
      }

      return data as ManufacturerLogo[];
    },
  });
}

export function useUpsertManufacturerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ manufacturer, logo_url }: { manufacturer: string; logo_url: string }) => {
      const { data, error } = await supabase
        .from("manufacturer_logos")
        .upsert(
          { manufacturer, logo_url },
          { onConflict: "manufacturer" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturer-logos"] });
    },
  });
}

export function useDeleteManufacturerLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("manufacturer_logos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturer-logos"] });
    },
  });
}
