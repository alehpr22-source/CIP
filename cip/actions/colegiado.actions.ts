"use server"

import { createClient } from "@/lib/supabase/server"

export interface FiltrosColegiados {
  busqueda?: string
  estado_habilitacion?: string
}

export async function listarColegiados(filtros: FiltrosColegiados = {}) {
  const supabase = createClient()

  let query = supabase
    .from("colegiados")
    .select(`
      id,
      numero_cip,
      estado_habilitacion,
      fecha_colegiatura,
      created_at,
      expedientes!colegiados_expediente_id_fkey (
        codigo_expediente,
        solicitantes!expedientes_solicitante_id_fkey (
          dni,
          nombres,
          apellido_paterno,
          apellido_materno,
          carrera_id
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (filtros.estado_habilitacion) {
    query = query.eq("estado_habilitacion", filtros.estado_habilitacion)
  }

  if (filtros.busqueda) {
    const b = filtros.busqueda.trim()
    query = query.or(
      `numero_cip.ilike.%${b}%,expedientes.solicitantes.dni.ilike.%${b}%,expedientes.solicitantes.nombres.ilike.%${b}%,expedientes.solicitantes.apellido_paterno.ilike.%${b}%,expedientes.solicitantes.apellido_materno.ilike.%${b}%`
    )
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  const result = await Promise.all(
    (data ?? []).map(async (col: any) => {
      const expediente = col.expedientes as unknown as {
        codigo_expediente: string
        solicitantes: {
          dni: string
          nombres: string
          apellido_paterno: string
          apellido_materno: string
          carrera_id: string
        }
      }

      const { data: carrera } = await supabase
        .from("carreras")
        .select("codigo, nombre")
        .eq("id", expediente.solicitantes.carrera_id)
        .single()

      return {
        id: col.id,
        numero_cip: col.numero_cip,
        estado_habilitacion: col.estado_habilitacion,
        fecha_colegiatura: col.fecha_colegiatura,
        created_at: col.created_at,
        codigo_expediente: expediente.codigo_expediente,
        dni: expediente.solicitantes.dni,
        nombres: expediente.solicitantes.nombres,
        apellido_paterno: expediente.solicitantes.apellido_paterno,
        apellido_materno: expediente.solicitantes.apellido_materno,
        carrera_codigo: carrera?.codigo ?? "",
        carrera_nombre: carrera?.nombre ?? "",
      }
    })
  )

  return { data: result, error: null }
}

