import Link from "next/link"

interface Props {
  isLoggedIn: boolean
}

export function Footer({ isLoggedIn }: Props) {
  return (
    <footer className="mt-auto border-t-4 border-cip-gold bg-cip-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cip-red text-sm font-bold text-white">
              CIP
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Colegio de Ingenieros del Per&uacute;</p>
              <p className="text-xs text-cip-gold">Consejo Departamental</p>
            </div>
          </div>

          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/sedes" className="transition-colors hover:text-cip-gold">
              Sedes
            </Link>
            {!isLoggedIn && (
              <Link href="/solicitar" className="transition-colors hover:text-cip-gold">
                Solicitar
              </Link>
            )}
            <Link href="/colegiados" className="transition-colors hover:text-cip-gold">
              Consultar Colegiados
            </Link>
            <Link href="/admin/login" className="transition-colors hover:text-cip-gold">
              Administrador
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Colegio de Ingenieros del Per&uacute;. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
