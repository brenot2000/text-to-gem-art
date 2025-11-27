import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ArrowRight, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type LeadCardProps = {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "foto_gerada" | "contato_feito" | "venda_realizada";
    reference_image_url: string | null;
    generated_image_url: string | null;
    created_at: string;
  };
  onStatusChange: (leadId: string, newStatus: "foto_gerada" | "contato_feito" | "venda_realizada") => void;
};

export const LeadCard = ({ lead, onStatusChange }: LeadCardProps) => {
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

  const getNextStatus = () => {
    if (lead.status === "foto_gerada") return "contato_feito";
    if (lead.status === "contato_feito") return "venda_realizada";
    return null;
  };

  const getNextStatusLabel = () => {
    if (lead.status === "foto_gerada") return "Marcar Contato Feito";
    if (lead.status === "contato_feito") return "Marcar Venda Realizada";
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/5 hover:bg-white/10 transition-all">
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{lead.name}</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/80">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${lead.email}`} className="hover:text-white">
              {lead.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Phone className="w-4 h-4" />
            <a
              href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {lead.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Calendar className="w-4 h-4" />
            {formatDate(lead.created_at)}
          </div>
        </div>

        {(lead.reference_image_url || lead.generated_image_url) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full glass-card backdrop-blur-glass border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Ver Imagens
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card backdrop-blur-glass border-white/20 bg-white/10 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">Transformação de {lead.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {lead.reference_image_url && (
                  <div>
                    <p className="text-white/80 mb-2 text-center">Antes</p>
                    <img
                      src={lead.reference_image_url}
                      alt="Antes"
                      className="w-full rounded-lg border border-white/20"
                    />
                  </div>
                )}
                {lead.generated_image_url && (
                  <div>
                    <p className="text-white/80 mb-2 text-center">Depois</p>
                    <img
                      src={lead.generated_image_url}
                      alt="Depois"
                      className="w-full rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {nextStatus && (
          <Button
            onClick={() => onStatusChange(lead.id, nextStatus)}
            size="sm"
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            {getNextStatusLabel()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
