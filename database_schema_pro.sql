-- ESQUEMA DEFINITIVO Y ROBUSTO PARA CHILLSTREAM
-- Este script asegura que todas las tablas y columnas existan sin borrar datos.

create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLA DE PERFILES (Identidad y Wallet)
-- ==========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FORZAR columnas si la tabla ya existía de versiones anteriores
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists twitter_url text;
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists discord_url text;
alter table public.profiles add column if not exists paypal_url text;
alter table public.profiles add column if not exists kofi_url text;
alter table public.profiles add column if not exists flow_balance decimal(10,2) default 100.00;
alter table public.profiles add column if not exists chill_points integer default 0;
alter table public.profiles add column if not exists role text default 'user' check (role in ('user', 'streamer', 'admin'));
alter table public.profiles add column if not exists is_premium boolean default false;

-- ==========================================
-- 2. TABLA DE CANALES (Streaming)
-- ==========================================
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references public.profiles(id) on delete cascade not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FORZAR columnas de configuración de stream
alter table public.streams add column if not exists stream_key text;
alter table public.streams add column if not exists title text default 'Mi primer directo en ChillStream';
alter table public.streams add column if not exists category text default 'Charlando';
alter table public.streams add column if not exists is_live boolean default false;
alter table public.streams add column if not exists viewers_count integer default 0;

-- ==========================================
-- 3. TABLA DE MENSAJES (Chat)
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
-- 4. SEGURIDAD Y REALTIME
-- ==========================================
alter table public.profiles enable row level security;
alter table public.streams enable row level security;
alter table public.messages enable row level security;

-- Habilitar Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.messages;
commit;

-- ==========================================
-- 5. POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================

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

-- ==========================================
-- 6. MOTOR DE DONACIONES (Función RPC)
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
