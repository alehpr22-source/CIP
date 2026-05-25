"use server"

import { createAuthClient } from "@/lib/supabase/auth-server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function loginUser(formData: FormData) {
  const correo = formData.get("correo") as string
  const password = formData.get("password") as string

  const supabase = await createAuthClient()
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password })

  if (error) return { error: error.message }

  revalidatePath("/micuenta")
  redirect("/micuenta")
}

export async function registerUserAccount(solicitanteId: string, correo: string, password: string) {
  const adminClient = createAdminClient()

  const { data: authUser, error: errAuth } = await adminClient.auth.admin.createUser({
    email: correo,
    password,
    email_confirm: true,
  })

  if (errAuth) return { error: errAuth.message }

  const { error: errUpdate } = await adminClient
    .from("solicitantes")
    .update({ auth_user_id: authUser.user.id })
    .eq("id", solicitanteId)

  if (errUpdate) return { error: errUpdate.message }

  return { success: true }
}

export async function logoutUser() {
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function solicitarResetPassword(formData: FormData) {
  const email = formData.get("email") as string
  if (!email) return { error: "El correo es obligatorio" }

  const supabase = await createAuthClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/auth/restablecer`,
  })

  if (error) return { error: error.message }

  return { enviado: true }
}

export async function obtenerSesion() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: solicitante } = await supabase
    .from("solicitantes")
    .select("id, dni, nombres, apellido_paterno, apellido_materno")
    .eq("auth_user_id", user.id)
    .single()

  return { user, solicitante }
}
