import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-bold text-white">
          CIP
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Colegio de Ingenieros del Per&uacute;
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Sistema de colegiatura profesional. Inicia tu proceso de colegiatura, consulta el estado
          de tu expediente y visualiza tu carnet digital.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/solicitar"
            className="rounded-lg bg-blue-700 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-800"
          >
            Solicitar Colegiatura
          </Link>

          <Link
            href="/consulta"
            className="rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Consultar Tr&aacute;mite
          </Link>
        </div>
      </div>
    </div>
  )
}
