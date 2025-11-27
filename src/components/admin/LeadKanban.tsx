import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import { useAdminLeads, Lead } from "@/hooks/useAdminLeads";

const DroppableColumn = ({ 
  id, 
  title, 
  color, 
  leads, 
  count,
  onUpdate,
  onDelete,
  onFetchImages,
}: { 
  id: string; 
  title: string; 
  color: string; 
  leads: Lead[];
  count: number;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onFetchImages: (id: string) => Promise<any>;
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
      <CardContent className="space-y-3 min-h-[800px] max-h-[900px] overflow-y-auto">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onUpdate={onUpdate}
              onDelete={onDelete}
              onFetchImages={onFetchImages}
            />
          ))
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
  const { leads, isLoading, updateLead, deleteLead, updateLeadStatus, fetchLeadImages, setLeads } = useAdminLeads();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      // Optimistic update
      setLeads(prevLeads =>
        prevLeads.map(l =>
          l.id === leadId ? { ...l, status: newStatus } : l
        )
      );
      updateLeadStatus(leadId, newStatus);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  const getStats = () => {
    return {
      fotosGeradas: leads.reduce((sum, lead) => sum + (lead.fotos_geradas || 0), 0),
      contatosFeitos: leads.filter((l) => 
        l.status === "contato_feito" || 
        l.status === "venda_realizada" || 
        l.status === "venda_perdida"
      ).length,
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
              onUpdate={updateLead}
              onDelete={deleteLead}
              onFetchImages={fetchLeadImages}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="opacity-90 rotate-3 scale-105">
              <LeadCard 
                lead={activeLead} 
                onUpdate={updateLead}
                onDelete={deleteLead}
                onFetchImages={fetchLeadImages}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
