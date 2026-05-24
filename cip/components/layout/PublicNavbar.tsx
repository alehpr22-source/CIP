import Link from "next/link"

export function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-cip-gold/70 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cip-red text-sm font-bold text-white">
            CIP
          </div>
          <span className="text-lg font-semibold text-cip-dark">Colegio de Ingenieros</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/sedes"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-cip-red"
          >
            Sedes
          </Link>
          <Link
            href="/solicitar"
            className="rounded-lg bg-cip-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cip-red-dark"
          >
            Solicitar Colegiatura
          </Link>
          <Link
            href="/colegiados"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-cip-red"
          >
            Consultar Colegiados
          </Link>
          <Link
            href="/consulta"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-cip-red"
          >
            Consultar Tr&aacute;mite
          </Link>
        </div>
      </div>
    </nav>
  )
}
