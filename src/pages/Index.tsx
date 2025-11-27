import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles, Heart, Star, Camera, ArrowDown, Zap, Shield, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating background elements - sutis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-10 blur-3xl animate-float-smooth" style={{ background: 'linear-gradient(135deg, #E8A5B8 0%, #D88FA3 100%)' }}></div>
        <div className="absolute top-60 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl animate-float-smooth" style={{ animationDelay: '2s', background: 'linear-gradient(135deg, #8AC4D0 0%, #6BA8B5 100%)' }}></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 rounded-full opacity-10 blur-3xl animate-float-smooth" style={{ animationDelay: '4s', background: 'linear-gradient(135deg, #C09874 0%, #A88665 100%)' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <div className="animate-fade-in-up max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 relative z-50">
              <img src={logo} alt="Beautyness Club" className="h-12 w-auto drop-shadow-lg brightness-0 invert" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight text-foreground">
              Quer ter uma ideia de como poderia ficar
              <br />
              <span className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-primary block my-2">
                após iniciar uma jornada de cuidados?
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-5xl font-light text-foreground block mt-4">
                Resultados que a <span className="font-bold text-secondary">beautyness.club</span> pode te gerar
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-3xl text-foreground max-w-4xl mx-auto mb-4 md:mb-6 leading-relaxed">
              Basta <span className="font-bold text-primary">enviar uma imagem</span> que nossa IA mostrará uma projeção
            </p>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed">
              Nossa IA cria uma projeção ilustrativa, baseada na sua foto, para te ajudar na motivação.
              <br className="hidden sm:block" />
              <span className="font-bold text-foreground">É 100% gratuito e leva apenas 30 segundos.</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-12 md:mb-16">
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-primary/30 bg-card shadow-soft">
                <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="font-semibold text-sm sm:text-base">100% Privado & Seguro</span>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-accent/30 bg-card shadow-soft">
                <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <span className="font-semibold text-sm sm:text-base">Resultados Realistas</span>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-secondary/30 bg-card shadow-soft">
                <div className="flex items-center gap-2 sm:gap-3 text-foreground">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  <span className="font-semibold text-sm sm:text-base">IA Avançada</span>
                </div>
              </div>
            </div>

            <div className="animate-bounce">
              <ArrowDown className="w-10 h-10 text-primary mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Example Result Section */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground animate-fade-in-up">
            Veja um exemplo real de resultado
          </h2>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <img 
              src="/lovable-uploads/exemplo-resultado.png" 
              alt="Exemplo real de transformação - antes e depois"
              className="w-full max-w-4xl mx-auto rounded-3xl shadow-intense border-2 border-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-foreground leading-tight">
              Milhares de mulheres já descobriram sua melhor versão
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 bg-card shadow-soft animate-slide-in-left hover:shadow-glow transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-3 sm:mb-4">98%</div>
                <p className="text-muted-foreground text-base sm:text-lg font-medium">Se sentem mais motivadas após ver o resultado</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/20 bg-card shadow-soft animate-fade-in-up hover:shadow-glow transition-shadow" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-3 sm:mb-4">30s</div>
                <p className="text-muted-foreground text-base sm:text-lg font-medium">É o tempo médio para gerar sua transformação</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-secondary/20 bg-card shadow-soft animate-slide-in-right hover:shadow-glow transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl font-bold text-secondary mb-3 sm:mb-4">+50k</div>
                <p className="text-muted-foreground text-base sm:text-lg font-medium">Mulheres já visualizaram sua melhor versão</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="container mx-auto px-6 mb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card shadow-soft animate-fade-in-up">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="text-center mb-8 md:mb-12">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative">
                    <div className="p-3 sm:p-4 rounded-full bg-primary shadow-glow">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-foreground leading-tight px-4">
                  Como tirar a foto perfeita para melhores resultados
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl px-4">
                  Siga estas dicas simples para obter uma transformação mais precisa
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center space-y-2 sm:space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="p-4 sm:p-6 rounded-full bg-primary text-white shadow-soft w-14 h-14 sm:w-20 sm:h-20 mx-auto flex items-center justify-center transform rotate-3">
                    <span className="text-2xl sm:text-3xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-foreground text-base sm:text-lg md:text-xl">Corpo Completo</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base px-2">Certifique-se de aparecer da cabeça aos pés na foto</p>
                </div>
                
                <div className="text-center space-y-2 sm:space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="p-4 sm:p-6 rounded-full bg-accent text-white shadow-soft w-14 h-14 sm:w-20 sm:h-20 mx-auto flex items-center justify-center transform -rotate-2">
                    <span className="text-2xl sm:text-3xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-foreground text-base sm:text-lg md:text-xl">Rosto de Frente</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base px-2">Olhe diretamente para a câmera com o rosto bem visível</p>
                </div>
                
                <div className="text-center space-y-2 sm:space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="p-4 sm:p-6 rounded-full bg-secondary text-white shadow-soft w-14 h-14 sm:w-20 sm:h-20 mx-auto flex items-center justify-center transform rotate-1">
                    <span className="text-2xl sm:text-3xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-foreground text-base sm:text-lg md:text-xl">Boa Iluminação</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base px-2">Use luz natural ou ambiente bem iluminado</p>
                </div>
                
                <div className="text-center space-y-2 sm:space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="p-4 sm:p-6 rounded-full bg-primary text-white shadow-soft w-14 h-14 sm:w-20 sm:h-20 mx-auto flex items-center justify-center transform -rotate-1">
                    <span className="text-2xl sm:text-3xl font-bold">4</span>
                  </div>
                  <h4 className="font-bold text-foreground text-base sm:text-lg md:text-xl">Foto Nítida</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base px-2">Evite fotos tremidas ou com baixa qualidade</p>
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
      <div className="text-center py-12 sm:py-16 text-muted-foreground border-t border-border bg-card/50 backdrop-blur-glass relative z-10">
        <div className="container mx-auto px-6">
          <p className="text-sm sm:text-base md:text-lg">Beautyness Club - CNPJ: 31.009.678/0001-69</p>
        </div>
      </div>
    </div>
  );
};

export default Index;