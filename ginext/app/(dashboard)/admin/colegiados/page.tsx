'use client';

import { useEffect, useState } from 'react';

import { InfoAlert } from '@/components/ui/InfoAlert';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { listColegiados, updateColegiadoEstado } from '@/lib/services/colegiados';
import type { ColegiadoRow } from '@/lib/supabase';

type ColegiadoWithUsuario = ColegiadoRow & {
  usuarios: {
    id: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    correo: string;
    dni: string;
  };
};

export default function AdminColegiadosPage() {
  const { usuario, loading: authLoading } = useAuth();

  const [colegiados, setColegiados] = useState<ColegiadoWithUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    if (!usuario) return;
    if (usuario.role !== 'ADMIN') return;

    const load = async () => {
      setLoading(true);
      setError('');

      const { data, error: colegiadosError } = await listColegiados();

      if (colegiadosError) {
        setError('No se pudieron cargar los colegiados');
      } else {
        setColegiados(data ?? []);
      }

      setLoading(false);
    };

    void load();
  }, [usuario]);

  async function handleToggleEstado(colegiado: ColegiadoWithUsuario) {
    setError('');
    setSuccess('');

    const nuevoEstado = colegiado.estado === 'HABILITADO' ? 'INHABILITADO' : 'HABILITADO';

    const { error: updateError } = await updateColegiadoEstado(colegiado.id, nuevoEstado);

    if (updateError) {
      setError('No se pudo actualizar el estado');
      return;
    }

    setColegiados((prev) =>
      prev.map((c) => (c.id === colegiado.id ? { ...c, estado: nuevoEstado } : c))
    );

    setSuccess(`Estado actualizado a ${nuevoEstado}`);
  }

  const filteredColegiados = colegiados.filter((c) => {
    if (filterCarrera && c.carrera !== filterCarrera) return false;
    if (filterEstado && c.estado !== filterEstado) return false;
    return true;
  });

  const carreras = Array.from(new Set(colegiados.map((c) => c.carrera)));

  if (authLoading || loading) {
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
          <h1 className='text-3xl font-bold'>Gestion de Colegiados</h1>
          <Button
            type='button'
            variant='outline'
            onClick={() => void listColegiados().then(({ data }) => setColegiados(data ?? []))}
          >
            Actualizar
          </Button>
        </div>

        {error && <InfoAlert message={error} variant='error' />}
        {success && <InfoAlert message={success} variant='success' />}

        <div className='flex flex-wrap gap-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>Filtrar por carrera</label>
            <select
              value={filterCarrera}
              onChange={(e) => setFilterCarrera(e.target.value)}
              className='rounded-lg border border-zinc-300 px-3 py-2 text-sm'
            >
              <option value=''>Todas</option>
              {carreras.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>Filtrar por estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className='rounded-lg border border-zinc-300 px-3 py-2 text-sm'
            >
              <option value=''>Todos</option>
              <option value='HABILITADO'>Habilitado</option>
              <option value='INHABILITADO'>Inhabilitado</option>
            </select>
          </div>
        </div>

        {filteredColegiados.length === 0 ? (
          <div className='rounded-2xl border border-zinc-200 bg-white p-8 text-center'>
            <p className='text-gray-500'>No hay colegiados registrados.</p>
          </div>
        ) : (
          <div className='rounded-2xl border border-zinc-200 bg-white overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-zinc-50 border-b border-zinc-200'>
                  <tr>
                    <th className='text-left px-4 py-3 font-semibold'>N° Colegiado</th>
                    <th className='text-left px-4 py-3 font-semibold'>Nombre</th>
                    <th className='text-left px-4 py-3 font-semibold'>Carrera</th>
                    <th className='text-left px-4 py-3 font-semibold'>Fecha</th>
                    <th className='text-left px-4 py-3 font-semibold'>Estado</th>
                    <th className='text-left px-4 py-3 font-semibold'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredColegiados.map((colegiado) => (
                    <tr key={colegiado.id} className='border-b border-zinc-100 hover:bg-zinc-50'>
                      <td className='px-4 py-3 font-mono text-xs'>
                        {colegiado.numero_colegiado}
                      </td>
                      <td className='px-4 py-3'>
                        {colegiado.usuarios.nombres} {colegiado.usuarios.apellido_paterno}
                      </td>
                      <td className='px-4 py-3 text-gray-600'>{colegiado.carrera}</td>
                      <td className='px-4 py-3 text-gray-600'>
                        {new Date(colegiado.fecha_colegiatura).toLocaleDateString('es-PE')}
                      </td>
                      <td className='px-4 py-3'>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            colegiado.estado === 'HABILITADO'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {colegiado.estado}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => void handleToggleEstado(colegiado)}
                          className={
                            colegiado.estado === 'HABILITADO'
                              ? 'text-red-600 border-red-300 hover:bg-red-50'
                              : 'text-emerald-600 border-emerald-300 hover:bg-emerald-50'
                          }
                        >
                          {colegiado.estado === 'HABILITADO' ? 'Inhabilitar' : 'Habilitar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
