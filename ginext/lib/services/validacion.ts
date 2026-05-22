import { getDocumentosBySolicitud, getLatestDocumentosByTipo, REQUIRED_DOCUMENT_TYPES } from '@/lib/services/documentos';
import { type SolicitudRow } from '@/lib/supabase';

export const CARRERAS_VALIDAS = [
  'Ingeniería Civil',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Eléctrica',
  'Ingeniería Electrónica',
];

export async function validarSolicitud(solicitud: SolicitudRow) {
  const observaciones: string[] = [];

  if (!CARRERAS_VALIDAS.includes(solicitud.carrera)) {
    observaciones.push(`La carrera "${solicitud.carrera}" no es una ingeniería válida.`);
  }

  const { data: docs } = await getDocumentosBySolicitud(solicitud.id);
  const latestDocs = getLatestDocumentosByTipo(docs ?? []);

  for (const tipo of REQUIRED_DOCUMENT_TYPES) {
    if (!latestDocs.has(tipo)) {
      observaciones.push(`Falta documento de tipo: ${tipo}.`);
    }
  }

  return {
    valido: observaciones.length === 0,
    observaciones,
  };
}
