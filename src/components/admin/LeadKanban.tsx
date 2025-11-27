import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LeadCard } from "./LeadCard";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "foto_gerada" | "contato_feito" | "venda_realizada";
  reference_image_url: string | null;
  generated_image_url: string | null;
  created_at: string;
};

export const LeadKanban = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel("leads_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: "foto_gerada" | "contato_feito" | "venda_realizada"
  ) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: "O status do lead foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  const columns = [
    { status: "foto_gerada", title: "Fotos Geradas", color: "from-purple-500 to-pink-500" },
    { status: "contato_feito", title: "Contatos Feitos", color: "from-blue-500 to-cyan-500" },
    { status: "venda_realizada", title: "Vendas Realizadas", color: "from-green-500 to-emerald-500" },
  ];

  if (isLoading) {
    return (
      <div className="text-center text-white text-xl py-12">
        Carregando leads...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <Card
          key={column.status}
          className="glass-card backdrop-blur-glass border-white/20 bg-white/10"
        >
          <CardHeader>
            <CardTitle className={`text-white bg-gradient-to-r ${column.color} bg-clip-text text-transparent`}>
              {column.title}
              <span className="ml-2 text-sm font-normal text-white/60">
                ({getLeadsByStatus(column.status).length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            {getLeadsByStatus(column.status).map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={updateLeadStatus}
              />
            ))}
            {getLeadsByStatus(column.status).length === 0 && (
              <p className="text-white/60 text-center py-8">
                Nenhum lead nesta coluna
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
