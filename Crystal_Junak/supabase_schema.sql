
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create products table
create table if not exists public.products (
  id text primary key, -- using text id like 'amethyst' to preserve url structure
  name text not null,
  sub_title text,
  description text,
  energy text,
  folder_name text,
  color text,
  bg_gradient text,
  price numeric not null,
  formatted_price text,
  details jsonb,
  stock int default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_details jsonb not null, -- { name, email, address, phone }
  total numeric not null,
  status text default 'pending', -- pending, processing, shipped, delivered, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order items table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) not null,
  quantity int not null,
  price numeric not null -- price at time of purchase
);

-- Set up Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for products
-- Anyone can read products
create policy "Public products are viewable by everyone" 
  on public.products for select 
  using (true);

-- Only authenticated users (admins) can insert/update/delete products
create policy "Admins can insert products" 
  on public.products for insert 
  with check (auth.role() = 'authenticated');

create policy "Admins can update products" 
  on public.products for update 
  using (auth.role() = 'authenticated');

create policy "Admins can delete products" 
  on public.products for delete 
  using (auth.role() = 'authenticated');

-- Policies for orders
-- Admins can view all orders
create policy "Admins can view all orders" 
  on public.orders for select 
  using (auth.role() = 'authenticated');

-- Anyone can create an order (public checkout)
create policy "Public can create orders" 
  on public.orders for insert 
  with check (true);

-- Policies for order_items
create policy "Admins can view all order items" 
  on public.order_items for select 
  using (auth.role() = 'authenticated');

create policy "Public can create order items" 
  on public.order_items for insert 
  with check (true);

-- Storage bucket for product images (if needed later)
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Images are publicly accessible" 
  on storage.objects for select 
  using ( bucket_id = 'product-images' );

create policy "Admins can upload images" 
  on storage.objects for insert 
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Seed Data (Insert initial products)
-- We use DO block or just Insert Ignore logic to avoid duplicates if re-run

INSERT INTO public.products (id, name, sub_title, description, energy, folder_name, color, bg_gradient, price, formatted_price, details)
VALUES 
(
  'amethyst',
  'Amethyst',
  'The Stone of Spiritual Clarity',
  'A protective stone that helps relieve stress and anxiety in your life, and the symptoms that accompany it, namely headaches, fatigues, and anxiety aids cell regeneration.',
  'Tranquility & Protection',
  'amethyst',
  '#a78bfa',
  'bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950',
  4999,
  '₹4,999',
  '{"origin": "Brazil", "chakra": "Crown", "zodiac": "Aquarius"}'::jsonb
),
(
  'rose-quartz',
  'Rose Quartz',
  'The Stone of Universal Love',
  'Restores trust and harmony in relationships, encouraging unconditional love. Rose Quartz purifies and opens the heart at all levels to promote love, self-love, friendship, deep inner healing and feelings of peace.',
  'Love & Harmony',
  'rose-quartz',
  '#f472b6',
  'bg-gradient-to-b from-slate-950 via-pink-950 to-slate-950',
  3999,
  '₹3,999',
  '{"origin": "Madagascar", "chakra": "Heart", "zodiac": "Taurus"}'::jsonb
),
(
  'clear-quartz',
  'Clear Quartz',
  'The Master Healer',
  'Amplifies energy and thought, as well as the effect of other crystals. It absorbs, stores, releases and regulates energy. Clear Quartz draws off negative energy of all kinds.',
  'Clarity & Amplification',
  'clear-quartz',
  '#e2e8f0',
  'bg-gradient-to-b from-slate-950 via-slate-800 to-slate-950',
  3499,
  '₹3,499',
  '{"origin": "Arkansas, USA", "chakra": "All", "zodiac": "Leo"}'::jsonb
),
(
  'black-obsidian',
  'Black Obsidian',
  'The Psychic Protector',
  'A powerful cleanser of psychic smog created within your aura, and is a strong psychic protection stone. It drives out stress and tension.',
  'Protection & Grounding',
  'amethyst', -- As per existing data
  '#334155',
  'bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950',
  5499,
  '₹4,499',
  '{"origin": "Mexico", "chakra": "Root", "zodiac": "Scorpio"}'::jsonb
),
(
  'citrine',
  'Citrine',
  'The Light Maker',
  'Citrine emanates positivity and joy. It is associated with wealth and abundance.',
  'Abundance & Joy',
  'clear-quartz', -- As per existing data
  '#facc15',
  'bg-gradient-to-b from-slate-950 via-yellow-950 to-slate-950',
  4499,
  '₹4,499',
  '{"origin": "Brazil", "chakra": "Solar Plexus", "zodiac": "Aries"}'::jsonb
),
(
  'selenite',
  'Selenite',
  'Liquid Light',
  'Selenite is ideal for clarity, purification, and connection to higher planes.',
  'Purification & Peace',
  'rose-quartz', -- As per existing data
  '#ffffff',
  'bg-gradient-to-b from-slate-950 via-slate-800 to-slate-950',
  2999,
  '₹2,999',
  '{"origin": "Morocco", "chakra": "Crown", "zodiac": "Taurus"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sub_title = EXCLUDED.sub_title,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
