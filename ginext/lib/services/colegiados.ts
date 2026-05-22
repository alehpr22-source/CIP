import { supabase, type ColegiadoRow, type CarnetRow } from '@/lib/supabase';

export async function generarNumeroColegiado(carrera: string): Promise<string> {
  const { data: contador } = await supabase
    .from('contador_carrera')
    .select('*')
    .eq('carrera', carrera)
    .maybeSingle();

  let nuevoNumero: number;

  if (contador) {
    nuevoNumero = contador.ultimo_numero + 1;
    await supabase
      .from('contador_carrera')
      .update({ ultimo_numero: nuevoNumero })
      .eq('carrera', carrera);
  } else {
    nuevoNumero = 1;
    await supabase
      .from('contador_carrera')
      .insert({ carrera, ultimo_numero: 1 });
  }

  return String(nuevoNumero).padStart(5, '0');
}

export async function aprobarSolicitud(solicitudId: string, usuarioId: string, carrera: string) {
  const numeroColegiado = await generarNumeroColegiado(carrera);

  const { data: colegiado, error: colegiadoError } = await supabase
    .from('colegiados')
    .insert({
      usuario_id: usuarioId,
      solicitud_id: solicitudId,
      carrera,
      numero_colegiado: numeroColegiado,
      estado: 'HABILITADO',
      fecha_colegiatura: new Date().toISOString(),
    })
    .select()
    .single();

  if (colegiadoError || !colegiado) {
    return { error: colegiadoError ?? new Error('No se pudo crear el colegiado'), data: null };
  }

  const codigoCarnet = `CARNET-${colegiado.id.slice(0, 8).toUpperCase()}`;
  const { data: carnet, error: carnetError } = await supabase
    .from('carnets')
    .insert({
      colegiado_id: colegiado.id,
      codigo_carnet: codigoCarnet,
    })
    .select()
    .single();

  if (carnetError) {
    return { error: carnetError, data: null };
  }

  await supabase
    .from('solicitudes')
    .update({ estado: 'APROBADO' })
    .eq('id', solicitudId);

  return {
    error: null,
    data: { colegiado: colegiado as ColegiadoRow, carnet: carnet as CarnetRow },
  };
}

export async function rechazarSolicitud(solicitudId: string, motivo: string) {
  const { error: updateError } = await supabase
    .from('solicitudes')
    .update({ estado: 'RECHAZADO' })
    .eq('id', solicitudId);

  if (updateError) {
    return { error: updateError };
  }

  const { error: obsError } = await supabase
    .from('observaciones')
    .insert({
      solicitud_id: solicitudId,
      mensaje: `Solicitud rechazada: ${motivo}`,
    });

  return { error: obsError };
}

export async function listColegiados() {
  const { data, error } = await supabase
    .from('colegiados')
    .select(`
      *,
      usuarios!inner(id, nombres, apellido_paterno, apellido_materno, correo, dni)
    `)
    .order('fecha_colegiatura', { ascending: false });

  return { data: data as unknown as (ColegiadoRow & { usuarios: { id: string; nombres: string; apellido_paterno: string; apellido_materno: string; correo: string; dni: string } })[] | null, error };
}

export async function updateColegiadoEstado(colegiadoId: string, estado: 'HABILITADO' | 'INHABILITADO') {
  return supabase
    .from('colegiados')
    .update({ estado })
    .eq('id', colegiadoId)
    .select()
    .single();
}
