"use server"

import { createClient } from "@/lib/supabase/server"

export interface FiltrosColegiados {
  busqueda?: string
  estado_habilitacion?: string
  carrera_id?: string
  sede_id?: string
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

  async function obtenerExpedienteIdsPorSolicitante(
    filtro: { campo: string; valor: string }
  ): Promise<string[]> {
    const { data: solicitantes } = await supabase
      .from("solicitantes")
      .select("id")
      .eq(filtro.campo, filtro.valor)

    if (!solicitantes || solicitantes.length === 0) return []

    const { data: expedientes } = await supabase
      .from("expedientes")
      .select("id")
      .in("solicitante_id", solicitantes.map((s) => s.id))

    return (expedientes ?? []).map((e) => e.id)
  }

  let filtroExpedienteIds: string[] | null = null

  if (filtros.carrera_id) {
    filtroExpedienteIds = await obtenerExpedienteIdsPorSolicitante({
      campo: "carrera_id",
      valor: filtros.carrera_id,
    })
  }

  if (filtros.sede_id) {
    const ids = await obtenerExpedienteIdsPorSolicitante({
      campo: "sede_id",
      valor: filtros.sede_id,
    })
    filtroExpedienteIds = filtroExpedienteIds
      ? filtroExpedienteIds.filter((id) => ids.includes(id))
      : ids
  }

  if (filtroExpedienteIds !== null) {
    if (filtroExpedienteIds.length === 0) {
      return { data: [], error: null }
    }
    query = query.in("expediente_id", filtroExpedienteIds)
  }

  if (filtros.busqueda) {
    const b = filtros.busqueda.trim()

    const { data: solicitantes } = await supabase
      .from("solicitantes")
      .select("id")
      .or(
        `dni.ilike.%${b}%,nombres.ilike.%${b}%,apellido_paterno.ilike.%${b}%,apellido_materno.ilike.%${b}%`
      )

    const solicitanteIds = (solicitantes ?? []).map((s) => s.id)

    let expedienteIds: string[] = []

    if (solicitanteIds.length > 0) {
      const { data: expedientes } = await supabase
        .from("expedientes")
        .select("id")
        .in("solicitante_id", solicitanteIds)

      expedienteIds = (expedientes ?? []).map((e) => e.id)
    }

    const cipMatch = b.length > 0 ? `numero_cip.ilike.%${b}%` : "1=0"

    if (expedienteIds.length > 0) {
      query = query.or(
        `${cipMatch},expediente_id.in.(${expedienteIds.join(",")})`
      )
    } else {
      query = query.or(cipMatch)
    }
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message, data: null }
  }

  const carreras = await supabase.from("carreras").select("id, codigo, nombre")
  const carreraMap = new Map((carreras.data ?? []).map((c) => [c.id, c]))

  const result = (data ?? []).map((col: any) => {
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

    const carrera = carreraMap.get(expediente.solicitantes.carrera_id)

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

  return { data: result, error: null }
}

