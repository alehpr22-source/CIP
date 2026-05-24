export const ESTADO_BADGE: Record<string, "warning" | "info" | "success" | "danger"> = {
  Pendiente: "warning",
  Observado: "info",
  "Pendiente de pago": "info",
  Aprobado: "success",
  Rechazado: "danger",
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
