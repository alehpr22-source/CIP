import { SolicitudForm } from "./_components/SolicitudForm"
import { obtenerSedes, obtenerUniversidades, obtenerCarreras } from "@/lib/carreras"

export default async function SolicitarPage() {
  const [sedes, universidades, carreras] = await Promise.all([
    obtenerSedes(),
    obtenerUniversidades(),
    obtenerCarreras(),
  ])

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Solicitud de Colegiatura
        </h1>
        <p className="mt-2 text-gray-600">
          Completa todos los pasos para iniciar tu proceso de colegiatura profesional.
        </p>
      </div>

      <SolicitudForm
        sedes={sedes}
        universidades={universidades}
        carreras={carreras}
      />
    </div>
  )
}
