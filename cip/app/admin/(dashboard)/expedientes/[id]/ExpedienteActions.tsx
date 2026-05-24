"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { aprobarExpediente, observarExpediente, rechazarExpediente } from "@/actions/expediente.actions"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  expedienteId: string
  estado: string
}

export function ExpedienteActions({ expedienteId, estado }: Props) {
  const router = useRouter()
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const requiereComentario = estado === "Pendiente"

  async function handleAction(action: string) {
    setLoading(action)
    setError("")

    let result: { error?: string } | undefined

    if (action === "aprobar") {
      result = await aprobarExpediente(expedienteId)
    } else if (action === "observar") {
      if (!comentario.trim()) {
        setError("Debes agregar un comentario")
        setLoading(null)
        return
      }
      result = await observarExpediente(expedienteId, comentario)
    } else if (action === "rechazar") {
      if (!comentario.trim()) {
        setError("Debes agregar un comentario")
        setLoading(null)
        return
      }
      result = await rechazarExpediente(expedienteId, comentario)
    }

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

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Comentario {requiereComentario ? "(opcional)" : ""}
        </label>
        <textarea
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Agrega un comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={loading !== null}
          onClick={() => handleAction("aprobar")}
        >
          {loading === "aprobar" ? "Aprobando..." : "✅ Aprobar"}
        </Button>

        <Button
          variant="outline"
          disabled={loading !== null}
          onClick={() => handleAction("observar")}
        >
          {loading === "observar" ? "Observando..." : "👁 Observar"}
        </Button>

        <Button
          variant="danger"
          disabled={loading !== null}
          onClick={() => handleAction("rechazar")}
        >
          {loading === "rechazar" ? "Rechazando..." : "❌ Rechazar"}
        </Button>
      </div>
    </div>
  )
}
