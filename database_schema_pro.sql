-- ESQUEMA PROFESIONAL E INMORTAL PARA CHILLSTREAM
-- Este script se puede ejecutar varias veces sin errores.

create extension if not exists "uuid-ossp";

-- 1. Tabla de Perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  twitter_url text,
  instagram_url text,
  discord_url text,
  diamonds decimal(10,2) default 100.00,
  role text default 'user' check (role in ('user', 'streamer', 'admin')),
  is_premium boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Canales (Sincronizada con la Pentium)
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'Mi primer stream',
  category text default 'Charlando',
  is_live boolean default false,
  viewers_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Mensajes (Chat Realtime)
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  stream_id uuid references public.streams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Habilitar Seguridad (RLS)
alter table public.profiles enable row level security;
alter table public.streams enable row level security;
alter table public.messages enable row level security;

-- 5. Habilitar Realtime para Mensajes
-- (Esto permite que los mensajes aparezcan al instante)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.messages;
commit;

-- 6. POLÍTICAS DE SEGURIDAD (Idempotentes)

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

-- Mensajes (Chat)
drop policy if exists "Ver mensajes de la sala" on public.messages;
create policy "Ver mensajes de la sala" on public.messages for select using (true);
drop policy if exists "Enviar mensajes al chat" on public.messages;
create policy "Enviar mensajes al chat" on public.messages for insert with check (auth.uid() = user_id);
