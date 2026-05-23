export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Colegio de Ingenieros del Per&uacute;. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
