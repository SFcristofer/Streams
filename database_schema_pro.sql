-- ESQUEMA PROFESIONAL, INMORTAL Y ECONÓMICO PARA CHILLSTREAM
-- Este script configura tablas, seguridad, realtime y economía.

create extension if not exists "uuid-ossp";

-- 1. TABLA DE PERFILES (Identidad y Wallet)
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
  flow_balance decimal(10,2) default 100.00, -- Moneda Real
  chill_points integer default 0,           -- Moneda Social (Gratis)
  role text default 'user' check (role in ('user', 'streamer', 'admin')),
  is_premium boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABLA DE CANALES (Configuración del Stream)
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'Mi primer directo en ChillStream',
  category text default 'Charlando',
  is_live boolean default false,
  viewers_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLA DE MENSAJES (Chat Realtime)
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  stream_id uuid references public.streams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. HABILITAR SEGURIDAD (RLS)
alter table public.profiles enable row level security;
alter table public.streams enable row level security;
alter table public.messages enable row level security;

-- 5. HABILITAR TIEMPO REAL (Realtime)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.messages;
commit;

-- 6. POLÍTICAS DE SEGURIDAD (Permisos)

-- Perfiles
drop policy if exists "Permitir insertar perfil" on public.profiles;
create policy "Permitir insertar perfil" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;
create policy "Usuarios actualizan su propio perfil" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Ver perfiles públicos" on public.profiles;
create policy "Ver perfiles públicos" on public.profiles for select using (true);

-- Streams
drop policy if exists "Permitir crear stream" on public.streams;
create policy "Permitir crear stream" on public.streams for insert with check (auth.uid() = streamer_id);
drop policy if exists "Ver streams públicos" on public.streams;
create policy "Ver streams públicos" on public.streams for select using (true);

-- Mensajes
drop policy if exists "Ver mensajes de la sala" on public.messages;
create policy "Ver mensajes de la sala" on public.messages for select using (true);
drop policy if exists "Enviar mensajes al chat" on public.messages;
create policy "Enviar mensajes al chat" on public.messages for insert with check (auth.uid() = user_id);

-- 7. MOTOR DE ECONOMÍA: FUNCIÓN DE DONACIÓN (RPC)
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
  -- Buscar receptor
  select id into receiver_id from public.profiles where username = streamer_username;
  -- Buscar canal
  select id into current_stream_id from public.streams where streamer_id = receiver_id;

  -- Validar Saldo
  if (select flow_balance from public.profiles where id = sender_id) < amount_to_send then
    raise exception 'Saldo insuficiente';
  end if;

  -- Ejecutar Transacción Atómica
  update public.profiles set flow_balance = flow_balance - amount_to_send where id = sender_id;
  update public.profiles set flow_balance = flow_balance + amount_to_send where id = receiver_id;

  -- Notificar en el chat
  insert into public.messages (stream_id, user_id, username, content)
  values (current_stream_id, sender_id, (select username from public.profiles where id = sender_id), 
         '🌊 ¡HA DONADO ' || amount_to_send || ' CHILL FLOW! 🌊');
end;
$$ language plpgsql security definer;
