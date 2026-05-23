import type { ValidadorReniec, ReniecRequest, ReniecResponse } from "./api"

export class ValidadorReniecProduccion implements ValidadorReniec {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.RENIEC_API_URL ?? ""
    this.apiKey = process.env.RENIEC_API_KEY ?? ""
  }

  async validar(request: ReniecRequest): Promise<ReniecResponse> {
    try {
      const res = await fetch(`${this.apiUrl}/consulta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ dni: request.dni }),
      })

      if (!res.ok) {
        return { valido: false, mensaje: "Error al consultar RENIEC" }
      }

      const data = await res.json()

      const nomNorm = request.nombres.toUpperCase().trim()
      const apeNorm = request.apellidos.toUpperCase().trim()
      const reniecNombres = (data.nombres ?? "").toUpperCase().trim()
      const reniecApellidos = (data.apellidos ?? "").toUpperCase().trim()

      if (nomNorm !== reniecNombres || apeNorm !== reniecApellidos) {
        return {
          valido: false,
          nombres: data.nombres,
          apellidos: data.apellidos,
          mensaje: "Los nombres no coinciden con RENIEC",
        }
      }

      return {
        valido: true,
        nombres: data.nombres,
        apellidos: data.apellidos,
        mensaje: "Identidad verificada correctamente",
      }
    } catch {
      return { valido: false, mensaje: "Error de conexión con RENIEC" }
    }
  }
}
