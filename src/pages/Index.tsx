import { ImageGenerator } from "@/components/ImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Gerador de Imagem IA</h1>
          <p className="text-muted-foreground">
            Crie imagens incríveis usando Google Gemini
          </p>
        </div>
        <ImageGenerator />
      </div>
    </div>
  );
};

export default Index;
