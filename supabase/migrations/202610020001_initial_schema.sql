create extension if not exists pgcrypto;
create table if not exists public.products (
  id text primary key, name text not null, category text not null,
  price_kobo integer not null check (price_kobo > 0), image text not null,
  color text not null, tag text not null default 'HANDMADE',
  active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), email text not null,
  status text not null default 'pending' check (status in ('pending','paid','cancelled','refunded')),
  items jsonb not null, stripe_session_id text unique, amount_total integer,
  email_sent_at timestamptz, created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
create policy "Products are readable by everyone" on public.products for select using (active = true);
-- Order writes are performed by server routes with the service-role key. Never expose that key in a browser.
insert into public.products (id,name,category,price_kobo,image,color,tag) values
('adire-slide','Adire Ease Slide','Everyday slides',2850000,'photo-1543163521-1bf539c55dd2','Indigo / Natural','BESTSELLER'),
('aso-oke-mule','Aso-Oke Sunday Mule','Heritage edit',4200000,'photo-1543163521-1bf539c55dd2','Sand / Cocoa','HANDWOVEN'),
('lagos-stride','Lagos Stride Sandal','Leather sandals',3600000,'photo-1562273138-f46be4ebdf33','Cognac','NEW ARRIVAL'),
('oluwa-loafer','Oluwa Soft Loafer','Made for more',5800000,'photo-1531310197839-ccf54634509e','Espresso','SMALL BATCH')
on conflict (id) do update set name=excluded.name, category=excluded.category, price_kobo=excluded.price_kobo, image=excluded.image, color=excluded.color, tag=excluded.tag;
