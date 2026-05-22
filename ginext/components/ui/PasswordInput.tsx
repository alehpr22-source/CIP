'use client';

import { useState } from 'react';
import { Input } from './input';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <Input
        type={show ? 'text' : 'password'}
        className={`pr-12 ${className ?? ''}`}
        {...props}
      />
      <button
        type='button'
        onClick={() => setShow(!show)}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition'
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {show ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
      </button>
    </div>
  );
}
