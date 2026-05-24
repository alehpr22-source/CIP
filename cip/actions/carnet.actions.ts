"use server"

import { createClient } from "@/lib/supabase/server"

export async function obtenerDatosCarnet(dni: string) {
  const supabase = createClient()

  const { data: solicitante, error: errSolicitante } = await supabase
    .from("solicitantes")
    .select(`
      id,
      dni,
      nombres,
      apellido_paterno,
      apellido_materno,
      foto_url,
      carrera_id
    `)
    .eq("dni", dni)
    .single()

  if (errSolicitante || !solicitante) return null

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id, estado")
    .eq("solicitante_id", solicitante.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!expediente || expediente.estado !== "Aprobado") return null

  const { data: colegiado } = await supabase
    .from("colegiados")
    .select(`
      numero_cip,
      estado_habilitacion,
      fecha_colegiatura
    `)
    .eq("expediente_id", expediente.id)
    .single()

  if (!colegiado) return null

  const { data: carrera } = await supabase
    .from("carreras")
    .select("codigo, nombre")
    .eq("id", solicitante.carrera_id)
    .single()

  return {
    numero_cip: colegiado.numero_cip,
    estado_habilitacion: colegiado.estado_habilitacion,
    fecha_colegiatura: colegiado.fecha_colegiatura,
    dni: solicitante.dni,
    nombres: solicitante.nombres,
    apellido_paterno: solicitante.apellido_paterno,
    apellido_materno: solicitante.apellido_materno,
    foto_url: solicitante.foto_url,
    carrera_codigo: carrera?.codigo ?? "",
    carrera_nombre: carrera?.nombre ?? "",
  }
}
