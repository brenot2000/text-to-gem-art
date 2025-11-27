import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Phone, CheckCircle, XCircle } from "lucide-react";

type DashboardStatsProps = {
  stats: {
    fotosGeradas: number;
    contatosFeitos: number;
    vendasRealizadas: number;
    vendasPerdidas: number;
  };
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Imagens Geradas</p>
              <p className="text-4xl font-bold text-white">{stats.fotosGeradas}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-primary">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Contatos Feitos</p>
              <p className="text-4xl font-bold text-white">{stats.contatosFeitos}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-accent">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Vendas Realizadas</p>
              <p className="text-4xl font-bold text-white">{stats.vendasRealizadas}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Vendas Perdidas</p>
              <p className="text-4xl font-bold text-white">{stats.vendasPerdidas}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
