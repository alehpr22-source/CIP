import {
  supabase,
  type SolicitudEstadoEnum,
  type SolicitudInsert,
  type SolicitudRow,
} from '@/lib/supabase';

export const ACTIVE_SOLICITUD_STATES: SolicitudEstadoEnum[] = [
  'EN_REVISION',
  'OBSERVADO',
  'APROBADO',
];

export async function getSolicitudActivaByUsuario(
  usuarioId: string
) {
  return supabase
    .from('solicitudes')
    .select('*')
    .eq('usuario_id', usuarioId)
    .in('estado', ACTIVE_SOLICITUD_STATES)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function createSolicitud(
  payload: SolicitudInsert
) {
  return supabase
    .from('solicitudes')
    .insert(payload)
    .select()
    .single();
}

export async function updateSolicitudEstado(
  solicitudId: string,
  estado: SolicitudEstadoEnum
) {
  return supabase
    .from('solicitudes')
    .update({ estado })
    .eq('id', solicitudId)
    .select()
    .single();
}

export async function markSolicitudEnRevision(
  solicitudId: string
) {
  return supabase
    .from('solicitudes')
    .update({
      estado: 'EN_REVISION',
      enviado_at: new Date().toISOString(),
    })
    .eq('id', solicitudId)
    .select()
    .single();
}

export async function listSolicitudesForAdmin() {
  return supabase
    .from('solicitudes')
    .select('*')
    .in('estado', ['EN_REVISION', 'OBSERVADO', 'APROBADO', 'RECHAZADO'])
    .order('created_at', { ascending: false });
}

export function isSolicitudActiva(
  solicitud: SolicitudRow
) {
  return ACTIVE_SOLICITUD_STATES.includes(
    solicitud.estado
  );
}
