-- ESQUEMA CHILLSTREAM PRO: VOZ, ECONOMÍA Y RETOS
-- Este script es seguro para ejecutar múltiples veces.

create extension if not exists "uuid-ossp";

-- 1. TABLA DE PERFILES (Con Control de Voz y Wallet)
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
  tts_enabled boolean default true, -- El streamer decide si hay voz en su canal
  role text default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABLA DE RECOMPENSAS (Configuradas por el Streamer)
create table if not exists public.channel_rewards (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  cost integer not null default 1000,
  icon text default '🎁',
  type text default 'challenge', -- 'challenge' (solo alerta) o 'tts' (asistente lee mensaje)
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLA DE CANJES (Con entrada de texto del Viewer)
create table if not exists public.reward_redemptions (
  id uuid default uuid_generate_v4() primary key,
  reward_id uuid references public.channel_rewards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  streamer_id uuid references public.profiles(id) on delete cascade not null,
  user_input text, -- El mensaje que el viewer quiere que se escuche
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLA DE STREAMS, MENSAJES Y DONACIONES (Resto del sistema)
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'En directo',
  category text default 'Charlando',
  is_live boolean default false
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  stream_id uuid references public.streams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SEGURIDAD Y REALTIME
alter table public.profiles enable row level security;
alter table public.channel_rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.messages enable row level security;

begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.profiles, 
    public.messages, 
    public.reward_redemptions;
commit;

-- POLÍTICAS (Simplificadas para evitar errores)
create policy "Acceso total streamer rewards" on public.channel_rewards for all using (auth.uid() = streamer_id);
create policy "Público ve rewards" on public.channel_rewards for select using (true);
create policy "Público ve perfiles" on public.profiles for select using (true);
create policy "Usuarios editan perfil" on public.profiles for update using (auth.uid() = id);
create policy "Insertar mensajes" on public.messages for insert with check (auth.uid() = user_id);
create policy "Ver mensajes" on public.messages for select using (true);
create policy "Crear canje" on public.reward_redemptions for insert with check (auth.uid() = user_id);
create policy "Ver canjes" on public.reward_redemptions for select using (auth.uid() = streamer_id);

-- REFRESCAR CACHÉ
notify pgrst, 'reload schema';
