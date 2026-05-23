export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {
  public: {
    Tables: {
      carreras: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      sedes: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      solicitantes: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      expedientes: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      pagos_inscripcion: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      colegiados: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      pagos_mensualidades: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      usuarios_admin: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      historial_estados_expediente: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
      cip_correlativos: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }
    }
  }
}
