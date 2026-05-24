import { Suspense } from "react"
import Link from "next/link"
import { consultarExpediente } from "@/actions/consulta.actions"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ESTADO_BADGE, formatDate } from "@/lib/constants"
import { EditarDocumento } from "./EditarDocumento"
import { EnviarRevisionButton } from "./EnviarRevisionButton"
import { PagoForm } from "./PagoForm"

function DocLink({ url, label }: { url: string; label: string }) {
  if (!url) return <span className="text-sm text-gray-400">No subido</span>
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
      {label}
    </a>
  )
}

function DocumentosSection({
  solicitanteId, dni, correo, esObservado,
  foto_url, titulo_url, dni_url, comprobante_url,
}: {
  solicitanteId: string; dni: string; correo: string; esObservado: boolean
  foto_url: string; titulo_url: string; dni_url: string; comprobante_url: string | null
}) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">📄 Documentos subidos</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <DocLink url={foto_url} label="📷 Foto" />
          {esObservado && <EditarDocumento solicitanteId={solicitanteId} dni={dni} correo={correo} tipo="foto" />}
        </div>
        <div className="flex items-center justify-between">
          <DocLink url={titulo_url} label="🎓 Título" />
          {esObservado && <EditarDocumento solicitanteId={solicitanteId} dni={dni} correo={correo} tipo="titulo" />}
        </div>
        <div className="flex items-center justify-between">
          <DocLink url={dni_url} label="🆔 Copia DNI" />
          {esObservado && <EditarDocumento solicitanteId={solicitanteId} dni={dni} correo={correo} tipo="dni" />}
        </div>
        <div className="flex items-center justify-between">
          <DocLink url={comprobante_url ?? ""} label="🧾 Voucher" />
          {esObservado && <EditarDocumento solicitanteId={solicitanteId} dni={dni} correo={correo} tipo="voucher" />}
        </div>
      </div>
      {esObservado && (
        <EnviarRevisionButton solicitanteId={solicitanteId} dni={dni} correo={correo} />
      )}
    </div>
  )
}

async function Resultado({ dni, correo }: { dni: string; correo: string }) {
  const result = await consultarExpediente(dni, correo)

  if ("error" in result) {
    return (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {(result as { error: string }).error}
      </div>
    )
  }

  const r = result as {
    solicitante: {
      id: string; dni: string; nombres: string; apellido_paterno: string; apellido_materno: string
      carrera_nombre: string; sede_nombre: string; universidad: string
      foto_url: string; titulo_url: string; dni_url: string
    }
    expediente: { id: string; codigo_expediente: string; estado: string; observaciones: string | null; fecha_revision: string | null; created_at: string } | null
    colegiado: { id: string; numero_cip: string; estado_habilitacion: string; fecha_colegiatura: string } | null
    pago: { id: string; monto: number; estado: string; tipo_pago: string; comprobante_url: string | null } | null
  }
  const { solicitante, expediente, colegiado, pago } = r
  const esObservado = expediente?.estado === "Observado"

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">📋 Datos del Solicitante</h2>

      <div className="rounded-lg border bg-white p-6">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div><span className="font-medium text-gray-500">DNI:</span> <span className="text-gray-800">{solicitante.dni}</span></div>
          <div><span className="font-medium text-gray-500">Apellido Paterno:</span> <span className="text-gray-800">{solicitante.apellido_paterno}</span></div>
          <div><span className="font-medium text-gray-500">Apellido Materno:</span> <span className="text-gray-800">{solicitante.apellido_materno}</span></div>
          <div><span className="font-medium text-gray-500">Nombres:</span> <span className="text-gray-800">{solicitante.nombres}</span></div>
          <div><span className="font-medium text-gray-500">Carrera:</span> <span className="text-gray-800">{solicitante.carrera_nombre}</span></div>
          <div><span className="font-medium text-gray-500">Sede:</span> <span className="text-gray-800">{solicitante.sede_nombre}</span></div>
          <div><span className="font-medium text-gray-500">Universidad:</span> <span className="text-gray-800">{solicitante.universidad}</span></div>
        </div>
      </div>

      <DocumentosSection
        solicitanteId={solicitante.id}
        dni={dni}
        correo={correo}
        esObservado={esObservado}
        foto_url={solicitante.foto_url}
        titulo_url={solicitante.titulo_url}
        dni_url={solicitante.dni_url}
        comprobante_url={pago?.comprobante_url ?? null}
      />

      {expediente?.estado === "Pendiente de pago" && (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">💳 Pago de Inscripción</h2>
          <PagoForm
            solicitanteId={solicitante.id}
            dni={dni}
            correo={correo}
            nombres={solicitante.nombres}
            apellido_paterno={solicitante.apellido_paterno}
            apellido_materno={solicitante.apellido_materno}
          />
        </div>
      )}

      {expediente ? (
        <>
          <h2 className="text-lg font-semibold text-gray-800">📌 Estado del Trámite</h2>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-gray-800">{expediente.codigo_expediente}</span>
              <Badge variant={ESTADO_BADGE[expediente.estado] ?? "neutral"}>{expediente.estado}</Badge>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div><span className="font-medium text-gray-500">Fecha de registro:</span> <span className="text-gray-800">{formatDate(expediente.created_at)}</span></div>
              {expediente.fecha_revision && (
                <div><span className="font-medium text-gray-500">Fecha de revisión:</span> <span className="text-gray-800">{formatDate(expediente.fecha_revision)}</span></div>
              )}
            </div>

            {expediente.observaciones && (
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <span className="font-medium">Observación del revisor:</span>
                <p className="mt-1">{expediente.observaciones}</p>
              </div>
            )}
          </div>

          {pago && (
            <>
              <h2 className="text-lg font-semibold text-gray-800">💳 Pago</h2>
              <div className="rounded-lg border bg-white p-6 text-sm">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div><span className="font-medium text-gray-500">Monto:</span> <span className="text-gray-800">S/ {pago.monto.toFixed(2)}</span></div>
                  <div><span className="font-medium text-gray-500">Estado:</span> <span className="text-gray-800">{pago.estado}</span></div>
                  <div><span className="font-medium text-gray-500">Tipo:</span> <span className="text-gray-800">{pago.tipo_pago}</span></div>
                </div>
              </div>
            </>
          )}

          {colegiado && (
            <>
              <h2 className="text-lg font-semibold text-gray-800">🪪 Colegiatura</h2>
              <div className="rounded-lg border bg-white p-6 text-sm">
                <div className="mb-3">
                  <span className="font-medium text-gray-500">CIP:</span>{" "}
                  <Link href={`/carnet/${colegiado.numero_cip}`} className="font-mono text-lg font-bold text-blue-700 hover:text-blue-900 underline">
                    {colegiado.numero_cip}
                  </Link>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><span className="font-medium text-gray-500">Estado:</span> <span className="text-gray-800">{colegiado.estado_habilitacion === "Habilitado" ? "✅ Habilitado" : "❌ Inhabilitado"}</span></div>
                  <div><span className="font-medium text-gray-500">Fecha de colegiatura:</span> <span className="text-gray-800">{new Date(colegiado.fecha_colegiatura).toLocaleDateString("es-PE")}</span></div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          No se encontró un expediente asociado a tu registro.
        </div>
      )}
    </div>
  )
}

export default async function ConsultaPage(props: {
  searchParams: Promise<{ dni?: string; correo?: string }>
}) {
  const { dni, correo } = await props.searchParams
  const mostrarResultado = dni && correo

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
        🔍 Consulta de Expediente
      </h1>
      <p className="mb-8 text-center text-sm text-gray-500">
        Ingresa tu DNI y correo electrónico para consultar el estado de tu trámite.
      </p>

      <form className="space-y-4 rounded-lg border bg-white p-6 shadow-sm" method="GET">
        <Input label="DNI" name="dni" placeholder="12345678" defaultValue={dni ?? ""} required />
        <Input label="Correo electrónico" name="correo" type="email" placeholder="tucorreo@email.com" defaultValue={correo ?? ""} required />
        <Button type="submit" className="w-full">Consultar</Button>
      </form>

      {mostrarResultado && (
        <Suspense fallback={<p className="mt-6 text-center text-sm text-gray-500">Consultando...</p>}>
          <Resultado dni={dni} correo={correo} />
        </Suspense>
      )}
    </div>
  )
}
