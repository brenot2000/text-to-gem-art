-- Add venda_perdida status to enum
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'venda_perdida';