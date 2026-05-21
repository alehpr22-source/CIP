import { Loader2 } from 'lucide-react';

type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-3'>
      <Loader2 className='size-8 animate-spin text-red-600' />
      <p className='text-lg font-medium text-gray-600'>{message}</p>
    </div>
  );
}
