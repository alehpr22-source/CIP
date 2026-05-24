import Link from "next/link"

export function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
            CIP
          </div>
          <span className="text-lg font-semibold text-gray-900">Colegio de Ingenieros</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/sedes"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Sedes
          </Link>
          <Link
            href="/solicitar"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Solicitar Colegiatura
          </Link>
          <Link
            href="/consulta"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Consultar
          </Link>
        </div>
      </div>
    </nav>
  )
}
