'use client';

import { useEffect, useMemo, useState } from 'react';

import { StatusBadge } from '@/components/solicitud/ui/StatusBadge';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import {
  getDocumentosBySolicitud,
  getLatestDocumentosByTipo,
  getSignedDocumentoUrl,
} from '@/lib/services/documentos';
import {
  createObservacion,
  listObservacionesBySolicitud,
} from '@/lib/services/observaciones';
import {
  listSolicitudesForAdmin,
  updateSolicitudEstado,
} from '@/lib/services/solicitudes';
import {
  supabase,
  type DocumentoRow,
  type ObservacionRow,
  type SolicitudRow,
  type UsuarioRow,
} from '@/lib/supabase';

type UsuarioMini = Pick<
  UsuarioRow,
  'id' | 'nombres' | 'apellido_paterno' | 'apellido_materno' | 'correo'
>;

export default function AdminSolicitudesPage() {
  const { usuario, loading } = useAuth();

  const [solicitudes, setSolicitudes] = useState<
    SolicitudRow[]
  >([]);
  const [usuariosMap, setUsuariosMap] = useState<
    Record<string, UsuarioMini>
  >({});
  const [selectedId, setSelectedId] = useState('');
  const [documentos, setDocumentos] = useState<
    DocumentoRow[]
  >([]);
  const [observaciones, setObservaciones] = useState<
    ObservacionRow[]
  >([]);
  const [signedUrls, setSignedUrls] = useState<
    Record<string, string>
  >({});
  const [mensaje, setMensaje] = useState('');
  const [loadingPage, setLoadingPage] = useState(false);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState('');

  const selectedSolicitud = useMemo(
    () =>
      solicitudes.find((item) => item.id === selectedId) ??
      null,
    [selectedId, solicitudes]
  );

  const latestDocs = useMemo(
    () => getLatestDocumentosByTipo(documentos),
    [documentos]
  );

  useEffect(() => {
    if (!usuario) {
      return;
    }

    if (usuario.role !== 'ADMIN') {
      return;
    }

    const load = async () => {
      setLoadingPage(true);
      setError('');

      const {
        data: solicitudesData,
        error: solicitudesError,
      } = await listSolicitudesForAdmin();

      if (solicitudesError) {
        setError('No se pudieron cargar las solicitudes');
        setLoadingPage(false);
        return;
      }

      const currentSolicitudes = solicitudesData ?? [];
      setSolicitudes(currentSolicitudes);

      if (currentSolicitudes.length > 0) {
        setSelectedId(currentSolicitudes[0].id);
      }

      const userIds = Array.from(
        new Set(
          currentSolicitudes.map((item) => item.usuario_id)
        )
      );

      if (userIds.length > 0) {
        const {
          data: usuariosData,
          error: usuariosError,
        } = await supabase
          .from('usuarios')
          .select(
            'id,nombres,apellido_paterno,apellido_materno,correo'
          )
          .in('id', userIds);

        if (usuariosError) {
          setError('No se pudo cargar la lista de postulantes');
        } else {
          const map: Record<string, UsuarioMini> = {};
          for (const row of usuariosData ?? []) {
            map[row.id] = row;
          }
          setUsuariosMap(map);
        }
      }

      setLoadingPage(false);
    };

    void load();
  }, [usuario]);

  useEffect(() => {
    if (!selectedSolicitud) {
      return;
    }

    const loadDetalle = async () => {
      const [{ data: docs }, { data: obs }] = await Promise.all([
        getDocumentosBySolicitud(selectedSolicitud.id),
        listObservacionesBySolicitud(selectedSolicitud.id),
      ]);

      const docsData = docs ?? [];
      setDocumentos(docsData);
      setObservaciones(obs ?? []);

      const latest = getLatestDocumentosByTipo(docsData);
      const urlMap: Record<string, string> = {};

      for (const [tipo, doc] of latest.entries()) {
        const { data: signedUrl } =
          await getSignedDocumentoUrl(doc.archivo_url);
        if (signedUrl) {
          urlMap[tipo] = signedUrl;
        }
      }

      setSignedUrls(urlMap);
    };

    void loadDetalle();
  }, [selectedSolicitud]);

  async function refreshSolicitudes() {
    const { data } = await listSolicitudesForAdmin();
    setSolicitudes(data ?? []);
  }

  async function handleObservarSolicitud() {
    if (!selectedSolicitud) {
      return;
    }

    if (!mensaje.trim()) {
      setError('Debes ingresar una observacion');
      return;
    }

    setActionLoading(true);
    setError('');

    const { error: obsError } = await createObservacion(
      selectedSolicitud.id,
      mensaje.trim()
    );

    if (obsError) {
      setActionLoading(false);
      setError('No se pudo registrar la observacion');
      return;
    }

    const { data, error: updateError } =
      await updateSolicitudEstado(
        selectedSolicitud.id,
        'OBSERVADO'
      );

    setActionLoading(false);

    if (updateError) {
      setError('No se pudo actualizar el estado');
      return;
    }

    setMensaje('');
    setSolicitudes((prev) =>
      prev.map((item) =>
        item.id === data.id ? data : item
      )
    );

    const { data: obs } =
      await listObservacionesBySolicitud(data.id);
    setObservaciones(obs ?? []);
  }

  if (loading || loadingPage) {
    return <LoadingScreen />;
  }

  if (!usuario || usuario.role !== 'ADMIN') {
    return (
      <section className='px-6 py-10'>
        <div className='max-w-4xl mx-auto'>
          <InfoAlert message={error || 'No autorizado'} variant='error' />
        </div>
      </section>
    );
  }

  return (
    <section className='px-6 py-10'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>
            Revision de solicitudes
          </h1>
          <Button
            type='button'
            variant='outline'
            onClick={() => void refreshSolicitudes()}
          >
            Actualizar
          </Button>
        </div>

        {error && <InfoAlert message={error} variant='error' />}

        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-1 rounded-2xl border border-zinc-200 bg-white p-4 space-y-3'>
            <h2 className='font-semibold'>Solicitudes activas</h2>

            {solicitudes.length === 0 ? (
              <p className='text-sm text-gray-500'>
                No hay solicitudes en revision u observadas.
              </p>
            ) : (
              solicitudes.map((item) => {
                const postulante =
                  usuariosMap[item.usuario_id];

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left rounded-xl border p-3 ${selectedId === item.id ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                  >
                    <p className='font-medium'>
                      {postulante
                        ? `${postulante.nombres} ${postulante.apellido_paterno}`
                        : item.usuario_id}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {item.carrera}
                    </p>
                    <StatusBadge status={item.estado} />
                  </button>
                );
              })
            )}
          </div>

          <div className='lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 space-y-5'>
            {!selectedSolicitud ? (
              <p className='text-gray-500'>
                Selecciona una solicitud para revisar.
              </p>
            ) : (
              <>
                <div>
                  <h2 className='text-xl font-semibold'>
                    Detalle de solicitud
                  </h2>
                  <div className='flex items-center gap-2 mt-1'>
                    <StatusBadge status={selectedSolicitud.estado} />
                    <span className='text-sm text-gray-600'>
                      {selectedSolicitud.carrera}
                    </span>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-3'>
                  {Array.from(latestDocs.entries()).map(
                    ([tipo, doc]) => (
                      <div
                        key={tipo}
                        className='rounded-xl border border-zinc-200 p-3'
                      >
                        <p className='font-medium'>{tipo}</p>
                        <p className='text-sm text-gray-500'>
                          Version {doc.version}
                        </p>
                        {signedUrls[tipo] ? (
                          <a
                            href={signedUrls[tipo]}
                            target='_blank'
                            rel='noreferrer'
                            className='text-sm text-red-600 hover:underline'
                          >
                            Ver documento
                          </a>
                        ) : (
                          <p className='text-sm text-gray-400'>
                            Sin URL disponible
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className='space-y-2'>
                  <h3 className='font-semibold'>Observaciones previas</h3>
                  {observaciones.length === 0 ? (
                    <p className='text-sm text-gray-500'>
                      Aun no hay observaciones.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {observaciones.map((obs) => (
                        <div
                          key={obs.id}
                          className='rounded-xl border border-zinc-200 p-3 text-sm'
                        >
                          {obs.mensaje}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='observacion'
                    className='text-sm font-medium text-gray-700'
                  >
                    Nueva observacion
                  </label>
                  <Textarea
                    id='observacion'
                    value={mensaje}
                    onChange={(e) =>
                      setMensaje(e.target.value)
                    }
                    className='min-h-24'
                    placeholder='Detalle los documentos faltantes o errores encontrados'
                  />
                </div>

                <Button
                  type='button'
                  onClick={() => void handleObservarSolicitud()}
                  disabled={actionLoading}
                  className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium'
                >
                  {actionLoading
                    ? 'Guardando observacion...'
                    : 'Marcar como OBSERVADO'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
