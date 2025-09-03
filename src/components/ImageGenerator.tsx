import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, Camera, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

// API Key padrão do Google Gemini
const DEFAULT_API_KEY = "AIzaSyCT7Og4oj9ChYgTKIqLF8BIhcUeZSn8naU";

// Prompt padrão fixo para transformação fitness
const DEFAULT_PROMPT = `Pegue esta foto e recrie a mesma pessoa em versão **100% magra, atlética e fitness**, mantendo o mesmo rosto e as mesmas roupas originais.

Regras principais:

* **Barriga/Abdômen:** a barriga deve ser **reta, firme e lisa**, **sem nenhuma pochete, dobra, volume ou gordura abaixo do umbigo**. Não deixe nenhuma saliência na parte inferior da barriga. O abdômen deve parecer definido, atlético e saudável por baixo da roupa.
* **Cintura:** bem fina, destacando a forma atlética.
* **Rosto:** afinado, mandíbula visível, pescoço alongado, bochechas menores.
* **Braços e Ombros:** magros e tonificados.
* **Peito:** firme, definido, sem gordura.
* **Quadris e Pernas:** mais magros e definidos, pernas atléticas.
* **Postura:** ereta, confiante, atlética.
* **Roupas:** mantenha exatamente as roupas originais, sem mudar cor ou estilo. Apenas ajuste o caimento para o corpo magro. **Nunca invente novas roupas e nunca exponha pele.**
* **Resultado:** fotorealista, com transformação clara: corpo magro, atlético, barriga reta e sem nenhuma gordura acumulada.`;

export const ImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertImageToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.onerror = () => reject(new Error('Erro ao converter imagem'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande. Tamanho máximo: 10MB');
      return;
    }

    try {
      setReferenceFile(file);
      const imageUrl = URL.createObjectURL(file);
      setReferenceImage(imageUrl);
      toast.success('Imagem de referência carregada!');
    } catch (error) {
      toast.error('Erro ao carregar imagem');
    }
  };

  const removeReferenceImage = () => {
    if (referenceImage) {
      URL.revokeObjectURL(referenceImage);
    }
    setReferenceImage(null);
    setReferenceFile(null);
  };

  const generateImage = async () => {
    if (!referenceFile) {
      toast.error("Por favor, selecione uma imagem de referência");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Prepare parts array
      const parts: any[] = [
        {
          text: DEFAULT_PROMPT,
        }
      ];

      // Add reference image
      const { data: imageData, mimeType } = await convertImageToBase64(referenceFile);
      parts.push({
        inlineData: {
          mimeType,
          data: imageData
        }
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${DEFAULT_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: parts,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      // Verifica se há dados de imagem na resposta
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const imagePart = data.candidates[0].content.parts.find(
          (part: any) => part.inlineData?.mimeType?.startsWith("image/")
        );
        
        if (imagePart) {
          const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          setGeneratedImage(imageUrl);
          toast.success("Imagem gerada com sucesso!");
        } else {
          throw new Error("Nenhuma imagem foi retornada pela API");
        }
      } else {
        throw new Error("Resposta inesperada da API");
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar imagem. Verifique sua API Key e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Upload Section */}
      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10 shadow-intense animate-fade-in-up">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-accent shadow-glow animate-pulse-glow">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-30 blur-xl animate-pulse-glow"></div>
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">Descubra Sua Melhor Versão</CardTitle>
          <p className="text-white/80 text-xl">
            Envie sua foto e veja como você ficaria com o corpo que sempre sonhou
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-6">
            <Label htmlFor="referenceImage" className="text-2xl font-bold text-white">Sua Foto Atual</Label>
            {!referenceImage ? (
              <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 text-center bg-white/5 hover:border-white/50 hover:bg-white/10 transition-all duration-500 group">
                <div className="animate-float-smooth group-hover:scale-110 transition-transform duration-500">
                  <Upload className="mx-auto h-16 w-16 text-white mb-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Faça o upload da sua foto
                </h3>
                <p className="text-lg text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                  Siga o tutorial acima para uma foto perfeita e resultados mais precisos
                </p>
                <Input
                  id="referenceImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="lg"
                  className="bg-gradient-primary shadow-intense hover:shadow-glow transition-all duration-300 text-lg px-8 py-4 h-auto animate-pulse-glow"
                  onClick={() => document.getElementById('referenceImage')?.click()}
                >
                  <Upload className="w-6 h-6 mr-3" />
                  Escolher Foto
                </Button>
              </div>
            ) : (
              <div className="relative border-2 border-white/30 rounded-3xl p-8 bg-white/10 animate-fade-in-up">
                <div className="flex items-start gap-8">
                  <div className="relative">
                    <img
                      src={referenceImage}
                      alt="Sua foto atual"
                      className="w-40 h-40 object-cover rounded-2xl shadow-intense border-2 border-white/30"
                    />
                    <div className="absolute -top-3 -right-3 p-2 rounded-full bg-gradient-secondary shadow-glow">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">Foto carregada com sucesso!</h4>
                    <p className="text-lg text-white/80 mb-2">
                      {referenceFile?.name}
                    </p>
                    <p className="text-white/60">
                      Tamanho: {Math.round((referenceFile?.size || 0) / 1024)}KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={removeReferenceImage}
                    className="shrink-0 border-white/30 hover:border-red-400 hover:bg-red-500/20 bg-white/10 backdrop-blur-sm"
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={generateImage}
            disabled={isLoading || !referenceFile}
            size="lg"
            className="w-full bg-gradient-hero shadow-intense hover:shadow-glow transition-all duration-500 text-xl px-8 py-6 h-auto animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Criando sua transformação...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 mr-3" />
                Ver Minha Transformação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {generatedImage && (
        <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10 shadow-intense animate-fade-in-up">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 rounded-full bg-gradient-warm shadow-glow animate-pulse-glow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-warm opacity-30 blur-xl animate-pulse-glow"></div>
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">
              Sua Melhor Versão Revelada
            </CardTitle>
            <p className="text-white/80 text-xl">
              Compare e veja a diferença - esta poderia ser você em 30 dias!
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Before Image */}
              <div className="space-y-6 animate-slide-in-left">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white/70 mb-4">ANTES</h3>
                  <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
                </div>
                <div className="relative group">
                  <img
                    src={referenceImage}
                    alt="Sua foto original"
                    className="w-full rounded-3xl shadow-intense border-2 border-white/20 group-hover:shadow-glow transition-all duration-500"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-black/10 group-hover:bg-black/0 transition-all duration-500"></div>
                </div>
              </div>

              {/* After Image */}
              <div className="space-y-6 animate-slide-in-right">
                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">DEPOIS</h3>
                  <div className="w-24 h-1 bg-gradient-warm mx-auto rounded-full shadow-glow"></div>
                </div>
                <div className="relative group">
                  <img
                    src={generatedImage}
                    alt="Sua transformação fitness"
                    className="w-full rounded-3xl shadow-intense border-2 border-white/30 group-hover:shadow-glow transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-12 p-10 bg-gradient-hero rounded-3xl shadow-intense animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h4 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                ✨ Sabia que nós podemos te ajudar a ter esse resultado?
              </h4>
              <p className="text-white/90 text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
                Esta visualização mostra seu potencial real. Com o acompanhamento certo, 
                você pode transformar essa visão em realidade.
              </p>
              <p className="text-white/70 text-lg">
                Cada jornada é única. Os resultados podem variar de acordo com dedicação e cuidados individuais.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};