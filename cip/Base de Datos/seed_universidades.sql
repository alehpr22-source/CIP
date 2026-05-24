-- ============================================
-- SEED DATA: Universidades peruanas y sus carreras de ingeniería
-- Ejecutar DESPUÉS de migracion_universidades.sql
-- ============================================

-- ============================================
-- 1. CARRERAS (solo si no existen)
-- ============================================
insert into public.carreras (codigo, nombre) values
  ('IC', 'Ingeniería Civil'),
  ('IS', 'Ingeniería de Sistemas'),
  ('II', 'Ingeniería Industrial'),
  ('IM', 'Ingeniería Mecánica'),
  ('IE', 'Ingeniería Eléctrica'),
  ('IET', 'Ingeniería Electrónica'),
  ('IQ', 'Ingeniería Química'),
  ('IAMB', 'Ingeniería Ambiental'),
  ('IAGRI', 'Ingeniería Agrónoma'),
  ('IALI', 'Ingeniería de Alimentos'),
  ('IMIN', 'Ingeniería de Minas'),
  ('IG', 'Ingeniería Geológica'),
  ('INF', 'Ingeniería Informática'),
  ('ISOFT', 'Ingeniería de Software'),
  ('IBM', 'Ingeniería Biomédica'),
  ('IP', 'Ingeniería de Petróleo'),
  ('ITS', 'Ingeniería Textil'),
  ('IT', 'Ingeniería de Telecomunicaciones'),
  ('IAGRI2', 'Ingeniería Agrícola')
on conflict (codigo) do nothing;

-- ============================================
-- 2. SEDES (solo si no existen)
-- ============================================
insert into public.sedes (nombre) values
  ('Lima'),
  ('Callao'),
  ('Arequipa'),
  ('Cusco'),
  ('La Libertad'),
  ('Piura'),
  ('Lambayeque'),
  ('Junín'),
  ('Puno'),
  ('Cajamarca'),
  ('Ica'),
  ('Loreto'),
  ('Tacna'),
  ('Áncash'),
  ('Huánuco'),
  ('Ayacucho'),
  ('San Martín'),
  ('Ucayali'),
  ('Amazonas'),
  ('Apurímac'),
  ('Huancavelica'),
  ('Moquegua'),
  ('Pasco'),
  ('Tumbes'),
  ('Madre de Dios')
on conflict do nothing;

-- ============================================
-- 3. UNIVERSIDADES
-- ============================================
insert into public.universidades (nombre) values
  ('Universidad Nacional de Ingeniería (UNI)'),
  ('Universidad Nacional Mayor de San Marcos (UNMSM)'),
  ('Pontificia Universidad Católica del Perú (PUCP)'),
  ('Universidad de Lima'),
  ('Universidad Peruana de Ciencias Aplicadas (UPC)'),
  ('Universidad Ricardo Palma'),
  ('Universidad Nacional Federico Villarreal'),
  ('Universidad Nacional Agraria La Molina'),
  ('Universidad de Ingeniería y Tecnología (UTEC)'),
  ('Universidad César Vallejo - Lima'),
  ('Universidad Privada del Norte - Lima'),
  ('Universidad Tecnológica del Perú (UTP) - Lima'),
  ('Universidad San Martín de Porres'),
  ('Universidad Científica del Sur'),
  ('Universidad Nacional del Callao'),
  ('Universidad Nacional de San Agustín (UNSA)'),
  ('Universidad Católica San Pablo'),
  ('Universidad Tecnológica del Perú (UTP) - Arequipa'),
  ('Universidad La Salle'),
  ('Universidad Continental - Arequipa'),
  ('Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)'),
  ('Universidad Andina del Cusco'),
  ('Universidad Continental - Cusco'),
  ('Universidad Nacional de Trujillo (UNT)'),
  ('Universidad Privada Antenor Orrego (UPAO)'),
  ('Universidad César Vallejo - Trujillo'),
  ('Universidad Privada del Norte - Trujillo'),
  ('Universidad Nacional de Piura (UNP)'),
  ('Universidad de Piura (UDEP)'),
  ('Universidad César Vallejo - Piura'),
  ('Universidad Nacional Pedro Ruiz Gallo'),
  ('Universidad Católica Santo Toribio de Mogrovejo'),
  ('Universidad César Vallejo - Chiclayo'),
  ('Universidad Señor de Sipán'),
  ('Universidad Nacional del Centro del Perú (UNCP)'),
  ('Universidad Continental - Huancayo'),
  ('Universidad Peruana Los Andes'),
  ('Universidad Nacional del Altiplano (UNA)'),
  ('Universidad Nacional de Cajamarca'),
  ('Universidad Privada del Norte - Cajamarca'),
  ('Universidad Nacional San Luis Gonzaga'),
  ('Universidad Privada San Juan Bautista - Ica'),
  ('Universidad Nacional de la Amazonía Peruana (UNAP)'),
  ('Universidad Nacional Jorge Basadre Grohmann'),
  ('Universidad Privada de Tacna'),
  ('Universidad Nacional Santiago Antúnez de Mayolo'),
  ('Universidad San Pedro'),
  ('Universidad Nacional Hermilio Valdizán'),
  ('Universidad Nacional San Cristóbal de Huamanga'),
  ('Universidad Nacional de San Martín'),
  ('Universidad Nacional de Ucayali'),
  ('Universidad Nacional Toribio Rodríguez de Mendoza'),
  ('Universidad Nacional Micaela Bastidas de Apurímac'),
  ('Universidad Nacional de Huancavelica'),
  ('Universidad Nacional de Moquegua'),
  ('Universidad José Carlos Mariátegui'),
  ('Universidad Nacional Daniel Alcides Carrión'),
  ('Universidad Nacional de Tumbes'),
  ('Universidad Nacional Amazónica de Madre de Dios');

-- ============================================
-- 20. RELACIONES UNIVERSIDAD-CARRERA
-- ============================================

-- Helper: función para insertar relación
-- Formato: select insertar_relacion('nombre_univ', 'CODIGO_CARRERA');

-- === LIMA ===

-- UNI
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Ingeniería%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE','IET','IQ','IAMB','IG','IMIN','ITS','INF','IN')
on conflict do nothing;

-- UNMSM
with u as (select id from public.universidades where nombre like 'Universidad Nacional Mayor de San Marcos%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IAMB','IG','IMIN')
on conflict do nothing;

-- PUCP
with u as (select id from public.universidades where nombre like 'Pontificia Universidad Católica%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IM')
on conflict do nothing;

-- Universidad de Lima
with u as (select id from public.universidades where nombre = 'Universidad de Lima')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IS','II','IC')
on conflict do nothing;

-- UPC
with u as (select id from public.universidades where nombre like 'Universidad Peruana de Ciencias Aplicadas%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAMB','ISOFT')
on conflict do nothing;

-- Ricardo Palma
with u as (select id from public.universidades where nombre like 'Universidad Ricardo Palma%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAMB')
on conflict do nothing;

-- Federico Villarreal
with u as (select id from public.universidades where nombre like 'Universidad Nacional Federico Villarreal%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAMB','IG')
on conflict do nothing;

-- La Molina
with u as (select id from public.universidades where nombre like 'Universidad Nacional Agraria La Molina%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IAGRI','IAMB','IALI')
on conflict do nothing;

-- UTEC
with u as (select id from public.universidades where nombre like 'Universidad de Ingeniería y Tecnología%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','IET','IM','IE','IBM','ISOFT')
on conflict do nothing;

-- UCV Lima
with u as (select id from public.universidades where nombre like 'Universidad César Vallejo - Lima%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- UPN Lima
with u as (select id from public.universidades where nombre like 'Universidad Privada del Norte - Lima%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- UTP Lima
with u as (select id from public.universidades where nombre like 'Universidad Tecnológica del Perú (UTP) - Lima%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAMB')
on conflict do nothing;

-- USMP
with u as (select id from public.universidades where nombre like 'Universidad San Martín de Porres%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IS','II')
on conflict do nothing;

-- Científica del Sur
with u as (select id from public.universidades where nombre like 'Universidad Científica del Sur%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IAMB','IBM')
on conflict do nothing;

-- UNAC
with u as (select id from public.universidades where nombre like 'Universidad Nacional del Callao%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IM','IE','IQ')
on conflict do nothing;

-- === AREQUIPA ===

-- UNSA
with u as (select id from public.universidades where nombre like 'Universidad Nacional de San Agustín%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE','IET','IQ','IAMB','IG','IMIN')
on conflict do nothing;

-- San Pablo
with u as (select id from public.universidades where nombre like 'Universidad Católica San Pablo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IBM')
on conflict do nothing;

-- UTP Arequipa
with u as (select id from public.universidades where nombre like 'Universidad Tecnológica del Perú (UTP) - Arequipa%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- Continental Arequipa
with u as (select id from public.universidades where nombre like 'Universidad Continental - Arequipa%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === CUSCO ===

-- UNSAAC
with u as (select id from public.universidades where nombre like 'Universidad Nacional de San Antonio Abad del Cusco%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE','IET','IQ','IAMB','IG','IMIN')
on conflict do nothing;

-- Andina del Cusco
with u as (select id from public.universidades where nombre like 'Universidad Andina del Cusco%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- Continental Cusco
with u as (select id from public.universidades where nombre like 'Universidad Continental - Cusco%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === LA LIBERTAD ===

-- UNT
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Trujillo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IAMB','IAGRI')
on conflict do nothing;

-- UPAO
with u as (select id from public.universidades where nombre like 'Universidad Privada Antenor Orrego%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IE','IET')
on conflict do nothing;

-- UCV Trujillo
with u as (select id from public.universidades where nombre like 'Universidad César Vallejo - Trujillo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- UPN Trujillo
with u as (select id from public.universidades where nombre like 'Universidad Privada del Norte - Trujillo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === PIURA ===

-- UNP
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Piura%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE','IET')
on conflict do nothing;

-- UDEP
with u as (select id from public.universidades where nombre like 'Universidad de Piura%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE')
on conflict do nothing;

-- UCV Piura
with u as (select id from public.universidades where nombre like 'Universidad César Vallejo - Piura%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === LAMBAYEQUE ===

-- Pedro Ruiz Gallo
with u as (select id from public.universidades where nombre like 'Universidad Nacional Pedro Ruiz Gallo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAGRI')
on conflict do nothing;

-- Santo Toribio
with u as (select id from public.universidades where nombre like 'Universidad Católica Santo Toribio%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- UCV Chiclayo
with u as (select id from public.universidades where nombre like 'Universidad César Vallejo - Chiclayo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- Señor de Sipán
with u as (select id from public.universidades where nombre like 'Universidad Señor de Sipán%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === JUNÍN ===

-- UNCP
with u as (select id from public.universidades where nombre like 'Universidad Nacional del Centro del Perú%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IAMB','IM')
on conflict do nothing;

-- Continental Huancayo
with u as (select id from public.universidades where nombre like 'Universidad Continental - Huancayo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- Los Andes
with u as (select id from public.universidades where nombre like 'Universidad Peruana Los Andes%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === PUNO ===

-- UNA Puno
with u as (select id from public.universidades where nombre like 'Universidad Nacional del Altiplano%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IAGRI','IMIN','IAMB')
on conflict do nothing;

-- === CAJAMARCA ===

-- UNC
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Cajamarca%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAGRI','IMIN')
on conflict do nothing;

-- UPN Cajamarca
with u as (select id from public.universidades where nombre like 'Universidad Privada del Norte - Cajamarca%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS')
on conflict do nothing;

-- === ICA ===

-- San Luis Gonzaga
with u as (select id from public.universidades where nombre like 'Universidad Nacional San Luis Gonzaga%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IM','IMIN')
on conflict do nothing;

-- === LORETO ===

-- UNAP
with u as (select id from public.universidades where nombre like 'Universidad Nacional de la Amazonía Peruana%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','IET','IQ','IAGRI')
on conflict do nothing;

-- === TACNA ===

-- Jorge Basadre
with u as (select id from public.universidades where nombre like 'Universidad Nacional Jorge Basadre%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE')
on conflict do nothing;

-- Privada de Tacna
with u as (select id from public.universidades where nombre like 'Universidad Privada de Tacna%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === ÁNCASH ===

-- Santiago Antúnez de Mayolo
with u as (select id from public.universidades where nombre like 'Universidad Nacional Santiago Antúnez de Mayolo%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IM','IE','IAGRI')
on conflict do nothing;

-- San Pedro
with u as (select id from public.universidades where nombre like 'Universidad San Pedro%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- === HUÁNUCO ===

-- Hermilio Valdizán
with u as (select id from public.universidades where nombre like 'Universidad Nacional Hermilio Valdizán%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IAGRI')
on conflict do nothing;

-- === AYACUCHO ===

-- Huamanga
with u as (select id from public.universidades where nombre like 'Universidad Nacional San Cristóbal de Huamanga%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IET','IQ','IMIN','IAGRI')
on conflict do nothing;

-- === SAN MARTÍN ===

-- UNSM
with u as (select id from public.universidades where nombre like 'Universidad Nacional de San Martín%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IAGRI')
on conflict do nothing;

-- === UCAYALI ===

-- UNU
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Ucayali%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','IAGRI')
on conflict do nothing;

-- === AMAZONAS ===

-- UNTRM
with u as (select id from public.universidades where nombre like 'Universidad Nacional Toribio Rodríguez de Mendoza%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','IAGRI')
on conflict do nothing;

-- === APURÍMAC ===

-- Micaela Bastidas
with u as (select id from public.universidades where nombre like 'Universidad Nacional Micaela Bastidas%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IAGRI')
on conflict do nothing;

-- === HUANCAVELICA ===

-- UNH
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Huancavelica%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IAGRI')
on conflict do nothing;

-- === MOQUEGUA ===

-- UNM
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Moquegua%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II')
on conflict do nothing;

-- José Carlos Mariátegui
with u as (select id from public.universidades where nombre like 'Universidad José Carlos Mariátegui%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS')
on conflict do nothing;

-- === PASCO ===

-- UNDAC
with u as (select id from public.universidades where nombre like 'Universidad Nacional Daniel Alcides Carrión%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','II','IM','IE')
on conflict do nothing;

-- === TUMBES ===

-- UNTumbes
with u as (select id from public.universidades where nombre like 'Universidad Nacional de Tumbes%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IS','IAGRI','IAMB')
on conflict do nothing;

-- === MADRE DE DIOS ===

-- UNAMAD
with u as (select id from public.universidades where nombre like 'Universidad Nacional Amazónica de Madre de Dios%')
insert into public.universidad_carreras (universidad_id, carrera_id)
select u.id, c.id from u, public.carreras c where c.codigo in ('IC','IAMB','IAGRI')
on conflict do nothing;
