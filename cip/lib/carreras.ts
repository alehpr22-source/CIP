import { createClient } from "@/lib/supabase/server"

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
