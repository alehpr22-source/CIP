"use server"

import { createClient } from "@/lib/supabase/server"

export async function obtenerDatosCarnet(numeroCip: string) {
  const supabase = createClient()

  const { data: colegiado, error } = await supabase
    .from("colegiados")
    .select(`
      numero_cip,
      estado_habilitacion,
      fecha_colegiatura,
      expedientes!colegiados_expediente_id_fkey (
        solicitantes!expedientes_solicitante_id_fkey (
          dni,
          nombres,
          apellido_paterno,
          apellido_materno,
          foto_url,
          carrera_id,
          sede_id
        )
      )
    `)
    .eq("numero_cip", numeroCip)
    .single()

  if (error || !colegiado) {
    return null
  }

  const expediente = colegiado.expedientes as unknown as {
    solicitantes: {
      dni: string
      nombres: string
      apellido_paterno: string
      apellido_materno: string
      foto_url: string
      carrera_id: string
      sede_id: string
    }
  }

  const { data: carrera } = await supabase
    .from("carreras")
    .select("codigo, nombre")
    .eq("id", expediente.solicitantes.carrera_id)
    .single()

  return {
    numero_cip: colegiado.numero_cip,
    estado_habilitacion: colegiado.estado_habilitacion,
    fecha_colegiatura: colegiado.fecha_colegiatura,
    dni: expediente.solicitantes.dni,
    nombres: expediente.solicitantes.nombres,
    apellido_paterno: expediente.solicitantes.apellido_paterno,
    apellido_materno: expediente.solicitantes.apellido_materno,
    foto_url: expediente.solicitantes.foto_url,
    carrera_codigo: carrera?.codigo ?? "",
    carrera_nombre: carrera?.nombre ?? "",
  }
}
