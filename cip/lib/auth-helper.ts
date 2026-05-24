import { createAuthClient } from "@/lib/supabase/auth-server"

type AdminSuccess = {
  success: true
  supabase: Awaited<ReturnType<typeof createAuthClient>>
  admin: { id: string }
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
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (!admin) return { success: false, error: "No eres administrador" }

  return { success: true, supabase, admin }
}
