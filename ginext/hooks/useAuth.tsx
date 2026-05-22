'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  User,
  Session,
} from '@supabase/supabase-js';

import {
  supabase,
  type UsuarioRow,
  type UsuarioInsert,
  type RoleEnum,
} from '@/lib/supabase';
import { consultarReniecMock } from '@/lib/services/reniec';

// ==========================================
// TYPES
// ==========================================

type RegisterData = {
  dni: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  usuario: UsuarioRow | null;
  loading: boolean;

  signUp: (
    data: RegisterData
  ) => Promise<{
    error: Error | null;
  }>;

  signIn: (
    correo: string,
    password: string
  ) => Promise<{
    error: Error | null;
  }>;

  signOut: () => Promise<void>;

  refreshUsuario: () => Promise<void>;

  hasRole: (role: RoleEnum) => boolean;
};

// ==========================================
// CONTEXT
// ==========================================

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

// ==========================================
// PROVIDER
// ==========================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [usuario, setUsuario] =
    useState<UsuarioRow | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH USUARIO
  // ==========================================

  const fetchUsuario = async (
    userId: string
  ) => {

    const {
      data,
      error,
    } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {

      console.error(
        'Error fetching usuario:',
        JSON.stringify(error, null, 2)
      );

      return null;
    }

    if (!data) {
      return null;
    }

    return data as UsuarioRow;
  };

  // ==========================================
  // SESSION LISTENER
  // ==========================================

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(async ({
        data: { session },
      }) => {

        setSession(session);

        setUser(
          session?.user ?? null
        );

        if (session?.user) {

          const usuarioData =
            await fetchUsuario(
              session.user.id
            );

          setUsuario(usuarioData);
        }

        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        setSession(session);

        setUser(
          session?.user ?? null
        );

        if (session?.user) {

          const usuarioData =
            await fetchUsuario(
              session.user.id
            );

          setUsuario(usuarioData);

        } else {

          setUsuario(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  // ==========================================
  // REGISTER
  // ==========================================

  async function signUp(
    data: RegisterData
  ) {

    try {

      const reniecData =
        await consultarReniecMock(data.dni);

      if (!reniecData) {
        return {
          error: new Error(
            'No se pudo validar el DNI con RENIEC'
          ),
        };
      }

      if (
        reniecData.nombres !== data.nombres ||
        reniecData.apellido_paterno !==
          data.apellido_paterno ||
        reniecData.apellido_materno !==
          data.apellido_materno
      ) {
        return {
          error: new Error(
            'Los datos no coinciden con RENIEC'
          ),
        };
      }

      const { data: dniExists } = await supabase
        .from('usuarios')
        .select('id')
        .eq('dni', data.dni)
        .maybeSingle();

      if (dniExists) {
        return {
          error: new Error(
            'Este DNI ya está registrado'
          ),
        };
      }

      const { data: correoExists } = await supabase
        .from('usuarios')
        .select('id')
        .eq('correo', data.correo)
        .maybeSingle();

      if (correoExists) {
        return {
          error: new Error(
            'Este correo ya está registrado'
          ),
        };
      }

      // ==========================================
      // SIGN UP
      // ==========================================

      const {
        data: signUpData,
        error,
      } = await supabase.auth.signUp({

        email: data.correo,

        password: data.password,

        options: {

          data: {

            dni: data.dni,

            nombres:
              reniecData.nombres,

            apellido_paterno:
              reniecData.apellido_paterno,

            apellido_materno:
              reniecData.apellido_materno,
          },
        },
      });

      if (error) {

        console.error(
          'SIGNUP ERROR:',
          JSON.stringify(error, null, 2)
        );

        return {
          error,
        };
      }

      if (!signUpData.user) {
        return {
          error: new Error(
            'No se pudo crear el usuario'
          ),
        };
      }

      const usuarioToInsert: UsuarioInsert = {
        id: signUpData.user.id,
        dni: data.dni,
        correo: data.correo,
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
      };

      const { error: upsertUsuarioError } =
        await supabase
          .from('usuarios')
          .upsert(usuarioToInsert, {
            onConflict: 'id',
          });

      if (upsertUsuarioError) {
        console.error(
          'UPSERT USUARIO ERROR:',
          JSON.stringify(
            upsertUsuarioError,
            null,
            2
          )
        );

        return {
          error: new Error(
            `Cuenta creada, pero no se pudo registrar el perfil: ${upsertUsuarioError.message}`
          ),
        };
      }

      return {
        error: null,
      };

    } catch {

      return {
        error: new Error(
          'Error inesperado'
        ),
      };
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async function signIn(
    correo: string,
    password: string
  ) {

    const { error } =
      await supabase.auth
        .signInWithPassword({

          email: correo,

          password,
        });

    return { error };
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function signOut() {

    await supabase.auth.signOut();

    setUsuario(null);
  }

  // ==========================================
  // REFRESH
  // ==========================================

  async function refreshUsuario() {

    if (!user) return;

    const usuarioData =
      await fetchUsuario(user.id);

    setUsuario(usuarioData);
  }

  function hasRole(role: RoleEnum): boolean {
    return usuario?.role === role;
  }

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        usuario,
        loading,
        signUp,
        signIn,
        signOut,
        refreshUsuario,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth debe usarse dentro de AuthProvider'
    );
  }

  return context;
}
