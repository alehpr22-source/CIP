import type { ValidadorReniec, ReniecRequest, ReniecResponse } from "./api"

const USUARIOS_SIMULADOS: Record<string, { nombres: string; apellidos: string }> = {
  "12345678": { nombres: "JUAN CARLOS", apellidos: "PEREZ GARCIA" },
  "87654321": { nombres: "MARIA ELENA", apellidos: "LOPEZ RAMIREZ" },
  "11111111": { nombres: "CARLOS ANDRES", apellidos: "QUISPE MAMANI" },
  "22222222": { nombres: "ANA PAULA", apellidos: "TORRES VARGAS" },
  "33333333": { nombres: "PEDRO JESUS", apellidos: "CASTILLO FLORES" },
}

export class ValidadorReniecSimulado implements ValidadorReniec {
  async validar(request: ReniecRequest): Promise<ReniecResponse> {
    await new Promise((r) => setTimeout(r, 800))

    const registro = USUARIOS_SIMULADOS[request.dni]

    if (!registro) {
      return {
        valido: false,
        mensaje: `El DNI ${request.dni} no existe en RENIEC`,
      }
    }

    const nomIngresado = request.nombres.toUpperCase().trim()
    const apeIngresado = request.apellidos.toUpperCase().trim()

    const nombresCorrectos = !nomIngresado || nomIngresado === registro.nombres
    const apellidosCorrectos = !apeIngresado || apeIngresado === registro.apellidos

    if (!nombresCorrectos || !apellidosCorrectos) {
      return {
        valido: false,
        nombres: registro.nombres,
        apellidos: registro.apellidos,
        mensaje: `Los datos no coinciden con RENIEC. Correcto: ${registro.nombres} ${registro.apellidos}`,
      }
    }

    return {
      valido: true,
      nombres: registro.nombres,
      apellidos: registro.apellidos,
      mensaje: "Identidad verificada correctamente",
    }
  }
}
