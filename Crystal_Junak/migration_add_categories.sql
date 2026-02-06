-- Add categories column to products (if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'categories') THEN 
        ALTER TABLE public.products ADD COLUMN categories text[]; 
    END IF; 
END $$;

-- Update specific known products (Original Seed Data)
UPDATE public.products SET categories = ARRAY['Protection', 'Study', 'Health'] WHERE id = 'amethyst';
UPDATE public.products SET categories = ARRAY['Relationship', 'Health'] WHERE id = 'rose-quartz';
UPDATE public.products SET categories = ARRAY['Health', 'Study', 'Protection', 'Clarity'] WHERE id = 'clear-quartz';
UPDATE public.products SET categories = ARRAY['Protection', 'Grounding'] WHERE id = 'black-obsidian';
UPDATE public.products SET categories = ARRAY['Money', 'Health', 'Abundance'] WHERE id = 'citrine';
UPDATE public.products SET categories = ARRAY['Health', 'Protection', 'Purification'] WHERE id = 'selenite';

-- Catch-all for other products (Assigning defaults based on name/description or generic)
-- This ensures 'Baclate', '7 Chakra Tree' etc have some data for testing
UPDATE public.products 
SET categories = ARRAY['Money'] 
WHERE (categories IS NULL OR categories = '{}') AND (name ILIKE '%money%' OR name ILIKE '%wealth%' OR description ILIKE '%money%');

UPDATE public.products 
SET categories = ARRAY['Relationship'] 
WHERE (categories IS NULL OR categories = '{}') AND (name ILIKE '%love%' OR name ILIKE '%attract%' OR description ILIKE '%love%');

UPDATE public.products 
SET categories = ARRAY['Health'] 
WHERE (categories IS NULL OR categories = '{}') AND (name ILIKE '%health%' OR name ILIKE '%heal%' OR description ILIKE '%heal%');

-- Fallback for anything else remaining null -> 'Protection' (just so they show up somewhere)
UPDATE public.products 
SET categories = ARRAY['Protection'] 
WHERE categories IS NULL OR categories = '{}';
