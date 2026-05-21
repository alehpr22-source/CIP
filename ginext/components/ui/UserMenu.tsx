'use client';

import { LogOut, User } from 'lucide-react';
import type { UsuarioRow } from '@/lib/supabase';

type UserMenuProps = {
  usuario: UsuarioRow | null;
  onSignOut: () => void;
  variant?: 'inline' | 'block';
};

export function UserMenu({ usuario, onSignOut, variant = 'inline' }: UserMenuProps) {
  if (!usuario) return null;

  const fullName = `${usuario.nombres} ${usuario.apellido_paterno}`.trim();

  if (variant === 'block') {
    return (
      <div className='space-y-3'>
        <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
          <div className='flex items-center justify-center size-9 rounded-full bg-red-100 text-red-700 shrink-0'>
            <User className='size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-gray-900 truncate'>{fullName}</p>
            <p className='text-xs text-gray-500 truncate'>{usuario.correo}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition'
        >
          <LogOut className='size-4' />
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center justify-center size-8 rounded-full bg-red-100 text-red-700 shrink-0'>
        <User className='size-4' />
      </div>
      <div className='min-w-0'>
        <p className='text-sm font-semibold text-gray-900 truncate max-w-[180px]'>{fullName}</p>
        <p className='text-xs text-gray-500 truncate max-w-[180px]'>{usuario.correo}</p>
      </div>
      <button
        onClick={onSignOut}
        className='flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl font-medium transition shrink-0'
      >
        <LogOut className='size-4' />
        <span className='hidden sm:inline'>Salir</span>
      </button>
    </div>
  );
}
