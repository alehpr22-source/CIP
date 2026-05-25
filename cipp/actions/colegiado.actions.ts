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

  const carreras = await supabase.from("carreras").select("id, nombre")
  const carreraMap = new Map((carreras.data ?? []).map((c) => [c.id, c.nombre]))

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
      carrera_nombre: carreraMap.get(expediente.solicitantes.carrera_id) ?? "",
    }
  })

  return { data: result, error: null }
}

export interface ResultadoColegiadoPublico {
  numero_cip: string
  dni: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  carrera_nombre: string
  sede_nombre: string
  estado_habilitacion: string
}

export async function buscarColegiadosPublico(filtros: {
  tipo: "dni"
  dni: string
} | {
  tipo: "nombres"
  apellido_paterno: string
  apellido_materno: string
  nombres: string
}) {
  const supabase = createClient()

  let solicitantesQuery = supabase
    .from("solicitantes")
    .select("id, dni, nombres, apellido_paterno, apellido_materno, carrera_id, carrera_manual, sede_id")

  if (filtros.tipo === "dni") {
    solicitantesQuery = solicitantesQuery.eq("dni", filtros.dni)
  } else {
    if (filtros.apellido_paterno) {
      solicitantesQuery = solicitantesQuery.ilike("apellido_paterno", `%${filtros.apellido_paterno}%`)
    }
    if (filtros.apellido_materno) {
      solicitantesQuery = solicitantesQuery.ilike("apellido_materno", `%${filtros.apellido_materno}%`)
    }
    if (filtros.nombres) {
      solicitantesQuery = solicitantesQuery.ilike("nombres", `%${filtros.nombres}%`)
    }
  }

  const { data: solicitantes, error: errSol } = await solicitantesQuery

  if (errSol || !solicitantes || solicitantes.length === 0) {
    return { data: [] }
  }

  const solicitanteIds = solicitantes.map((s) => s.id)

  const { data: expedientes } = await supabase
    .from("expedientes")
    .select("id, solicitante_id")
    .in("solicitante_id", solicitanteIds)

  const expedienteIds = (expedientes ?? []).map((e) => e.id)

  if (expedienteIds.length === 0) {
    return { data: [] }
  }

  const { data: colegiados } = await supabase
    .from("colegiados")
    .select("id, numero_cip, estado_habilitacion, expediente_id")
    .in("expediente_id", expedienteIds)

  if (!colegiados || colegiados.length === 0) {
    return { data: [] }
  }

  const sedeIds = [...new Set(solicitantes.map((s) => s.sede_id))]

  const { data: sedesData } = await supabase.from("sedes").select("id, nombre").in("id", sedeIds)

  const sedeMap = new Map((sedesData ?? []).map((s) => [s.id, s.nombre]))

  const resultado: ResultadoColegiadoPublico[] = []

  for (const col of colegiados) {
    const exp = expedientes?.find((e) => e.id === col.expediente_id)
    if (!exp) continue

    const sol = solicitantes.find((s) => s.id === exp.solicitante_id)
    if (!sol) continue

    resultado.push({
      numero_cip: col.numero_cip,
      dni: sol.dni,
      nombres: sol.nombres,
      apellido_paterno: sol.apellido_paterno,
      apellido_materno: sol.apellido_materno,
      carrera_nombre: sol.carrera_manual ?? "",
      sede_nombre: sedeMap.get(sol.sede_id) ?? "",
      estado_habilitacion: col.estado_habilitacion,
    })
  }

  return { data: resultado }
}

