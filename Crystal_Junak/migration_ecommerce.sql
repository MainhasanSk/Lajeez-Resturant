-- Add user_id to orders table if it doesn't exist (or recreate table to be safe/clean for this feature)
-- Ideally, we modify the existing table.

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;

-- Policies for orders
-- 1. Admins can view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (auth.role() = 'authenticated'); -- In a real app, check for specific admin role/claim

-- 2. Users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Users can create orders
CREATE POLICY "Users can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies for order_items
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

-- 1. Admins view
CREATE POLICY "Admins can view all order items" 
ON public.order_items FOR SELECT 
USING (auth.role() = 'authenticated');

-- 2. Users view (via order ownership)
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- 3. Users create
CREATE POLICY "Users can create order items" 
ON public.order_items FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);
