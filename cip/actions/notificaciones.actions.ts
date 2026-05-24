"use server"

import { requireUser } from "@/lib/auth-helper"

export async function listarNotificaciones() {
  const auth = await requireUser()
  if (!auth.success) return { data: [], error: auth.error }
  const { supabase, solicitante } = auth

  const { data, error } = await supabase
    .from("notificaciones")
    .select("id, tipo, titulo, mensaje, leida, created_at")
    .eq("solicitante_id", solicitante.id)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) return { data: [], error: error.message }

  return { data, error: null }
}

export async function marcarLeida(notificacionId: string) {
  const auth = await requireUser()
  if (!auth.success) return { error: auth.error }
  const { supabase, solicitante } = auth

  const { error } = await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("id", notificacionId)
    .eq("solicitante_id", solicitante.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function marcarTodasLeidas() {
  const auth = await requireUser()
  if (!auth.success) return { error: auth.error }
  const { supabase, solicitante } = auth

  const { error } = await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("solicitante_id", solicitante.id)
    .eq("leida", false)

  if (error) return { error: error.message }
  return { success: true }
}

export async function contarNoLeidas() {
  const auth = await requireUser()
  if (!auth.success) return 0
  const { supabase, solicitante } = auth

  const { count } = await supabase
    .from("notificaciones")
    .select("*", { count: "exact", head: true })
    .eq("solicitante_id", solicitante.id)
    .eq("leida", false)

  return count ?? 0
}
