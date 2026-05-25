import type { ValidadorReniec, ReniecRequest, ReniecResponse } from "./api"

export class ValidadorReniecProduccion implements ValidadorReniec {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.RENIEC_API_URL ?? ""
    this.apiKey = process.env.RENIEC_API_KEY ?? ""
  }

  async validar(request: ReniecRequest): Promise<ReniecResponse> {
    if (!this.apiUrl || !this.apiKey) {
      return { valido: false, mensaje: "Configuracion RENIEC incompleta" }
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ dni: request.dni }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout))

      if (!res.ok) {
        let mensaje = `Error al consultar ApiPeruDev (HTTP ${res.status})`
        try {
          const errBody = await res.json()
          mensaje = errBody?.message ?? mensaje
        } catch {}
        if (res.status === 401 || res.status === 403) {
          return { valido: false, mensaje: "Token invalido o sin permisos en ApiPeruDev" }
        }
        if (res.status === 429) {
          return { valido: false, mensaje: "Limite de consultas alcanzado en ApiPeruDev" }
        }
        return { valido: false, mensaje }
      }

      const payload = await res.json()
      const data = payload?.data

      const nombresApi = normalize(data?.nombres)
      const apellidosApi = normalize(`${data?.apellido_paterno ?? ""} ${data?.apellido_materno ?? ""}`)

      if (!nombresApi && !apellidosApi) {
        return { valido: false, mensaje: `No se obtuvo informacion para el DNI ${request.dni}` }
      }

      const nomNorm = normalize(request.nombres)
      const apeNorm = normalize(request.apellidos)
      const coincideNombres = !nomNorm || !nombresApi || nomNorm === nombresApi
      const coincideApellidos = !apeNorm || !apellidosApi || apeNorm === apellidosApi

      if (!coincideNombres || !coincideApellidos) {
        return {
          valido: true,
          nombres: data?.nombres,
          apellidos: `${data?.apellido_paterno ?? ""} ${data?.apellido_materno ?? ""}`.trim(),
          mensaje: "DNI valido, pero hay diferencias con los nombres/apellidos ingresados",
        }
      }

      return {
        valido: true,
        nombres: data?.nombres,
        apellidos: `${data?.apellido_paterno ?? ""} ${data?.apellido_materno ?? ""}`.trim(),
        mensaje: "Identidad verificada correctamente",
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { valido: false, mensaje: "Tiempo de espera agotado al consultar ApiPeruDev" }
      }

      return { valido: false, mensaje: "Error de conexion con ApiPeruDev" }
    }
  }
}

function normalize(value: string): string {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
