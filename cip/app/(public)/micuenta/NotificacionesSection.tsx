"use client"

import { useState } from "react"
import { marcarTodasLeidas } from "@/actions/notificaciones.actions"
import { formatDate } from "@/lib/constants"

interface Notif {
  id: string
  tipo: string
  titulo: string
  mensaje: string | null
  leida: boolean
  created_at: string
}

const ICONOS: Record<string, string> = {
  aprobado: "✅",
  observado: "⚠️",
  rechazado: "❌",
  colegiado: "🎉",
  pago: "💳",
}

export function NotificacionesSection({ initial }: { initial: Notif[] }) {
  const [notificaciones, setNotificaciones] = useState(initial)
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? notificaciones : notificaciones.slice(0, 5)

  async function handleMarcarTodas() {
    const res = await marcarTodasLeidas()
    if (res.success) {
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
    }
  }

  const noLeidas = notificaciones.filter((n) => !n.leida).length

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {noLeidas > 0 ? `${noLeidas} sin leer` : "Todas leídas"}
        </span>
        {noLeidas > 0 && (
          <button
            onClick={handleMarcarTodas}
            className="text-xs font-medium text-blue-700 hover:text-blue-900"
          >
            Marcar todas leídas
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400">Sin notificaciones</p>
      ) : (
        <div className="space-y-2">
          {visible.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border p-2.5 text-xs ${n.leida ? "bg-white" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-start gap-1.5">
                <span>{ICONOS[n.tipo] ?? "📢"}</span>
                <div className="flex-1 min-w-0">
                  <p className={`${n.leida ? "text-gray-700" : "font-medium text-gray-900"}`}>
                    {n.titulo}
                  </p>
                  {n.mensaje && (
                    <p className="mt-0.5 text-gray-500 truncate">{n.mensaje}</p>
                  )}
                  <p className="mt-0.5 text-gray-400">{formatDate(n.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notificaciones.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs font-medium text-blue-700 hover:text-blue-900"
        >
          {showAll ? "Mostrar menos" : `Ver las ${notificaciones.length} notificaciones`}
        </button>
      )}
    </div>
  )
}
