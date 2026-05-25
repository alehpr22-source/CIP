"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { actualizarDocumentoDashboard, enviarParaRevisionDashboard } from "@/actions/dashboard.actions"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Documento {
  tipo: "foto" | "titulo" | "dni"
  label: string
  icon: string
  url: string
}

interface Props {
  solicitanteId: string
  fotoUrl: string
  tituloUrl: string
  dniUrl: string
}

function SubirDocumento({ solicitanteId, tipo, label, icon, url }: Documento & { solicitanteId: string }) {
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

    const result = await actualizarDocumentoDashboard(solicitanteId, tipo, selected.base64)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSelected(null)
      router.refresh()
    }
  }

  function handleCancel() {
    setSelected(null)
    setError("")
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            Ver documento actual
          </a>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleSelectFile}
      />

      {!selected && (
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Cambiar
        </Button>
      )}

      {selected && (
        <div className="flex flex-col items-end gap-1">
          <span className="max-w-40 truncate text-xs text-gray-500">{selected.name}</span>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" disabled={loading} onClick={handleConfirm}>
              {loading ? "Subiendo..." : "Confirmar"}
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

export function CorregirExpediente({ solicitanteId, fotoUrl, tituloUrl, dniUrl }: Props) {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState("")
  const [exito, setExito] = useState(false)

  async function handleEnviar() {
    setEnviando(true)
    setErrorEnvio("")

    const result = await enviarParaRevisionDashboard(solicitanteId)

    if (result.error) {
      setErrorEnvio(result.error)
      setEnviando(false)
    } else {
      setExito(true)
      router.refresh()
    }
  }

  if (exito) {
    return (
      <Alert variant="success" title="Solicitud enviada para revisión">
        Tu expediente ha sido reenviado correctamente. El colegio evaluará los cambios y te notificará el resultado.
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">
          Tu solicitud fue rechazada. Corrige los documentos que correspondan y envía para una nueva revisión.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Documentos</p>
        <SubirDocumento solicitanteId={solicitanteId} tipo="foto" label="Foto personal" icon="📷" url={fotoUrl} />
        <SubirDocumento solicitanteId={solicitanteId} tipo="titulo" label="Título profesional" icon="🎓" url={tituloUrl} />
        <SubirDocumento solicitanteId={solicitanteId} tipo="dni" label="Copia DNI" icon="🆔" url={dniUrl} />
      </div>

      {errorEnvio && <Alert variant="error">{errorEnvio}</Alert>}

      <Button variant="primary" loading={enviando} onClick={handleEnviar} className="w-full">
        {enviando ? "Enviando..." : "Enviar para revisión"}
      </Button>

      <p className="text-xs text-gray-500">
        Solo puedes reenviar si tu expediente está en estado Rechazado. Una vez enviado, volverá a estado Pendiente.
      </p>
    </div>
  )
}
