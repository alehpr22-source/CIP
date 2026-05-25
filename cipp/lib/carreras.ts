import { createAdminClient } from "@/lib/supabase/admin"
import type { Universidad } from "@/types"

const supabase = createAdminClient()

export async function obtenerCarreras() {
  const { data, error } = await supabase.from("carreras").select("id, nombre").order("nombre")
  if (error) throw new Error(`Error cargando carreras: ${error.message}`)
  return data ?? []
}

export async function obtenerSedes() {
  const { data, error } = await supabase.from("sedes").select("id, nombre, direccion, telefono").order("nombre")
  if (error) throw new Error(`Error cargando sedes: ${error.message}`)
  return data ?? []
}

export async function obtenerUniversidades(): Promise<Universidad[]> {
  const { data, error } = await supabase.from("universidades").select("id, nombre").order("nombre")
  if (error) {
    console.warn("Error cargando universidades:", error.message)
    return []
  }
  return data ?? []
}
