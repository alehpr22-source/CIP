import { Suspense } from "react"
import { Building2, MapPin, Phone } from "lucide-react"
import { obtenerSedes } from "@/lib/carreras"

async function SedesGrid() {
  const sedes = await obtenerSedes()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sedes.map((sede) => (
        <div
          key={sede.id}
          className="rounded-xl border border-gray-200 border-l-8 border-l-cip-red bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cip-red/10 text-cip-red">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-cip-dark">{sede.nombre}</h3>
          {sede.direccion && (
            <p className="mb-1 text-sm text-gray-500">{sede.direccion}</p>
          )}
          {sede.telefono && (
            <p className="text-sm text-gray-400"><Phone className="mr-1 inline h-4 w-4" />{sede.telefono}</p>
          )}
          {!sede.direccion && !sede.telefono && (
            <p className="text-sm text-gray-400">Sin informaci&oacute;n disponible</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function SedesPage() {
  return (
    <div>
      <section className="bg-cip-red py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-2">
            <Building2 className="mx-auto h-16 w-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Nuestras Sedes</h1>
          <p className="mt-1 text-sm text-white/80">
            Encuentra la sede departamental del Colegio de Ingenieros m&aacute;s cercana a ti.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-cip-gold" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cip-red border-t-transparent" />
            </div>
          }
        >
          <SedesGrid />
        </Suspense>
      </section>
    </div>
  )
}
