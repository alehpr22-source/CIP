export interface ReniecRequest {
  dni: string
  nombres: string
  apellidos: string
}

export interface ReniecResponse {
  valido: boolean
  nombres?: string
  apellidos?: string
  mensaje: string
}

export interface ValidadorReniec {
  validar(request: ReniecRequest): Promise<ReniecResponse>
}
