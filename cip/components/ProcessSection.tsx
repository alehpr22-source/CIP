const pasos = [
  {
    numero: "1",
    icono: "📝",
    titulo: "Solicitar colegiatura",
    descripcion: "Completa el formulario de registro y sube tus documentos en formato digital.",
    detalles: [
      "Ingresa tu DNI, nombres y apellidos",
      "Valida tus datos con RENIEC (automático)",
      "Selecciona tu carrera y sede",
      "Sube tu foto (de frente, fondo claro), título profesional y copia de DNI",
      "Recibirás un código de expediente para dar seguimiento",
    ],
    tiempo: "~10 minutos",
  },
  {
    numero: "2",
    icono: "✅",
    titulo: "Revisión y pago",
    descripcion: "El comité de admisión evalúa tu expediente. Si todo está en orden, procedes al pago.",
    detalles: [
      "Un administrador revisa tus datos y documentos",
      "Si faltara algo, el expediente se rechaza con observaciones",
      "Corrige los campos observados y vuelve a enviar",
      "Una vez aprobado, genera tu voucher de pago (S/ 1,500)",
      "El administrador confirma el pago y activa tu colegiatura",
    ],
    tiempo: "~2 a 5 días hábiles",
  },
  {
    numero: "3",
    icono: "🪪",
    titulo: "Obtén tu CIP",
    descripcion: "¡Felicidades! Ya eres colegiado. Accede a tu carnet digital y descárgalo.",
    detalles: [
      "Se genera tu número CIP único",
      "Tu expediente queda como Aprobado",
      "Visualiza tu carnet digital con foto y datos",
      "Descarga el carnet en formato PNG",
      "El carnet incluye código de verificación",
    ],
    tiempo: "Inmediato",
  },
]

export function ProcessSection() {
  return (
    <section className="bg-cip-gray">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold text-cip-dark">
          ¿C&oacute;mo funciona el proceso?
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-500">
          Solicitar la colegiatura es sencillo. Sigue estos tres pasos y obt&eacute;n tu n&uacute;mero CIP.
        </p>

        <div className="relative space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          {/* Línea conectora horizontal (solo desktop) */}
          <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-cip-gold/60 md:block" />

          {pasos.map((paso, i) => (
            <div key={paso.numero} className="relative">
              {/* Círculo numerado */}
              <div className="relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cip-red text-2xl shadow-md">
                <span className="text-white">{paso.icono}</span>
              </div>

              {/* Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cip-red">
                    Paso {paso.numero}
                  </span>
                  <span className="text-xs text-gray-400">{paso.tiempo}</span>
                </div>

                <h3 className="mb-1 text-lg font-semibold text-cip-dark">{paso.titulo}</h3>
                <p className="mb-4 text-sm text-gray-500">{paso.descripcion}</p>

                <ul className="space-y-2">
                  {paso.detalles.map((detalle, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 shrink-0 text-cip-red">✓</span>
                      <span>{detalle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flecha hacia abajo en mobile */}
              {i < pasos.length - 1 && (
                <div className="my-2 text-center text-2xl text-gray-300 md:hidden">↓</div>
              )}
            </div>
          ))}
        </div>

        {/* Nota final */}
        <div className="mx-auto mt-16 max-w-xl rounded-lg border-2 border-cip-red/20 bg-cip-red-light p-4 text-center text-sm text-cip-red-dark">
          💡 ¿Tienes dudas? Puedes consultar el estado de tu tr&aacute;mite en cualquier momento desde la
          p&aacute;gina de Consulta con tu DNI y correo electr&oacute;nico.
        </div>
      </div>
    </section>
  )
}
