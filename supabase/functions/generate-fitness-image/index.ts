import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, mimeType, prompt, userData } = await req.json();

    if (!imageData || !mimeType || !prompt) {
      return new Response(
        JSON.stringify({ success: false, code: 400, error: "bad_request", message: "Missing imageData, mimeType or prompt" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, code: 500, error: "config_error", message: "AI gateway key not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI Gateway for image generation...");

    const gatewayResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageData}` } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!gatewayResp.ok) {
      const text = await gatewayResp.text();
      console.error("AI gateway error:", gatewayResp.status, text);

      if (gatewayResp.status === 429) {
        return new Response(
          JSON.stringify({ success: false, code: 429, error: "Rate limit exceeded", message: "Limite de uso da API atingido. Aguarde alguns minutos." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (gatewayResp.status === 402) {
        return new Response(
          JSON.stringify({ success: false, code: 402, error: "Payment required", message: "Créditos esgotados no Lovable AI. Adicione créditos para continuar." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, code: gatewayResp.status, error: "ai_gateway_error", message: "AI gateway error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await gatewayResp.json();
    const url: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!url || !url.startsWith("data:")) {
      console.error("No data URL image in AI gateway response", data);
      return new Response(
        JSON.stringify({ success: false, code: 500, error: "no_image", message: "A API não retornou uma imagem." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // data URL format: data:<mime>;base64,<b64>
    const [meta, b64] = url.split(",");
    const mimeMatch = /^data:(.*?);base64$/.exec(meta || "");
    const outMime = mimeMatch?.[1] || "image/png";

    // Save lead to database if userData provided
    if (userData && userData.name && userData.email && userData.phone) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        try {
          const leadResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseServiceKey,
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              status: "foto_gerada",
              reference_image_url: `data:${mimeType};base64,${imageData}`,
              generated_image_url: url,
            })
          });

          if (!leadResponse.ok) {
            console.error("Failed to save lead:", await leadResponse.text());
          }
        } catch (saveError) {
          console.error("Error saving lead:", saveError);
          // Don't fail the whole request if lead saving fails
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, imageData: b64, mimeType: outMime }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-fitness-image function:", error);
    return new Response(
      JSON.stringify({ success: false, code: 500, error: "internal_error", message: error instanceof Error ? error.message : "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
