import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Phone, CheckCircle, XCircle, DollarSign, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

type Lead = {
  id: string;
  status: string;
  vendedor: string | null;
  valor_venda: number | null;
};

type DashboardStatsProps = {
  stats: {
    fotosGeradas: number;
    contatosFeitos: number;
    vendasRealizadas: number;
    vendasPerdidas: number;
  };
  leads: Lead[];
};

export const DashboardStats = ({ stats, leads }: DashboardStatsProps) => {
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

  // Calcular valor total de vendas e vendas por vendedor
  const vendasRealizadas = leads.filter(l => l.status === "venda_realizada");
  const valorTotal = vendasRealizadas.reduce((sum, lead) => sum + (lead.valor_venda || 0), 0);
  
  const vendasPorVendedor = vendasRealizadas.reduce((acc, lead) => {
    const vendedor = lead.vendedor || "Sem vendedor";
    if (!acc[vendedor]) {
      acc[vendedor] = { count: 0, valor: 0 };
    }
    acc[vendedor].count += 1;
    acc[vendedor].valor += lead.valor_venda || 0;
    return acc;
  }, {} as Record<string, { count: number; valor: number }>);

  const vendedoresData = Object.entries(vendasPorVendedor)
    .map(([nome, data]) => ({
      nome,
      vendas: data.count,
      valor: data.valor,
    }))
    .sort((a, b) => b.valor - a.valor);

  const COLORS = ["#a855f7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

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

  const CustomVendedorTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card backdrop-blur-glass border-white/20 bg-[#1a1a2e] p-3 rounded-lg shadow-lg">
          <p className="text-white font-semibold">{payload[0].payload.nome}</p>
          <p className="text-white/80">{payload[0].payload.vendas} vendas</p>
          <p className="text-green-400 font-semibold">
            R$ {payload[0].payload.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { 
      style: "currency", 
      currency: "BRL" 
    });
  };

  const taxaConversao = stats.fotosGeradas > 0 
    ? ((stats.vendasRealizadas / stats.fotosGeradas) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Valor Total</p>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(valorTotal)}</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1 font-medium">Taxa de Conversão</p>
                <p className="text-4xl font-bold text-white">{taxaConversao}%</p>
              </div>
              <div className="p-3 rounded-full" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card className="glass-card backdrop-blur-glass border-white/30 bg-[#1a1a2e]/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Vendas por Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendedoresData.length > 0 ? (
              <div className="space-y-3">
                {vendedoresData.map((vendedor, index) => (
                  <div 
                    key={vendedor.nome}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <p className="text-white font-semibold">{vendedor.nome}</p>
                        <p className="text-white/60 text-sm">{vendedor.vendas} vendas</p>
                      </div>
                    </div>
                    <p className="text-green-400 font-bold text-lg">
                      {formatCurrency(vendedor.valor)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[240px]">
                <p className="text-white/40 text-center">
                  Nenhuma venda registrada ainda
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
