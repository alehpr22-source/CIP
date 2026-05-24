import Link from "next/link"
import { createAuthClient } from "@/lib/supabase/auth-server"
import { logoutUser } from "@/actions/user-auth.actions"

async function UserHeader() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: sol } = await supabase
    .from("solicitantes")
    .select("nombres, apellido_paterno, apellido_materno")
    .eq("auth_user_id", user?.id)
    .single()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            CIP
          </div>
          <span className="text-sm font-semibold text-gray-900">Mi Cuenta</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/micuenta"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Inicio
          </Link>
          <Link
            href="/micuenta/datos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Mis Datos
          </Link>
          <Link
            href="/micuenta/pagos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Mis Pagos
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{sol ? `${sol.nombres} ${sol.apellido_paterno}` : user?.email}</span>
        <form action={logoutUser}>
          <button type="submit" className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Cerrar sesi&oacute;n
          </button>
        </form>
      </div>
    </header>
  )
}

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <UserHeader />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
    </div>
  )
}
