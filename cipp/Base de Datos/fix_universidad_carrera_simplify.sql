-- ============================================
-- FIX: Simplificar lógica Sede/Universidad/Carrera
-- CIP - Colegio de Ingenieros del Perú
-- 
-- Cambios:
-- 1. Eliminar codigo de carreras (sin propósito)
-- 2. Eliminar universidad_id de carreras (si existe)
-- 3. Eliminar tabla universidad_carreras (no necesaria)
-- 4. Asegurar cip_correlativos para todas las carreras
-- 5. Eliminar políticas de universidad_carreras
-- ============================================

-- ============================================
-- 1. ELIMINAR codigo DE carreras
-- ============================================
alter table public.carreras
  drop constraint if exists carreras_codigo_key;

alter table public.carreras
  drop column if exists codigo;

-- ============================================
-- 2. ELIMINAR universidad_id DE carreras (si existe)
-- ============================================
alter table public.carreras
  drop constraint if exists carreras_universidad_id_fkey;

alter table public.carreras
  drop column if exists universidad_id;

-- ============================================
-- 3. ELIMINAR TABLA universidad_carreras
-- ============================================
drop table if exists public.universidad_carreras cascade;

-- ============================================
-- 4. ASEGURAR cip_correlativos PARA TODAS LAS CARRERAS
-- ============================================
insert into public.cip_correlativos (carrera_id, ultimo_numero)
select id, 0 from public.carreras
on conflict (carrera_id) do nothing;

-- ============================================
-- 5. ELIMINAR POLÍTICAS RLS DE universidad_carreras
-- ============================================
drop policy if exists "Anon puede leer universidad_carreras" on public.universidad_carreras;
drop policy if exists "Admins control total universidad_carreras" on public.universidad_carreras;

-- ============================================
-- 6. ACTUALIZAR SEED - insertar carreras sin codigo
--    (solo si no existen aún)
-- ============================================
do $$
begin
  if not exists (select 1 from public.carreras limit 1) then
    insert into public.carreras (nombre) values
      ('Ingeniería Civil'),
      ('Ingeniería de Sistemas'),
      ('Ingeniería Industrial'),
      ('Ingeniería Mecánica'),
      ('Ingeniería Eléctrica'),
      ('Ingeniería Electrónica'),
      ('Ingeniería Química'),
      ('Ingeniería Ambiental'),
      ('Ingeniería Agrónoma'),
      ('Ingeniería de Alimentos'),
      ('Ingeniería de Minas'),
      ('Ingeniería Geológica'),
      ('Ingeniería Informática'),
      ('Ingeniería de Software'),
      ('Ingeniería Biomédica'),
      ('Ingeniería de Petróleo'),
      ('Ingeniería Textil'),
      ('Ingeniería de Telecomunicaciones'),
      ('Ingeniería Agrícola');
  end if;
end $$;

-- ============================================
-- 7. VERIFICAR DATOS
-- ============================================
select '--- carreras ---' as " ";
select id, nombre from public.carreras order by nombre;

select '--- cip_correlativos ---' as " ";
select * from public.cip_correlativos order by carrera_id;

select '--- universidades (deben seguir existiendo) ---' as " ";
select id, nombre from public.universidades order by nombre;

select '--- sedes ---' as " ";
select id, nombre from public.sedes order by nombre;
