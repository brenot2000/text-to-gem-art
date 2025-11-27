import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Phone, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DashboardStatsProps = {
  stats: {
    fotosGeradas: number;
    contatosFeitos: number;
    vendasRealizadas: number;
    vendasPerdidas: number;
  };
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const chartData = [
    {
      name: "Imagens",
      value: stats.fotosGeradas,
      fill: "#a855f7",
    },
    {
      name: "Contatos",
      value: stats.contatosFeitos,
      fill: "#06b6d4",
    },
    {
      name: "Vendas",
      value: stats.vendasRealizadas,
      fill: "#10b981",
    },
    {
      name: "Perdidas",
      value: stats.vendasPerdidas,
      fill: "#ef4444",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card backdrop-blur-glass border-white/20 bg-[#1a1a2e] p-3 rounded-lg shadow-lg">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-white/80">{payload[0].value} leads</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Imagens Geradas</p>
                <p className="text-4xl font-bold text-white">{stats.fotosGeradas}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" }}>
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Contatos Feitos</p>
                <p className="text-4xl font-bold text-white">{stats.contatosFeitos}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" }}>
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Vendas Realizadas</p>
                <p className="text-4xl font-bold text-white">{stats.vendasRealizadas}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Vendas Perdidas</p>
                <p className="text-4xl font-bold text-white">{stats.vendasPerdidas}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold">Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                style={{ fontSize: '14px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
