-- ============================================
-- SCRIPT COMPLETO - Ejecutar en Supabase SQL Editor
-- CIP - Colegio de Ingenieros del Perú
-- ============================================

-- ============================================
-- 1. TRIGGERS
-- ============================================

-- TRIGGER 1: generar_codigo_expediente
create or replace function public.fn_generar_codigo_expediente()
returns trigger as $$
declare
  anio_actual text;
  consecutivo int;
begin
  anio_actual := to_char(current_date, 'YYYY');

  select coalesce(max(cast(split_part(codigo_expediente, '-', 3) as integer)), 0) + 1
  into consecutivo
  from public.expedientes
  where codigo_expediente like 'EXP-' || anio_actual || '-%';

  new.codigo_expediente := 'EXP-' || anio_actual || '-' || lpad(consecutivo::text, 5, '0');

  return new;
end;
$$ language plpgsql;

drop trigger if exists generar_codigo_expediente on public.expedientes;
create trigger generar_codigo_expediente
  before insert on public.expedientes
  for each row
  execute function public.fn_generar_codigo_expediente();


-- TRIGGER 2: inicializar_correlativo_carrera
create or replace function public.fn_inicializar_correlativo_carrera()
returns trigger as $$
begin
  insert into public.cip_correlativos (carrera_id, ultimo_numero)
  values (new.id, 0)
  on conflict (carrera_id) do nothing;

  return new;
end;
$$ language plpgsql;

drop trigger if exists inicializar_correlativo_carrera on public.carreras;
create trigger inicializar_correlativo_carrera
  after insert on public.carreras
  for each row
  execute function public.fn_inicializar_correlativo_carrera();


-- TRIGGER 3: generar_numero_cip (ELIMINADO - reemplazado por Server Action)
-- El CIP ahora se genera en actions/expediente.actions.ts → aprobarPago()
drop trigger if exists generar_numero_cip on public.colegiados;
drop function if exists public.fn_generar_numero_cip();


-- TRIGGER 4: actualizar_habilitacion
create or replace function public.fn_actualizar_habilitacion()
returns trigger as $$
declare
  v_colegiado_id uuid;
  tiene_deuda boolean;
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then
    v_colegiado_id := new.colegiado_id;
  else
    v_colegiado_id := old.colegiado_id;
  end if;

  select exists (
    select 1
    from public.pagos_mensualidades
    where colegiado_id = v_colegiado_id
      and estado = 'Pendiente'
  ) into tiene_deuda;

  if tiene_deuda then
    update public.colegiados
    set estado_habilitacion = 'Inhabilitado'
    where id = v_colegiado_id;
  else
    update public.colegiados
    set estado_habilitacion = 'Habilitado'
    where id = v_colegiado_id;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists actualizar_habilitacion on public.pagos_mensualidades;
create trigger actualizar_habilitacion
  after insert or update or delete on public.pagos_mensualidades
  for each row
  execute function public.fn_actualizar_habilitacion();


-- ============================================
-- 2. POLÍTICAS RLS FALTANTES
-- ============================================

-- Anon puede leer cip_correlativos
create policy "Anon puede leer cip_correlativos"
on public.cip_correlativos for select to anon
using (true);

-- Anon puede insertar cip_correlativos
create policy "Anon puede insertar cip_correlativos"
on public.cip_correlativos for insert to anon
with check (true);

-- Anon puede update cip_correlativos
create policy "Anon puede update cip_correlativos"
on public.cip_correlativos for update to anon
using (true)
with check (true);


-- ============================================
-- 3. FIX: POLÍTICA ADMIN PARA cip_correlativos (agregar with check)
-- ============================================

drop policy if exists "Admins control total cip_correlativos" on public.cip_correlativos;

create policy "Admins control total cip_correlativos"
on public.cip_correlativos for all to authenticated
using (
  exists (
    select 1 from public.usuarios_admin
    where usuarios_admin.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.usuarios_admin
    where usuarios_admin.auth_user_id = auth.uid()
  )
);


-- ============================================
-- 4. SEMILLA CORRELATIVOS PARA CARRERAS EXISTENTES
-- (Solo si las carreras se insertaron antes de los triggers)

insert into public.cip_correlativos (carrera_id, ultimo_numero)
select id, 0 from public.carreras
on conflict (carrera_id) do nothing;


-- ============================================
-- 5. AGREGAR apellido_paterno y apellido_materno a solicitantes
-- ============================================

alter table public.solicitantes
  add column apellido_paterno text,
  add column apellido_materno text;

update public.solicitantes
set
  apellido_paterno = split_part(apellidos, ' ', 1),
  apellido_materno = trim(substring(apellidos from position(' ' in apellidos)));

alter table public.solicitantes
  alter column apellido_paterno set not null,
  alter column apellido_materno set not null;

alter table public.solicitantes
  drop column apellidos;
