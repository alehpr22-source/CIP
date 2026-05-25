import { createAuthClient } from "@/lib/supabase/auth-server"
import { createClient } from "@/lib/supabase/server"

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="flex-1 bg-gray-50 p-6 text-center text-gray-500">No autenticado</div>
  }

  const serverClient = createClient()
  const { data: solicitante } = await serverClient
    .from("solicitantes")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (!solicitante) {
    return <div className="flex-1 bg-gray-50 p-6 text-center text-gray-500">Sin datos de usuario</div>
  }

  return <div className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</div>
}
