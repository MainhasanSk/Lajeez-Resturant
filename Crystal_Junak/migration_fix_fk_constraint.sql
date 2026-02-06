-- FIX: Allow deleting products even if they are in orders (Cascading Delete)

-- 1. Drop the existing strict constraint
ALTER TABLE public.order_items
DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey";

-- 2. Add a new constraint that deletes order items when a product is deleted
ALTER TABLE public.order_items
ADD CONSTRAINT "order_items_product_id_fkey"
FOREIGN KEY ("product_id")
REFERENCES public.products("id")
ON DELETE CASCADE;
