-- Enable RLS on products if not already
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to DELETE products
CREATE POLICY "Enable delete for authenticated users" ON "public"."products"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users (admins) to UPDATE products
CREATE POLICY "Enable update for authenticated users" ON "public"."products"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users (admins) to INSERT products
CREATE POLICY "Enable insert for authenticated users" ON "public"."products"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);
