export interface CarnetData {
  nombres: string
  apellidos: string
  carrera: string
  numeroCip: string
  fotoUrl: string
  estado: string
  qrValue: string
}

export function generarCarnetPath(data: CarnetData): string {
  return `/carnet/${data.numeroCip}`
}
