import Link from "next/link"

const links = [
  { href: "/admin/expedientes", label: "Expedientes" },
  { href: "/admin/colegiados", label: "Colegiados" },
]

export function AdminSidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
          CIP
        </div>
        <span className="text-sm font-semibold text-gray-900">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
