"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth-helper"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface FiltrosExpedientes {
  estado?: string
  busqueda?: string
}

export async function listarExpedientes(filtros: FiltrosExpedientes = {}) {
  const supabase = createClient()

  let query = supabase
    .from("expedientes")
    .select(`
      id,
      codigo_expediente,
      estado,
      observaciones,
      fecha_revision,
      created_at,
      solicitantes!expedientes_solicitante_id_fkey (
        id,
        dni,
        nombres,
        apellido_paterno,
        apellido_materno
      )
    `)
    .order("created_at", { ascending: false })

  if (filtros.estado) {
    query = query.eq("estado", filtros.estado)
  }

  if (filtros.busqueda) {
    query = query.or(
      `solicitantes.dni.ilike.%${filtros.busqueda}%,solicitantes.nombres.ilike.%${filtros.busqueda}%,solicitantes.apellido_paterno.ilike.%${filtros.busqueda}%,solicitantes.apellido_materno.ilike.%${filtros.busqueda}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al listar expedientes:", error.message)
    return { error: error.message }
  }

  return { data: data as unknown as ExpedienteRow[] }
}

export async function obtenerDetalleExpediente(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("expedientes")
    .select(`
      id,
      codigo_expediente,
      estado,
      observaciones,
      fecha_revision,
      created_at,
      solicitantes!expedientes_solicitante_id_fkey (
        id,
        dni,
        nombres,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        universidad,
        carrera_id,
        sede_id,
        foto_url,
        titulo_url,
        dni_url,
        validado_reniec
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error al obtener detalle:", error.message)
    return null
  }

  const { data: pagos } = await supabase
    .from("pagos_inscripcion")
    .select(`
      id,
      tipo_pago,
      monto,
      estado,
      transaccion_id,
      comprobante_url
    `)
    .eq("expediente_id", id)
    .limit(1)

  const dataWithPago = {
    ...data,
    pagos_inscripcion: pagos ?? [],
  }

  return dataWithPago as unknown as ExpedienteDetalle
}

export async function aprobarExpediente(expedienteId: string, _formData?: FormData) {
  const auth = await requireAdmin()
  if (!auth.success) return { error: auth.error }
  const { supabase, admin } = auth

  const { data: actual } = await supabase
    .from("expedientes")
    .select("estado")
    .eq("id", expedienteId)
    .single()

  if (!actual) return { error: "Expediente no encontrado" }

  const { error: errUpdate } = await supabase
    .from("expedientes")
    .update({ estado: "Pendiente de pago", fecha_revision: new Date().toISOString() })
    .eq("id", expedienteId)

  if (errUpdate) return { error: errUpdate.message }

  await supabase.from("historial_estados_expediente").insert({
    expediente_id: expedienteId,
    admin_id: admin.id,
    estado_anterior: actual.estado,
    estado_nuevo: "Pendiente de pago",
  })

  revalidatePath("/admin/expedientes")
  redirect("/admin/expedientes")
}

export async function observarExpediente(expedienteId: string, comentario: string) {
  if (!comentario.trim()) return { error: "Debes agregar un comentario" }

  const auth = await requireAdmin()
  if (!auth.success) return { error: auth.error }
  const { supabase, admin } = auth

  const { data: actual } = await supabase
    .from("expedientes")
    .select("estado")
    .eq("id", expedienteId)
    .single()

  if (!actual) return { error: "Expediente no encontrado" }

  const { error: errUpdate } = await supabase
    .from("expedientes")
    .update({ estado: "Observado", observaciones: comentario, fecha_revision: new Date().toISOString() })
    .eq("id", expedienteId)

  if (errUpdate) return { error: errUpdate.message }

  await supabase.from("historial_estados_expediente").insert({
    expediente_id: expedienteId,
    admin_id: admin.id,
    estado_anterior: actual.estado,
    estado_nuevo: "Observado",
    comentario,
  })

  revalidatePath("/admin/expedientes")
  redirect("/admin/expedientes")
}

export async function rechazarExpediente(expedienteId: string, comentario: string) {
  if (!comentario.trim()) return { error: "Debes agregar un comentario" }

  const auth = await requireAdmin()
  if (!auth.success) return { error: auth.error }
  const { supabase, admin } = auth

  const { data: actual } = await supabase
    .from("expedientes")
    .select("estado")
    .eq("id", expedienteId)
    .single()

  if (!actual) return { error: "Expediente no encontrado" }

  const { error: errUpdate } = await supabase
    .from("expedientes")
    .update({ estado: "Rechazado", observaciones: comentario, fecha_revision: new Date().toISOString() })
    .eq("id", expedienteId)

  if (errUpdate) return { error: errUpdate.message }

  await supabase.from("historial_estados_expediente").insert({
    expediente_id: expedienteId,
    admin_id: admin.id,
    estado_anterior: actual.estado,
    estado_nuevo: "Rechazado",
    comentario,
  })

  revalidatePath("/admin/expedientes")
  redirect("/admin/expedientes")
}

export async function aprobarPago(expedienteId: string, _formData?: FormData) {
  const auth = await requireAdmin()
  if (!auth.success) return { error: auth.error }
  const { supabase, admin } = auth

  const { data: expediente } = await supabase
    .from("expedientes")
    .select(`
      id,
      estado,
      solicitantes!expedientes_solicitante_id_fkey (
        carrera_id
      )
    `)
    .eq("id", expedienteId)
    .single()

  if (!expediente) return { error: "Expediente no encontrado" }
  if (expediente.estado !== "Pendiente de pago") return { error: "El expediente no está pendiente de pago" }

  const { data: pago } = await supabase
    .from("pagos_inscripcion")
    .select("id, estado")
    .eq("expediente_id", expedienteId)
    .single()

  if (!pago) return { error: "No se encontró pago para este expediente" }

  const { error: errPago } = await supabase
    .from("pagos_inscripcion")
    .update({ estado: "Aprobado" })
    .eq("id", pago.id)

  if (errPago) return { error: errPago.message }

  const carreraId = (expediente.solicitantes as unknown as { carrera_id: string }).carrera_id

  const { data: carrera } = await supabase
    .from("carreras")
    .select("codigo")
    .eq("id", carreraId)
    .single()

  if (!carrera) return { error: "Carrera no encontrada" }

  const { data: correlativo } = await supabase
    .from("cip_correlativos")
    .select("ultimo_numero")
    .eq("carrera_id", carreraId)
    .single()

  const nuevoNumero = (correlativo?.ultimo_numero ?? 0) + 1
  const numeroCip = String(nuevoNumero).padStart(5, "0")

  if (correlativo) {
    const { error: errUpdate } = await supabase
      .from("cip_correlativos")
      .update({ ultimo_numero: nuevoNumero })
      .eq("carrera_id", carreraId)

    if (errUpdate) return { error: errUpdate.message }
  } else {
    const { error: errInsert } = await supabase
      .from("cip_correlativos")
      .insert({ carrera_id: carreraId, ultimo_numero: nuevoNumero })

    if (errInsert) return { error: errInsert.message }
  }

  const { data: colegiado, error: errColegiado } = await supabase
    .from("colegiados")
    .insert({
      expediente_id: expedienteId,
      carrera_id: carreraId,
      numero_cip: numeroCip,
    })
    .select("numero_cip")
    .single()

  if (errColegiado) return { error: errColegiado.message }

  const { error: errEstado } = await supabase
    .from("expedientes")
    .update({ estado: "Aprobado", fecha_revision: new Date().toISOString() })
    .eq("id", expedienteId)

  if (errEstado) return { error: errEstado.message }

  await supabase.from("historial_estados_expediente").insert({
    expediente_id: expedienteId,
    admin_id: admin.id,
    estado_anterior: "Pendiente de pago",
    estado_nuevo: "Aprobado",
    comentario: `Pago aprobado. CIP: ${colegiado.numero_cip}`,
  })

  revalidatePath("/admin/expedientes")
  redirect("/admin/expedientes")
}

interface ExpedienteRow {
  id: string
  codigo_expediente: string
  estado: string
  observaciones: string | null
  fecha_revision: string | null
  created_at: string
  solicitantes: {
    id: string
    dni: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
  }
}

interface ExpedienteDetalle {
  id: string
  codigo_expediente: string
  estado: string
  observaciones: string | null
  fecha_revision: string | null
  created_at: string
  solicitantes: {
    id: string
    dni: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    correo: string | null
    telefono: string | null
    universidad: string
    carrera_id: string
    sede_id: string
    foto_url: string
    titulo_url: string
    dni_url: string
    validado_reniec: boolean
  }
  pagos_inscripcion: {
    id: string
    tipo_pago: string
    monto: number
    estado: string
    transaccion_id: string | null
    comprobante_url: string | null
  }[]
}
