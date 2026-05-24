-- ============================================
-- MIGRACIÓN: Tablas de universidades y carrera manual
-- CIP - Colegio de Ingenieros del Perú
-- ============================================

-- 1. TABLA UNIVERSIDADES
create table if not exists public.universidades (
  id uuid not null default gen_random_uuid(),
  nombre varchar(255) not null,
  sede_id uuid not null,
  constraint universidades_pkey primary key (id),
  constraint universidades_sede_id_fkey foreign key (sede_id) references public.sedes (id)
);

-- 2. TABLA UNIVERSIDAD_CARRERAS (qué carreras ofrece cada universidad)
create table if not exists public.universidad_carreras (
  universidad_id uuid not null,
  carrera_id uuid not null,
  constraint universidad_carreras_pkey primary key (universidad_id, carrera_id),
  constraint universidad_carreras_universidad_id_fkey foreign key (universidad_id) references public.universidades (id),
  constraint universidad_carreras_carrera_id_fkey foreign key (carrera_id) references public.carreras (id)
);

-- 3. MODIFICAR SOLICITANTES
alter table public.solicitantes
  add column if not exists universidad_id uuid references public.universidades (id);

alter table public.solicitantes
  add column if not exists carrera_manual varchar(255);

-- Hacer carrera_id nullable (por si el usuario escribe una carrera manual)
alter table public.solicitantes
  alter column carrera_id drop not null;

-- 4. POLÍTICAS RLS
alter table public.universidades enable row level security;
alter table public.universidad_carreras enable row level security;

drop policy if exists "Anon puede leer universidades" on public.universidades;
create policy "Anon puede leer universidades"
  on public.universidades for select to anon
  using (true);

drop policy if exists "Anon puede leer universidad_carreras" on public.universidad_carreras;
create policy "Anon puede leer universidad_carreras"
  on public.universidad_carreras for select to anon
  using (true);

drop policy if exists "Admins control total universidades" on public.universidades;
create policy "Admins control total universidades"
  on public.universidades for all to authenticated
  using (
    exists (select 1 from public.usuarios_admin where usuarios_admin.auth_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.usuarios_admin where usuarios_admin.auth_user_id = auth.uid())
  );

drop policy if exists "Admins control total universidad_carreras" on public.universidad_carreras;
create policy "Admins control total universidad_carreras"
  on public.universidad_carreras for all to authenticated
  using (
    exists (select 1 from public.usuarios_admin where usuarios_admin.auth_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.usuarios_admin where usuarios_admin.auth_user_id = auth.uid())
  );
