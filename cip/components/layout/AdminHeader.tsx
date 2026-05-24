import Link from "next/link"
import { createAuthClient } from "@/lib/supabase/auth-server"
import { logoutAdmin } from "@/actions/auth.actions"

export async function AdminHeader() {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: admin } = await supabase
    .from("usuarios_admin")
    .select("rol")
    .eq("auth_user_id", user?.id)
    .single()

  const rol = admin?.rol ?? ""

  const links = []

  if (rol === "SuperAdmin" || rol === "Revisor" || rol === "Tesoreria") {
    links.push({ href: "/admin/expedientes", label: "Expedientes" })
  }

  if (rol === "SuperAdmin") {
    links.push({ href: "/admin/colegiados", label: "Colegiados" })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            CIP
          </div>
          <span className="text-sm font-semibold text-gray-900">Admin</span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {rol}
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <form action={logoutAdmin}>
          <button type="submit" className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Cerrar sesi&oacute;n
          </button>
        </form>
      </div>
    </header>
  )
}
