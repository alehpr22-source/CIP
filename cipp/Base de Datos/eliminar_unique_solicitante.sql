-- Elimina la constraint UNIQUE sobre solicitante_id en expedientes
-- para permitir múltiples expedientes por solicitante (historial de reenvíos)
alter table public.expedientes drop constraint if exists expedientes_solicitante_id_key;
