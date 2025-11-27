import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "foto_gerada" | "contato_feito" | "venda_realizada" | "venda_perdida";
  reference_image_url: string | null;
  generated_image_url: string | null;
  created_at: string;
  vendedor: string | null;
  valor_venda: number | null;
  fotos_geradas: number | null;
};

export const useAdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      console.log("Fetching leads via edge function...");
      
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("No authentication token");
      }

      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log(`Fetched ${data?.data?.length || 0} leads`);
      setLeads(data?.data || []);
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("No authentication token");
      }

      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { id, ...updates },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Update local state optimistically
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
      );

      return true;
    } catch (error: any) {
      console.error("Error updating lead:", error);
      toast({
        title: "Erro ao atualizar lead",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("No authentication token");
      }

      const { data, error } = await supabase.functions.invoke("admin-leads", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { id },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Remove from local state
      setLeads((prev) => prev.filter((lead) => lead.id !== id));

      toast({
        title: "Lead excluído",
        description: "O lead foi removido com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Erro ao excluir lead",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const updateLeadStatus = useCallback(
    async (
      id: string,
      status: "foto_gerada" | "contato_feito" | "venda_realizada" | "venda_perdida"
    ) => {
      // Optimistic update
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );

      const success = await updateLead(id, { status });

      if (success) {
        toast({
          title: "✅ Status atualizado!",
          description: "O lead foi movido com sucesso.",
        });
      } else {
        // Revert on failure
        fetchLeads();
      }

      return success;
    },
    [updateLead, fetchLeads]
  );

  useEffect(() => {
    fetchLeads();

    // Realtime subscription for new leads only (inserts from landing page)
    const channel = supabase
      .channel("leads_new")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        () => {
          console.log("New lead detected, refreshing...");
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    fetchLeads,
    updateLead,
    deleteLead,
    updateLeadStatus,
    setLeads,
  };
};
