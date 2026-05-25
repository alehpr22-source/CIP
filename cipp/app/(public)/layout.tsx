import { PublicNavbar } from "@/components/layout/PublicNavbar"
import { Footer } from "@/components/layout/Footer"
import { createAuthClient } from "@/lib/supabase/auth-server"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let isLoggedIn = false

  try {
    const supabase = await createAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: solicitante } = await supabase
        .from("solicitantes")
        .select("id")
        .eq("auth_user_id", user.id)
        .single()

      isLoggedIn = !!solicitante
    }
  } catch {
    // No session
  }

  return (
    <>
      <PublicNavbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <Footer isLoggedIn={isLoggedIn} />
    </>
  )
}
