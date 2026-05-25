"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { revisarExpedienteConDetalle } from "@/actions/expediente.actions"
import type { RevisionCampos } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  expedienteId: string
  estado: string
}

interface GrupoProps {
  titulo: string
  items: { key: string; label: string }[]
  campos: RevisionCampos
  onToggle: (key: string, valido: boolean) => void
}

function GrupoRevision({ titulo, items, campos, onToggle }: GrupoProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{titulo}</p>
      <div className="space-y-1">
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
            <span className="text-sm text-gray-700">{label}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onToggle(key, true)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  campos[key]
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-400 hover:border-green-300 hover:text-green-600"
                }`}
              >
                ✅
              </button>
              <button
                type="button"
                onClick={() => onToggle(key, false)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  !campos[key]
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:text-red-600"
                }`}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExpedienteActions({ expedienteId, estado }: Props) {
  const router = useRouter()
  const [campos, setCampos] = useState<RevisionCampos>({
    identidad: true,
    formacion: true,
    foto: true,
    titulo: true,
    dni_file: true,
  })
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  function handleToggle(key: string, valido: boolean) {
    setCampos((prev) => ({ ...prev, [key]: valido }))
  }

  function todosCorrectos() {
    return Object.values(campos).every(Boolean)
  }

  async function handleAction(accion: "aprobar" | "observar" | "rechazar") {
    setLoading(accion)
    setError("")

    if (accion !== "aprobar" && !comentario.trim()) {
      setError("Debes agregar un comentario")
      setLoading(null)
      return
    }

    const result = await revisarExpedienteConDetalle(expedienteId, accion, comentario, campos)

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

      <GrupoRevision
        titulo="📋 Datos personales"
        items={[
          { key: "identidad", label: "Identidad (DNI, Nombres, Apellidos, Correo, Teléfono)" },
          { key: "formacion", label: "Formación (Universidad, Carrera, Sede)" },
        ]}
        campos={campos}
        onToggle={handleToggle}
      />

      <GrupoRevision
        titulo="📄 Documentos"
        items={[
          { key: "foto", label: "Foto personal" },
          { key: "titulo", label: "Título profesional" },
          { key: "dni_file", label: "Copia DNI" },
        ]}
        campos={campos}
        onToggle={handleToggle}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Comentario general {estado !== "Pendiente" ? "(opcional)" : ""}
        </label>
        <textarea
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Agrega un comentario general..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={loading !== null || !todosCorrectos()}
          onClick={() => handleAction("aprobar")}
        >
          {loading === "aprobar" ? "Aprobando..." : "✅ Aprobar todo"}
        </Button>

        <Button
          variant="danger"
          disabled={loading !== null}
          onClick={() => handleAction("rechazar")}
        >
          {loading === "rechazar" ? "Rechazando..." : "❌ Rechazar solicitud"}
        </Button>
      </div>

      {!todosCorrectos() && (
        <p className="text-xs text-gray-500">
          Hay campos marcados como incorrectos. Las observaciones se enviarán al rechazar la solicitud.
        </p>
      )}
    </div>
  )
}
