export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface Relationship {
  foreignKeyName: string
  columns: string[]
  referencedRelation: string
  referencedColumns: string[]
}

export interface Database {
  public: {
    Tables: {
      carreras: {
        Row: { id: string; nombre: string }
        Insert: { id?: string; nombre: string }
        Update: { id?: string; nombre?: string }
        Relationships: []
      }
      sedes: {
        Row: { id: string; nombre: string; direccion: string | null; telefono: string | null }
        Insert: { id?: string; nombre: string; direccion?: string | null; telefono?: string | null }
        Update: { id?: string; nombre?: string; direccion?: string | null; telefono?: string | null }
        Relationships: []
      }
      solicitantes: {
        Row: {
          id: string; dni: string; nombres: string; apellido_paterno: string; apellido_materno: string
          correo: string | null; telefono: string | null
          carrera_id: string | null; sede_id: string; universidad: string
          foto_url: string; titulo_url: string; dni_url: string
          validado_reniec: boolean; created_at: string
          universidad_id: string | null; carrera_manual: string | null
        }
        Insert: {
          id?: string; dni: string; nombres: string; apellido_paterno: string; apellido_materno: string
          correo?: string | null; telefono?: string | null
          carrera_id?: string | null; sede_id: string; universidad: string
          foto_url?: string; titulo_url?: string; dni_url?: string
          validado_reniec?: boolean
          universidad_id?: string | null; carrera_manual?: string | null
        }
        Update: {
          id?: string; dni?: string; nombres?: string; apellido_paterno?: string; apellido_materno?: string
          correo?: string | null; telefono?: string | null
          carrera_id?: string | null; sede_id?: string; universidad?: string
          foto_url?: string; titulo_url?: string; dni_url?: string
          validado_reniec?: boolean
          universidad_id?: string | null; carrera_manual?: string | null
        }
        Relationships: [
          { foreignKeyName: "solicitantes_carrera_id_fkey"; columns: ["carrera_id"]; referencedRelation: "carreras"; referencedColumns: ["id"] },
          { foreignKeyName: "solicitantes_sede_id_fkey"; columns: ["sede_id"]; referencedRelation: "sedes"; referencedColumns: ["id"] },
        ]
      }
      expedientes: {
        Row: {
          id: string; solicitante_id: string; codigo_expediente: string
          estado: string; observaciones: string | null
          fecha_revision: string | null; created_at: string
        }
        Insert: {
          id?: string; solicitante_id: string; codigo_expediente?: string
          estado?: string; observaciones?: string | null; fecha_revision?: string | null
        }
        Update: {
          id?: string; solicitante_id?: string; codigo_expediente?: string
          estado?: string; observaciones?: string | null; fecha_revision?: string | null
        }
        Relationships: [
          { foreignKeyName: "expedientes_solicitante_id_fkey"; columns: ["solicitante_id"]; referencedRelation: "solicitantes"; referencedColumns: ["id"] },
        ]
      }
      pagos_inscripcion: {
        Row: {
          id: string; expediente_id: string; tipo_pago: string
          monto: number; estado: string; transaccion_id: string | null
          comprobante_url: string | null; created_at: string
        }
        Insert: {
          id?: string; expediente_id: string; tipo_pago?: string
          monto?: number; estado?: string; transaccion_id?: string | null
          comprobante_url?: string | null
        }
        Update: {
          id?: string; expediente_id?: string; tipo_pago?: string
          monto?: number; estado?: string; transaccion_id?: string | null
          comprobante_url?: string | null
        }
        Relationships: [
          { foreignKeyName: "pagos_inscripcion_expediente_id_fkey"; columns: ["expediente_id"]; referencedRelation: "expedientes"; referencedColumns: ["id"] },
        ]
      }
      colegiados: {
        Row: {
          id: string; expediente_id: string; carrera_id: string
          numero_cip: string; estado_habilitacion: string
          fecha_colegiatura: string; carnet_url: string | null
          qr_url: string | null; created_at: string
        }
        Insert: {
          id?: string; expediente_id: string; carrera_id: string
          numero_cip?: string; estado_habilitacion?: string
          fecha_colegiatura?: string; carnet_url?: string | null
          qr_url?: string | null
        }
        Update: {
          id?: string; expediente_id?: string; carrera_id?: string
          numero_cip?: string; estado_habilitacion?: string
          fecha_colegiatura?: string; carnet_url?: string | null
          qr_url?: string | null
        }
        Relationships: [
          { foreignKeyName: "colegiados_expediente_id_fkey"; columns: ["expediente_id"]; referencedRelation: "expedientes"; referencedColumns: ["id"] },
          { foreignKeyName: "colegiados_carrera_id_fkey"; columns: ["carrera_id"]; referencedRelation: "carreras"; referencedColumns: ["id"] },
        ]
      }
      pagos_mensualidades: {
        Row: {
          id: string; colegiado_id: string; anio: number; mes: number
          monto: number; tipo_pago: string; estado: string
          transaccion_id: string | null; comprobante_url: string | null
          created_at: string
        }
        Insert: {
          id?: string; colegiado_id: string; anio: number; mes: number
          monto?: number; tipo_pago?: string; estado?: string
          transaccion_id?: string | null; comprobante_url?: string | null
        }
        Update: {
          id?: string; colegiado_id?: string; anio?: number; mes?: number
          monto?: number; tipo_pago?: string; estado?: string
          transaccion_id?: string | null; comprobante_url?: string | null
        }
        Relationships: [
          { foreignKeyName: "pagos_mensualidades_colegiado_id_fkey"; columns: ["colegiado_id"]; referencedRelation: "colegiados"; referencedColumns: ["id"] },
        ]
      }
      usuarios_admin: {
        Row: {
          id: string; auth_user_id: string; nombres: string; apellidos: string
          correo: string; rol: string; sede_id: string | null
        }
        Insert: {
          id?: string; auth_user_id: string; nombres: string; apellidos: string
          correo: string; rol?: string; sede_id?: string | null
        }
        Update: {
          id?: string; auth_user_id?: string; nombres?: string; apellidos?: string
          correo?: string; rol?: string; sede_id?: string | null
        }
        Relationships: [
          { foreignKeyName: "usuarios_admin_sede_id_fkey"; columns: ["sede_id"]; referencedRelation: "sedes"; referencedColumns: ["id"] },
        ]
      }
      historial_estados_expediente: {
        Row: {
          id: string; expediente_id: string; admin_id: string
          estado_anterior: string | null; estado_nuevo: string
          comentario: string | null; created_at: string
        }
        Insert: {
          id?: string; expediente_id: string; admin_id: string
          estado_anterior?: string | null; estado_nuevo: string
          comentario?: string | null
        }
        Update: {
          id?: string; expediente_id?: string; admin_id?: string
          estado_anterior?: string | null; estado_nuevo?: string
          comentario?: string | null
        }
        Relationships: [
          { foreignKeyName: "historial_expediente_id_fkey"; columns: ["expediente_id"]; referencedRelation: "expedientes"; referencedColumns: ["id"] },
          { foreignKeyName: "historial_admin_id_fkey"; columns: ["admin_id"]; referencedRelation: "usuarios_admin"; referencedColumns: ["id"] },
        ]
      }
      cip_correlativos: {
        Row: { id: string; carrera_id: string; ultimo_numero: number }
        Insert: { id?: string; carrera_id: string; ultimo_numero?: number }
        Update: { id?: string; carrera_id?: string; ultimo_numero?: number }
        Relationships: [
          { foreignKeyName: "cip_correlativos_carrera_id_fkey"; columns: ["carrera_id"]; referencedRelation: "carreras"; referencedColumns: ["id"] },
        ]
      }
    }
  }
}

export type Carreras = Database["public"]["Tables"]["carreras"]["Row"]
export type Sedes = Database["public"]["Tables"]["sedes"]["Row"]
export type Solicitantes = Database["public"]["Tables"]["solicitantes"]["Row"]
export type Expedientes = Database["public"]["Tables"]["expedientes"]["Row"]
export type PagosInscripcion = Database["public"]["Tables"]["pagos_inscripcion"]["Row"]
export type Colegiados = Database["public"]["Tables"]["colegiados"]["Row"]
export type PagosMensualidades = Database["public"]["Tables"]["pagos_mensualidades"]["Row"]
export type UsuariosAdmin = Database["public"]["Tables"]["usuarios_admin"]["Row"]
export type HistorialEstados = Database["public"]["Tables"]["historial_estados_expediente"]["Row"]
export type CipCorrelativos = Database["public"]["Tables"]["cip_correlativos"]["Row"]
