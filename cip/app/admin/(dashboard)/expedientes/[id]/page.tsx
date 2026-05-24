import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { obtenerDetalleExpediente } from "@/actions/expediente.actions"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ESTADO_BADGE, formatDate } from "@/lib/constants"
import { ExpedienteActions } from "./ExpedienteActions"
import { ConfirmarPagoActions } from "./ConfirmarPagoActions"

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-gray-100 py-2 text-sm">
      <span className="w-40 font-medium text-gray-500">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function ExpedienteContent({ id }: { id: string }) {
  const supabase = createClient()
  const detalle = await obtenerDetalleExpediente(id)

  if (!detalle) {
    return (
      <p className="py-12 text-center text-gray-500">
        Expediente no encontrado
      </p>
    )
  }

  const [carreras, sedes] = await Promise.all([
    supabase.from("carreras").select("id, nombre"),
    supabase.from("sedes").select("id, nombre"),
  ])

  const s = detalle.solicitantes
  const carrera = carreras.data?.find((c) => c.id === s.carrera_id)
  const sede = sedes.data?.find((sed) => sed.id === s.sede_id)
  const pago = detalle.pagos_inscripcion?.[0]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back + header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/expedientes" className="text-sm text-blue-600 hover:text-blue-800">
          ← Volver a bandeja
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-800">{detalle.codigo_expediente}</span>
          <Badge variant={ESTADO_BADGE[detalle.estado] ?? "neutral"}>{detalle.estado}</Badge>
        </div>
      </div>

      {/* Datos del solicitante */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">📋 Datos del Solicitante</h2>
        <InfoRow label="DNI" value={s.dni} />
        <InfoRow label="Apellido Paterno" value={s.apellido_paterno} />
        <InfoRow label="Apellido Materno" value={s.apellido_materno} />
        <InfoRow label="Nombres" value={s.nombres} />
        <InfoRow label="Correo" value={s.correo ?? "-"} />
        <InfoRow label="Teléfono" value={s.telefono ?? "-"} />
        <InfoRow label="Universidad" value={s.universidad} />
        <InfoRow label="Carrera" value={carrera?.nombre ?? "-"} />
        <InfoRow label="Sede" value={sede?.nombre ?? "-"} />
        <InfoRow label="Validado RENIEC" value={s.validado_reniec ? "✅ Sí" : "❌ No"} />
      </section>

      {/* Documentos */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">📄 Documentos</h2>
        <div className="flex flex-wrap gap-3">
          {s.foto_url && (
            <a href={`${s.foto_url}?_t=${Date.now()}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">📷 Foto</Button>
            </a>
          )}
          {s.titulo_url && (
            <a href={`${s.titulo_url}?_t=${Date.now()}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">🎓 Título</Button>
            </a>
          )}
          {s.dni_url && (
            <a href={`${s.dni_url}?_t=${Date.now()}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">🆔 Copia DNI</Button>
            </a>
          )}
          {pago?.comprobante_url && (
            <a href={`${pago.comprobante_url}?_t=${Date.now()}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">🧾 Voucher</Button>
            </a>
          )}
        </div>
      </section>

      {/* Pago */}
      {pago && (
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">💳 Pago de Inscripción</h2>
          <InfoRow label="Monto" value={`S/ ${pago.monto.toFixed(2)}`} />
          <InfoRow label="Estado" value={pago.estado} />
          <InfoRow label="Tipo" value={pago.tipo_pago} />
          <InfoRow label="N° Operación" value={pago.transaccion_id ?? "-"} />

          {detalle.estado === "Pendiente de pago" && pago.comprobante_url && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">Voucher de pago:</p>
              <a href={`${pago.comprobante_url}?_t=${Date.now()}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`${pago.comprobante_url}?_t=${Date.now()}`}
                  alt="Voucher de pago"
                  className="max-h-64 rounded-lg border object-contain"
                />
              </a>
            </div>
          )}
        </section>
      )}

      {/* Fecha */}
      <section className="rounded-lg border bg-white p-6">
        <InfoRow label="Fecha de registro" value={formatDate(detalle.created_at)} />
        {detalle.fecha_revision && (
          <InfoRow label="Fecha de revisión" value={formatDate(detalle.fecha_revision)} />
        )}
        {detalle.observaciones && (
          <InfoRow label="Observaciones" value={detalle.observaciones} />
        )}
      </section>

      {/* Acciones */}
      {detalle.estado === "Pendiente de pago" ? (
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">⚡ Revisión de Pago</h2>
          <ConfirmarPagoActions expedienteId={detalle.id} />
        </section>
      ) : (detalle.estado === "Pendiente" || detalle.estado === "Observado") && (
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">⚡ Acciones</h2>
          <ExpedienteActions expedienteId={detalle.id} estado={detalle.estado} />
        </section>
      )}
    </div>
  )
}

export default async function ExpedienteDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<p className="py-12 text-center text-gray-500">Cargando expediente...</p>}>
      <ExpedienteContent id={id} />
    </Suspense>
  )
}
