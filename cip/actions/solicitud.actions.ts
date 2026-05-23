"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getValidadorReniec } from "@/lib/reniec"
import { subirArchivo } from "@/lib/supabase/storage"

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
  dni_base64: string
  voucher_base64: string
  transaccion_id: string
}

export async function validarDniConReniec(dni: string, nombres: string, apellidos: string) {
  const validador = getValidadorReniec()
  return await validador.validar({ dni, nombres, apellidos })
}

export async function registrarSolicitud(input: SolicitudInput) {
  const supabase = createClient()

  const validador = getValidadorReniec()
  const reniecResult = await validador.validar({
    dni: input.dni,
    nombres: input.nombres,
    apellidos: input.apellidos,
  })

  if (!reniecResult.valido) {
    return { error: `Validación RENIEC falló: ${reniecResult.mensaje}` }
  }

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
      foto_url: "",
      titulo_url: "",
      dni_url: "",
      validado_reniec: true,
    })
    .select()
    .single()

  if (errSolicitante) {
    return { error: errSolicitante.message }
  }

  const folder = `solicitudes/${solicitante.id}`

  const [fotoUrl, tituloUrl, dniUrl, voucherUrl] = await Promise.all([
    subirArchivo("expedientes", `${folder}/foto.${extension(input.foto_base64)}`, input.foto_base64),
    subirArchivo("expedientes", `${folder}/titulo.${extension(input.titulo_base64)}`, input.titulo_base64),
    subirArchivo("expedientes", `${folder}/dni.${extension(input.dni_base64)}`, input.dni_base64),
    subirArchivo("expedientes", `${folder}/voucher.png`, input.voucher_base64),
  ])

  if (!fotoUrl || !tituloUrl || !dniUrl || !voucherUrl) {
    return { error: "Error al subir archivos a Storage" }
  }

  const { error: errUpdate } = await supabase
    .from("solicitantes")
    .update({ foto_url: fotoUrl, titulo_url: tituloUrl, dni_url: dniUrl })
    .eq("id", solicitante.id)

  if (errUpdate) {
    return { error: errUpdate.message }
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

  const { error: errPago } = await supabase.from("pagos_inscripcion").insert({
    expediente_id: expediente.id,
    tipo_pago: "Virtual",
    monto: 1500,
    estado: "Aprobado",
    transaccion_id: input.transaccion_id,
    comprobante_url: voucherUrl,
  })

  if (errPago) {
    return { error: errPago.message }
  }

  revalidatePath("/admin/expedientes")

  return {
    success: true,
    expediente: expediente.codigo_expediente,
    solicitanteId: solicitante.id,
    expedienteId: expediente.id,
  }
}

function extension(base64: string): string {
  const match = base64.match(/^data:image\/(\w+)/)
  if (match) return match[1] === "jpeg" ? "jpg" : match[1]
  if (base64.includes("application/pdf")) return "pdf"
  return "png"
}

