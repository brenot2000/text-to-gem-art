import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles, Heart, Star, Camera, CheckCircle, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-luxury opacity-10"></div>
        <div className="container mx-auto px-6 py-20 text-center relative">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="p-6 rounded-full bg-gradient-luxury shadow-glow animate-float">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-luxury bg-clip-text text-transparent leading-tight">
              Veja Sua Melhor<br />
              <span className="text-5xl md:text-6xl">Versão em 30 Dias</span>
            </h1>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              Imagine acordar todos os dias <span className="font-semibold text-foreground">se sentindo confiante</span> no seu próprio corpo
            </p>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Nossa inteligência artificial exclusiva mostra exatamente como você ficaria com o corpo que sempre sonhou.
              <br />
              <span className="font-semibold text-primary">É 100% gratuito e leva apenas 30 segundos.</span>
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-full bg-primary/10">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">100% Privado & Seguro</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-full bg-primary/10">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">Resultados Realistas</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">IA Avançada</span>
              </div>
            </div>

            <div className="animate-bounce">
              <ArrowDown className="w-8 h-8 text-primary mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Milhares de mulheres já descobriram sua melhor versão
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Se sentem mais motivadas após ver o resultado</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">30s</div>
                <p className="text-muted-foreground">É o tempo médio para gerar sua transformação</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">+50k</div>
                <p className="text-muted-foreground">Mulheres já visualizaram sua melhor versão</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-luxury border-0 bg-gradient-accent/20 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-luxury shadow-glow">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Como tirar a foto perfeita para melhores resultados
                </h3>
                <p className="text-muted-foreground">
                  Siga estas dicas simples para obter uma transformação mais precisa
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Corpo Completo</h4>
                  <p className="text-sm text-muted-foreground">Certifique-se de aparecer da cabeça aos pés na foto</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Rosto de Frente</h4>
                  <p className="text-sm text-muted-foreground">Olhe diretamente para a câmera com o rosto bem visível</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Boa Iluminação</h4>
                  <p className="text-sm text-muted-foreground">Use luz natural ou ambiente bem iluminado</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Foto Nítida</h4>
                  <p className="text-sm text-muted-foreground">Evite fotos tremidas ou com baixa qualidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Generator */}
      <div className="container mx-auto px-6 pb-16">
        <ImageGenerator />
      </div>

      {/* Footer */}
      <div className="text-center py-12 text-muted-foreground text-sm border-t border-border bg-card/30">
        <div className="container mx-auto px-6">
          <p className="mb-2">Powered by Advanced AI Technology</p>
          <p className="text-xs">Seus dados são processados com total segurança e privacidade</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
