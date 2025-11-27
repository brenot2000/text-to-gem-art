import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, Calendar, Copy, Check, DollarSign, User, ZoomIn, X, Trash2, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Lead } from "@/hooks/useAdminLeads";

type LeadCardProps = {
  lead: Lead;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onFetchImages: (id: string) => Promise<any>;
};

export const LeadCard = ({ lead, onUpdate, onDelete, onFetchImages }: LeadCardProps) => {
  const [copied, setCopied] = useState(false);
  const [vendedor, setVendedor] = useState(lead.vendedor || "");
  const [valorVenda, setValorVenda] = useState(
    lead.valor_venda 
      ? lead.valor_venda.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; label: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesFetched, setImagesFetched] = useState(false);

  // Load images on demand when user clicks
  const handleLoadImages = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagesFetched || imagesLoading) return;
    setImagesLoading(true);
    try {
      await onFetchImages(lead.id);
      setImagesFetched(true);
    } finally {
      setImagesLoading(false);
    }
  };

  const openImageViewer = (url: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage({ url, label });
    setImageViewerOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(lead.id);
    setIsDeleting(false);
    setDeleteDialogOpen(false);
  };

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
        title: "✅ Número copiado!",
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

  const formatCurrency = (value: string) => {
    const numero = value.replace(/\D/g, "");
    if (!numero) return "";
    const valorNumerico = parseFloat(numero) / 100;
    return valorNumerico.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatCurrency(e.target.value);
    setValorVenda(valorFormatado);
  };

  const handleUpdateVenda = async () => {
    setIsSaving(true);
    try {
      const valorNumerico = valorVenda 
        ? parseFloat(valorVenda.replace(/\./g, "").replace(",", "."))
        : null;
      
      await onUpdate(lead.id, {
        vendedor: vendedor || null,
        valor_venda: valorNumerico,
      });

      toast({
        title: "✅ Dados atualizados!",
        description: "Vendedor e valor foram salvos com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    if (vendedor !== (lead.vendedor || "") || valorVenda !== (lead.valor_venda?.toString() || "")) {
      handleUpdateVenda();
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card backdrop-blur-glass border-white/30 bg-[#252541]/90 hover:bg-[#2d2d4a]/90 transition-all cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">{lead.name}</h3>
            {lead.fotos_geradas && lead.fotos_geradas > 1 && (
              <p className="text-white/60 text-xs mt-1">
                {lead.fotos_geradas} fotos geradas
              </p>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-red-500/20 text-white/50 hover:text-red-400 shrink-0 ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/90">
            <Mail className="w-4 h-4 shrink-0 text-white/70" />
            <a 
              href={`mailto:${lead.email}`} 
              className="hover:text-white truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-white/70" />
            <a
              href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-white/90 flex-1 truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.phone}
            </a>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                copyPhone();
              }}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-white/20"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/70" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.created_at)}
          </div>
        </div>

        {/* Campos de Vendedor e Valor */}
        {(lead.status === "venda_realizada" || lead.status === "contato_feito") && (
          <div className="space-y-2 pt-2 border-t border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              <Label className="text-white/80 text-xs flex items-center gap-1">
                <User className="w-3 h-3" />
                Vendedor
              </Label>
              <Input
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
                onBlur={handleBlur}
                placeholder="Nome do vendedor"
                className="h-8 bg-white/10 border-white/20 text-white text-sm placeholder:text-white/40"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-white/80 text-xs flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Valor da Venda (R$)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                  R$
                </span>
                <Input
                  value={valorVenda}
                  onChange={handleValorChange}
                  onBlur={handleBlur}
                  placeholder="0,00"
                  type="text"
                  className="h-8 bg-white/10 border-white/20 text-white text-sm placeholder:text-white/40 pl-10"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        )}

        {/* Images - loaded on demand */}
        {!imagesFetched && !imagesLoading && (
          <Button
            onClick={handleLoadImages}
            variant="outline"
            size="sm"
            className="w-full mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Image className="w-4 h-4 mr-2" />
            Ver fotos
          </Button>
        )}
        
        {imagesLoading && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="h-32 bg-white/10 rounded-lg animate-pulse flex items-center justify-center">
              <Image className="w-6 h-6 text-white/30" />
            </div>
            <div className="h-32 bg-white/10 rounded-lg animate-pulse flex items-center justify-center">
              <Image className="w-6 h-6 text-white/30" />
            </div>
          </div>
        )}
        
        {imagesFetched && (lead.reference_image_url || lead.generated_image_url) && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {lead.reference_image_url && (
              <div 
                className="cursor-pointer group"
                onClick={(e) => openImageViewer(lead.reference_image_url!, "Antes", e)}
              >
                <p className="text-white/70 text-xs mb-1 text-center font-medium">Antes</p>
                <div className="relative">
                  <img
                    src={lead.reference_image_url}
                    alt="Antes"
                    className="w-full h-32 object-cover rounded-lg border-2 border-white/20 shadow-md group-hover:border-white/40 transition-all"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
            {lead.generated_image_url && (
              <div 
                className="cursor-pointer group"
                onClick={(e) => openImageViewer(lead.generated_image_url!, "Depois", e)}
              >
                <p className="text-white/70 text-xs mb-1 text-center font-medium">Depois</p>
                <div className="relative">
                  <img
                    src={lead.generated_image_url}
                    alt="Depois"
                    className="w-full h-32 object-cover rounded-lg border-2 border-white/20 shadow-md group-hover:border-white/40 transition-all"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Viewer Dialog */}
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black/95 border-white/20" onClick={(e) => e.stopPropagation()}>
            <DialogTitle className="sr-only">
              {selectedImage?.label || "Visualizar imagem"}
            </DialogTitle>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
                onClick={() => setImageViewerOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
              <p className="absolute top-4 left-4 text-white font-semibold text-lg bg-black/50 px-3 py-1 rounded-full">
                {selectedImage?.label}
              </p>
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.label}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              )}
              
              {/* Navigation buttons */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {lead.reference_image_url && (
                  <Button
                    variant={selectedImage?.label === "Antes" ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage({ url: lead.reference_image_url!, label: "Antes" });
                    }}
                    className={selectedImage?.label === "Antes" ? "bg-primary" : "bg-white/10 border-white/30 text-white hover:bg-white/20"}
                  >
                    Antes
                  </Button>
                )}
                {lead.generated_image_url && (
                  <Button
                    variant={selectedImage?.label === "Depois" ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage({ url: lead.generated_image_url!, label: "Depois" });
                    }}
                    className={selectedImage?.label === "Depois" ? "bg-primary" : "bg-white/10 border-white/30 text-white hover:bg-white/20"}
                  >
                    Depois
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1a1a2e] border-white/20" onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Deletar lead?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                Tem certeza que deseja deletar o lead <strong className="text-white">{lead.name}</strong>? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deletando..." : "Deletar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
