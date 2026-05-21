import { createClient } from '@supabase/supabase-js';

export type RoleEnum = 'USER' | 'ADMIN';
export type SolicitudEstadoEnum =
  | 'EN_REVISION'
  | 'OBSERVADO'
  | 'APROBADO'
  | 'RECHAZADO';
export type DocumentoTipoEnum =
  | 'DNI'
  | 'FOTO'
  | 'TITULO'
  | 'PAGO';
export type EstadoColegiadoEnum =
  | 'HABILITADO'
  | 'INHABILITADO';
export type EstadoPagoEnum = 'PENDIENTE' | 'PAGADO';

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          dni: string;
          correo: string;
          nombres: string;
          apellido_paterno: string;
          apellido_materno: string;
          role: RoleEnum;
          created_at: string;
        };
        Insert: {
          id: string;
          dni: string;
          correo: string;
          nombres: string;
          apellido_paterno: string;
          apellido_materno: string;
          role?: RoleEnum;
          created_at?: string;
        };
        Update: {
          id?: string;
          dni?: string;
          correo?: string;
          nombres?: string;
          apellido_paterno?: string;
          apellido_materno?: string;
          role?: RoleEnum;
          created_at?: string;
        };
        Relationships: [];
      };
      solicitudes: {
        Row: {
          id: string;
          usuario_id: string;
          carrera: string;
          estado: SolicitudEstadoEnum;
          enviado_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          carrera: string;
          estado?: SolicitudEstadoEnum;
          enviado_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          carrera?: string;
          estado?: SolicitudEstadoEnum;
          enviado_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      documentos: {
        Row: {
          id: string;
          solicitud_id: string;
          tipo: DocumentoTipoEnum;
          archivo_url: string;
          version: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          solicitud_id: string;
          tipo: DocumentoTipoEnum;
          archivo_url: string;
          version?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          solicitud_id?: string;
          tipo?: DocumentoTipoEnum;
          archivo_url?: string;
          version?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      observaciones: {
        Row: {
          id: string;
          solicitud_id: string;
          mensaje: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          solicitud_id: string;
          mensaje: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          solicitud_id?: string;
          mensaje?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      colegiados: {
        Row: {
          id: string;
          usuario_id: string;
          solicitud_id: string;
          carrera: string;
          numero_colegiado: string;
          estado: EstadoColegiadoEnum;
          fecha_colegiatura: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          solicitud_id: string;
          carrera: string;
          numero_colegiado?: string;
          estado?: EstadoColegiadoEnum;
          fecha_colegiatura?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          solicitud_id?: string;
          carrera?: string;
          numero_colegiado?: string;
          estado?: EstadoColegiadoEnum;
          fecha_colegiatura?: string;
        };
        Relationships: [];
      };
      carnets: {
        Row: {
          id: string;
          colegiado_id: string;
          codigo_carnet: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          colegiado_id: string;
          codigo_carnet: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          colegiado_id?: string;
          codigo_carnet?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contador_carrera: {
        Row: {
          id: string;
          carrera: string;
          ultimo_numero: number;
        };
        Insert: {
          id?: string;
          carrera: string;
          ultimo_numero?: number;
        };
        Update: {
          id?: string;
          carrera?: string;
          ultimo_numero?: number;
        };
        Relationships: [];
      };
      pagos: {
        Row: {
          id: string;
          colegiado_id: string;
          monto: number;
          mes: number | null;
          anio: number | null;
          estado: EstadoPagoEnum;
          fecha_pago: string | null;
        };
        Insert: {
          id?: string;
          colegiado_id: string;
          monto?: number;
          mes?: number | null;
          anio?: number | null;
          estado?: EstadoPagoEnum;
          fecha_pago?: string | null;
        };
        Update: {
          id?: string;
          colegiado_id?: string;
          monto?: number;
          mes?: number | null;
          anio?: number | null;
          estado?: EstadoPagoEnum;
          fecha_pago?: string | null;
        };
        Relationships: [];
      };
      meses_adeudados: {
        Row: {
          id: string;
          colegiado_id: string;
          mes: number;
          anio: number;
          monto: number;
          estado: EstadoPagoEnum;
          created_at: string;
        };
        Insert: {
          id?: string;
          colegiado_id: string;
          mes: number;
          anio: number;
          monto?: number;
          estado?: EstadoPagoEnum;
          created_at?: string;
        };
        Update: {
          id?: string;
          colegiado_id?: string;
          mes?: number;
          anio?: number;
          monto?: number;
          estado?: EstadoPagoEnum;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role_enum: RoleEnum;
      solicitud_estado_enum: SolicitudEstadoEnum;
      documento_tipo_enum: DocumentoTipoEnum;
      estado_colegiado_enum: EstadoColegiadoEnum;
      estado_pago_enum: EstadoPagoEnum;
    };
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export type UsuarioRow =
  Database['public']['Tables']['usuarios']['Row'];
export type UsuarioInsert =
  Database['public']['Tables']['usuarios']['Insert'];
export type SolicitudRow =
  Database['public']['Tables']['solicitudes']['Row'];
export type SolicitudInsert =
  Database['public']['Tables']['solicitudes']['Insert'];
export type DocumentoRow =
  Database['public']['Tables']['documentos']['Row'];
export type ObservacionRow =
  Database['public']['Tables']['observaciones']['Row'];
export type ColegiadoRow =
  Database['public']['Tables']['colegiados']['Row'];
export type CarnetRow =
  Database['public']['Tables']['carnets']['Row'];
export type ContadorCarreraRow =
  Database['public']['Tables']['contador_carrera']['Row'];
export type PagoRow =
  Database['public']['Tables']['pagos']['Row'];
export type MesAdeudadoRow =
  Database['public']['Tables']['meses_adeudados']['Row'];
