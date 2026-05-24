export const ESTADO_BADGE: Record<string, "warning" | "info" | "success" | "danger"> = {
  Pendiente: "warning",
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

const NOMBRE_MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre",
]

export function nombreMes(numero: number) {
  return NOMBRE_MESES[numero - 1] ?? `Mes ${numero}`
}

export type RevisionCampos = Record<string, boolean>

const MAPA_CAMPOS: Record<string, string> = {
  identidad: "Identidad",
  formacion: "Formación académica",
  foto: "Foto personal",
  titulo: "Título profesional",
  dni_file: "Copia DNI",
}

export function formatearDetalleCampos(campos: RevisionCampos): string {
  const correctos: string[] = []
  const incorrectos: string[] = []
  for (const [key, valido] of Object.entries(campos)) {
    const label = MAPA_CAMPOS[key] ?? key
    if (valido) correctos.push(`✅ ${label}`)
    else incorrectos.push(`❌ ${label}`)
  }
  const partes: string[] = []
  if (correctos.length > 0) partes.push(`Correcto:\n${correctos.join("\n")}`)
  if (incorrectos.length > 0) partes.push(`Incorrecto:\n${incorrectos.join("\n")}`)
  return partes.join("\n\n")
}

export function serializarObservaciones(comentario: string, campos?: RevisionCampos): string {
  if (!campos) return comentario
  return JSON.stringify({ comentario, campos })
}

export function parsearObservaciones(obs: string | null): { comentario: string; campos: RevisionCampos | null } {
  if (!obs) return { comentario: "", campos: null }
  try {
    const parsed = JSON.parse(obs)
    if (parsed && typeof parsed === "object" && "comentario" in parsed) {
      return { comentario: parsed.comentario ?? "", campos: parsed.campos ?? null }
    }
  } catch {}
  return { comentario: obs, campos: null }
}
