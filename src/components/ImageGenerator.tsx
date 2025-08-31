import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// API Key padrão do Google Gemini
const DEFAULT_API_KEY = "AIzaSyCT7Og4oj9ChYgTKIqLF8BIhcUeZSn8naU";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, digite uma descrição para a imagem");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
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
                parts: [
                  {
                    text: prompt,
                  },
                ],
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
          <CardTitle>Gerador de Imagem com Google Gemini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Descrição da Imagem</Label>
            <Textarea
              id="prompt"
              placeholder="Descreva a imagem que você quer gerar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Imagem...
              </>
            ) : (
              "Gerar Imagem"
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Imagem Gerada</CardTitle>
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