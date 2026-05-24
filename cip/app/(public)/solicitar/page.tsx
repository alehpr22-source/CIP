import { UserPlus } from "lucide-react"
import { SolicitudForm } from "./_components/SolicitudForm"
import { obtenerCarreras, obtenerSedes } from "@/lib/carreras"

export default async function SolicitarPage() {
  const [carreras, sedes] = await Promise.all([obtenerCarreras(), obtenerSedes()])

  return (
    <div>
      <section className="bg-cip-red py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-2">
            <UserPlus className="mx-auto h-16 w-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Solicitud de Colegiatura
          </h1>
          <p className="mt-1 text-sm text-white/80">
            Inicia tu proceso de colegiatura profesional completando todos los pasos.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-cip-gold" />
        </div>
      </section>

      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 border-l-8 border-l-cip-red bg-white p-6 shadow-sm">
            <SolicitudForm carreras={carreras} sedes={sedes} />
          </div>
        </div>
      </section>
    </div>
  )
}
