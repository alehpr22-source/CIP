import { useId } from 'react';
import { FileText } from 'lucide-react';

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

  const displayLabel = fileLabel
    ? getFriendlyFileName(fileLabel)
    : undefined;

  return (
    <div className='rounded-2xl border border-red-100 bg-white p-4 shadow-sm'>
      <div>
        <p className='font-semibold text-red-800'>{tipo}</p>
        <p className='text-sm text-gray-500'>
          {versionLabel ?? 'Sin documento cargado'}
        </p>
        <RequirementList items={requirements} />
      </div>

      <div className='mt-3 flex items-center gap-3'>
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
          <span className='flex items-center gap-1.5 text-sm text-gray-600'>
            <FileText className='size-3.5 shrink-0' />
            {displayLabel}
          </span>
        ) : (
          <span className='text-sm text-gray-400'>Sin archivos seleccionados</span>
        )}
      </div>
    </div>
  );
}
