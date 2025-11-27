import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Upload, X, Camera, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Prompt padrão fixo para transformação fitness
const DEFAULT_PROMPT = `Pegue esta foto e recrie a mesma pessoa em versão **100% magra, atlética e fitness**, mantendo o mesmo rosto e as mesmas roupas originais.

Regras principais:

 * **Barriga/Abdômen:** a barriga deve ser **reta, firme e lisa**, **sem nenhuma pochete, dobra, volume ou gordura abaixo do umbigo**. Não deixe nenhuma saliência na parte inferior da barriga. O abdômen deve parecer definido, atlético e saudável por baixo da roupa, caso a barriga eteja coberta manter coberta.
 * **Cintura:** bem fina, destacando a forma atlética, deixando mais reta como de uma modelo.
 * **Rosto:** afinado, mandíbula visível, pescoço alongado, bochechas menores como de uma modelo.
 * **Braços e Ombros:** magros e tonificados como de uma modelo.
 * **Peito:** firme, definido, sem gordura.
 * **Quadris e Pernas:** mais magros e definidos, pernas atléticas como de uma modelo.
 * **Postura:** ereta, confiante, atlética.
 * **Roupas:** mantenha exatamente as roupas originais, sem mudar cor ou estilo. Apenas ajuste o caimento para o corpo magro. **Nunca invente novas roupas e nunca exponha pele.**
 * **Resultado:** fotorealista, com transformação clara: corpo magro, atlético, barriga reta e sem nenhuma gordura acumulada.`;

export const ImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDataForm, setShowDataForm] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const convertImageToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(",")[1]; // Remove data:image/...;base64, prefix
        resolve({
          data: base64Data,
          mimeType: file.type,
        });
      };
      reader.onerror = () => reject(new Error("Erro ao converter imagem"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Tamanho máximo: 10MB");
      return;
    }

    try {
      setReferenceFile(file);
      const imageUrl = URL.createObjectURL(file);
      setReferenceImage(imageUrl);
      toast.success("Imagem de referência carregada!");
    } catch (error) {
      toast.error("Erro ao carregar imagem");
    }
  };

  const removeReferenceImage = () => {
    if (referenceImage) {
      URL.revokeObjectURL(referenceImage);
    }
    setReferenceImage(null);
    setReferenceFile(null);
  };


  const handleShowDataForm = () => {
    if (!referenceFile) {
      toast.error("Por favor, selecione uma imagem de referência");
      return;
    }
    setShowDataForm(true);
  };

  const handleSubmitDataForm = async () => {
    if (!userData.name || !userData.email || !userData.phone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    console.log("Dados capturados:", userData);
    setShowDataForm(false);
    await generateImage();
  };

  const handleUserDataChange = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateImage = async (retryCount = 0) => {
    if (!referenceFile) {
      toast.error("Por favor, selecione uma imagem de referência");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const enhancedPrompt = `${DEFAULT_PROMPT}

IMPORTANTE: Você DEVE gerar uma imagem transformada, não apenas texto. Crie uma imagem visual mostrando a pessoa com as transformações solicitadas.`;

      // Convert image to base64
      const { data: imageData, mimeType } = await convertImageToBase64(referenceFile);

      console.log('Calling edge function to generate image...');

      // Call edge function with user data
      const { data, error } = await supabase.functions.invoke('generate-fitness-image', {
        body: {
          imageData,
          mimeType,
          prompt: enhancedPrompt,
          userData: userData,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erro ao chamar a função');
      }

      if (!data || !data.success) {
        if (data?.error === 'Rate limit exceeded') {
          toast.error('Limite de uso atingido. Aguarde alguns minutos e tente novamente.');
          throw new Error('Rate limit exceeded');
        }
        
        if (retryCount < 2) {
          console.log(`Tentativa ${retryCount + 1} falhou. Tentando novamente...`);
          toast.info(`Processando... Tentativa ${retryCount + 2}/3`);
          setTimeout(() => generateImage(retryCount + 1), 1000);
          return;
        }
        
        throw new Error(data?.message || 'A API não conseguiu gerar uma imagem');
      }

      // Success - construct image URL from base64 data
      const imageUrl = `data:${data.mimeType};base64,${data.imageData}`;
      setGeneratedImage(imageUrl);
      toast.success("Transformação concluída! Saiba que nós podemos te ajudar a ter esse resultado!");

    } catch (error) {
      console.error("Erro ao gerar imagem:", error);

      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          toast.error('Limite de uso atingido. Aguarde alguns minutos.');
        } else if (error.message.includes('após 3 tentativas')) {
          toast.error('Não foi possível gerar a imagem após 3 tentativas. Tente com outra foto.');
        } else {
          toast.error('Erro ao gerar imagem. Tente novamente.');
        }
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
    } finally {
      if (retryCount === 0) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Upload Section */}
      <Card className="glass-card backdrop-blur-glass border-white/20 bg-white/10 shadow-intense animate-fade-in-up">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-accent shadow-glow">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">Descubra Sua Melhor Versão</CardTitle>
          <p className="text-white/80 text-xl">Envie sua foto e veja como você ficaria com o corpo que sempre sonhou</p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-6">
            <Label htmlFor="referenceImage" className="text-2xl font-bold text-white">
              Sua Foto Atual
            </Label>
            {!referenceImage ? (
              <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 text-center bg-white/5 hover:border-white/50 hover:bg-white/10 transition-all duration-500 group">
                <div className="animate-float-smooth group-hover:scale-110 transition-transform duration-500">
                  <Upload className="mx-auto h-16 w-16 text-white mb-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Faça o upload da sua foto</h3>
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
                  className="bg-gradient-primary shadow-intense hover:shadow-glow transition-all duration-300 text-lg px-8 py-4 h-auto animate-glow-border"
                  onClick={() => document.getElementById("referenceImage")?.click()}
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
                    <p className="text-lg text-white/80 mb-2">{referenceFile?.name}</p>
                    <p className="text-white/60">Tamanho: {Math.round((referenceFile?.size || 0) / 1024)}KB</p>
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
            onClick={handleShowDataForm}
            disabled={isLoading || !referenceFile}
            size="lg"
            className="w-full bg-gradient-hero shadow-intense hover:shadow-glow transition-all duration-500 text-xl px-8 py-6 h-auto animate-glow-border disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="p-4 rounded-full bg-gradient-warm shadow-glow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">
              Sua Melhor Versão Revelada
            </CardTitle>
            <p className="text-white/80 text-xl">Compare e veja a diferença - esta poderia ser você em 30 dias!</p>
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

            <div
              className="text-center mt-12 p-10 bg-gradient-hero rounded-3xl shadow-intense animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <h4 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                ✨ Sabia que nós podemos te ajudar a ter esse resultado?
              </h4>
              <p className="text-white/90 text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
                Esta visualização mostra seu potencial real. Com o acompanhamento certo, você pode transformar essa
                visão em realidade.
              </p>
              <p className="text-white/70 text-lg">
                Cada jornada é única. Os resultados podem variar de acordo com dedicação e cuidados individuais.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Collection Dialog */}
      <Dialog open={showDataForm} onOpenChange={setShowDataForm}>
        <DialogContent className="glass-card backdrop-blur-glass border-white/20 bg-white/10 shadow-intense max-w-md animate-scale-in">
          <DialogHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="p-3 rounded-full bg-gradient-accent shadow-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Informe seus dados para ver o resultado gratuitamente
            </DialogTitle>
            <p className="text-white/70 text-sm">Seus dados são seguros e privados conosco</p>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label htmlFor="userName" className="text-sm font-medium text-white">
                Nome completo
              </Label>
              <Input
                id="userName"
                type="text"
                placeholder="Seu nome completo"
                value={userData.name}
                onChange={(e) => handleUserDataChange("name", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/15 backdrop-blur-sm h-12"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="userEmail" className="text-sm font-medium text-white">
                Email
              </Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="seu@email.com"
                value={userData.email}
                onChange={(e) => handleUserDataChange("email", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/15 backdrop-blur-sm h-12"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="userPhone" className="text-sm font-medium text-white">
                Telefone/WhatsApp
              </Label>
              <Input
                id="userPhone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={userData.phone}
                onChange={(e) => handleUserDataChange("phone", e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/15 backdrop-blur-sm h-12"
              />
            </div>
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowDataForm(false)}
                className="flex-1 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm h-12"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitDataForm}
                className="flex-1 bg-gradient-hero shadow-intense hover:shadow-glow transition-all duration-300 animate-glow-border h-12 text-white font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Gerar Resultado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
