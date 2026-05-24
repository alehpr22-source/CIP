"use server"

import { requireUser } from "@/lib/auth-helper"
import { revalidatePath } from "next/cache"

export async function obtenerDeuda() {
  const auth = await requireUser()
  if (!auth.success) return { error: auth.error }
  const { supabase, solicitante } = auth

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id")
    .eq("solicitante_id", solicitante.id)
    .single()

  if (!expediente) return { error: "No tienes un expediente registrado" }

  const { data: colegiado } = await supabase
    .from("colegiados")
    .select("id, estado_habilitacion, fecha_colegiatura")
    .eq("expediente_id", expediente.id)
    .single()

  if (!colegiado) return { error: "Aún no eres colegiado. Debes esperar la aprobación de tu expediente." }

  const ahora = new Date()
  const anioActual = ahora.getFullYear()
  const mesActual = ahora.getMonth() + 1

  const fechaColegiatura = new Date(colegiado.fecha_colegiatura)
  let mesInicio = fechaColegiatura.getMonth() + 2
  let anioInicio = fechaColegiatura.getFullYear()

  if (mesInicio > 12) {
    mesInicio = 1
    anioInicio++
  }

  const mesesPagados = new Set<string>()

  const { data: pagos } = await supabase
    .from("pagos_mensualidades")
    .select("anio, mes")
    .eq("colegiado_id", colegiado.id)
    .eq("estado", "Pagado")

  for (const p of pagos ?? []) {
    mesesPagados.add(`${p.anio}-${p.mes}`)
  }

  const mesesAdeudados: { anio: number; mes: number }[] = []
  let currentAnio = anioInicio
  let currentMes = mesInicio

  while (currentAnio < anioActual || (currentAnio === anioActual && currentMes <= mesActual)) {
    if (!mesesPagados.has(`${currentAnio}-${currentMes}`)) {
      mesesAdeudados.push({ anio: currentAnio, mes: currentMes })
    }
    currentMes++
    if (currentMes > 12) {
      currentMes = 1
      currentAnio++
    }
  }

  const totalDeuda = mesesAdeudados.length * 20

  return {
    data: {
      colegiadoId: colegiado.id,
      estadoHabilitacion: colegiado.estado_habilitacion,
      mesesAdeudados,
      totalDeuda,
      mesActual,
      anioActual,
    },
  }
}

export async function listarPagosMensuales() {
  const auth = await requireUser()
  if (!auth.success) return { error: auth.error, data: [] }
  const { supabase, solicitante } = auth

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id")
    .eq("solicitante_id", solicitante.id)
    .single()

  if (!expediente) return { error: null, data: [] }

  const { data: colegiado } = await supabase
    .from("colegiados")
    .select("id")
    .eq("expediente_id", expediente.id)
    .single()

  if (!colegiado) return { error: null, data: [] }

  const { data, error } = await supabase
    .from("pagos_mensualidades")
    .select("*")
    .eq("colegiado_id", colegiado.id)
    .order("anio", { ascending: false })
    .order("mes", { ascending: false })

  if (error) return { error: error.message, data: [] }

  return { data, error: null }
}

export async function registrarPagoMensual(formData: FormData) {
  const auth = await requireUser()
  if (!auth.success) return { error: auth.error }
  const { supabase, solicitante } = auth

  const { data: expediente } = await supabase
    .from("expedientes")
    .select("id")
    .eq("solicitante_id", solicitante.id)
    .single()

  if (!expediente) return { error: "No tienes un expediente registrado" }

  const { data: colegiado } = await supabase
    .from("colegiados")
    .select("id")
    .eq("expediente_id", expediente.id)
    .single()

  if (!colegiado) return { error: "Aún no eres colegiado" }

  const anio = parseInt(formData.get("anio") as string)
  const mes = parseInt(formData.get("mes") as string)
  const tipoPago = formData.get("tipo_pago") as string || "Virtual"

  if (!anio || !mes) return { error: "Año y mes son requeridos" }

  const { error } = await supabase.from("pagos_mensualidades").insert({
    colegiado_id: colegiado.id,
    anio,
    mes,
    monto: 20,
    tipo_pago: tipoPago,
    estado: "Pagado",
  })

  if (error) return { error: error.message }

  revalidatePath("/micuenta/pagos")
  return { success: true }
}


