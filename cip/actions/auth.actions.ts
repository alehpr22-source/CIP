"use server"

import { createAuthClient } from "@/lib/supabase/auth-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function loginAdmin(_prev: { error: string }, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" }
  }

  const supabase = await createAuthClient()

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return { error: "Credenciales inválidas" }
  }

  const { data: admin } = await supabase
    .from("usuarios_admin")
    .select("id, nombres, apellidos, rol")
    .eq("auth_user_id", authData.user.id)
    .single()

  if (!admin) {
    await supabase.auth.signOut()
    return { error: "No tienes permisos de administrador" }
  }

  revalidatePath("/admin/expedientes")
  redirect("/admin/expedientes")
}

export async function logoutAdmin() {
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  revalidatePath("/admin/login")
  redirect("/admin/login")
}
