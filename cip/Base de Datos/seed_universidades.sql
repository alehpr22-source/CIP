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
-- 3. UNIVERSIDADES (Lima)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Ingeniería (UNI)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Mayor de San Marcos (UNMSM)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Pontificia Universidad Católica del Perú (PUCP)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad de Lima', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Peruana de Ciencias Aplicadas (UPC)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Ricardo Palma', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Federico Villarreal', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Agraria La Molina', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad de Ingeniería y Tecnología (UTEC)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad César Vallejo - Lima', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada del Norte - Lima', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Tecnológica del Perú (UTP) - Lima', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad San Martín de Porres', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Científica del Sur', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lima%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional del Callao', sede.id from sede;

-- ============================================
-- 4. UNIVERSIDADES (Arequipa)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Arequipa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de San Agustín (UNSA)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Arequipa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Católica San Pablo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Arequipa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Tecnológica del Perú (UTP) - Arequipa', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Arequipa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad La Salle', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Arequipa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Continental - Arequipa', sede.id from sede;

-- ============================================
-- 5. UNIVERSIDADES (Cusco)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Cusco%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Cusco%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Andina del Cusco', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Cusco%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Continental - Cusco', sede.id from sede;

-- ============================================
-- 6. UNIVERSIDADES (La Libertad)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%La Libertad%' or nombre ilike '%Trujillo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Trujillo (UNT)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%La Libertad%' or nombre ilike '%Trujillo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada Antenor Orrego (UPAO)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%La Libertad%' or nombre ilike '%Trujillo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad César Vallejo - Trujillo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%La Libertad%' or nombre ilike '%Trujillo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada del Norte - Trujillo', sede.id from sede;

-- ============================================
-- 7. UNIVERSIDADES (Piura)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Piura%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Piura (UNP)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Piura%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad de Piura (UDEP)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Piura%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad César Vallejo - Piura', sede.id from sede;

-- ============================================
-- 8. UNIVERSIDADES (Lambayeque)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Lambayeque%' or nombre ilike '%Chiclayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Pedro Ruiz Gallo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lambayeque%' or nombre ilike '%Chiclayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Católica Santo Toribio de Mogrovejo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lambayeque%' or nombre ilike '%Chiclayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad César Vallejo - Chiclayo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Lambayeque%' or nombre ilike '%Chiclayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Señor de Sipán', sede.id from sede;

-- ============================================
-- 9. UNIVERSIDADES (Junín)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Junín%' or nombre ilike '%Huancayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional del Centro del Perú (UNCP)', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Junín%' or nombre ilike '%Huancayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Continental - Huancayo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Junín%' or nombre ilike '%Huancayo%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Peruana Los Andes', sede.id from sede;

-- ============================================
-- 10. UNIVERSIDADES (Puno)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Puno%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional del Altiplano (UNA)', sede.id from sede;

-- ============================================
-- 11. UNIVERSIDADES (Cajamarca)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Cajamarca%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Cajamarca', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Cajamarca%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada del Norte - Cajamarca', sede.id from sede;

-- ============================================
-- 12. UNIVERSIDADES (Ica)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Ica%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional San Luis Gonzaga', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Ica%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada San Juan Bautista - Ica', sede.id from sede;

-- ============================================
-- 13. UNIVERSIDADES (Loreto)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Loreto%' or nombre ilike '%Iquitos%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de la Amazonía Peruana (UNAP)', sede.id from sede;

-- ============================================
-- 14. UNIVERSIDADES (Tacna)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Tacna%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Jorge Basadre Grohmann', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Tacna%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Privada de Tacna', sede.id from sede;

-- ============================================
-- 15. UNIVERSIDADES (Áncash)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Áncash%' or nombre ilike '%Ancash%' or nombre ilike '%Huaraz%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Santiago Antúnez de Mayolo', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Áncash%' or nombre ilike '%Ancash%' or nombre ilike '%Huaraz%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad San Pedro', sede.id from sede;

-- ============================================
-- 16. UNIVERSIDADES (Huánuco)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Huánuco%' or nombre ilike '%Huanuco%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Hermilio Valdizán', sede.id from sede;

-- ============================================
-- 17. UNIVERSIDADES (Ayacucho)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Ayacucho%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional San Cristóbal de Huamanga', sede.id from sede;

-- ============================================
-- 18. UNIVERSIDADES (San Martín)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%San Martín%' or nombre ilike '%Moyobamba%' or nombre ilike '%Tarapoto%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de San Martín', sede.id from sede;

-- ============================================
-- 19. UNIVERSIDADES (resto de regiones)
-- ============================================
with sede as (select id from public.sedes where nombre ilike '%Ucayali%' or nombre ilike '%Pucallpa%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Ucayali', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Amazonas%' or nombre ilike '%Chachapoyas%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Toribio Rodríguez de Mendoza', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Apurímac%' or nombre ilike '%Apurimac%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Micaela Bastidas de Apurímac', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Huancavelica%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Huancavelica', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Moquegua%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Moquegua', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Moquegua%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad José Carlos Mariátegui', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Pasco%' or nombre ilike '%Cerro de Pasco%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Daniel Alcides Carrión', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Tumbes%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional de Tumbes', sede.id from sede;
with sede as (select id from public.sedes where nombre ilike '%Madre de Dios%' or nombre ilike '%Puerto Maldonado%' limit 1)
insert into public.universidades (nombre, sede_id)
select 'Universidad Nacional Amazónica de Madre de Dios', sede.id from sede;

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
