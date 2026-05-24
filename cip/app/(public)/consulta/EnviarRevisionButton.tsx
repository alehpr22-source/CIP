"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { enviarParaRevision } from "@/actions/consulta.actions"
import { Button } from "@/components/ui/Button"

interface Props {
  solicitanteId: string
  dni: string
  correo: string
}

export function EnviarRevisionButton({ solicitanteId, dni, correo }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleClick() {
    setLoading(true)
    setError("")

    try {
      const result = await enviarParaRevision(solicitanteId, dni, correo)

      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Error al enviar para revisión:", err)
      setError("Error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500">Corrige los documentos que necesites y luego envía para revisión.</p>
      <Button disabled={loading} onClick={handleClick}>
        {loading ? "Enviando..." : "Enviar para revisión"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
