import { Clock, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';

type StatusBadgeProps = {
  status: string;
};

const statusConfig: Record<string, { className: string; icon: React.ReactNode }> = {
  EN_REVISION: {
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: <Clock className='size-3' />,
  },
  OBSERVADO: {
    className: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <AlertTriangle className='size-3' />,
  },
  APROBADO: {
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle className='size-3' />,
  },
  RECHAZADO: {
    className: 'bg-zinc-200 text-zinc-700 border-zinc-300',
    icon: <XCircle className='size-3' />,
  },
  BORRADOR: {
    className: 'bg-white text-red-700 border-red-300',
    icon: <FileText className='size-3' />,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.BORRADOR;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {status}
    </span>
  );
}
