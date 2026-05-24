import { createClient } from "@/lib/supabase/server"
import type { Universidad, UniversidadCarrera } from "@/types"

export async function obtenerCarreras() {
  const supabase = createClient()
  const { data, error } = await supabase.from("carreras").select("id, codigo, nombre").order("nombre")
  if (error) throw new Error(`Error cargando carreras: ${error.message}`)
  return data ?? []
}

export async function obtenerSedes() {
  const supabase = createClient()
  const { data, error } = await supabase.from("sedes").select("id, nombre, direccion, telefono").order("nombre")
  if (error) throw new Error(`Error cargando sedes: ${error.message}`)
  return data ?? []
}

export async function obtenerUniversidades(): Promise<Universidad[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("universidades").select("id, nombre, sede_id").order("nombre")
  if (error) throw new Error(`Error cargando universidades: ${error.message}`)
  return data ?? []
}

export async function obtenerUniversidadCarreras(): Promise<UniversidadCarrera[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("universidad_carreras").select("universidad_id, carrera_id")
  if (error) throw new Error(`Error cargando relaciones universidad-carrera: ${error.message}`)
  return data ?? []
}
