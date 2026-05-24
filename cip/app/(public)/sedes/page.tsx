import { Suspense } from "react"
import { obtenerSedes } from "@/lib/carreras"

async function SedesGrid() {
  const sedes = await obtenerSedes()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sedes.map((sede) => (
        <div
          key={sede.id}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
            📍
          </div>
          <h3 className="mb-1 text-base font-semibold text-gray-900">{sede.nombre}</h3>
          {sede.direccion && (
            <p className="mb-1 text-sm text-gray-500">{sede.direccion}</p>
          )}
          {sede.telefono && (
            <p className="text-sm text-gray-400">📞 {sede.telefono}</p>
          )}
          {!sede.direccion && !sede.telefono && (
            <p className="text-sm text-gray-400">Sin información disponible</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function SedesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Nuestras Sedes</h1>
        <p className="mt-2 text-gray-500">
          Encuentra la sede departamental del Colegio de Ingenieros más cercana a ti.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
          </div>
        }
      >
        <SedesGrid />
      </Suspense>
    </div>
  )
}
