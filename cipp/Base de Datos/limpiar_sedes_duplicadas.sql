-- ============================================
-- LIMPIAR DUPLICADOS DE SEDES
-- ============================================
-- Paso 1: Para cada nombre de sede duplicado, conservar la que tenga más datos
-- y reasignar las universidades que apuntan a las duplicadas

with ranked_sedes as (
  select 
    id,
    nombre,
    row_number() over (
      partition by nombre 
      order by 
        case when direccion is not null then 1 else 2 end,
        case when telefono is not null then 1 else 2 end,
        id
    ) as rn
  from public.sedes
),
to_delete as (
  select id, nombre from ranked_sedes where rn > 1
),
to_keep as (
  select id, nombre from ranked_sedes where rn = 1
)
update public.universidades u
set sede_id = tk.id
from to_delete td
join to_keep tk on tk.nombre = td.nombre
where u.sede_id = td.id;

-- Paso 2: Eliminar las sedes duplicadas
delete from public.sedes s
where s.id in (
  select td.id from (
    select id, row_number() over (
      partition by nombre 
      order by 
        case when direccion is not null then 1 else 2 end,
        case when telefono is not null then 1 else 2 end,
        id
    ) as rn
    from public.sedes
  ) td
  where td.rn > 1
);

-- Paso 3: Verificar resultado
select nombre, count(*) as cantidad
from public.sedes
group by nombre
having count(*) > 1;
