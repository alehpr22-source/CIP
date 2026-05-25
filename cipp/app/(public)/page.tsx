import { ProcessSection } from "@/components/ProcessSection"

export default function HomePage() {
  return (
    <div>
      <section className="bg-cip-red">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg backdrop-blur-sm">
                CIP
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Colegio de Ingenieros del Per&uacute;
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Sistema de colegiatura profesional. Inicia tu proceso de colegiatura, consulta el estado
                de tu expediente y visualiza tu carnet digital.
              </p>
              <div className="mt-6 h-1 w-24 rounded-full bg-cip-gold" />
            </div>

            <div className="flex aspect-[4/3] items-center justify-center rounded-xl border-4 border-cip-gold/50 bg-gradient-to-br from-cip-gold-light to-cip-gold/20 text-cip-gold-dark backdrop-blur-sm">
              <span className="text-lg">Imagen institucional</span>
            </div>
          </div>
        </div>
      </section>

      <ProcessSection />
    </div>
  )
}
