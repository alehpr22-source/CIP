-- ============================================
-- MIGRACIÓN: Quitar sede_id de universidades
-- CIP - Colegio de Ingenieros del Perú
-- Motivo: Las universidades no deben estar
--   ligadas a una sede específica. Un solicitante
--   puede egresar de una universidad en cualquier
--   región y colegiarse en otra distinta.
-- ============================================

alter table public.universidades
  drop constraint if exists universidades_sede_id_fkey;

alter table public.universidades
  drop column if exists sede_id;
