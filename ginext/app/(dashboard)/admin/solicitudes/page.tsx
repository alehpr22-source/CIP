'use client';

import { useEffect, useMemo, useState } from 'react';

import { StatusBadge } from '@/components/solicitud/ui/StatusBadge';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { aprobarSolicitud, rechazarSolicitud } from '@/lib/services/colegiados';
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
import { validarSolicitud } from '@/lib/services/validacion';
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

  const [solicitudes, setSolicitudes] = useState<SolicitudRow[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Record<string, UsuarioMini>>({});
  const [selectedId, setSelectedId] = useState('');
  const [documentos, setDocumentos] = useState<DocumentoRow[]>([]);
  const [observaciones, setObservaciones] = useState<ObservacionRow[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState('');
  const [loadingPage, setLoadingPage] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validacionResult, setValidacionResult] = useState<{ valido: boolean; observaciones: string[] } | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoForm, setShowRechazoForm] = useState(false);

  const selectedSolicitud = useMemo(
    () => solicitudes.find((item) => item.id === selectedId) ?? null,
    [selectedId, solicitudes]
  );

  const latestDocs = useMemo(
    () => getLatestDocumentosByTipo(documentos),
    [documentos]
  );

  useEffect(() => {
    if (!usuario) return;
    if (usuario.role !== 'ADMIN') return;

    const load = async () => {
      setLoadingPage(true);
      setError('');

      const { data: solicitudesData, error: solicitudesError } = await listSolicitudesForAdmin();

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

      const userIds = Array.from(new Set(currentSolicitudes.map((item) => item.usuario_id)));

      if (userIds.length > 0) {
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select('id,nombres,apellido_paterno,apellido_materno,correo')
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
    if (!selectedSolicitud) return;

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
        const { data: signedUrl } = await getSignedDocumentoUrl(doc.archivo_url);
        if (signedUrl) {
          urlMap[tipo] = signedUrl;
        }
      }

      setSignedUrls(urlMap);
    };

    void loadDetalle();
  }, [selectedSolicitud]);

  async function handleSelectSolicitud(id: string) {
    setSelectedId(id);
    setValidacionResult(null);
    setSuccess('');
    setShowRechazoForm(false);
    setMotivoRechazo('');
  }

  async function refreshSolicitudes() {
    const { data } = await listSolicitudesForAdmin();
    setSolicitudes(data ?? []);
  }

  async function handleObservarSolicitud() {
    if (!selectedSolicitud) return;
    if (!mensaje.trim()) {
      setError('Debes ingresar una observacion');
      return;
    }

    setActionLoading(true);
    setError('');

    const { error: obsError } = await createObservacion(selectedSolicitud.id, mensaje.trim());

    if (obsError) {
      setActionLoading(false);
      setError('No se pudo registrar la observacion');
      return;
    }

    const { data, error: updateError } = await updateSolicitudEstado(selectedSolicitud.id, 'OBSERVADO');

    setActionLoading(false);

    if (updateError) {
      setError('No se pudo actualizar el estado');
      return;
    }

    setMensaje('');
    setSolicitudes((prev) => prev.map((item) => (item.id === data.id ? data : item)));

    const { data: obs } = await listObservacionesBySolicitud(data.id);
    setObservaciones(obs ?? []);
  }

  async function handleValidar() {
    if (!selectedSolicitud) return;

    setActionLoading(true);
    setValidacionResult(null);
    setError('');
    setSuccess('');

    const result = await validarSolicitud(selectedSolicitud);

    setActionLoading(false);
    setValidacionResult(result);

    if (result.valido) {
      setSuccess('La solicitud cumple con todos los requisitos.');
    } else {
      setError('La solicitud tiene observaciones.');
    }
  }

  async function handleAprobar() {
    if (!selectedSolicitud) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    const { error: aprobacionError, data } = await aprobarSolicitud(
      selectedSolicitud.id,
      selectedSolicitud.usuario_id,
      selectedSolicitud.carrera
    );

    setActionLoading(false);

    if (aprobacionError) {
      setError('No se pudo aprobar la solicitud.');
      return;
    }

    setSuccess(`Solicitud aprobada. Colegiado creado: ${data?.colegiado.numero_colegiado}`);
    setValidacionResult(null);

    const { data: updatedSolicitudes } = await listSolicitudesForAdmin();
    setSolicitudes(updatedSolicitudes ?? []);
  }

  async function handleRechazar() {
    if (!selectedSolicitud) return;
    if (!motivoRechazo.trim()) {
      setError('Debes ingresar un motivo de rechazo');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    const { error: rechazoError } = await rechazarSolicitud(selectedSolicitud.id, motivoRechazo.trim());

    setActionLoading(false);

    if (rechazoError) {
      setError('No se pudo rechazar la solicitud.');
      return;
    }

    setSuccess('Solicitud rechazada correctamente.');
    setMotivoRechazo('');
    setShowRechazoForm(false);

    const { data: updatedSolicitudes } = await listSolicitudesForAdmin();
    setSolicitudes(updatedSolicitudes ?? []);
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
          <h1 className='text-3xl font-bold'>Revision de solicitudes</h1>
          <Button type='button' variant='outline' onClick={() => void refreshSolicitudes()}>
            Actualizar
          </Button>
        </div>

        {error && <InfoAlert message={error} variant='error' />}
        {success && <InfoAlert message={success} variant='success' />}

        <div className='grid lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-1 rounded-2xl border border-zinc-200 bg-white p-4 space-y-3'>
            <h2 className='font-semibold'>Solicitudes</h2>

            {solicitudes.length === 0 ? (
              <p className='text-sm text-gray-500'>No hay solicitudes.</p>
            ) : (
              solicitudes.map((item) => {
                const postulante = usuariosMap[item.usuario_id];

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => void handleSelectSolicitud(item.id)}
                    className={`w-full text-left rounded-xl border p-3 ${selectedId === item.id ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                  >
                    <p className='font-medium'>
                      {postulante
                        ? `${postulante.nombres} ${postulante.apellido_paterno}`
                        : item.usuario_id}
                    </p>
                    <p className='text-sm text-gray-600'>{item.carrera}</p>
                    <StatusBadge status={item.estado} />
                  </button>
                );
              })
            )}
          </div>

          <div className='lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 space-y-5'>
            {!selectedSolicitud ? (
              <p className='text-gray-500'>Selecciona una solicitud para revisar.</p>
            ) : (
              <>
                <div>
                  <h2 className='text-xl font-semibold'>Detalle de solicitud</h2>
                  <div className='flex items-center gap-2 mt-1'>
                    <StatusBadge status={selectedSolicitud.estado} />
                    <span className='text-sm text-gray-600'>{selectedSolicitud.carrera}</span>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-3'>
                  {Array.from(latestDocs.entries()).map(([tipo, doc]) => (
                    <div key={tipo} className='rounded-xl border border-zinc-200 p-3'>
                      <p className='font-medium'>{tipo}</p>
                      <p className='text-sm text-gray-500'>Version {doc.version}</p>
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
                        <p className='text-sm text-gray-400'>Sin URL disponible</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className='space-y-2'>
                  <h3 className='font-semibold'>Observaciones previas</h3>
                  {observaciones.length === 0 ? (
                    <p className='text-sm text-gray-500'>Aun no hay observaciones.</p>
                  ) : (
                    <div className='space-y-2'>
                      {observaciones.map((obs) => (
                        <div key={obs.id} className='rounded-xl border border-zinc-200 p-3 text-sm'>
                          {obs.mensaje}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSolicitud.estado === 'EN_REVISION' || selectedSolicitud.estado === 'OBSERVADO' ? (
                  <>
                    <div className='space-y-2'>
                      <label htmlFor='observacion' className='text-sm font-medium text-gray-700'>
                        Nueva observacion
                      </label>
                      <Textarea
                        id='observacion'
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        className='min-h-24'
                        placeholder='Detalle los documentos faltantes o errores encontrados'
                      />
                    </div>

                    <div className='flex flex-wrap gap-3'>
                      <Button
                        type='button'
                        onClick={() => void handleObservarSolicitud()}
                        disabled={actionLoading}
                        className='bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium'
                      >
                        {actionLoading ? 'Guardando...' : 'Marcar como OBSERVADO'}
                      </Button>

                      <Button
                        type='button'
                        onClick={() => void handleValidar()}
                        disabled={actionLoading}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium'
                      >
                        {actionLoading ? 'Validando...' : 'Validar'}
                      </Button>
                    </div>

                    {validacionResult && (
                      <div className='rounded-xl border border-zinc-200 p-4 space-y-2'>
                        <h3 className='font-semibold'>
                          {validacionResult.valido ? 'Validacion exitosa' : 'Observaciones de validacion'}
                        </h3>
                        {validacionResult.valido ? (
                          <p className='text-sm text-green-700'>La solicitud cumple con todos los requisitos.</p>
                        ) : (
                          <ul className='list-disc list-inside text-sm text-red-700 space-y-1'>
                            {validacionResult.observaciones.map((obs, i) => (
                              <li key={i}>{obs}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div className='flex flex-wrap gap-3'>
                      <Button
                        type='button'
                        onClick={() => void handleAprobar()}
                        disabled={actionLoading || !validacionResult?.valido}
                        className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium'
                      >
                        {actionLoading ? 'Aprobando...' : 'Aprobar'}
                      </Button>

                      {!showRechazoForm ? (
                        <Button
                          type='button'
                          onClick={() => setShowRechazoForm(true)}
                          disabled={actionLoading}
                          className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium'
                        >
                          Rechazar
                        </Button>
                      ) : (
                        <div className='w-full space-y-2'>
                          <Textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className='min-h-24'
                            placeholder='Motivo del rechazo...'
                          />
                          <div className='flex gap-3'>
                            <Button
                              type='button'
                              onClick={() => void handleRechazar()}
                              disabled={actionLoading || !motivoRechazo.trim()}
                              className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium'
                            >
                              {actionLoading ? 'Rechazando...' : 'Confirmar rechazo'}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => {
                                setShowRechazoForm(false);
                                setMotivoRechazo('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className='rounded-xl border border-zinc-200 p-4'>
                    <p className='text-sm text-gray-600'>
                      Esta solicitud ya fue{' '}
                      <span className='font-semibold'>{selectedSolicitud.estado.toLowerCase()}</span>.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
