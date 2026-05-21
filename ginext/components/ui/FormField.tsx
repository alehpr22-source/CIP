import { cn } from '@/lib/utils';

type FormFieldProps = {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, id, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className='block text-sm font-semibold text-gray-700'>
        {label}
      </label>
      {children}
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
}
