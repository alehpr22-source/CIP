'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { consultarReniecMock } from '@/lib/services/reniec';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { AuthCard } from '@/components/ui/AuthCard';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reniecLoading, setReniecLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === 'dni') {
      if (!/^\d*$/.test(value) || value.length > 8) return;

      setFormData((prev) => ({ ...prev, dni: value }));

      if (value.length === 8) {
        setReniecLoading(true);
        const reniecData = await consultarReniecMock(value);
        setReniecLoading(false);

        if (!reniecData) {
          setError('No se pudo validar el DNI');
          return;
        }

        setFormData((prev) => ({
          ...prev,
          dni: value,
          nombres: reniecData.nombres,
          apellido_paterno: reniecData.apellido_paterno,
          apellido_materno: reniecData.apellido_materno,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          dni: value,
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
        }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }

    if (!formData.nombres || !formData.apellido_paterno || !formData.apellido_materno) {
      setError('Debe validar un DNI válido');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      dni: formData.dni,
      nombres: formData.nombres,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      correo: formData.correo,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/login');
  }

  return (
    <AuthCard title='Crear Cuenta' subtitle='Regístrate para acceder al sistema virtual de colegiatura.'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {error && <InfoAlert message={error} variant='error' />}

        <div className='space-y-2'>
          <label htmlFor='dni' className='text-sm font-medium text-gray-700'>
            DNI
          </label>
          <Input
            id='dni'
            name='dni'
            value={formData.dni}
            onChange={handleChange}
            placeholder='12345678'
            className='bg-white'
            required
          />
        </div>

        {reniecLoading && (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Validando DNI con RENIEC...
          </div>
        )}

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Nombres</label>
          <Input value={formData.nombres} disabled className='bg-gray-100' />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Apellido Paterno</label>
          <Input value={formData.apellido_paterno} disabled className='bg-gray-100' />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Apellido Materno</label>
          <Input value={formData.apellido_materno} disabled className='bg-gray-100' />
        </div>

        <div className='space-y-2'>
          <label htmlFor='correo' className='text-sm font-medium text-gray-700'>
            Correo electrónico
          </label>
          <Input
            id='correo'
            name='correo'
            type='email'
            value={formData.correo}
            onChange={handleChange}
            placeholder='correo@ejemplo.com'
            className='bg-white'
            required
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='password' className='text-sm font-medium text-gray-700'>
            Contraseña
          </label>
          <Input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            className='bg-white'
            required
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>
            Confirmar contraseña
          </label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='••••••••'
            className='bg-white'
            required
          />
        </div>

        <Button
          type='submit'
          disabled={loading || reniecLoading}
          className='w-full bg-red-600 text-white hover:bg-red-700'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </Button>
      </form>

      <div className='mt-6 text-center text-sm text-gray-500'>
        ¿Ya tienes cuenta?{' '}
        <Link href='/login' className='text-red-600 hover:underline'>
          Inicia sesión aquí
        </Link>
      </div>
    </AuthCard>
  );
}
