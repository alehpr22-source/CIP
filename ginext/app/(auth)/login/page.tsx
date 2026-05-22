'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { translateAuthError } from '@/lib/utils/auth-errors';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { AuthCard } from '@/components/ui/AuthCard';
import { InfoAlert } from '@/components/ui/InfoAlert';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: loginError } = await signIn(correo, password);
      if (loginError) {
        setError(translateAuthError(loginError.message));
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/postulante');
        router.refresh();
        return;
      }

      const { data: usuario } = await supabase
        .from('usuarios')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      router.push(usuario?.role === 'ADMIN' ? '/admin/solicitudes' : '/postulante');
      router.refresh();
    } catch {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title='Iniciar Sesión' subtitle='Sistema Virtual de Colegiatura'>
      <form onSubmit={handleLogin} className='space-y-6'>
        {error && <InfoAlert message={error} variant='error' />}

        <div className='space-y-2'>
          <label htmlFor='correo' className='block text-sm font-semibold text-gray-700'>
            Correo electrónico
          </label>
          <Input
            id='correo'
            type='email'
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder='correo@ejemplo.com'
            className='w-full rounded-2xl px-4 py-4 h-auto bg-white text-gray-900 border-red-200'
            required
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='password' className='block text-sm font-semibold text-gray-700'>
            Contraseña
          </label>
          <PasswordInput
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Ingrese su contraseña'
            className='w-full rounded-2xl px-4 py-4 h-auto bg-white text-gray-900 border-red-200'
            required
          />
        </div>

        <Button
          type='submit'
          disabled={loading}
          className='w-full bg-red-700 hover:bg-red-800 text-white py-6 rounded-2xl font-semibold text-base'
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </Button>

        <div className='text-center text-gray-500'>
          ¿No tienes cuenta?{' '}
          <Link href='/register' className='text-red-600 font-semibold hover:underline'>
            Regístrate
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
