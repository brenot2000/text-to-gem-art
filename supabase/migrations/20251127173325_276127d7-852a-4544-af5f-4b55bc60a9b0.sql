-- Drop existing policies that might be causing slow queries
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;

-- Create a security definer function that returns leads for admins
CREATE OR REPLACE FUNCTION public.get_leads_for_admin()
RETURNS SETOF public.leads
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.leads
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  ORDER BY created_at DESC;
$$;

-- Create a simpler RLS policy using a subquery with LIMIT 1
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
    LIMIT 1
  )
);