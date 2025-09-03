import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, Camera, Sparkles } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card className="shadow-luxury border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-accent shadow-soft">
              <Camera className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Descubra Sua Melhor Versão</CardTitle>
          <p className="text-muted-foreground mt-2">
            Envie sua foto e veja como você ficaria com o corpo que sempre sonhou
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="referenceImage" className="text-lg font-semibold">Sua Foto Atual</Label>
            {!referenceImage ? (
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-gradient-soft hover:border-primary/50 transition-all duration-300">
                <div className="animate-float">
                  <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Faça o upload da sua foto
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
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
                  className="bg-gradient-luxury shadow-luxury hover:shadow-glow transition-all duration-300"
                  onClick={() => document.getElementById('referenceImage')?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Escolher Foto
                </Button>
              </div>
            ) : (
              <div className="relative border-2 border-primary/20 rounded-2xl p-6 bg-gradient-soft">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={referenceImage}
                      alt="Sua foto atual"
                      className="w-32 h-32 object-cover rounded-xl shadow-soft border-2 border-primary/20"
                    />
                    <div className="absolute -top-2 -right-2 p-1 rounded-full bg-primary shadow-soft">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-2">Foto carregada com sucesso!</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {referenceFile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tamanho: {Math.round((referenceFile?.size || 0) / 1024)}KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={removeReferenceImage}
                    className="shrink-0 hover:bg-destructive/10 hover:border-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={generateImage}
            disabled={isLoading || !referenceFile}
            size="lg"
            className="w-full bg-gradient-luxury shadow-luxury hover:shadow-glow transition-all duration-300 animate-glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Criando sua transformação...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Ver Minha Transformação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {generatedImage && (
        <Card className="shadow-luxury border-0 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-luxury shadow-glow animate-float">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-luxury bg-clip-text text-transparent">
              Sua Melhor Versão Revelada
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Compare e veja a diferença - esta poderia ser você em 30 dias!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before Image */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">ANTES</h3>
                  <div className="w-16 h-1 bg-muted mx-auto rounded-full"></div>
                </div>
                <div className="relative group">
                  <img
                    src={referenceImage}
                    alt="Sua foto original"
                    className="w-full rounded-2xl shadow-soft border-2 border-border group-hover:shadow-luxury transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/5 group-hover:bg-black/0 transition-all duration-300"></div>
                </div>
              </div>

              {/* After Image */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold bg-gradient-luxury bg-clip-text text-transparent mb-2">DEPOIS</h3>
                  <div className="w-16 h-1 bg-gradient-luxury mx-auto rounded-full shadow-glow"></div>
                </div>
                <div className="relative group">
                  <img
                    src={generatedImage}
                    alt="Sua transformação fitness"
                    className="w-full rounded-2xl shadow-luxury border-2 border-primary/20 group-hover:shadow-glow transition-all duration-300 animate-glow"
                  />
                  <div className="absolute -inset-1 bg-gradient-luxury rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 p-8 bg-gradient-luxury rounded-2xl shadow-glow text-white">
              <h4 className="text-2xl font-bold mb-4">
                ✨ Sabia que nós podemos te ajudar a ter esse resultado?
              </h4>
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                Esta visualização mostra seu potencial real. Com o acompanhamento certo, 
                você pode transformar essa visão em realidade.
              </p>
              <p className="text-white/80 text-sm">
                Cada jornada é única. Os resultados podem variar de acordo com dedicação e cuidados individuais.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};