import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type LeadCardProps = {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "foto_gerada" | "contato_feito" | "venda_realizada" | "venda_perdida";
    reference_image_url: string | null;
    generated_image_url: string | null;
    created_at: string;
  };
};

export const LeadCard = ({ lead }: LeadCardProps) => {
  const [copied, setCopied] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(lead.phone);
      setCopied(true);
      toast({
        title: "Número copiado!",
        description: "O número foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o número.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card backdrop-blur-glass border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{lead.name}</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/80">
            <Mail className="w-4 h-4 shrink-0" />
            <a href={`mailto:${lead.email}`} className="hover:text-white truncate">
              {lead.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-white/80" />
            <a
              href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-white/80 flex-1 truncate"
            >
              {lead.phone}
            </a>
            <Button
              onClick={copyPhone}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/80" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Calendar className="w-4 h-4" />
            {formatDate(lead.created_at)}
          </div>
        </div>

        {/* Images inline */}
        {(lead.reference_image_url || lead.generated_image_url) && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {lead.reference_image_url && (
              <div>
                <p className="text-white/60 text-xs mb-1 text-center">Antes</p>
                <img
                  src={lead.reference_image_url}
                  alt="Antes"
                  className="w-full h-32 object-cover rounded-lg border border-white/20"
                />
              </div>
            )}
            {lead.generated_image_url && (
              <div>
                <p className="text-white/60 text-xs mb-1 text-center">Depois</p>
                <img
                  src={lead.generated_image_url}
                  alt="Depois"
                  className="w-full h-32 object-cover rounded-lg border border-white/20"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
