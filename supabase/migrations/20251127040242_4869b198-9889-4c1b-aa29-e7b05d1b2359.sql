-- Add campo para contar fotos geradas
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS fotos_geradas INTEGER DEFAULT 1;