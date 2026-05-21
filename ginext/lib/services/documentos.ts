import {
  supabase,
  type DocumentoRow,
  type DocumentoTipoEnum,
} from '@/lib/supabase';

const DOCUMENTOS_BUCKET = 'documentos-colegiatura';

export const REQUIRED_DOCUMENT_TYPES: DocumentoTipoEnum[] = [
  'DNI',
  'FOTO',
  'TITULO',
  'PAGO',
];

export function isAllowedFileType(file: File) {
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];

  return allowedTypes.includes(file.type);
}

export function isAllowedFileSize(file: File) {
  const maxSizeBytes = 5 * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export async function getDocumentosBySolicitud(
  solicitudId: string
) {
  return supabase
    .from('documentos')
    .select('*')
    .eq('solicitud_id', solicitudId)
    .order('version', { ascending: false });
}

export function getLatestDocumentosByTipo(
  documentos: DocumentoRow[]
) {
  const latest =
    new Map<DocumentoTipoEnum, DocumentoRow>();

  for (const doc of documentos) {
    if (!latest.has(doc.tipo)) {
      latest.set(doc.tipo, doc);
    }
  }

  return latest;
}

export function hasRequiredDocumentos(
  documentos: DocumentoRow[]
) {
  const latest =
    getLatestDocumentosByTipo(documentos);

  return REQUIRED_DOCUMENT_TYPES.every((tipo) =>
    latest.has(tipo)
  );
}

export async function uploadDocumentoVersion(
  solicitudId: string,
  tipo: DocumentoTipoEnum,
  file: File
) {
  const { data: docs, error: docsError } =
    await supabase
      .from('documentos')
      .select('version')
      .eq('solicitud_id', solicitudId)
      .eq('tipo', tipo)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

  if (docsError) {
    return {
      error: docsError,
      data: null,
    };
  }

  const nextVersion = (docs?.version ?? 0) + 1;
  const fileExtension = file.name
    .split('.')
    .pop()
    ?.toLowerCase();
  const safeExtension =
    fileExtension && fileExtension.length > 0
      ? fileExtension
      : 'bin';
  const filePath =
    `solicitudes/${solicitudId}/${tipo}/` +
    `v${nextVersion}-${Date.now()}.${safeExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTOS_BUCKET)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      error: uploadError,
      data: null,
    };
  }

  const {
    data: insertedDocumento,
    error: insertError,
  } = await supabase
    .from('documentos')
    .insert({
      solicitud_id: solicitudId,
      tipo,
      archivo_url: filePath,
      version: nextVersion,
    })
    .select()
    .single();

  return {
    error: insertError,
    data: insertedDocumento,
  };
}

export async function getSignedDocumentoUrl(
  path: string
) {
  const { data, error } = await supabase.storage
    .from(DOCUMENTOS_BUCKET)
    .createSignedUrl(path, 60 * 10);

  return {
    data: data?.signedUrl ?? null,
    error,
  };
}
