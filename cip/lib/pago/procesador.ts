export interface PagoResult {
  exitoso: boolean
  transaccionId?: string
  mensaje: string
}

export function procesarPago(_monto: number, _metodo: string): PagoResult {
  return { exitoso: false, mensaje: "No implementado" }
}
