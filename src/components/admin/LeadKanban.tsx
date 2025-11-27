import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LeadCard } from "./LeadCard";
import { DashboardStats } from "./DashboardStats";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

type Lead = {
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

const DroppableColumn = ({ 
  id, 
  title, 
  color, 
  leads, 
  count 
}: { 
  id: string; 
  title: string; 
  color: string; 
  leads: Lead[];
  count: number;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl transition-all ${
        isOver ? "ring-2 ring-white/50 scale-105" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent font-bold`}>
            {title}
          </span>
          <span className="text-sm font-normal text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {count}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto">
        {leads.length > 0 ? (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-white/40 text-sm">Arraste cards aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LeadKanban = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchLeads();

    // Subscrição realtime com debounce para evitar atualizações desnecessárias
    let timeoutId: NodeJS.Timeout;
    
    const channel = supabase
      .channel("leads_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          // Ignora eventos de UPDATE para evitar conflito com optimistic updates
          if (payload.eventType !== 'UPDATE') {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              fetchLeads();
            }, 500);
          }
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timeoutId);
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
    newStatus: "foto_gerada" | "contato_feito" | "venda_realizada" | "venda_perdida"
  ) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) {
        // Se der erro, reverte o estado local
        fetchLeads();
        throw error;
      }

      toast({
        title: "✅ Status atualizado!",
        description: "O lead foi movido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as "foto_gerada" | "contato_feito" | "venda_realizada" | "venda_perdida";

    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      // Optimistic update - atualiza o estado local imediatamente
      setLeads(prevLeads =>
        prevLeads.map(l =>
          l.id === leadId ? { ...l, status: newStatus } : l
        )
      );

      // Depois atualiza no banco de dados
      updateLeadStatus(leadId, newStatus);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  const getStats = () => {
    return {
      fotosGeradas: leads.filter((l) => l.status === "foto_gerada").length,
      contatosFeitos: leads.filter((l) => l.status === "contato_feito").length,
      vendasRealizadas: leads.filter((l) => l.status === "venda_realizada").length,
      vendasPerdidas: leads.filter((l) => l.status === "venda_perdida").length,
    };
  };

  const columns = [
    { status: "foto_gerada", title: "Fotos Geradas", color: "from-purple-500 to-pink-500" },
    { status: "contato_feito", title: "Contatos Feitos", color: "from-blue-500 to-cyan-500" },
    { status: "venda_realizada", title: "Vendas Realizadas", color: "from-green-500 to-emerald-500" },
    { status: "venda_perdida", title: "Vendas Perdidas", color: "from-red-500 to-rose-500" },
  ];

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  if (isLoading) {
    return (
      <div className="text-center text-white text-xl py-12">
        Carregando leads...
      </div>
    );
  }

  return (
    <>
      <DashboardStats stats={getStats()} leads={leads} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <DroppableColumn
              key={column.status}
              id={column.status}
              title={column.title}
              color={column.color}
              leads={getLeadsByStatus(column.status)}
              count={getLeadsByStatus(column.status).length}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="opacity-90 rotate-3 scale-105">
              <LeadCard lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
