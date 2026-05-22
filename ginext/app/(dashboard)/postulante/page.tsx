'use client';

import { useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { FileText, GraduationCap, UserCheck, Upload } from 'lucide-react';

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
  'Ingeniería Civil',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Ambiental',
  'Ingeniería Mecánica',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
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
    <section className='relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-red-50 px-6 py-10'>
      <motion.div
        className='absolute top-20 left-10 size-72 rounded-full bg-red-200/20 blur-3xl pointer-events-none'
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className='absolute bottom-40 right-10 size-96 rounded-full bg-red-300/15 blur-3xl pointer-events-none'
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className='relative z-10'>
        <motion.div
          className='max-w-5xl mx-auto space-y-8'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className='rounded-3xl border border-red-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg'
          >
            <div className='flex items-start gap-5'>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                className='size-14 shrink-0 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center'
              >
                <UserCheck className='size-7' />
              </motion.div>
              <div className='flex-1'>
                <motion.h1
                  variants={fadeUpVariants}
                  initial='hidden'
                  animate='visible'
                  className='text-3xl font-bold text-red-700'
                >
                  Bienvenido, {usuario.nombres}
                </motion.h1>
                <motion.div
                  variants={fadeUpVariants}
                  initial='hidden'
                  animate='visible'
                  transition={{ delay: 0.15 }}
                  className='mt-3 space-y-1 text-gray-600'
                >
                  <p><strong>DNI:</strong> {usuario.dni}</p>
                  <p><strong>Correo:</strong> {usuario.correo}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <InfoAlert message={error} variant='error' />
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <InfoAlert message={success} variant='success' />
            </motion.div>
          )}

          <motion.div
            variants={cardVariants}
            className='rounded-3xl border border-red-100 bg-white/80 backdrop-blur-sm p-8 shadow-lg space-y-6'
          >
            <motion.div
              variants={fadeUpVariants}
              initial='hidden'
              animate='visible'
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
                  className='size-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center'
                >
                  <GraduationCap className='size-5' />
                </motion.div>
                <h2 className='text-2xl font-bold text-red-700'>
                  Solicitud de Colegiatura
                </h2>
              </div>
              <StatusBadge
                status={solicitud?.estado ?? 'BORRADOR'}
              />
            </motion.div>

            {isDraftMode ? (
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='space-y-6'
              >
                <motion.div
                  variants={fadeUpVariants}
                  className='flex items-center gap-2 text-sm text-gray-500 bg-red-50/50 rounded-xl px-4 py-3'
                >
                  <FileText className='size-4 shrink-0 text-red-400' />
                  <span>Estas en borrador. Puedes reemplazar tus archivos antes de confirmar el envio.</span>
                </motion.div>

                <motion.div variants={fadeUpVariants} className='space-y-2'>
                  <label htmlFor='carrera' className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                    <GraduationCap className='size-4 text-red-500' />
                    Carrera
                  </label>
                  <select
                    id='carrera'
                    value={carrera}
                    onChange={(event) => setCarrera(event.target.value)}
                    className='w-full rounded-xl border border-red-200 bg-white p-3 transition-all focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300'
                  >
                    <option value=''>Selecciona una carrera</option>
                    {carreras.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className='grid md:grid-cols-2 gap-4'
                >
                  {REQUIRED_DOCUMENT_TYPES.map((tipo) => (
                    <motion.div
                      key={tipo}
                      variants={cardVariants}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    >
                      <DocumentPickerCard
                        tipo={tipo}
                        requirements={DOCUMENT_REQUIREMENTS[tipo]}
                        fileLabel={draftFiles[tipo]?.name ?? undefined}
                        accept={tipo === 'FOTO' ? '.png,.jpg,.jpeg' : '.pdf,.png,.jpg,.jpeg'}
                        disabled={actionLoading}
                        onSelect={(file) => handleSelectDraftFile(tipo, file)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUpVariants}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type='button'
                    onClick={() => void handleConfirmarEnvioInicial()}
                    disabled={actionLoading || !draftHasAllRequired || !carrera}
                    className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all'
                  >
                    {actionLoading ? 'Enviando documentos...' : 'Confirmar envio de documentos'}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='space-y-6'
              >
                {solicitud && (
                  <motion.div
                    variants={fadeUpVariants}
                    className='rounded-2xl border border-red-100 bg-red-50/30 p-4 space-y-2'
                  >
                    <p className='text-gray-700'><strong>Estado:</strong> {solicitud.estado}</p>
                    <p className='text-gray-700'><strong>Carrera:</strong> {solicitud.carrera}</p>
                  </motion.div>
                )}

                {latestObservacion && solicitud?.estado === 'OBSERVADO' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <InfoAlert message={`Ultima observacion: ${latestObservacion.mensaje}`} variant='info' />
                  </motion.div>
                )}

                <motion.div
                  variants={containerVariants}
                  className='grid md:grid-cols-2 gap-4'
                >
                  {REQUIRED_DOCUMENT_TYPES.map((tipo) => {
                    const latestDoc = latestDocumentosByTipo.get(tipo);
                    return (
                      <motion.div
                        key={tipo}
                        variants={cardVariants}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      >
                        <DocumentPickerCard
                          tipo={tipo}
                          requirements={DOCUMENT_REQUIREMENTS[tipo]}
                          versionLabel={latestDoc ? `Version actual: ${latestDoc.version}` : undefined}
                          fileLabel={latestDoc?.archivo_url}
                          accept={tipo === 'FOTO' ? '.png,.jpg,.jpeg' : '.pdf,.png,.jpg,.jpeg'}
                          disabled={actionLoading || !isPersistedEditable}
                          onSelect={(file) => void handleUploadPersistedDocumento(tipo, file)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>

                {solicitud?.estado === 'EN_REVISION' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <InfoAlert message='Documentos enviados. Esperando revision administrativa.' variant='info' />
                  </motion.div>
                )}

                {solicitud?.estado === 'OBSERVADO' && (
                  <motion.div
                    variants={fadeUpVariants}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type='button'
                      onClick={() => void handleReenviarSolicitud()}
                      disabled={actionLoading}
                      className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all'
                    >
                      {actionLoading ? 'Procesando...' : 'Reenviar solicitud'}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
