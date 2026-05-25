import { createAuthClient } from "@/lib/supabase/auth-server"

type AdminSuccess = {
  success: true
  supabase: Awaited<ReturnType<typeof createAuthClient>>
  admin: { id: string; rol: string }
}

type AdminFailure = {
  success: false
  error: string
}

export type AdminResult = AdminSuccess | AdminFailure

export async function requireAdmin(): Promise<AdminResult> {
  const supabase = await createAuthClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "No autenticado" }

  const { data: admin } = await supabase
    .from("usuarios_admin")
    .select("id, rol")
    .eq("auth_user_id", user.id)
    .single()

  if (!admin) return { success: false, error: "No eres administrador" }

  return { success: true, supabase, admin }
}

export async function requireAdminRole(allowedRoles: string[]): Promise<AdminResult> {
  const result = await requireAdmin()
  if (!result.success) return result

  if (!allowedRoles.includes(result.admin.rol)) {
    return { success: false, error: `Se requiere rol: ${allowedRoles.join(" o ")}` }
  }

  return result
}

type UserSuccess = {
  success: true
  supabase: Awaited<ReturnType<typeof createAuthClient>>
  solicitante: { id: string; dni: string; nombres: string; apellido_paterno: string; apellido_materno: string }
}

type UserFailure = {
  success: false
  error: string
}

export type UserResult = UserSuccess | UserFailure

export async function requireUser(): Promise<UserResult> {
  const supabase = await createAuthClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "No autenticado" }

  const { data: solicitante } = await supabase
    .from("solicitantes")
    .select("id, dni, nombres, apellido_paterno, apellido_materno")
    .eq("auth_user_id", user.id)
    .single()

  if (!solicitante) return { success: false, error: "No tienes una solicitud de colegiatura vinculada" }

  return { success: true, supabase, solicitante }
}
