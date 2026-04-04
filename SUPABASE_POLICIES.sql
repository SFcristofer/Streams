-- COPIA Y PEGA ESTO EN EL SQL EDITOR DE SUPABASE
-- ESTO ARREGLA EL ERROR DE "ROW-LEVEL SECURITY POLICY"

-- 1. Permitir que los usuarios creen su propio perfil inicial
create policy "Permitir insertar perfil" 
on public.profiles for insert 
with check (auth.uid() = id);

-- 2. Permitir que los usuarios actualicen su propio perfil
drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;
create policy "Usuarios actualizan su propio perfil" 
on public.profiles for update 
using (auth.uid() = id);

-- 3. Permitir que los usuarios creen su entrada de stream
create policy "Permitir crear stream" 
on public.streams for insert 
with check (auth.uid() = streamer_id);

-- 4. Permitir que todo el mundo vea los perfiles y streams
create policy "Ver perfiles públicos" on public.profiles for select using (true);
create policy "Ver streams públicos" on public.streams for select using (true);
