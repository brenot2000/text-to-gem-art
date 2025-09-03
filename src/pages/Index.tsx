import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles, Heart, Star, Camera, ArrowDown, Zap, Shield, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-accent rounded-full opacity-30 blur-3xl animate-float-smooth"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-warm rounded-full opacity-25 blur-3xl animate-float-smooth" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-cool rounded-full opacity-30 blur-3xl animate-float-smooth" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <div className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="p-8 rounded-full bg-gradient-primary shadow-glow animate-pulse-glow">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 blur-xl animate-pulse-glow"></div>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight drop-shadow-lg">
              <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-sm">
                Veja Sua Melhor
              </span>
              <br />
              <span className="text-6xl md:text-7xl text-white drop-shadow-2xl">
                Versão em 30 Dias
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto mb-6 leading-relaxed font-medium drop-shadow-lg">
              Imagine acordar todos os dias <span className="font-bold text-white bg-black/20 px-2 py-1 rounded-lg">se sentindo confiante</span> no seu próprio corpo
            </p>

            <p className="text-xl text-white max-w-3xl mx-auto mb-16 leading-relaxed drop-shadow-lg bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              Nossa inteligência artificial exclusiva mostra exatamente como você ficaria com o corpo que sempre sonhou.
              <br />
              <span className="font-bold text-white">É 100% gratuito e leva apenas 30 segundos.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
              <div className="glass-card px-8 py-4 rounded-full backdrop-blur-glass border border-white/40 bg-white/20 shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <Shield className="w-6 h-6" />
                  <span className="font-bold text-lg drop-shadow-sm">100% Privado & Seguro</span>
                </div>
              </div>
              <div className="glass-card px-8 py-4 rounded-full backdrop-blur-glass border border-white/40 bg-white/20 shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <Target className="w-6 h-6" />
                  <span className="font-bold text-lg drop-shadow-sm">Resultados Realistas</span>
                </div>
              </div>
              <div className="glass-card px-8 py-4 rounded-full backdrop-blur-glass border border-white/40 bg-white/20 shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <Zap className="w-6 h-6" />
                  <span className="font-bold text-lg drop-shadow-sm">IA Avançada</span>
                </div>
              </div>
            </div>

            <div className="animate-bounce">
              <ArrowDown className="w-10 h-10 text-white/60 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-xl bg-black/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/30 inline-block">
              Milhares de mulheres já descobriram sua melhor versão
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card backdrop-blur-glass border-white/40 bg-white/25 shadow-glass animate-slide-in-left">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4 drop-shadow-sm">98%</div>
                <p className="text-gray-800 text-lg font-semibold">Se sentem mais motivadas após ver o resultado</p>
              </CardContent>
            </Card>
            <Card className="glass-card backdrop-blur-glass border-white/40 bg-white/25 shadow-glass animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-4 drop-shadow-sm">30s</div>
                <p className="text-gray-800 text-lg font-semibold">É o tempo médio para gerar sua transformação</p>
              </CardContent>
            </Card>
            <Card className="glass-card backdrop-blur-glass border-white/40 bg-white/25 shadow-glass animate-slide-in-right">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-cool bg-clip-text text-transparent mb-4 drop-shadow-sm">+50k</div>
                <p className="text-gray-800 text-lg font-semibold">Mulheres já visualizaram sua melhor versão</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="container mx-auto px-6 mb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10 shadow-intense animate-fade-in-up">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="p-4 rounded-full bg-gradient-secondary shadow-glow animate-pulse-glow">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-secondary opacity-30 blur-xl animate-pulse-glow"></div>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-xl">
                  Como tirar a foto perfeita para melhores resultados
                </h3>
                <p className="text-white text-xl drop-shadow-lg bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl inline-block">
                  Siga estas dicas simples para obter uma transformação mais precisa
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="p-6 rounded-full bg-gradient-primary shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform rotate-3">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-bold text-white text-xl drop-shadow-lg">Corpo Completo</h4>
                  <p className="text-white font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">Certifique-se de aparecer da cabeça aos pés na foto</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="p-6 rounded-full bg-gradient-secondary shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform -rotate-2">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-bold text-white text-xl drop-shadow-lg">Rosto de Frente</h4>
                  <p className="text-white font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">Olhe diretamente para a câmera com o rosto bem visível</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="p-6 rounded-full bg-gradient-accent shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform rotate-1">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-bold text-white text-xl drop-shadow-lg">Boa Iluminação</h4>
                  <p className="text-white font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">Use luz natural ou ambiente bem iluminado</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="p-6 rounded-full bg-gradient-warm shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform -rotate-1">
                    <span className="text-3xl font-bold text-white">4</span>
                  </div>
                  <h4 className="font-bold text-white text-xl drop-shadow-lg">Foto Nítida</h4>
                  <p className="text-white font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">Evite fotos tremidas ou com baixa qualidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Generator */}
      <div className="container mx-auto px-6 pb-20 relative z-10">
        <ImageGenerator />
      </div>

      {/* Footer */}
      <div className="text-center py-16 text-white/60 border-t border-white/20 bg-black/20 backdrop-blur-glass relative z-10">
        <div className="container mx-auto px-6">
          <p className="mb-2 text-lg">Powered by Advanced AI Technology</p>
          <p className="text-sm">Seus dados são processados com total segurança e privacidade</p>
        </div>
      </div>
    </div>
  );
};

export default Index;