"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { actualizarDocumento } from "@/actions/consulta.actions"
import { Button } from "@/components/ui/Button"

interface Props {
  solicitanteId: string
  dni: string
  correo: string
  tipo: "foto" | "titulo" | "dni" | "voucher"
}

const labels: Record<string, string> = {
  foto: "Cambiar foto",
  titulo: "Cambiar título",
  dni: "Cambiar DNI",
  voucher: "Cambiar voucher",
}

export function EditarDocumento({ solicitanteId, dni, correo, tipo }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<{ name: string; base64: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setSelected({ name: file.name, base64: reader.result as string })
      setError("")
    }
    reader.onerror = () => setError("Error al leer el archivo")
    reader.readAsDataURL(file)

    e.target.value = ""
  }

  async function handleConfirm() {
    if (!selected) return

    setLoading(true)
    setError("")

    try {
      const result = await actualizarDocumento(solicitanteId, dni, correo, tipo, selected.base64)

      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Error al confirmar cambio:", err)
      setError("Error inesperado al subir el archivo. Intenta de nuevo.")
      setLoading(false)
    }
  }

  function handleCancel() {
    setSelected(null)
    setError("")
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleSelectFile}
      />

      {!selected && (
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          {labels[tipo]}
        </Button>
      )}

      {selected && (
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500 truncate max-w-40">{selected.name}</span>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" disabled={loading} onClick={handleConfirm}>
              {loading ? "Subiendo..." : "Confirmar cambio"}
            </Button>
            <Button variant="ghost" size="sm" disabled={loading} onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}
