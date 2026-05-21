import {
  supabase,
  type ObservacionRow,
} from '@/lib/supabase';

export async function listObservacionesBySolicitud(
  solicitudId: string
) {
  return supabase
    .from('observaciones')
    .select('*')
    .eq('solicitud_id', solicitudId)
    .order('created_at', { ascending: false });
}

export async function createObservacion(
  solicitudId: string,
  mensaje: string
) {
  return supabase
    .from('observaciones')
    .insert({
      solicitud_id: solicitudId,
      mensaje,
    })
    .select()
    .single();
}

export function getLatestObservacion(
  observaciones: ObservacionRow[]
) {
  if (observaciones.length === 0) {
    return null;
  }

  return observaciones[0];
}
