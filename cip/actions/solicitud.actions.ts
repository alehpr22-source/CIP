"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface SolicitudInput {
  dni: string
  nombres: string
  apellidos: string
  correo: string
  telefono: string
  carrera_id: string
  sede_id: string
  universidad: string
  foto_base64: string
  titulo_base64: string
}

export async function registrarSolicitud(input: SolicitudInput) {
  const supabase = await createClient()

  const { data: carreras, error: errCarreras } = await supabase
    .from("carreras")
    .select("id, codigo, nombre")

  if (errCarreras || !carreras || carreras.length === 0) {
    return { error: "Error al cargar carreras" }
  }

  const { data: sedes, error: errSedes } = await supabase
    .from("sedes")
    .select("id, nombre")

  if (errSedes || !sedes || sedes.length === 0) {
    return { error: "Error al cargar sedes" }
  }

  const { data: solicitante, error: errSolicitante } = await supabase
    .from("solicitantes")
    .insert({
      dni: input.dni,
      nombres: input.nombres,
      apellidos: input.apellidos,
      correo: input.correo || null,
      telefono: input.telefono || null,
      carrera_id: input.carrera_id,
      sede_id: input.sede_id,
      universidad: input.universidad,
      foto_url: input.foto_base64,
      titulo_url: input.titulo_base64,
      validado_reniec: false,
    })
    .select()
    .single()

  if (errSolicitante) {
    return { error: errSolicitante.message }
  }

  const { data: expediente, error: errExpediente } = await supabase
    .from("expedientes")
    .insert({
      solicitante_id: solicitante.id,
      estado: "Pendiente",
    })
    .select()
    .single()

  if (errExpediente) {
    return { error: errExpediente.message }
  }

  revalidatePath("/admin/expedientes")

  return {
    success: true,
    expediente: expediente.codigo_expediente,
    solicitanteId: solicitante.id,
    expedienteId: expediente.id,
  }
}

export async function obtenerCarreras() {
  const supabase = await createClient()
  const { data } = await supabase.from("carreras").select("id, codigo, nombre").order("nombre")
  return data ?? []
}

export async function obtenerSedes() {
  const supabase = await createClient()
  const { data } = await supabase.from("sedes").select("id, nombre").order("nombre")
  return data ?? []
}
