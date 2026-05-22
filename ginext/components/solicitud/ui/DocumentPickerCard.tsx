import { useId } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Camera, IdCard, Receipt, ScrollText } from 'lucide-react';

import { RequirementList } from '@/components/solicitud/ui/RequirementList';

type DocumentPickerCardProps = {
  tipo: string;
  versionLabel?: string;
  fileLabel?: string;
  requirements: string[];
  disabled?: boolean;
  accept: string;
  onSelect: (file: File | null) => void;
};

const ICON_MAP: Record<string, LucideIcon> = {
  DNI: IdCard,
  FOTO: Camera,
  TITULO: ScrollText,
  PAGO: Receipt,
};

function getFriendlyFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] ?? path;
}

export function DocumentPickerCard({
  tipo,
  versionLabel,
  fileLabel,
  requirements,
  disabled = false,
  accept,
  onSelect,
}: DocumentPickerCardProps) {
  const inputId = useId();
  const IconComponent = ICON_MAP[tipo];

  const displayLabel = fileLabel
    ? getFriendlyFileName(fileLabel)
    : undefined;

  return (
    <div className='group rounded-2xl border border-red-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-start gap-4'>
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-red-800 group-hover:text-red-900 transition-colors'>
            {tipo}
          </p>
          <p className='text-sm text-gray-500 truncate'>
            {versionLabel ?? 'Sin documento cargado'}
          </p>
          <RequirementList items={requirements} />
        </div>
        <div className='size-12 shrink-0 rounded-xl bg-red-100 text-red-700 flex items-center justify-center group-hover:bg-red-800 transition-colors'>
          {IconComponent && (
            <IconComponent className='size-6 group-hover:text-white transition-colors' />
          )}
        </div>
      </div>

      <div className='mt-4 flex items-center gap-3'>
        <input
          id={inputId}
          type='file'
          accept={accept}
          className='hidden'
          onChange={(event) =>
            onSelect(event.target.files?.[0] ?? null)
          }
          disabled={disabled}
        />

        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center rounded-xl border px-4 py-2 text-sm font-medium transition ${disabled ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400' : 'border-red-300 bg-white text-red-700 hover:bg-red-50'}`}
        >
          Seleccionar archivo
        </label>

        {displayLabel ? (
          <span className='flex items-center gap-1.5 text-sm text-gray-600 truncate min-w-0'>
            <IdCard className='size-3.5 shrink-0' />
            <span className='truncate'>{displayLabel}</span>
          </span>
        ) : (
          <span className='text-sm text-gray-400'>Sin archivos seleccionados</span>
        )}
      </div>
    </div>
  );
}
