import { AlertCircle, Info, CheckCircle } from 'lucide-react';

type InfoAlertProps = {
  message: string;
  variant?: 'error' | 'info' | 'success';
};

export function InfoAlert({
  message,
  variant = 'info',
}: InfoAlertProps) {
  const styles = {
    error: {
      wrapper: 'border-red-300 bg-red-50 text-red-700',
      icon: <AlertCircle className='size-4 shrink-0 mt-0.5' />,
    },
    info: {
      wrapper: 'border-blue-200 bg-blue-50 text-blue-700',
      icon: <Info className='size-4 shrink-0 mt-0.5' />,
    },
    success: {
      wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      icon: <CheckCircle className='size-4 shrink-0 mt-0.5' />,
    },
  };

  const style = styles[variant] ?? styles.info;

  return (
    <div
      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${style.wrapper}`}
    >
      {style.icon}
      <span>{message}</span>
    </div>
  );
}
