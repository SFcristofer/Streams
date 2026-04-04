-- ESQUEMA PROFESIONAL, INMORTAL Y ULTRA-SEGURO PARA CHILLSTREAM
-- Este script se puede ejecutar infinitas veces sin errores de duplicados.

create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLA DE PERFILES (Identidad y Wallet)
-- ==========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  twitter_url text,
  instagram_url text,
  discord_url text,
  paypal_url text,
  kofi_url text,
  flow_balance decimal(10,2) default 100.00,
  chill_points integer default 0,
  role text default 'user' check (role in ('user', 'streamer', 'admin')),
  is_premium boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. TABLA DE CANALES (Streaming)
-- ==========================================
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'Mi primer directo en ChillStream',
  category text default 'Charlando',
  is_live boolean default false,
  viewers_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. TABLA DE RECOMPENSAS (Tienda del Canal)
-- ==========================================
create table if not exists public.channel_rewards (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  cost integer not null default 1000,
  icon text default '🎁',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. TABLA DE MENSAJES (Chat)
-- ==========================================
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  stream_id uuid references public.streams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 5. TABLA DE DONACIONES (Historial)
-- ==========================================
create table if not exists public.donations (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete set null,
  receiver_id uuid references public.profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 6. SEGURIDAD, REALTIME Y POLÍTICAS (Idempotentes)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.streams enable row level security;
alter table public.messages enable row level security;
alter table public.donations enable row level security;
alter table public.channel_rewards enable row level security;

-- Habilitar Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.messages;
commit;

-- LIMPIEZA Y RECREACIÓN DE POLÍTICAS
do $$ 
begin
    -- Perfiles
    drop policy if exists "Ver perfiles" on public.profiles;
    create policy "Ver perfiles" on public.profiles for select using (true);
    drop policy if exists "Editar propio perfil" on public.profiles;
    create policy "Editar propio perfil" on public.profiles for update using (auth.uid() = id);
    drop policy if exists "Crear perfil" on public.profiles;
    create policy "Crear perfil" on public.profiles for insert with check (auth.uid() = id);

    -- Recompensas
    drop policy if exists "Ver recompensas" on public.channel_rewards;
    create policy "Ver recompensas" on public.channel_rewards for select using (true);
    drop policy if exists "Manejar recompensas" on public.channel_rewards;
    create policy "Manejar recompensas" on public.channel_rewards for all using (auth.uid() = streamer_id);

    -- Streams
    drop policy if exists "Ver streams" on public.streams;
    create policy "Ver streams" on public.streams for select using (true);
    drop policy if exists "Manejar propio stream" on public.streams;
    create policy "Manejar propio stream" on public.streams for all using (auth.uid() = streamer_id);

    -- Mensajes y Donaciones
    drop policy if exists "Ver mensajes" on public.messages;
    create policy "Ver mensajes" on public.messages for select using (true);
    drop policy if exists "Enviar mensajes" on public.messages;
    create policy "Enviar mensajes" on public.messages for insert with check (auth.uid() = user_id);
    drop policy if exists "Ver donaciones recibidas" on public.donations;
    create policy "Ver donaciones recibidas" on public.donations for select using (auth.uid() = receiver_id);
end $$;

-- ==========================================
-- 7. MOTOR DE TRANSACCIONES PRO (Función RPC)
-- ==========================================
create or replace function donate_flow(
  streamer_username text,
  amount_to_send decimal
)
returns void as $$
declare
  sender_id uuid := auth.uid();
  receiver_id uuid;
  current_stream_id uuid;
begin
  select id into receiver_id from public.profiles where username = streamer_username;
  if sender_id = receiver_id then raise exception 'No puedes donar a tu propio canal.'; end if;
  select id into current_stream_id from public.streams where streamer_id = receiver_id;
  if (select flow_balance from public.profiles where id = sender_id) < amount_to_send then raise exception 'Saldo insuficiente'; end if;

  update public.profiles set flow_balance = flow_balance - amount_to_send where id = sender_id;
  update public.profiles set flow_balance = flow_balance + amount_to_send where id = receiver_id;
  insert into public.donations (sender_id, receiver_id, amount) values (sender_id, receiver_id, amount_to_send);
  insert into public.messages (stream_id, user_id, username, content)
  values (current_stream_id, sender_id, (select username from public.profiles where id = sender_id), 
         '🌊 ¡HA DONADO ' || amount_to_send || ' CHILL FLOW! 🌊');
end;
$$ language plpgsql security definer;
