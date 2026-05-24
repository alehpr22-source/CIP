import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
              CIP
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Colegio de Ingenieros del Perú</p>
              <p className="text-xs text-gray-500">Consejo Departamental</p>
            </div>
          </div>

          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/sedes" className="hover:text-gray-900">
              Sedes
            </Link>
            <Link href="/solicitar" className="hover:text-gray-900">
              Solicitar
            </Link>
            <Link href="/consulta" className="hover:text-gray-900">
              Consultar
            </Link>
            <Link href="/admin/login" className="hover:text-gray-900">
              Administrador
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Colegio de Ingenieros del Perú. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
