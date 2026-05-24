"use server"

import { createClient } from "@/lib/supabase/server"
import { subirArchivo } from "@/lib/supabase/storage"

export async function consultarExpediente(dni: string, correo: string) {
  const supabase = createClient()

  if (!dni || !correo) {
    return { error: "DNI y correo son requeridos" }
  }

  const { data: solicitante, error: errSolicitante } = await supabase
    .from("solicitantes")
    .select(`
      id,
      dni,
      nombres,
      apellido_paterno,
      apellido_materno,
      carrera_id,
      sede_id,
      universidad,
      foto_url,
      titulo_url,
      dni_url
    `)
    .eq("dni", dni)
    .eq("correo", correo)
    .single()

  if (errSolicitante || !solicitante) {
    return { error: "DNI o correo no coinciden con ningún registro" }
  }

  const { data: expediente } = await supabase
    .from("expedientes")
    .select(`
      id,
      codigo_expediente,
      estado,
      observaciones,
      fecha_revision,
      created_at
    `)
    .eq("solicitante_id", solicitante.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!expediente) {
    return {
      solicitante: {
        id: solicitante.id, dni: solicitante.dni,
        nombres: solicitante.nombres, apellido_paterno: solicitante.apellido_paterno,
        apellido_materno: solicitante.apellido_materno,
        carrera_id: solicitante.carrera_id, sede_id: solicitante.sede_id,
        universidad: solicitante.universidad,
        foto_url: solicitante.foto_url, titulo_url: solicitante.titulo_url, dni_url: solicitante.dni_url,
        carrera_nombre: "", sede_nombre: "",
      },
      expediente: null,
      colegiado: null,
      pago: null,
    }
  }

  const { data: colegiadoRaw } = await supabase
    .from("colegiados")
    .select(`
      id,
      numero_cip,
      estado_habilitacion,
      fecha_colegiatura
    `)
    .eq("expediente_id", expediente.id)
    .single()

  const { data: pagoRaw } = await supabase
    .from("pagos_inscripcion")
    .select(`
      id,
      monto,
      estado,
      tipo_pago,
      comprobante_url
    `)
    .eq("expediente_id", expediente.id)
    .single()

  const [carreras, sedes] = await Promise.all([
    supabase.from("carreras").select("id, nombre"),
    supabase.from("sedes").select("id, nombre"),
  ])

  const carrera = carreras.data?.find((c) => c.id === solicitante.carrera_id)
  const sede = sedes.data?.find((s) => s.id === solicitante.sede_id)

  const colegiado = colegiadoRaw ? {
    id: colegiadoRaw.id,
    numero_cip: colegiadoRaw.numero_cip,
    estado_habilitacion: colegiadoRaw.estado_habilitacion,
    fecha_colegiatura: colegiadoRaw.fecha_colegiatura,
  } : null

  const pago = pagoRaw ? {
    id: pagoRaw.id,
    monto: pagoRaw.monto,
    estado: pagoRaw.estado,
    tipo_pago: pagoRaw.tipo_pago,
    comprobante_url: pagoRaw.comprobante_url,
  } : null

  return {
    solicitante: {
      id: solicitante.id, dni: solicitante.dni,
      nombres: solicitante.nombres, apellido_paterno: solicitante.apellido_paterno,
      apellido_materno: solicitante.apellido_materno,
      carrera_id: solicitante.carrera_id, sede_id: solicitante.sede_id,
      universidad: solicitante.universidad,
      foto_url: solicitante.foto_url, titulo_url: solicitante.titulo_url, dni_url: solicitante.dni_url,
      carrera_nombre: carrera?.nombre ?? "-",
      sede_nombre: sede?.nombre ?? "-",
    },
    expediente: {
      id: expediente.id,
      codigo_expediente: expediente.codigo_expediente,
      estado: expediente.estado,
      observaciones: expediente.observaciones,
      fecha_revision: expediente.fecha_revision,
      created_at: expediente.created_at,
    },
    colegiado,
    pago,
  }
}

export async function actualizarDocumento(
  solicitanteId: string,
  dni: string,
  correo: string,
  tipo: "foto" | "titulo" | "dni" | "voucher",
  base64: string,
) {
  const supabase = createClient()

  if (!dni || !correo) {
    return { error: "DNI y correo son requeridos" }
  }

  const { data: solicitante } = await supabase
    .from("solicitantes")
    .select("id")
    .eq("id", solicitanteId)
    .eq("dni", dni)
    .eq("correo", correo)
    .single()

  if (!solicitante) {
    return { error: "Solicitante no encontrado" }
  }

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id, estado")
    .eq("solicitante_id", solicitanteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!expediente) {
    return { error: "Expediente no encontrado" }
  }

  if (expediente.estado !== "Observado") {
    return { error: "Solo puedes cambiar documentos cuando tu expediente está Observado" }
  }

  const extensionMap: Record<string, string> = {
    foto: "png",
    titulo: "png",
    dni: "png",
    voucher: "png",
  }

  const folder = `solicitudes/${dni}`
  const filename = `${tipo}.${extensionMap[tipo]}`

  const url = await subirArchivo("expedientes", `${folder}/${filename}`, base64)

  if (!url) {
    return { error: "Error al subir el archivo" }
  }

  if (tipo === "voucher") {
    const { error: errPago } = await supabase
      .from("pagos_inscripcion")
      .update({ comprobante_url: url })
      .eq("expediente_id", expediente.id)

    if (errPago) return { error: errPago.message }
  } else {
    const colMap: Record<string, string> = {
      foto: "foto_url",
      titulo: "titulo_url",
      dni: "dni_url",
    }

    const { error: errUpdate } = await supabase
      .from("solicitantes")
      .update({ [colMap[tipo]]: url })
      .eq("id", solicitanteId)

    if (errUpdate) return { error: errUpdate.message }
  }

  return { success: true, newUrl: url }
}

export async function enviarParaRevision(solicitanteId: string, dni: string, correo: string) {
  const supabase = createClient()

  const { data: solicitante } = await supabase
    .from("solicitantes")
    .select("id")
    .eq("id", solicitanteId)
    .eq("dni", dni)
    .eq("correo", correo)
    .single()

  if (!solicitante) {
    return { error: "Solicitante no encontrado" }
  }

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id, estado")
    .eq("solicitante_id", solicitanteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!expediente) {
    return { error: "Expediente no encontrado" }
  }

  if (expediente.estado !== "Observado") {
    return { error: "El expediente no está en estado Observado" }
  }

  const { error: errEstado } = await supabase
    .from("expedientes")
    .update({ estado: "Pendiente" })
    .eq("id", expediente.id)

  if (errEstado) return { error: errEstado.message }

  return { success: true }
}

export async function realizarPago(
  solicitanteId: string,
  dni: string,
  correo: string,
  voucherBase64: string,
) {
  const supabase = createClient()

  if (!dni || !correo) {
    return { error: "DNI y correo son requeridos" }
  }

  const { data: solicitante } = await supabase
    .from("solicitantes")
    .select("id")
    .eq("id", solicitanteId)
    .eq("dni", dni)
    .eq("correo", correo)
    .single()

  if (!solicitante) {
    return { error: "Solicitante no encontrado" }
  }

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id, estado")
    .eq("solicitante_id", solicitanteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!expediente) {
    return { error: "Expediente no encontrado" }
  }

  if (expediente.estado !== "Pendiente de pago") {
    return { error: "El expediente no está pendiente de pago" }
  }

  const transaccionId = "TXN-" + Date.now().toString(36).toUpperCase()
  const folder = `solicitudes/${dni}`
  const voucherUrl = await subirArchivo("expedientes", `${folder}/voucher.png`, voucherBase64)

  if (!voucherUrl) {
    return { error: "Error al subir el comprobante" }
  }

  const { error: errPago } = await supabase.from("pagos_inscripcion").insert({
    expediente_id: expediente.id,
    tipo_pago: "Virtual",
    monto: 1500,
    estado: "Pendiente",
    transaccion_id: transaccionId,
    comprobante_url: voucherUrl,
  })

  if (errPago) return { error: errPago.message }

  return { success: true }
}
