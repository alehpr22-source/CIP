'use client';

import { useEffect, useMemo, useState } from 'react';

import { DocumentPickerCard } from '@/components/solicitud/ui/DocumentPickerCard';
import { StatusBadge } from '@/components/solicitud/ui/StatusBadge';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  REQUIRED_DOCUMENT_TYPES,
  getDocumentosBySolicitud,
  getLatestDocumentosByTipo,
  hasRequiredDocumentos,
  isAllowedFileSize,
  isAllowedFileType,
  uploadDocumentoVersion,
} from '@/lib/services/documentos';
import {
  getLatestObservacion,
  listObservacionesBySolicitud,
} from '@/lib/services/observaciones';
import {
  createSolicitud,
  getSolicitudActivaByUsuario,
  markSolicitudEnRevision,
} from '@/lib/services/solicitudes';
import {
  type DocumentoRow,
  type DocumentoTipoEnum,
  type ObservacionRow,
  type SolicitudInsert,
  type SolicitudRow,
} from '@/lib/supabase';

const carreras = [
  'Ingenieria Civil',
  'Ingenieria de Sistemas',
  'Ingenieria Industrial',
  'Ingenieria Ambiental',
  'Ingenieria Mecanica',
];

const DOCUMENT_REQUIREMENTS: Record<
  DocumentoTipoEnum,
  string[]
> = {
  DNI: [
    'PDF o imagen (JPG/PNG), maximo 5MB.',
    'Debe verse completo y legible.',
  ],
  FOTO: [
    'Solo imagen (JPG/PNG), maximo 5MB.',
    'Rostro centrado, fondo claro, sin filtros.',
    'Recomendado: proporcion vertical 3:4 para carnet.',
  ],
  TITULO: [
    'PDF o imagen (JPG/PNG), maximo 5MB.',
    'Nombre completo y carrera deben ser legibles.',
  ],
  PAGO: [
    'PDF o imagen (JPG/PNG), maximo 5MB.',
    'Debe mostrar monto, fecha y referencia.',
  ],
};

type DraftFiles = Partial<Record<DocumentoTipoEnum, File>>;

export default function DashboardPage() {
  const { usuario, loading } = useAuth();

  const [solicitud, setSolicitud] =
    useState<SolicitudRow | null>(null);
  const [documentos, setDocumentos] = useState<
    DocumentoRow[]
  >([]);
  const [observaciones, setObservaciones] = useState<
    ObservacionRow[]
  >([]);
  const [carrera, setCarrera] = useState('');
  const [draftFiles, setDraftFiles] =
    useState<DraftFiles>({});
  const [loadingSolicitud, setLoadingSolicitud] =
    useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const latestDocumentosByTipo = useMemo(
    () => getLatestDocumentosByTipo(documentos),
    [documentos]
  );

  const isPersistedEditable =
    solicitud?.estado === 'OBSERVADO';
  const isDraftMode = !solicitud;

  const draftHasAllRequired =
    REQUIRED_DOCUMENT_TYPES.every(
      (tipo) => !!draftFiles[tipo]
    );

  async function loadSolicitudData(
    solicitudId: string
  ) {
    const [{ data: docs, error: docsError },
      { data: obs, error: obsError }] = await Promise.all([
      getDocumentosBySolicitud(solicitudId),
      listObservacionesBySolicitud(solicitudId),
    ]);

    if (docsError) {
      setError(
        'No se pudieron cargar los documentos de la solicitud'
      );
    } else {
      setDocumentos(docs ?? []);
    }

    if (obsError) {
      setError(
        'No se pudieron cargar las observaciones'
      );
    } else {
      setObservaciones(obs ?? []);
    }
  }

  useEffect(() => {
    if (!usuario) {
      return;
    }

    const loadSolicitudActiva = async () => {
      setLoadingSolicitud(true);
      setError('');

      const {
        data,
        error: activeError,
      } = await getSolicitudActivaByUsuario(
        usuario.id
      );

      if (activeError) {
        setError(
          'No se pudo validar el estado de la solicitud'
        );
        setLoadingSolicitud(false);
        return;
      }

      setSolicitud(data);

      if (data) {
        await loadSolicitudData(data.id);
      } else {
        setDocumentos([]);
        setObservaciones([]);
      }

      setLoadingSolicitud(false);
    };

    void loadSolicitudActiva();
  }, [usuario]);

  function validateFileByTipo(
    tipo: DocumentoTipoEnum,
    file: File
  ) {
    if (!isAllowedFileType(file)) {
      return 'Formato no permitido. Use PDF, PNG o JPG';
    }

    if (
      tipo === 'FOTO' &&
      !file.type.startsWith('image/')
    ) {
      return 'La foto debe ser una imagen JPG o PNG';
    }

    if (!isAllowedFileSize(file)) {
      return 'El archivo supera 5MB';
    }

    return null;
  }

  function handleSelectDraftFile(
    tipo: DocumentoTipoEnum,
    file: File | null
  ) {
    if (!file) {
      return;
    }

    const validationError = validateFileByTipo(tipo, file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setDraftFiles((prev) => ({
      ...prev,
      [tipo]: file,
    }));
  }

  async function handleConfirmarEnvioInicial() {
    if (!usuario || !carrera) {
      setError('Selecciona una carrera para continuar');
      return;
    }

    if (!draftHasAllRequired) {
      setError(
        'Debes seleccionar los 4 documentos antes de confirmar el envio'
      );
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const {
      data: activeSolicitud,
      error: activeError,
    } = await getSolicitudActivaByUsuario(usuario.id);

    if (activeError) {
      setActionLoading(false);
      setError('No se pudo validar tu solicitud actual');
      return;
    }

    if (activeSolicitud) {
      setActionLoading(false);
      setSolicitud(activeSolicitud);
      setError('Ya tienes una solicitud activa');
      return;
    }

    const solicitudToInsert: SolicitudInsert = {
      usuario_id: usuario.id,
      carrera,
      estado: 'EN_REVISION',
      enviado_at: new Date().toISOString(),
    };

    const {
      data: createdSolicitud,
      error: createError,
    } = await createSolicitud(solicitudToInsert);

    if (createError) {
      setActionLoading(false);
      setError('No se pudo crear la solicitud');
      return;
    }

    for (const tipo of REQUIRED_DOCUMENT_TYPES) {
      const file = draftFiles[tipo];

      if (!file) {
        continue;
      }

      const { error: uploadError } =
        await uploadDocumentoVersion(
          createdSolicitud.id,
          tipo,
          file
        );

      if (uploadError) {
        setActionLoading(false);
        setSolicitud(createdSolicitud);
        setError(
          `Se creo la solicitud, pero fallo la subida de ${tipo}: ${uploadError.message}`
        );
        await loadSolicitudData(createdSolicitud.id);
        return;
      }
    }

    setSolicitud(createdSolicitud);
    setDraftFiles({});
    await loadSolicitudData(createdSolicitud.id);
    setActionLoading(false);
    setSuccess('Documentos enviados a revision');
  }

  async function handleUploadPersistedDocumento(
    tipo: DocumentoTipoEnum,
    file: File | null
  ) {
    if (!solicitud || !file || !isPersistedEditable) {
      return;
    }

    const validationError = validateFileByTipo(tipo, file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setActionLoading(true);
    setError('');

    const { error: uploadError } =
      await uploadDocumentoVersion(
        solicitud.id,
        tipo,
        file
      );

    setActionLoading(false);

    if (uploadError) {
      setError(
        `No se pudo subir ${tipo}: ${uploadError.message}`
      );
      return;
    }

    await loadSolicitudData(solicitud.id);
    setSuccess('Documento actualizado correctamente');
  }

  async function handleReenviarSolicitud() {
    if (!solicitud) {
      return;
    }

    if (!hasRequiredDocumentos(documentos)) {
      setError(
        'Debes subir los 4 documentos obligatorios para reenviar'
      );
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const { data, error: updateError } =
      await markSolicitudEnRevision(solicitud.id);

    if (updateError) {
      setActionLoading(false);
      setError('No se pudo reenviar la solicitud');
      return;
    }

    setActionLoading(false);
    setSolicitud(data);
    setSuccess('Solicitud reenviada a revision');
  }

  if (loading || loadingSolicitud) {
    return <LoadingScreen />;
  }

  if (!usuario) {
    return null;
  }

  const latestObservacion =
    getLatestObservacion(observaciones);

  return (
    <section className='bg-gradient-to-b from-red-50 to-white px-6 py-10'>
      <div className='max-w-5xl mx-auto space-y-8'>
        <div className='rounded-3xl border border-red-100 bg-white p-8 shadow-md'>
          <h1 className='text-3xl font-bold text-red-700 mb-4'>
            Bienvenido, {usuario.nombres}
          </h1>

          <div className='space-y-2 text-gray-700'>
            <p>
              <strong>DNI:</strong> {usuario.dni}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>
          </div>
        </div>

        {error && <InfoAlert message={error} variant='error' />}
        {success && <InfoAlert message={success} variant='success' />}

        <div className='rounded-3xl border border-red-100 bg-white p-8 shadow-md space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-red-700'>
              Solicitud de Colegiatura
            </h2>
            <StatusBadge
              status={solicitud?.estado ?? 'BORRADOR'}
            />
          </div>

          {isDraftMode ? (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Estas en borrador visual. Puedes reemplazar tus archivos antes de confirmar el envio.
              </p>

              <div className='space-y-2'>
                <label
                  htmlFor='carrera'
                  className='text-sm font-medium text-gray-700'
                >
                  Carrera
                </label>
                <select
                  id='carrera'
                  value={carrera}
                  onChange={(event) =>
                    setCarrera(event.target.value)
                  }
                  className='w-full rounded-xl border border-red-200 p-3'
                >
                  <option value=''>Selecciona una carrera</option>
                  {carreras.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                {REQUIRED_DOCUMENT_TYPES.map((tipo) => (
                  <DocumentPickerCard
                    key={tipo}
                    tipo={tipo}
                    requirements={DOCUMENT_REQUIREMENTS[tipo]}
                    fileLabel={
                      draftFiles[tipo]?.name ?? undefined
                    }
                    accept={
                      tipo === 'FOTO'
                        ? '.png,.jpg,.jpeg'
                        : '.pdf,.png,.jpg,.jpeg'
                    }
                    disabled={actionLoading}
                    onSelect={(file) =>
                      handleSelectDraftFile(tipo, file)
                    }
                  />
                ))}
              </div>

              <Button
                type='button'
                onClick={() =>
                  void handleConfirmarEnvioInicial()
                }
                disabled={actionLoading || !draftHasAllRequired || !carrera}
                className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium'
              >
                {actionLoading
                  ? 'Enviando documentos...'
                  : 'Confirmar envio de documentos'}
              </Button>
            </div>
          ) : (
            <>
              {solicitud && (
                <div className='rounded-2xl border border-red-100 p-4 space-y-2'>
                  <p>
                    <strong>Estado:</strong> {solicitud.estado}
                  </p>
                  <p>
                    <strong>Carrera:</strong> {solicitud.carrera}
                  </p>
                </div>
              )}

              {latestObservacion &&
                solicitud?.estado === 'OBSERVADO' && (
                  <InfoAlert
                    message={`Ultima observacion: ${latestObservacion.mensaje}`}
                    variant='info'
                  />
                )}

              <div className='grid md:grid-cols-2 gap-4'>
                {REQUIRED_DOCUMENT_TYPES.map((tipo) => {
                  const latestDoc =
                    latestDocumentosByTipo.get(tipo);

                  return (
                    <DocumentPickerCard
                      key={tipo}
                      tipo={tipo}
                      requirements={DOCUMENT_REQUIREMENTS[tipo]}
                      versionLabel={
                        latestDoc
                          ? `Version actual: ${latestDoc.version}`
                          : undefined
                      }
                      fileLabel={latestDoc?.archivo_url}
                      accept={
                        tipo === 'FOTO'
                          ? '.png,.jpg,.jpeg'
                          : '.pdf,.png,.jpg,.jpeg'
                      }
                      disabled={
                        actionLoading || !isPersistedEditable
                      }
                      onSelect={(file) =>
                        void handleUploadPersistedDocumento(
                          tipo,
                          file
                        )
                      }
                    />
                  );
                })}
              </div>

              {solicitud?.estado === 'EN_REVISION' && (
                <InfoAlert
                  message='Documentos enviados. Esperando revision administrativa.'
                  variant='info'
                />
              )}

              {solicitud?.estado === 'OBSERVADO' && (
                <Button
                  type='button'
                  onClick={() =>
                    void handleReenviarSolicitud()
                  }
                  disabled={actionLoading}
                  className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium'
                >
                  {actionLoading
                    ? 'Procesando...'
                    : 'Reenviar solicitud'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
