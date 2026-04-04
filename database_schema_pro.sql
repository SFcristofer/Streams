-- ESQUEMA INTEGRAL CHILLSTREAM: ECONOMÍA, REALTIME Y VOZ (TTS)
-- Este script es seguro para ejecutar múltiples veces.

create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLA DE PERFILES
-- ==========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Asegurar columnas dinámicas
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists flow_balance decimal(10,2) default 100.00;
alter table public.profiles add column if not exists chill_points integer default 0;
alter table public.profiles add column if not exists tts_enabled boolean default true;
alter table public.profiles add column if not exists role text default 'user';

-- ==========================================
-- 2. TABLA DE CANALES
-- ==========================================
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'Mi primer directo en ChillStream',
  category text default 'Charlando',
  is_live boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. TABLA DE RECOMPENSAS (Tienda Personalizada)
-- ==========================================
create table if not exists public.channel_rewards (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  cost integer not null default 1000,
  icon text default '🎁',
  type text default 'challenge', -- NUEVA COLUMNA: challenge o tts
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. TABLA DE CANJES/RETOS (Redemptions)
-- ==========================================
create table if not exists public.reward_redemptions (
  id uuid default uuid_generate_v4() primary key,
  reward_id uuid references public.channel_rewards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  streamer_id uuid references public.profiles(id) on delete cascade not null,
  user_input text, -- Texto opcional enviado por el viewer
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 5. TABLA DE MENSAJES (Chat Realtime)
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
-- 6. TABLA DE DONACIONES (Contabilidad)
-- ==========================================
create table if not exists public.donations (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete set null,
  receiver_id uuid references public.profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 7. SEGURIDAD Y REALTIME
-- ==========================================
alter table public.profiles enable row level security;
alter table public.streams enable row level security;
alter table public.messages enable row level security;
alter table public.donations enable row level security;
alter table public.channel_rewards enable row level security;
alter table public.reward_redemptions enable row level security;

-- Habilitar Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.profiles,
    public.messages, 
    public.reward_redemptions, 
    public.donations;
commit;

-- Limpieza y Recreación de Políticas (Idempotentes)
do $$ 
begin
    drop policy if exists "Ver perfiles" on public.profiles;
    create policy "Ver perfiles" on public.profiles for select using (true);
    drop policy if exists "Ver recompensas" on public.channel_rewards;
    create policy "Ver recompensas" on public.channel_rewards for select using (true);
    drop policy if exists "Manejar recompensas" on public.channel_rewards;
    create policy "Manejar recompensas" on public.channel_rewards for all using (auth.uid() = streamer_id);
    drop policy if exists "Ver retos" on public.reward_redemptions;
    create policy "Ver retos" on public.reward_redemptions for select using (auth.uid() = streamer_id);
    drop policy if exists "Crear canje" on public.reward_redemptions;
    create policy "Crear canje" on public.reward_redemptions for insert with check (auth.uid() = user_id);
    drop policy if exists "Leer chat" on public.messages;
    create policy "Leer chat" on public.messages for select using (true);
    drop policy if exists "Hablar chat" on public.messages;
    create policy "Hablar chat" on public.messages for insert with check (auth.uid() = user_id);
end $$;
