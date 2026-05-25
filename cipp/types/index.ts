export interface Carrera {
  id: string
  nombre: string
}

export interface Sede {
  id: string
  nombre: string
  direccion?: string | null
  telefono?: string | null
}

export interface Universidad {
  id: string
  nombre: string
}

export interface Solicitante {
  id: string
  dni: string
  nombres: string
  apellidos: string
  correo?: string
  telefono?: string
  carrera_id?: string | null
  sede_id: string
  universidad: string
  universidad_id?: string | null
  carrera_manual?: string | null
  foto_url: string
  titulo_url: string
  dni_url: string
  validado_reniec: boolean
}

export interface Expediente {
  id: string
  solicitante_id: string
  codigo_expediente: string
  estado: "Pendiente" | "Pendiente de pago" | "Aprobado" | "Rechazado"
  observaciones?: string
  fecha_revision?: string
}

export interface PagoInscripcion {
  id: string
  expediente_id: string
  tipo_pago: "Virtual" | "Presencial"
  monto: number
  estado: "Pendiente" | "Aprobado" | "Rechazado"
  transaccion_id?: string
  comprobante_url?: string
}

export interface Colegiado {
  id: string
  expediente_id: string
  carrera_id: string
  numero_cip: string
  estado_habilitacion: "Habilitado" | "Inhabilitado"
  fecha_colegiatura: string
  carnet_url?: string
  qr_url?: string
}

export interface AdminUser {
  id: string
  auth_user_id: string
  nombres: string
  apellidos: string
  correo: string
  rol: "SuperAdmin" | "Revisor" | "Tesoreria"
  sede_id?: string
}
