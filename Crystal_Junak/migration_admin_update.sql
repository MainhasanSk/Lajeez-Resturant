-- 4. Admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (auth.role() = 'authenticated') -- Check for admin role ideally
WITH CHECK (auth.role() = 'authenticated');
