import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transformação Fitness com IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referenceImage">Sua Imagem</Label>
            {!referenceImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Faça upload da sua foto para transformação fitness
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
                  variant="outline"
                  onClick={() => document.getElementById('referenceImage')?.click()}
                >
                  Selecionar Imagem
                </Button>
              </div>
            ) : (
              <div className="relative border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={referenceImage}
                    alt="Imagem de referência"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Imagem carregada</p>
                    <p className="text-xs text-muted-foreground">
                      {referenceFile?.name} ({Math.round((referenceFile?.size || 0) / 1024)}KB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={removeReferenceImage}
                    className="shrink-0"
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
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transformando...
              </>
            ) : (
              "Transformar em Versão Fitness"
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Transformação</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={generatedImage}
              alt="Imagem gerada"
              className="w-full rounded-lg border"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};