export interface ReniecResponse {
  valido: boolean
  nombres?: string
  apellidos?: string
  mensaje: string
}

export function validarConReniec(_dni: string, _nombres: string, _apellidos: string): ReniecResponse {
  return { valido: false, mensaje: "No implementado" }
}
