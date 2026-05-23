export interface PagoResult {
  exitoso: boolean
  transaccionId?: string
  mensaje: string
}

export interface VoucherData {
  transaccionId: string
  dni: string
  nombres: string
  apellidos: string
  monto: number
  fecha: string
  voucherBase64: string
}

export function procesarPago(_monto: number, _metodo: string): PagoResult {
  return { exitoso: false, mensaje: "No implementado" }
}

export function generarVoucher(data: {
  transaccionId: string
  dni: string
  nombres: string
  apellidos: string
  monto: number
}): VoucherData {
  const fecha = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null

  if (!canvas) {
    return {
      ...data,
      fecha,
      voucherBase64: "",
    }
  }

  canvas.width = 500
  canvas.height = 320
  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "#1d4ed8"
  ctx.lineWidth = 4
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

  ctx.fillStyle = "#1d4ed8"
  ctx.fillRect(10, 10, canvas.width - 20, 50)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 20px Arial"
  ctx.textAlign = "center"
  ctx.fillText("COLEGIO DE INGENIEROS DEL PERÚ", canvas.width / 2, 43)

  ctx.fillStyle = "#1d4ed8"
  ctx.font = "bold 14px Arial"
  ctx.textAlign = "center"
  ctx.fillText("VOUCHER DE PAGO - COLEGIATURA", canvas.width / 2, 85)

  ctx.fillStyle = "#333"
  ctx.font = "12px monospace"
  ctx.textAlign = "left"

  const lines = [
    `N° Operación:  ${data.transaccionId}`,
    `DNI:           ${data.dni}`,
    `Ingeniero:     ${data.nombres} ${data.apellidos}`,
    `Concepto:      Derecho de Inscripción - Colegiatura`,
    `Monto:         S/ ${data.monto.toFixed(2)}`,
    `Fecha:         ${fecha}`,
    `Estado:        PAGADO`,
  ]

  lines.forEach((line, i) => {
    ctx.fillText(line, 40, 120 + i * 24)
  })

  ctx.fillStyle = "#999"
  ctx.font = "10px Arial"
  ctx.textAlign = "center"
  ctx.fillText("Este es un comprobante generado electrónicamente.", canvas.width / 2, canvas.height - 35)
  ctx.fillText("Válido para trámites internos del CIP.", canvas.width / 2, canvas.height - 20)

  return {
    ...data,
    fecha,
    voucherBase64: canvas.toDataURL("image/png"),
  }
}
