-- Add vendedor and valor_venda fields to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS vendedor TEXT,
ADD COLUMN IF NOT EXISTS valor_venda DECIMAL(10,2);