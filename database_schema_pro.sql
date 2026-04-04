-- ESQUEMA PROFESIONAL E INMORTAL PARA CHILLSTREAM
-- Este script se puede ejecutar varias veces sin errores de "ya existe".

create extension if not exists "uuid-ossp";

-- 1. Tabla de Perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'streamer', 'admin')),
  is_premium boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Canales
create table if not exists public.streams (
  id uuid default uuid_generate_v4() primary key,
  streamer_id uuid references profiles(id) on delete cascade not null unique,
  stream_key text,
  title text default 'Mi primer stream',
  is_live boolean default false,
  viewers_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar Seguridad (RLS)
alter table public.profiles enable row level security;
alter table public.streams enable row level security;

-- 4. POLÍTICAS DE SEGURIDAD (Idempotentes)

drop policy if exists "Permitir insertar perfil" on public.profiles;
create policy "Permitir insertar perfil" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;
create policy "Usuarios actualizan su propio perfil" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Permitir crear stream" on public.streams;
create policy "Permitir crear stream" on public.streams for insert with check (auth.uid() = streamer_id);

drop policy if exists "Ver perfiles públicos" on public.profiles;
create policy "Ver perfiles públicos" on public.profiles for select using (true);

drop policy if exists "Ver streams públicos" on public.streams;
create policy "Ver streams públicos" on public.streams for select using (true);
