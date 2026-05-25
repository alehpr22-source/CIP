"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { registrarPagoInscripcion } from "@/actions/dashboard.actions"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  solicitanteId: string
}

export function PagarInscripcion({ solicitanteId }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<{ name: string; base64: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)

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

  async function handlePagar() {
    if (!selected) return
    setLoading(true)
    setError("")

    const result = await registrarPagoInscripcion(solicitanteId, selected.base64)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setExito(true)
      router.refresh()
    }
  }

  if (exito) {
    return (
      <Alert variant="success" title="Pago registrado">
        Tu comprobante de pago ha sido registrado correctamente. El colegio validar&aacute; el pago y te notificar&aacute;.
      </Alert>
    )
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-2 text-lg font-semibold text-blue-800">💳 Pago de Inscripci&oacute;n</h3>
      <p className="mb-4 text-sm text-blue-700">
        Tu expediente est&aacute; pendiente de pago. Para continuar, sube el comprobante de tu pago de S/1500.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleSelectFile}
      />

      {!selected ? (
        <Button variant="primary" onClick={() => inputRef.current?.click()}>
          Seleccionar comprobante
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">Archivo: {selected.name}</p>
          <div className="flex gap-3">
            <Button loading={loading} onClick={handlePagar}>
              {loading ? "Registrando..." : "Pagar"}
            </Button>
            <Button variant="ghost" disabled={loading} onClick={() => setSelected(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
