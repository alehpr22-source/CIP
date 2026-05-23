import { createAuthClient } from "@/lib/supabase/auth-server"
import Link from "next/link"

export async function AdminHeader() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">Panel Administrativo</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <Link
          href="/admin/login?logout=true"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cerrar sesi&oacute;n
        </Link>
      </div>
    </header>
  )
}
