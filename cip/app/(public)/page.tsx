import { ProcessSection } from "@/components/ProcessSection"

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-bold text-white">
              CIP
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Colegio de Ingenieros del Per&uacute;
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Sistema de colegiatura profesional. Inicia tu proceso de colegiatura, consulta el estado
              de tu expediente y visualiza tu carnet digital.
            </p>
          </div>

          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <span className="text-lg">Imagen ilustrativa</span>
          </div>
        </div>
      </section>

      <ProcessSection />
    </div>
  )
}
