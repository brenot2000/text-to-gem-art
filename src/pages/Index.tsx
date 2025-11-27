import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles, Heart, Star, Camera, ArrowDown, Zap, Shield, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-primary rounded-full opacity-25 blur-3xl animate-float-smooth"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-secondary rounded-full opacity-20 blur-3xl animate-float-smooth" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-accent rounded-full opacity-25 blur-3xl animate-float-smooth" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <div className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <img src={logo} alt="Beautyness Club" className="h-12 w-auto" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-secondary drop-shadow-lg">
              Se veja mais magra com
              <br />
              <span className="text-7xl md:text-8xl bg-gradient-primary bg-clip-text text-transparent">
                inteligência artificial
              </span>
              <br />
              <span className="text-4xl md:text-5xl font-light text-secondary">
                resultado de 30 dias com a <span className="font-bold">beautyness.club</span>
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-secondary/90 max-w-4xl mx-auto mb-6 leading-relaxed font-light">
              Basta <span className="font-semibold text-secondary">enviar uma imagem</span> que nossa IA mostrará o resultado
            </p>

            <p className="text-xl text-secondary/80 max-w-3xl mx-auto mb-16 leading-relaxed">
              Nossa inteligência artificial exclusiva mostra exatamente como você ficaria com o corpo que sempre sonhou.
              <br />
              <span className="font-semibold text-secondary">É 100% gratuito e leva apenas 30 segundos.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
              <div className="glass-card px-6 py-3 rounded-full backdrop-blur-glass border border-secondary/30 bg-card/80">
                <div className="flex items-center gap-3 text-secondary">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">100% Privado & Seguro</span>
                </div>
              </div>
              <div className="glass-card px-6 py-3 rounded-full backdrop-blur-glass border border-secondary/30 bg-card/80">
                <div className="flex items-center gap-3 text-secondary">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Resultados Realistas</span>
                </div>
              </div>
              <div className="glass-card px-6 py-3 rounded-full backdrop-blur-glass border border-secondary/30 bg-card/80">
                <div className="flex items-center gap-3 text-secondary">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">IA Avançada</span>
                </div>
              </div>
            </div>

            <div className="animate-bounce">
              <ArrowDown className="w-10 h-10 text-secondary/60 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Example Result Section */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-secondary animate-fade-in-up">
            Veja um exemplo real de resultado
          </h2>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <img 
              src="/lovable-uploads/35df97ed-1871-47d7-bfef-6ba2a1f506e5.png" 
              alt="Exemplo real de transformação - antes e depois"
              className="w-full max-w-4xl mx-auto rounded-3xl shadow-intense border-2 border-secondary/20"
            />
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-secondary">
              Milhares de mulheres já descobriram sua melhor versão
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card backdrop-blur-glass border-secondary/30 bg-card/80 shadow-glass animate-slide-in-left">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">98%</div>
                <p className="text-secondary/80 text-lg">Se sentem mais motivadas após ver o resultado</p>
              </CardContent>
            </Card>
            <Card className="glass-card backdrop-blur-glass border-secondary/30 bg-card/80 shadow-glass animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-secondary bg-clip-text text-transparent mb-4">30s</div>
                <p className="text-secondary/80 text-lg">É o tempo médio para gerar sua transformação</p>
              </CardContent>
            </Card>
            <Card className="glass-card backdrop-blur-glass border-secondary/30 bg-card/80 shadow-glass animate-slide-in-right">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-4">+50k</div>
                <p className="text-secondary/80 text-lg">Mulheres já visualizaram sua melhor versão</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="container mx-auto px-6 mb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-card backdrop-blur-glass border-secondary/30 bg-card/80 shadow-intense animate-fade-in-up">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="p-4 rounded-full bg-gradient-primary shadow-glow">
                      <Camera className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 blur-xl"></div>
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-secondary">
                  Como tirar a foto perfeita para melhores resultados
                </h3>
                <p className="text-secondary/80 text-xl">
                  Siga estas dicas simples para obter uma transformação mais precisa
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="p-6 rounded-full bg-gradient-primary shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform rotate-3">
                    <span className="text-3xl font-bold text-secondary">1</span>
                  </div>
                  <h4 className="font-bold text-secondary text-xl">Corpo Completo</h4>
                  <p className="text-secondary/70">Certifique-se de aparecer da cabeça aos pés na foto</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="p-6 rounded-full bg-gradient-secondary shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform -rotate-2">
                    <span className="text-3xl font-bold text-secondary">2</span>
                  </div>
                  <h4 className="font-bold text-secondary text-xl">Rosto de Frente</h4>
                  <p className="text-secondary/70">Olhe diretamente para a câmera com o rosto bem visível</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="p-6 rounded-full bg-gradient-accent shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform rotate-1">
                    <span className="text-3xl font-bold text-secondary">3</span>
                  </div>
                  <h4 className="font-bold text-secondary text-xl">Boa Iluminação</h4>
                  <p className="text-secondary/70">Use luz natural ou ambiente bem iluminado</p>
                </div>
                
                <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="p-6 rounded-full bg-gradient-warm shadow-brutal w-20 h-20 mx-auto flex items-center justify-center transform -rotate-1">
                    <span className="text-3xl font-bold text-secondary">4</span>
                  </div>
                  <h4 className="font-bold text-secondary text-xl">Foto Nítida</h4>
                  <p className="text-secondary/70">Evite fotos tremidas ou com baixa qualidade</p>
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
      <div className="text-center py-16 text-secondary/60 border-t border-secondary/20 bg-card/40 backdrop-blur-glass relative z-10">
        <div className="container mx-auto px-6">
          <p className="text-lg">Criado e desenvolvido por Breno Santos</p>
        </div>
      </div>
    </div>
  );
};

export default Index;