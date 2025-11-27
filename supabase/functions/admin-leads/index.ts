import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple retry helper
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to get user info
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User authenticated:", user.id);

    // Create admin client with service role to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin with retry
    const roleData = await withRetry(async () => {
      const { data, error } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) throw error;
      return data;
    });

    if (!roleData) {
      console.error("User is not admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin verified, processing request...");

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    // Handle different actions
    if (method === "GET" && action === "list") {
      // List all leads WITHOUT image data to avoid timeout (base64 images are huge)
      const leads = await withRetry(async () => {
        const { data, error } = await supabaseAdmin
          .from("leads")
          .select("id, name, email, phone, status, vendedor, valor_venda, fotos_geradas, created_at, updated_at")
          .order("created_at", { ascending: false })
          .limit(100);
        
        if (error) {
          console.error("Database error fetching leads:", error);
          throw error;
        }
        return data;
      });

      console.log(`Fetched ${leads?.length || 0} leads successfully`);
      return new Response(
        JSON.stringify({ data: leads }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (method === "GET" && action === "get-images") {
      // Get images for a specific lead
      const leadId = url.searchParams.get("id");
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: "Lead ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const lead = await withRetry(async () => {
        const { data, error } = await supabaseAdmin
          .from("leads")
          .select("reference_image_url, generated_image_url")
          .eq("id", leadId)
          .single();
        
        if (error) throw error;
        return data;
      });

      return new Response(
        JSON.stringify({ data: lead }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (method === "PATCH") {
      // Update a lead
      const body = await req.json();
      const { id, ...updates } = body;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Lead ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Updating lead:", id, updates);

      const data = await withRetry(async () => {
        const { data, error } = await supabaseAdmin
          .from("leads")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      });

      console.log("Lead updated successfully:", id);
      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (method === "DELETE") {
      const body = await req.json();
      const { id } = body;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Lead ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Deleting lead:", id);

      await withRetry(async () => {
        const { error } = await supabaseAdmin
          .from("leads")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
      });

      console.log("Lead deleted successfully:", id);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
