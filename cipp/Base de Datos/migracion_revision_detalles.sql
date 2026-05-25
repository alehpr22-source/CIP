-- Agregar columna revision_detalles a expedientes para almacenar
-- el resultado de la revisión campo por campo (JSON)
alter table if exists public.expedientes
  add column if not exists revision_detalles jsonb default null;

-- Ejemplo del JSON almacenado:
-- {
--   "campos": {
--     "dni": true,
--     "nombres": true,
--     "apellidos": false,
--     "correo": true,
--     "telefono": true,
--     "universidad": true,
--     "carrera": true,
--     "sede": true,
--     "foto": true,
--     "titulo": false,
--     "dni_file": true
--   },
--   "comentario": "comentario opcional"
-- }
