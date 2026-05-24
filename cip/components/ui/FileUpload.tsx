import { useRef, useState } from "react"

interface FileUploadProps {
  label: string
  accept: string
  maxSizeMB: number
  hint?: string
  error?: string
  preview?: string | null
  onChange: (file: File | null) => void
}

export function FileUpload({ label, accept, maxSizeMB, hint, error, preview, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File | null) {
    if (!file) return
    if (file.size > maxSizeMB * 1024 * 1024) return
    onChange(file)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Vista previa" className="max-h-40 rounded object-contain" />
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">Click o arrastra</span> un archivo
            </p>
            <p className="text-xs text-gray-400">Máx {maxSizeMB}MB — {accept.replace(/,/g, ", ")}</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
