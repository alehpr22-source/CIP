"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { aprobarPago, revisarExpedienteConDetalle } from "@/actions/expediente.actions"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  expedienteId: string
}

export function ConfirmarPagoActions({ expedienteId }: Props) {
  const router = useRouter()
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function handleConfirmar() {
    setLoading("confirmar")
    setError("")

    const result = await aprobarPago(expedienteId)

    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      router.push("/admin/expedientes")
    }
  }

  async function handleRechazar() {
    if (!comentario.trim()) {
      setError("Debes indicar el motivo del rechazo")
      return
    }

    setLoading("rechazar")
    setError("")

    const result = await revisarExpedienteConDetalle(expedienteId, "rechazar", comentario, {})

    if (result?.error) {
      setError(result.error)
      setLoading(null)
    } else {
      router.push("/admin/expedientes")
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={loading !== null}
          onClick={handleConfirmar}
        >
          {loading === "confirmar" ? "Confirmando..." : "✅ Confirmar Pago"}
        </Button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rechazar pago (motivo):
        </label>
        <textarea
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Ej: Voucher ilegible, monto incorrecto..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>

      <Button
        variant="danger"
        disabled={loading !== null}
        onClick={handleRechazar}
      >
        {loading === "rechazar" ? "Rechazando..." : "❌ Rechazar Pago"}
      </Button>
    </div>
  )
}
