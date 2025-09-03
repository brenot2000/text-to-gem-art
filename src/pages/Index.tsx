import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles, Heart, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-luxury opacity-10"></div>
        <div className="container mx-auto px-6 py-16 text-center relative">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-luxury shadow-glow animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-luxury bg-clip-text text-transparent leading-tight">
              Sua Transformação<br />
              <span className="text-4xl md:text-5xl">em 30 Dias</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Descubra como você ficaria com seu corpo dos sonhos. 
              <br />
              <span className="font-semibold text-foreground">Envie sua foto e veja a magia acontecer.</span>
            </p>

            <div className="flex justify-center items-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-5 h-5 text-primary" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-primary" />
                <span>Resultados Realistas</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>IA Avançada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        <ImageGenerator />
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-muted-foreground text-sm border-t border-border">
        <p>Powered by Advanced AI Technology</p>
      </div>
    </div>
  );
};

export default Index;
